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
  var session = {
    hasGuessed: false,
    guessPlayer: 1,
    guessLocation: -1,
    shipSunk: false,
    hit: false,
    p1Ships: {},
    p2Ships: {},
    ready: false
  }
  sessions[sessionID] = session;
  res.status(200).json({sessionID: sessionID});
});

router.get('/join-session', function(req, res, next) {
  var session = req.query.q;
  var success = false;
  if (sessions[session]) {
    success = true;
    sessions[session]["ready"] = true;
  }
  console.log(sessions[session]);
  var result = {success: success, sessionID: session};
  res.status(200).json(result);
});

router.post('/ships', function(req, res, next) {
	var data = JSON.parse(req.body.data);
	console.log(data);
	var session = sessions[data.session];
	var playerShips = "p" + data.player + "Ships";
	console.log(playerShips);
	if (typeof session[playerShips].battleship === "undefined") {
		session[playerShips] = data.ships;
		console.log(session);
	}
	var result = {result: "ok"};
	res.json(result);
});

router.get('/guess', function(req, res, next) {
  var guess = req.query.guess;
  var player = req.query.player;
  var session = req.query.session;
  console.log(req.query);
  console.log("guess: " + guess + "  player: " + player + "  sessionID: " + session);
  session = sessions[session];
  var ships = (player == 1 ? session.p2Ships : session.p1Ships);
  var hit = false;
  var result = {};
  for (var ship in ships) {
	var coordinates = ships[ship];
	for (var i = 0; i < coordinates.length; i++) {
    		if (guess == coordinates[i]) {
      			hit = true;
			coordinates.splice(i, 1);
			if (coordinates.length === 0)
			{
				session.shipSunk = ship;
				result.ship = ship;
				delete ships[ship];
			}
      			break;
		}
    	}
  }
  if (Object.keys(ships).length === 0 && obj.constructor === Object) {
	result.playerWins = true;
	session.winner = player;
  }
  session.hit = hit;
  session.guessLocation = guess;
  session.hasGuessed = true;
  console.log(session);
  result.hit = hit;
  res.status(200).json(result);
});
router.get('/check-player', function(req, res, next) {
	var session = sessions[req.query.session];
	var ready = session.ready;
	result = {joined: ready};
	res.status(200).json(result);
});
router.get('/check-guess', function(req, res, next) {
	var session = sessions[req.query.session];
	var result = {isTurnOver: session.hasGuessed};
	if (req.query.player != session.guessPlayer && session.hasGuessed) {
		session.hasGuessed = false;
		session.guessPlayer = req.query.player;
		result.hit = session.hit;
		result.coordinates = session.guessLocation
		if (session.shipSunk) {
			result.shipSunk = session.shipSunk;
			session.shipSunk = false;
		}
		if (session.winner) {
			result.winner = winner;
		}
	}
	res.status(200).json(result);
});
module.exports = router;
