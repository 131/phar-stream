"use strict";
const fs   = require('fs');
const phar = require('../');

const archive = fs.createReadStream("test/2362566.phar");


const extract = new phar.extract()

extract.on('error', function(err){
  console.log("Got err", err);
});

extract.on('entry', function(header, stream, next) {
  console.log("Working with", header.entry_name);
  var dst = fs.createWriteStream("outn/" + header.entry_name);
  stream.pipe(dst);
  //stream.resume();
  stream.on('end', next);

/*



dst.close();
process.exit();
  })

  //stream.resume() // just auto drain the stream
*/

})

extract.on('finish', function() {
  console.log("FINISHEDE");
})


archive.pipe(extract)



