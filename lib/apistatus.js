var unirest = require('unirest')
var harplayer = require('harplayer')
var statusCodes = require('./codes.js')

module.exports = function getStatus(target, cb) {  

  // We might have a HAR, so let's try to replay
  // all the entries and return an array with the
  // responses in sequential order
  if (typeof target === 'object') {
    var data = []
    harplayer.replayAll(target, function(err, res, body){
      if (err) throw err
      data.push(buildResponse(res.statusCode))
      if (data.length === target.log.entries.length) cb(data)
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
        cb(data)
      })

  } else {
    throw new Error("Missing target URL")
  }
}

// Helper function to get the status type
function statusType(code) {
  var statusType
  if (code >= 100 && code < 200) {
    statusType = "Informational"
  } else if (code >= 200 && code < 300) {
    statusType = "Success"
  } else if (code >= 300 && code < 400) {
    statusType = "Redirect"
  } else if (code >= 400 && code < 500) {
    statusType = "Client Error"
  } else if (code >= 500 && code < 600) {
    statusType = "Server Error"
  } else {
    statusType = "Non-standard Code"
  }
  return statusType
}

// Helper function to get the status code description
function statusDescription(code) {
  return statusCodes[code] || "Non-standard Status"
}

// Helper function to format the response data
function buildResponse(code) {
  var output = {}
  if (code && typeof code === 'number') {
    output["statusCode"] = code
    output["statusType"] = statusType(code)
    output["statusDescription"] = statusDescription(code)
    output["online"] = true
  } else {
    output["online"] = false
  }  
  return output
}
