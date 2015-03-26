var unirest = require('unirest')
var statusCodes = require('./codes.js')

module.exports = function getStatus(url, cb) {

  // Create our request object with timeout
  var request = unirest.get(url).timeout(10000)

  // Take response and get the http status
  request.end(function responseHandler(res) {
    var status = res.status
    var clientError = res.clientError
    var serverError = res.serverError

    if (!status || typeof status !== 'number') {
      buildOutput(false, false, "Offline")
    } else if (clientError || serverError) {
      buildOutput(status, statusMessage(status), "Error")
    } else {
      buildOutput(status, statusMessage(status), "Online")
    }

    function buildOutput(status, msg, type) {
      cb({
        code: status,
        message: msg,
        type: type
      })
    }
  })
}

function statusMessage(status) {
  return statusCodes[status] || "Status"
}
