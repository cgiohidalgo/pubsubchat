'use strict';
//export GOOGLE_APPLICATION_CREDENTIALS=~/.ssh/backup.json"

const {PubSub} = require('@google-cloud/pubsub');

const credentials = {
    keyFilename: '/home/acastillo/.ssh/backup.json',
    projectId: 'shareapp-1546879226834',
};

async function chatToClient(clientID, message) {
    const pubSubClient = new PubSub(credentials);
    const dataBuffer = Buffer.from(message);
    const messageId = await pubSubClient.topic(clientID).publish(dataBuffer);
    console.log(`Message ${messageId} published.`);
}

let argv = process.argv.slice(2);
let toClientID = argv[0];
let message = argv[1];


chatToClient(toClientID, message);