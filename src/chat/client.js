'use strict';
//export GOOGLE_APPLICATION_CREDENTIALS=~/.ssh/backup.json"
var stdin = process.stdin;

const { PubSub } = require('@google-cloud/pubsub');
const notification = require('../notification');

const credentials = {
    keyFilename: '/home/acastillo/.ssh/backup.json',
    projectId: 'shareapp-1546879226834',
};

const pubsub = new PubSub(credentials);

function listenForMessages(subscriptionName, timeout, process) {
    // References an existing subscription
    const subscription = pubsub.subscription(subscriptionName + '_');

    // Create an event handler to handle messages
    let messageCount = 0;
    const messageHandler = message => {
        log(`\t${message.attributes.sender}< ${message.data}`);
        messageCount += 1;
        // "Ack" (acknowledge receipt of) the message
        message.ack();
    };
    // Listen for new messages until timeout is hit
    subscription.on(`message`, messageHandler);

    setTimeout(() => {
        subscription.removeListener('message', messageHandler);
        log(`${messageCount} message(s) received.`);
    }, timeout * 1000);
}


let argv = process.argv.slice(2)
let clientID = argv[0];

notification.createChatClient(clientID).then(() => {
    listenForMessages(clientID, 600);
});

// Set input character encoding.
stdin.setEncoding('utf-8');
// When user input data and click enter key.
stdin.on('data', function (text) {
    // User input exit.
    if (text === 'exit\n') {
        // Program exit.
        console.log("Good bye, master");
        process.exit();
    } else {
        let data = text.split(">")
        notification.sendMessage(data[0], data[1], clientID);
    }
});