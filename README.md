# phar-stream

[phar-stream](https://github.com/131/phar-stream) is a streaming **phar** archive ([PHP archive](https://en.wikipedia.org/wiki/PHAR_(file_format))) parser for nodejs. It is streams2 and operates purely using streams which means you can easily extract/parse phar without ever hitting the file system. phar-stream use es7 async/await syntax and require node 8+.

```
npm install phar-stream
```


[![Build Status](https://travis-ci.org/131/phar-stream.svg?branch=master)](https://travis-ci.org/131/phar-stream)
[![Coverage Status](https://coveralls.io/repos/github/131/phar-stream/badge.svg?branch=master)](https://coveralls.io/github/131/phar-stream?branch=master)
[![Version](https://img.shields.io/npm/v/phar-stream.svg)](https://www.npmjs.com/package/phar-stream)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](http://opensource.org/licenses/MIT)



## Usage

phar-stream exposes a single stream, [extract](https://github.com/131/phar-stream#extracting) which extracts phar.


## Related

If you want to unpack directories on the file system check out [phar-fs](https://github.com/131/phar-fs) which provides file system bindings to this module.


## Extracting

To extract a stream use `phar.extract()` and listen for `extract.on('entry', (header, stream, next) )`

``` js
const phar  = require('phar-stream');
const extract = new phar.extract()

extract.on('entry', function(header, stream, next) {
  // header is the phar header
  // stream is the content body (might be an empty stream)
  // call next when you are done with this entry

  stream.on('end', function() {
    next() // ready for next entry
  })

  stream.resume() // just auto drain the stream
})

extract.on('finish', function() {
  // all entries read
})


// archive = fs.createReadStream('somepath.phar');
archive.pipe(extract)
```

The phar archive is streamed sequentially, meaning you **must** drain each entry's stream as you get them or else the main extract stream will receive backpressure and stop reading.

## Headers

The header object using in `entry` should contain the following properties.
Most of these values can be found by stat'ing a file.

``` js
{
  entry_name: 'path/to/this/entry.txt',
  entry_size: 1314,        // entry size. defaults to 0
  entry_mtime: new Date(), // last modified date for entry
  entry_crc32: 15151, // entry CRC32 checksum
}
```


## Todo
* Implement phar-stream.pack to create phar archive (no need for now)
* Get rich or die tryin'


# Credits / related

* [131](https://github.com/131) - author
* [mafintosh' tar-stream](https://github.com/mafintosh/tar-stream) - API inspiration
* [bl](https://www.npmjs.com/package/bl) Buffer list collector, reader and streamer thingy.

# License

MIT
