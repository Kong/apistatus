var apistatus = require('../lib/apistatus.js')
var statusCodes = require('../lib/codes.js')
var assert = require('assert')
var nock = require('nock');

// Mock http responses
var nockServer = nock('http://localhost:9876');

nockServer.get('/ok').reply(200, undefined).persist();
nockServer.get('/fail').reply(501, undefined).persist();
nockServer.get('/redirect').reply(301, undefined).persist();
nockServer.get('/123').reply(123, undefined).persist();
nockServer.get('/500').reply(500, undefined).persist();
nockServer.get('/501').reply(501, undefined).persist();
nockServer.get('/777').reply(777, undefined).persist();

nockServer.get('/404').reply(404, undefined, {
  Location: 'http://localhost:9876/ok'
}).persist();

nockServer.get('/301').reply(301, undefined, {
  Location: 'http://localhost:9876/ok'
}).get('/302').reply(302, undefined, {
  Location: 'http://localhost:9876/ok'
})

describe('Package', function () {
  it('should still work with missing callback', function(){
    assert.doesNotThrow(function() { 
      apistatus('http://localhost:9876/ok') 
    }, Error)
  })
  it('should throw error for missing URL', function(done){
    assert.throws(function() { 
      apistatus(function(){}) 
    }, Error)
    done()
  })
  it('should throw error for invalid URL', function(){
    assert.throws(function() { 
      apistatus(53, function(){}) 
    }, Error)
  })
})

describe('Online', function () {
  it('should return online true', function(done){
    apistatus('http://localhost:9876/ok', function(status){
      assert.equal(status.online, true)
      done()
    })
  })
  it('should return message "OK"', function(done){
    apistatus('http://localhost:9876/ok', function(status){
      assert.equal(status.message, "OK")
      done()
    })
  })
  it('should return statusCode 200', function(done){
    apistatus('http://localhost:9876/ok', function(status){
      assert.equal(status.statusCode, 200)
      done()
    })
  })
})

describe('Offline', function () {
  it('should return online false', function(done){
    apistatus('http://nodomain:9876/', function(status){
      assert.equal(status.online, false)
      done()
    })
  })
  it('should return undefined statusDescription', function(done){
    apistatus('http://nodomain:9876/', function(status){
      assert.equal(status.statusDescription, undefined)
      done()
    })
  })
  it('should return undefined status', function(done){
    apistatus('http://nodomain:9876/', function(status){
      assert.equal(status.code, undefined)
      done()
    })
  })
})

describe('Redirects', function () {
  it('should not follow 301 redirects', function(done){
    apistatus('http://localhost:9876/301', function(status){
      assert.equal(status.statusCode, 301)
      done()
    })
  })
  it('should not follow 302 redirects', function(done){
    apistatus('http://localhost:9876/302', function(status){
      assert.equal(status.statusCode, 302)
      done()
    })
  })
  it('should not follow 404 redirect', function(done){
    apistatus('http://localhost:9876/404', function(status){
      assert.equal(status.statusCode, 404)
      done()
    })
  })
})

describe('Errors', function () {
  it('should return client errors', function(done){
    apistatus('http://localhost:9876/404', function(status){
      assert.equal(status.category, "Client Error")
      done()
    })
  })
  it('should return server errors', function(done){
    apistatus('http://localhost:9876/501', function(status){
      assert.equal(status.category, "Server Error")
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
      assert.equal(status.statusCode, "404")
      done()
    })
  })
  it('should not follow 404 redirect', function(done){
    apistatus('http://localhost:9876/404', function(status){
      assert.equal(status.statusCode, 404)
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
      assert.equal(status.statusCode, 123)
      done()
    })
  })
  it('should return non-standard status cpde', function(done){
    apistatus('http://localhost:9876/777', function(status){
      assert.equal(status.category, "Non-standard Category")
      done()
    })
  })
  it('should return non-standard status description', function(done){
    apistatus('http://localhost:9876/123', function(status){
      assert.equal(status.message, "Non-standard Status")
      done()
    })
  })
  it('should return standard status descriptions', function(done){
    apistatus('http://localhost:9876/500', function(status){
      assert.equal(status.message, "Internal Server Error")
      done()
    })
  })
})

describe('HAR Requests', function () {
  var har = require('./har.json')
  it('should be an array ', function(done){
    apistatus(har, function(data){
      assert.equal(data instanceof Array, true)
      done()
    })
  })
  it('should have three results', function(done){
    apistatus(har, function(data){
      assert.equal(data.length, 3)
      done()
    })
  })
  it('should throw an error on invalid har', function(done){
    assert.throws(function() { 
      apistatus({"not": "a har file"}, function(){}) 
    }, Error)
    done()
  })
  it('should have have the correct status codes', function(done){
    apistatus(har, function(data){
      var codes = [200, 301, 501], c = 0
      data.map(function(d){
        assert.equal(d.statusCode, codes[c++])
      })
      done()
    })
  })
})

describe('Latency', function () {
  it('should be a number', function(){
    apistatus('http://mockbin.com', function(status){
      assert.equal(typeof status.latency, "number")
      done()
    })
  })
})
