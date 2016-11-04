"use strict";

const fs       = require('fs');
const crypto   = require('crypto');
const path     = require('path');
const cp       = require('child_process');
const https    = require('https');

const expect   = require('expect.js');
const phar     = require('../');
const once     = require('nyks/function/once');
const detach     = require('nyks/function/detach');

function getManifest(archive, chain){
    chain = once(chain);
    //note that an invalid file might throw an error

  const extract = new phar.extract()
  extract.on('error', chain); 

    var files  = {};
    extract.on('entry', function(header, stream, next) {

      var output = crypto.createHash('md5')

      output.once('readable', function () {
        files[header.entry_name] = output.read().toString('hex');
        next();
      });
      stream.pipe(output)

    })

    extract.on('extracted', function() {
      //there MIGHT be an error if the archive is invalid
      chain(null, files);
    })

    archive.pipe(extract)
}

function phpPhar(code, chain){
  code = `<?php
    function fn($phar){ ${code} };
    $path = 'data1.phar';
    if(is_file($path)) unlink($path);
    $phar = new Phar($path, 0, 'data.phar');
    fn($phar);
    register_shutdown_function("unlink", realpath($path));
    readfile($path);
    unset($phar);
  `;

  var child = cp.spawn("php", ["-dphar.readonly=0"]);
  child.stdin.end(code);
  child.stderr.pipe(process.stderr);

  chain(null, child.stdout);
}

describe("Testing fixtures", function(){
  it("Should extract a dummy phar (data0.phar) (small buffer)", function(done){

      //test with little read buffer
    const archive  = fs.createReadStream(path.join(__dirname, "fixtures/data0.phar"), {highWaterMark : 90 });
    const manifest = require( path.join(__dirname, "fixtures/data0.phar.json") );

    getManifest(archive, function(err, files){

      expect(err).to.be(null);
      expect(files).to.eql(manifest);
      done();
    });

  });





  it("Should extract a big stub phar (data1.phar)", function(done){

    const manifest = require( path.join(__dirname, "fixtures/data0.phar.json") );

    phpPhar(`
      $phar->setStub("<?" . str_repeat("doStuffs();\n", 65 << 10) . " __HALT_COMPILER();");
      $phar->buildFromDirectory('${__dirname}/fixtures/data0');
    `, function(err, archive) {

      expect(err).to.be(null);

      getManifest(archive, function(err, files){
        expect(err).to.be(null);
        expect(files).to.eql(manifest);
        done();
      });
    });

  });


  it("Should fail on non phar", function(done){

    const archive  = fs.createReadStream(__filename);

    getManifest(archive, function(err, files){
      expect(err).to.be("No stub found in stream");
      done();
    });

  });



  it("should extract php Composer reference", function(done){


    const manifest = require( path.join(__dirname, "fixtures/composer-1.2.2.json") );

    var req = https.get("https://getcomposer.org/download/1.2.2/composer.phar", function(archive){
      getManifest(archive, function(err, files){
        expect(err).to.be(null);
        expect(files).to.eql(manifest);
        done();
      });
    });
  });

  it("Should extract big files", function(done){

    const manifest = {"dummy": "32ffaf8ca70d8b53a8a8717d942c0c9a"};

    phpPhar(`
      $phar->addFromString("dummy", str_repeat("doStuffs();\n", 1024 << 10));
    `, function(err, archive) {

      expect(err).to.be(null);

      getManifest(archive, function(err, files){
        expect(err).to.be(null);
        expect(files).to.eql(manifest);
        done();
      });
    });

  });



})

