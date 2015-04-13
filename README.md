# API Status [![Test Status](https://img.shields.io/travis/Mashape/apistatus.svg)](https://travis-ci.org/Mashape/apistatus/) [![Test Coverage](https://codeclimate.com/github/Mashape/apistatus/badges/coverage.svg)](https://codeclimate.com/github/Mashape/apistatus) ![License](https://img.shields.io/npm/l/apistatus.svg)

API status is a simple tool to send API requests and retrieve standard response data.

### Install

```sh
npm install apistatus
```

### Usage

```js
var apistatus = require('apistatus')

apistatus('http://mockbin.com/status/200', function(status){
  console.log(status)
  // { online: true, statusCode: 200, category: 'Success', message: 'OK' }
})

apistatus('http://mockbin.com/status/404', function(status){
  console.log(status)
  // { online: true, statusCode: 404, category: 'Client Error', message: 'Not Found' }
})

apistatus('http://notarealdomain35252.com/', function(status){
  console.log(status)
  // { online: false }
})

apistatus(require("har.json"), function(statuses){
  console.log(statuses)
  // [{ online: true, statusCode: 200, category: 'Success', message: 'OK' },...
})
```

### Wishlist

- optionally use the HAR response object to check against, essentially automated API testing 

### Contributing

Forks and pull requests are most welcomed. Please run `npm test` before sending a pull request. 

### MIT license

Copyright (c) 2015, Mashape (https://www.mashape.com/)
