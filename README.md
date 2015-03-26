# API Status 

API status is a simple tool that checks if an API is online. 

### Installation

```sh
npm install apistatus
```

### Programmatic Usage

```js
var apistatus = require('apistatus')

apistatus('http://mockbin.org/get', function(status){
  console.log(status)
  // { code: 200, message: 'OK', type: 'Online' }
})

apistatus('http://notarealdomain35252.org/', function(status){
  console.log(status)
  // { code: false, message: false, type: 'Offline' }
})

apistatus('http://mockbin.org/404', function(status){
  console.log(status)
  // { code: 404, message: 'Not Found', type: 'Error' }
})
```

### Wish List

- a website with logs of changes
- interval support for periodic checkups
- an api and support for [shields.io](shields.io) 

[![API Status](https://img.shields.io/badge/API-online-brightgreen.svg)](labs.mashape.com/apistatus) [![API Status](https://img.shields.io/badge/API-301%20redirect-yellowgreen.svg)](labs.mashape.com/apistatus) [![API Status](https://img.shields.io/badge/API-404%20client%20error-orange.svg)](labs.mashape.com/apistatus) [![API Status](https://img.shields.io/badge/API-501%20server%20error-red.svg)](labs.mashape.com/apistatus) [![API Status](https://img.shields.io/badge/API-offline-lightgray.svg)](labs.mashape.com/apistatus)

### Contributing

Forks and pull requests are most welcomed. Please run `npm test` before sending a pull request. 

### MIT license

Copyright (c) 2014, Mashape (https://www.mashape.com/)
