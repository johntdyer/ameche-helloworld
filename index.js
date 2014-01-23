var ameche  = require('ameche');
var utils   = require('./utils');

ameche.on('subscribe', function(event) {

    var subscriber = event.subscriber;

    subscriber.on('call:connected', function(event) {
      var call = event.call;

      // Lets let our user know this call is a monitored call
      call.say('We will be watching pager duty to make sure you dont miss an alert while on your call');

      // Start our pagerduty API polling loop
      setInterval(function(){
        utils.getEvents(function(res) {
          var data = '';

            res.on("data", function(chunk) {
              data+=chunk
            });

            res.on('end', function(){
              var incidents = JSON.parse(data).incidents;

              // We have an event
              if(incidents.length >= 1){
                // For now we just care about first incident
                utils.debugLog("obj " + incidents)

                call.say(
                         incidents[0].service.name +
                         " has an alert for " +
                         incidents[0].trigger_summary_data.subject +
                         " which is assigned to " +
                         incidents[0].assigned_to_user.name  +
                         " please press any key to ack this triggered incident"
                        );

                // Ack the alert
                var ask = call.connections[0].ask("[1 DIGIT]", {
                  mode: 'dtmf'
                }).on('end', function(event) {
                  if (event.result) {
                    utils.debugLog('Result: ' + event.result + '. Utterance: ' + event.utterance);
                  } else {
                    var cause = event.cause;
                    if (cause == 'nomatch') {
                      utils.debugLog("Could not recognize user's input");
                    } else if (cause == 'noinput') {
                      utils.debugLog('The user did not type anything');
                    }
                  }
                }).on('error', function(event) {
                  utils.debugLog('Error while performing ask: ' + event.error);
                });

              }else{
                call.say("all good in the hood");
              }
            });

        });
      },5000);

    });
});
