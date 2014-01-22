var ameche = require('ameche');

ameche.on('subscribe', function (event) {

    var subscriber = event.subscriber;
    subscriber.on('call:incoming', function (event) {
    	
    	console.log('Received incoming call');
    });
    
    subscriber.on('call:connected', function(event) {
        
        var call = event.call;
        call.say('Hello World!');
    });
});
