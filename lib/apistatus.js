var unirest = require('unirest')
var harplayer = require('harplayer')
var statusCodes = require('./codes.js')

function statusCategory(code) {
  if (code >= 100 && code < 200) {
    return "Informational"
  } else if (code >= 200 && code < 300) {
    return "Success"
  } else if (code >= 300 && code < 400) {
    return "Redirect"
  } else if (code >= 400 && code < 500) {
    return "Client Error"
  } else if (code >= 500 && code < 600) {
    return "Server Error"
  } else {
    return "Non-standard Category"
  }
}

function statusMessage(code) {
  return statusCodes[code] || "Non-standard Status"
}

function buildHandler(start) {
  return function(code) {
    var output = {}
    if (code && typeof code === 'number') {
      output.online = true
      output.latency =  new Date().getTime() - start
      output.statusCode = code
      output.message = statusMessage(code)
      output.category = statusCategory(code)
    } else {
      output.online = false
    }  
    return output
  } 
} 

function getStatus(target, callback) { 

  // Build a new response hander with the current time
  // so we can calculate the latency when it's all over
  var buildResponse = buildHandler(new Date().getTime())

  // Just in case the user doesn't care about the response
  // let's define a fallback callback right here
  if (!callback)  {
    callback = function(){}
  }

  // We might have a HAR, so let's try to replay
  // all the entries and return an array with the
  // responses in sequential order
  if (typeof target === 'object') {
    var data = []
    harplayer.replayAll(target, function(err, res, body){
      if (err) { 
        callback(null, err)
      }
      data.push(buildResponse(res.statusCode))
      if (data.length === target.log.entries.length) {
        callback(data)
      }
    })
  } else if (typeof target === 'string') {

    // Create our request object with the url and 
    // a long timoeout, not following redirects then
    // put the request into our response handler 
    unirest
      .get(target)
      .timeout(30000)
      .followRedirect(false)
      .end(function responseHandler(res) {
        var data = buildResponse(res.status)
        callback(data)
      })
  } else {
    throw new Error("Missing valid target URL")
  }

}

module.exports = getStatus
