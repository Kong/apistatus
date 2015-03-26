var apistatus = require('./lib/apistatus.js')
var statusCodes = require('./lib/codes.js')
var assert = require('assert')
var nock = require('nock');

// Mock http responses
var nockServer = nock('http://localhost:9876');

nockServer.get('/ok').reply(200, undefined).persist();
nockServer.get('/123').reply(123, undefined).persist();

nockServer.get('/404').reply(404, undefined, {
  Location: 'http://localhost:9876/ok'
}).persist();

nockServer.get('/301').reply(301, undefined, {
  Location: 'http://localhost:9876/ok'
}).get('/302').reply(302, undefined, {
  Location: 'http://localhost:9876/ok'
})

describe('Online', function () {
  it('should return type "Online"', function(done){
    apistatus('http://localhost:9876/ok', function(status){
      assert.equal(status.type, "Online")
      done()
    })
  })
  it('should return message "Online"', function(done){
    apistatus('http://localhost:9876/ok', function(status){
      assert.equal(status.message, "OK")
      done()
    })
  })
  it('should return status "200"', function(done){
    apistatus('http://localhost:9876/ok', function(status){
      assert.equal(status.code, 200)
      done()
    })
  })
})

describe('Offline', function () {
  it('should return type "Offline"', function(done){
    apistatus('http://nodomain:9876/', function(status){
      assert.equal(status.type, "Offline")
      done()
    })
  })
  it('should return message "false"', function(done){
    apistatus('http://nodomain:9876/', function(status){
      assert.equal(status.message, false)
      done()
    })
  })
  it('should return status "false"', function(done){
    apistatus('http://nodomain:9876/', function(status){
      assert.equal(status.code, false)
      done()
    })
  })
})

describe('Redirects', function () {
  it('should follow 301 redirects', function(done){
    apistatus('http://localhost:9876/301', function(status){
      assert.equal(status.code, 200)
      done()
    })
  })
  it('should follow 302 redirects', function(done){
    apistatus('http://localhost:9876/302', function(status){
      assert.equal(status.code, 200)
      done()
    })
  })
  it('should not follow 404 redirect', function(done){
    apistatus('http://localhost:9876/404', function(status){
      assert.equal(status.code, 404)
      done()
    })
  })
})

describe('Errors', function () {
  it('should return type "Error"', function(done){
    apistatus('http://localhost:9876/404', function(status){
      assert.equal(status.type, "Error")
      done()
    })
  })
  it('should return message "Not Found"', function(done){
    apistatus('http://localhost:9876/404', function(status){
      assert.equal(status.message, "Not Found")
      done()
    })
  })
  it('should return status "404"', function(done){
    apistatus('http://localhost:9876/404', function(status){
      assert.equal(status.code, "404")
      done()
    })
  })
  it('should not follow 404 redirect', function(done){
    apistatus('http://localhost:9876/404', function(status){
      assert.equal(status.code, 404)
      done()
    })
  })
})

describe('Status Codes', function () {
  it('should be an object', function(){
    assert.equal(typeof statusCodes, "object")
  })
  it('should return status "123"', function(done){
    apistatus('http://localhost:9876/123', function(status){
      assert.equal(status.code, 123)
      done()
    })
  })
  it('should return message "Status"', function(done){
    apistatus('http://localhost:9876/123', function(status){
      assert.equal(status.message, "Status")
      done()
    })
  })
  it('should return type "Online"', function(done){
    apistatus('http://localhost:9876/123', function(status){
      assert.equal(status.message, "Status")
      done()
    })
  })
})
