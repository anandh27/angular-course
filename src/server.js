// Twilio info.
var twilioAccountSID = 'AC1b698743da69d39a41e2e1edb49d40e8';
var twilioAuthToken = 'c6974858a5a9a81f74c1a4d09f786f1e';
var twilioNumber = '+12248580751';

// Firebase info.
var firebaseSecret = 'p3aRM8jaXRqQkoXftfkloFbChReV5kqH3ycziAyF';
var firebaseURL = 'https://waitandeat-thomas.firebaseio.com/';

// // Mailgun info.
// var mailgunApiKey = '';
// var mailgunDomain = '';

// Create references for libraries.
var express = require('express');
var http = require('http');
var Firebase = require('firebase');
var twilio = require('twilio');
// var mailgun = require('mailgun-js')({apiKey: mailgunApiKey, domain: mailgunDomain});

// Express server setup.
var router = express();
var server = http.createServer(router);
var twilioClient = twilio(twilioAccountSID, twilioAuthToken);

// Authenticate Firebase.
var firebaseRef = new Firebase(firebaseURL);
firebaseRef.authWithCustomToken(firebaseSecret, function(error, authData) {
  if (error) {
    console.log("Firebase server authentication failed.");
  } else {
    console.log("Authenticated with Firebase secret successfully.");
  }
});

// Create a reference to textMessages.
var textMessagesRef = firebaseRef.child('textMessages');

// Listen for new objects pushed to textMessagesRef.
textMessagesRef.on("child_added", function(snapshot) {
  var textMessage = snapshot.val();
  twilioClient.messages.create({
    body: 'Hi ' + textMessage.name + '! Your table for ' + textMessage.size + ' is now ready!',
    to: textMessage.phoneNumber,
    from: twilioNumber
  }, function(err, message) {
    if (err) {
      console.log(err);
    } else {
      console.log(message);
    }
  });
});

// // Create a reference to emails.
// var emailsRef = firebaseRef.child('emails');

// // Listen for new objects pushed to emailsRef.
// emailsRef.on("child_added", function(snapshot) {
//   var email = snapshot.val();
//   var emailData = {
//     from: '<postmaster@'  + mailgunDomain + '>',
//     to: email.emailAddress,
//     subject: 'Welcome to Wait and Eat',
//     text: 'Thanks for signing up for Wait and Eat!'
//   };
//   mailgun.messages().send(emailData, function(error, body) {
//     console.log(body);
//     if (error) {
//       console.log(error);
//     };
//   });
// });

server.listen(process.env.PORT || 8080, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});
