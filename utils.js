var https  = require('https');
var config   = require('./config');
// Helper function to make logging a little more explicit in the logs
function debugLog(msg,preface) {
  if (typeof(preface) == "undefined") preface = "#### DEBUG #### ";
  console.log(preface + msg);
}

function configSet(v,vName){
  if (typeof(v) == "undefined" || v == null){
    console.error("### ERROR - " + vName + " is not set and required" )
    return false
  }else{
    return true
  }
}

/*

Exports

*/


module.exports.debugLog = debugLog

module.exports.getEvents = function getEvents(callback) {

    var queryParams = "status=triggered"
    var options = {
        host: config.pagerduty.subdomain + '.pagerduty.com',
        port: 443,
        path: '/api/v1/incidents?status=triggered&sort_by=created_on:desc',
        method: 'GET',
        headers: {
            'Authorization': 'Token token=' + config.pagerduty.apikey,
            'Content-type': 'application/json'
        }
    };

    https.get(options, callback).on('error', function(e) {
      debugLog("Got error: " + e.message);
    });
}

module.exports.clearEvent = function clearEvent(event_id,callback) {
   configSet(event_id,'event_id');

    var querystring = require('querystring');

    var data = querystring.stringify({
      requester_id: config.pagerduty.requester_id;
      incidents : [
        {
          id: event_id,
          status: "acknowledged"
        }
      ]
    });

    var options = {
        host: config.pagerduty.subdomain + '.pagerduty.com',
        port: 443,
        path: '/api/v1/incidents',
        method: 'PUT',
        headers: {
          'Authorization': 'Token token=' + config.pagerduty.apikey,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(data)
        }
    };

    https.post(options, callback).on('error', function(e) {
      debugLog("Got error: " + e.message);
    });
}


