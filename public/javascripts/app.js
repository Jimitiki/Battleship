var gameData = {player: 0, session: "", 
	ships: {}};
function createGame() {
	this.player = 1;
	$.getJSON("/open-session", function(data) {
		console.log(data);
		gameData.player = 1;
		gameData.session = data.sessionID;
		submitShips();
		switchToGuesses();
		waitForJoin();
	});
}
function joinGame() {
	var sessionID = $("#sessionfield").val();
	var url = "/join-session?q=" + sessionID;
	$.get(url, function(data) {
		console.log(data);
		if (data.success) {
			gameData.player = 2;
			gameData.session = data.sessionID;
			submitShips();
			switchToGuesses();
			pollServer();
		}
	});
}
function submitShips() {
	var url = "/ships";
	var session = "AT8U";
	var ships = {};
	ships.carrier = [];
	for (var i = 0; i < 5; i++){
		ships.carrier.push(Math.floor(Math.random() * 100));
	}
	ships.battleship = [];
	for (i = 0; i < 4; i++)
	{
		ships.battleship.push(Math.floor(Math.random() * 100));
	}
	ships.cruiser = [];
	ships.submarine = [];
	for (i = 0; i < 3; i++)
	{
		ships.cruiser.push(Math.floor(Math.random() * 100));
		ships.submarine.push(Math.floor(Math.random() * 100));
	}
	ships.destroyer = [];
	for (i = 0; i < 2; i++)
	{
		ships.destroyer.push(Math.floor(Math.random() * 100));
	}
	var data  = {data: JSON.stringify({ships: ships, session:gameData.session, player: gameData.player})};
	console.log(data);
	$.post(url, data, function(data, status){
		console.log(data);
	});
}
function submitGuess() {
   	var guess = $("#guessInput").val();
        var url = "/guess";
	data = {guess: guess, player: gameData.player, session: gameData.session};
		
      	$.getJSON(url, data, function(data) {
                console.log(data);
		pollServer();
        });
}

function waitForJoin() {
	$(".guess-disable").attr("disabled", true);
	$("#submit-guess").off("click");
	var interval = setInterval(function() {
		url = '/check-player';
		data = {session: gameData.session};
		$.getJSON(url, data, function(data) {
			if (data.joined) {
				clearInterval(interval);
				console.log('p2 heyuh');
				$("#submit-guess").on("click", submitGuess);
				$(".guess-disable").attr("disabled", false);
			}
		});
	}, 1000);
}

function pollServer() {
	$("#submit-guess").off("click");
	$(".guess-disable").attr("disabled", true);
	var interval = setInterval(function() {
		url = '/check-guess';
		data = {player: gameData.player, session: gameData.session};
		$.getJSON(url, data, function(data) {
			console.log(data);
			if (data.isTurnOver) {
				clearInterval(interval);
				$("#submit-guess").on("click", submitGuess);
				$(".guess-disable").attr("disabled", false);
				console.log(data.hit);
				if (data.hit) console.log(data.coordinates);
			}
		});
	}, 1000);
}

function switchToGuesses() {
	$("#init").hide();
	$("#guess").show();
	$("#submit-guess").on("click", submitGuess);
	$("#session-display").text(gameData.session);
}
$(document).ready(function() {
	$("#creategame").on("click", function() {createGame()});
	$("#joingame").on("click", function() {joinGame()});
});
