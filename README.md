php PHAR archive support for nodejs

# API 

```
const Phar = require('phar');

Phar.extract("/path/to/file.phar", "/some/directory", function(err){
  if(err)
      console.error("Something went wrong", err);
  else
      console.log("All went fine, kthxbye");
})

```


# Todo
* Get rich or die tryin'


# Credits
* [131](https://github.com/131) - author
