"use strict";

const phar = require('./');


phar.extract("test/2362566.phar", "sub", function(err) {
  console.log(err);

});