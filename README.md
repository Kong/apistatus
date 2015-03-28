# API Status [![Travis CI](https://img.shields.io/travis/Mashape/apistatus.svg)](https://travis-ci.org/Mashape/apistatus/) ![License](https://img.shields.io/npm/l/apistatus.svg)

API status is a simple tool that checks if an API is online and display badges

[![API Status](https://img.shields.io/badge/API-online-brightgreen.svg)](http://labs.mashape.com/apistatus) [![API Status](https://img.shields.io/badge/API-301%20redirect-yellowgreen.svg)](http://labs.mashape.com/apistatus) [![API Status](https://img.shields.io/badge/API-404%20client%20error-orange.svg)](http://labs.mashape.com/apistatus) [![API Status](https://img.shields.io/badge/API-501%20server%20error-red.svg)](http://labs.mashape.com/apistatus) [![API Status](https://img.shields.io/badge/API-offline-lightgray.svg)](http://labs.mashape.com/apistatus)

### Install

```sh
npm install apistatus
```

### Usage

```js
var apistatus = require('apistatus')

apistatus('http://mockbin.com/status/200', function(status){
  console.log(status)
  // { statusCode: 200, statusType: 'Success', statusDescription: 'OK', online: true }
})

apistatus('http://mockbin.com/status/404', function(status){
  console.log(status)
  // { statusCode: 404, statusType: 'Client Error', statusDescription: 'Not Found', online: true }
})

apistatus('http://notarealdomain35252.com/', function(status){
  console.log(status)
  // { online: false }
})
```

### Wishlist

- optional HAR object for the requests to use for full API coverage beyond simple GET requests
- optional HAR object for the response to check against, essentially automated API testing 
- a website with logs of status changes and support for periodic checking of saved APIs

### Contributing

Forks and pull requests are most welcomed. Please run `npm test` before sending a pull request. 

### MIT license

Copyright (c) 2015, Mashape (https://www.mashape.com/)
