const gcm = require('node-gcm');
const config = require('../config/config')();
const utility = require('../functions/utility.js');

module.exports = {

    sendNotification: (device_tokens, data) => {
        console.log("It's sending notification");
        // Create a message
        let message = new gcm.Message();

// ... or some given values
//         var message = new gcm.Message({
//             collapseKey: 'demo',
//             priority: 'high',
//             contentAvailable: true,
//             delayWhileIdle: true,
//             timeToLive: 3,
//             restrictedPackageName: "somePackageName",
//             dryRun: true,
//             data: {
//                 key1: 'message1',
//                 key2: 'message2'
//             },
//             notification: {
//                 title: "Hello, World",
//                 icon: "ic_launcher",
//                 body: "This is a notification that will be displayed if your app is in the background."
//             }
//         });

        message.addData(data);
// Set up the sender with you API key
        let sender = new gcm.Sender(config.fcm.api_key);


        // Send the message
        sender.send(message, {registrationTokens: device_tokens}, (err, response) => {
            console.log("Error Notification: " + err);
            console.log(`Response is this {response}`);
            if (err)
                utility.log_it("[" + utility.get_t_now() + "][PushNotifications Service sendNotification] Error '" + err);
            else console.log(response);
        });

// // ... or retrying a specific number of times (10)
//         sender.send(message, {registrationTokens: registrationTokens}, 10, function (err, response) {
//             if (err) console.error(err);
//             else console.log(response);
//         });


    }

};






