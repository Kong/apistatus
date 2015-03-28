var unirest = require('unirest')
var statusCodes = require('./codes.js')

module.exports = function getStatus(url, cb) {

  // The response handler
  function responseHandler(res) {

    // This is the response status code
    var code = res.status

    // Create the ouput object
    var output = {}
    if (code && typeof code === 'number') {
      output["statusCode"] = code
      output["statusType"] = statusType(code)
      output["statusDescription"] = statusDescription(code)
      output["online"] = true
    } else {
      output["online"] = false
    }

    // Send the callback with the output
    cb(output)
  }

  // Create our request object with the url and 
  // a long timoeout, not following redirects then
  // put the request into our response handler 
  unirest
    .get(url)
    .timeout(30000)
    .followRedirect(false)
    .end(responseHandler)
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
    statusType = "Non-standardized Code"
  }
  return statusType
}

// Helper function to get the status code description
function statusDescription(code) {
  return statusCodes[code] || "Non-standard Status"
}
