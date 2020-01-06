
// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * This application demonstrates how to perform basic operations on
 * subscriptions with the Google Cloud Pub/Sub API.
 *
 * For more information, see the README.md under /pubsub and the documentation
 * at https://cloud.google.com/pubsub/docs.
 */

'use strict';

const credentials = {
    keyFilename: 'keys/backup_reader.json',
    projectId: 'shareapp-1546879226834',
};


async function subscribeWithFlowControlSettings(
  subscriptionName,
  maxInProgress,
  timeout
) {
  // [START pubsub_subscriber_flow_settings]
  // Imports the Google Cloud client library
  const {PubSub} = require('@google-cloud/pubsub');

  // Creates a client
  const pubsub = new PubSub(credentials);

  /**
   * TODO(developer): Uncomment the following lines to run the sample.
   */
  // const subscriptionName = 'my-sub';
  // const maxInProgress = 5;
  // const timeout = 10;

  const subscriberOptions = {
    flowControl: {
      maxMessages: maxInProgress,
    },
  };

  // References an existing subscription.
  // Note that flow control settings are not persistent across subscribers.
  const subscription = pubsub.subscription(subscriptionName, subscriberOptions);

  console.log(
    `Subscriber to subscription ${subscription.name} is ready to receive messages at a controlled volume of ${maxInProgress} messages.`
  );

  const messageHandler = message => {
    console.log(`Received message: ${message.id}`);
    console.log(`\tData: ${message.data}`);
    console.log(`\tAttributes: ${message.attributes}`);

    // "Ack" (acknowledge receipt of) the message
    message.ack();
  };

  subscription.on(`message`, messageHandler);

  setTimeout(() => {
    subscription.close();
  }, timeout * 1000);

  // [END pubsub_subscriber_flow_settings]
}

async function createPushSubscription(topicName, subscriptionName) {
  // [START pubsub_create_push_subscription]
  // Imports the Google Cloud client library
  const {PubSub} = require('@google-cloud/pubsub');

  // Creates a client
  const pubsub = new PubSub(credentials);

  /**
   * TODO(developer): Uncomment the following lines to run the sample.
   */
  // const topicName = 'my-topic';
  // const subscriptionName = 'my-sub';

  const options = {
    pushConfig: {
      // Set to an HTTPS endpoint of your choice. If necessary, register
      // (authorize) the domain on which the server is hosted.
      pushEndpoint: `https://${pubsub.projectId}.appspot.com/push`,
    },
  };

  await pubsub.topic(topicName).createSubscription(subscriptionName, options);
  console.log(`Subscription ${subscriptionName} created.`);

  // [END pubsub_create_push_subscription]
}


function listenForMessages(subscriptionName, timeout) {
  // Imports the Google Cloud client library
  const {PubSub} = require('@google-cloud/pubsub');

  // Creates a client
  const pubsub = new PubSub(credentials);
  // References an existing subscription
  const subscription = pubsub.subscription(subscriptionName);

  // Create an event handler to handle messages
  let messageCount = 0;
  const messageHandler = message => {
    console.log(`Received message ${message.id}:`);
    console.log(`\tData: ${message.data}`);
    console.log(`\tAttributes: ${message.attributes}`);
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


listenForMessages("worker1", 60);

/*createPushSubscription("game2", "worker3").then(result => {
    console.log("done")
})*/


