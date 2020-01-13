const express = require('express');

const datastorate = require('./storage');
const notification = require('./notification');
const app = express();


app.get('/', function(req, res) {
    res.send('hello world')
});

app.get('/newgame', function(req, res) {
    // Register the new game for the given clientIDs. 
    //{client1, client2, game: {name, gameID, state, gameLogic}}
    //Steps:
    //1. Create the state in the backend storage
    //2. Notify the pubsub chanel of the client1 with the initial state and authorize for playing the first move
    //
    //let data = {player1: 'player1', player2: 'player2', name: 'hex', state: []};
    let data = JSON.parse(req.query.data.replace(/'/g, '"'));
    console.log(data)
    datastorate.writeData('p2pgames', data).then(async function(result) {
        await notification.createChatClient(data.player1);
        await notification.notifyClient(data.player1, {gameID: result._path.segments[1], state: []});
        res.send('New ' + data.name + ' has been created with ID: ' + result._path.segments[1]);;
        
    })
});

app.get('/register', function(req, res) {
    //TODO register a new player for a game (clientID, gameID, options)
});

app.get('/leave', function(req, res) {
    //TODO release the clientID ending any active game
    //1. Mark any current game in the backed storage as finished
    //2. Clean the pubsub chanel for this clienID
})

app.get('/domove', function(req, res){
    //1. Verify the current movement agains the logic of the game and the state in the backend storage
    //2. Update the backend storage
    //3. Notify the next player thread about the current state of the game
});

app.listen(3000, () => {console.log('App listening on port 3000')} );

//http://localhost:3000/newgame/?query={player1:%27amc%27,player2:%27mcf%27,name:%27hex%27,state:[]}