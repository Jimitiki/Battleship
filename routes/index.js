var express = require('express');
var router = express.Router();

var sessions = {};

function generateSessionID() {
    var id = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 6; i++ )
        id += possible.charAt(Math.floor(Math.random() * possible.length));
    return id;
}



/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html', { root: 'public' });
});

router.get('/open-session', function(req, res, next) {
  var sessionID = generateSessionID();
  var array1 = [];
  var array2 = [];
  for (var i = 0; i <= 15; i++){
    array1.push(Math.floor(Math.random() * 100));
    array2.push(Math.floor(Math.random() * 100));
  }
  console.log(array1);
  console.log(array2);
  var session = {
    id: sessionID,
    p1Ships: array1,
    p2Ships: array2
  }
  sessions[sessionID] = session;
  console.log('hohoho');
  res.status(200).json({sessionID: sessionID});
});

router.get('/join-session', function(req, res, next) {
  var session = req.query.q;
  var success = false;
  if (sessions[session]) {
    success = true;
  }
  console.log(sessions[session]);
  var result = {success: success, sessionID: session};
  res.status(200).json(result);
});

router.post('/ships', function(req, res, next) {
  console.log(req);
  var body = req.body;
  console.log(body);
  //console.log(JSON.parse(req.rawBody));
  var sessionID = body["sessionID"];
  var player = body["player"];
  console.log(body["ships[]"]);
  res.json(body);
});

router.get('/guess', function(req, res, next) {
  var guess = req.query.guess;
  var player = req.query.player;
  var session = req.query.session;
  console.log(req.query);
  console.log("guess: " + guess + "  player: " + player + "  sessionID: " + session);
  session = sessions[session];
  var coordinates = (player == 1 ? session.p2Ships : session.p1Ships);
  var hit = false;
  for (var i = 0; i < coordinates.length; i++) {
    if (guess == coordinates[i]) {
      hit = true;
      break;
    }
  }
  var result = {hit: hit};
  res.status(200).json(result);
});
module.exports = router;
