'use strict';
//export GOOGLE_APPLICATION_CREDENTIALS=~/.ssh/backup.json"

const {PubSub} = require('@google-cloud/pubsub');

const credentials = {
    keyFilename: '/home/acastillo/.ssh/backup.json',
    projectId: 'shareapp-1546879226834',
};

const pubsub = new PubSub(credentials);


async function createChatClient(clientID) {
  try{
    const [topic] = await pubsub.createTopic(clientID);
    console.log(`Topic ${topic.name} created.`);
    subscribeToChanel(clientID);
  } catch(e) {
    console.log('Already a client. Waiting for messages');
  }

}

function subscribeToChanel(clientID) {

  async function createSubscription() {
    // Creates a new subscription
    await pubsub.topic(clientID).createSubscription(clientID + '_');
    console.log(`Subscription ${clientID} created.`);
  }

  createSubscription().catch(console.error);
}


function listenForMessages(subscriptionName, timeout) {
    // References an existing subscription
    const subscription = pubsub.subscription(subscriptionName + '_');
  
    // Create an event handler to handle messages
    let messageCount = 0;
    const messageHandler = message => {
      console.log(`Received message ${message.id}:`);
      console.log(`\tData: ${message.data}`);
      console.log(`\tAttributes: ${JSON.stringify(message.attributes)}`);
      messageCount += 1;
  
      // "Ack" (acknowledge receipt of) the message
      message.ack();
    };
  
    // Listen for new messages until timeout is hit
    subscription.on(`message`, messageHandler);
  
    setTimeout(() => {
      subscription.removeListener('message', messageHandler);
      console.log(`${messageCount} message(s) received.`);
    }, timeout * 1000);
  }
  
  /*
  let argv = process.argv.slice(2)
  let clientID = argv[0];

  createChatClient(clientID);
  listenForMessages(clientID, 300);*/