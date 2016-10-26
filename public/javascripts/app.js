var gameData = {player: 0, session: "", ships: []};
function createGame() {
	this.player = 1;
	$.getJSON("/open-session", function(data) {
		console.log(data);
		gameData.player = 1;
		gameData.session = data.sessionID;
		switchToGuesses();
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
			switchToGuesses();
		}
	}); 
}
function submitShips() {
	var url = "/ships";
	var session = "AT8U";
	var data  = JSON.stringify({ships: ships,session:session,player:1});
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
        });
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