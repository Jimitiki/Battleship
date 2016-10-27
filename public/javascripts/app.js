var gameData = {player: 0, session: "", ships: {carrier: [], battleship: [], cruiser: [], submarine: [], destroyer: 2}, guesses: []};

var shipLengths = {carrier: 5, battleship: 4, submarine: 3, cruiser: 3, destroyer: 2};

function createGame() {
	this.player = 1;
	$.getJSON("/open-session", function(data) {
		gameData.player = 1;
		gameData.session = data.sessionID;

        $("#init").hide();
        $("#session-id").text(data.sessionID)
        $("#game-load").show();
		waitForJoin();
	});
}
function joinGame() {
	var sessionID = $("#sessionfield").val();
	var url = "/join-session?q=" + sessionID;
	$.get(url, function(data) {
		if (data.success) {
			gameData.player = 2;
			gameData.session = data.sessionID;
            $("#init").hide();
            initializeGame();
            $("#opponent-board img").css("opacity", 0.6);
            var opponent = 3 - gameData.player;
            $("#other-player-num").text("1");
            $("#turn-msg").text("Player " + opponent + "'s turn");
			pollServer();
		}
	});
}
function submitShips() {
	var url = "/ships";
	var data  = {data: JSON.stringify({ships: gameData.ships, session: gameData.session, player: gameData.player})};
	$.post(url, data, function(data, status){
	});
}
function submitGuess() {
    var guess = $(this).attr("id");
    var guessedBefore = false;
    for (var i = 0; i < gameData.guesses.length; i++) {
        if (guess === gameData.guesses[i]) {
            guessedBefore = true;
        }
    }
    if (!guessedBefore) {
        gameData.guesses.push(guess);
        event.stopPropagation();
        $(".not-guessed").off();
        $(this).removeClass("not-guessed");
        var url = "/guess";
        data = {guess: guess, player: gameData.player, session: gameData.session};
        var opponent = 3 - gameData.player;
        $.getJSON(url, data, function(data) {
            $("#player-board img").css("opacity", 1);
            $("#opponent-board img").css("opacity", 0.8);
            var image = "";
            if (data.hit) {
                image = "/images/water_hit.png";
                if (data.ship) {
                    console.log("You sank a " + data.ship);
                    $("#ship-sunk").text("You sank a " + data.ship);
                    $("#ship-sunk").show();
                }
                $("#hit-alert").show();
                setTimeout(function() {
                    $("#hit-alert").hide(800, function() {
                        $("#ship-sunk").hide();
                    });
                }, 300);
            }
            else {
                image = "/images/miss.png";
                $("#miss-alert").show();
                setTimeout(function() {
                    $("#miss-alert").hide(800);                
                }, 300);
            }
            $("#opponent-board #" + guess).attr("src", image);
            console.log(data);
            if (data.playerWins) {
                $("#turn-msg").text("You Win!")
            }
            else {
                pollServer();
                $("#turn-msg").text("Player " + opponent + "'s turn");
            }
        });
    }
}

function waitForJoin() {
	var interval = setInterval(function() {
		url = '/check-player';
		data = {session: gameData.session};
		$.getJSON(url, data, function(data) {
			if (data.joined) {
				clearInterval(interval);
				initializeGame();
                $("#player-board img").css("opacity", 0.8);
                $(".not-guessed").on("click", submitGuess);
                $("#turn-msg").text("Your turn");
                $("#other-player-num").text("2");
                $("#game-view").show();
			}
		});
	}, 500);
}

function pollServer() {
	$("#submit-guess").off();
	$(".guess-disable").attr("disabled", true);
	var interval = setInterval(function() {
		url = '/check-guess';
		data = {player: gameData.player, session: gameData.session};
		$.getJSON(url, data, function(data) {
			if (data.isTurnOver) {
				clearInterval(interval);
                $("#opponent-board img").css("opacity", 1);
                $("#player-board img").css("opacity", 0.8);
                if (data.hit) {
                    $("#player-board #" + data.coordinates).attr("src", "/images/ship_hit.png");
                    if (data.shipSunk) {
                        console.log("your " + data.shipSunk + "has sunk");
                    }
                    $("#hit-alert").show();
                    $("#hit-alert").hide('slow');
                }
                else {
                    $("#player-board #" + data.coordinates).attr("src", "/images/miss.png");
                    $("#miss-alert").show();
                    $("#miss-alert").hide('slow');
                }
                if (data.playerLoses) {
                    $("#turn-msg").text("You Lose!");
                }
                else {
                    $("#turn-msg").text("Your turn");
                    $(".not-guessed").on("click", submitGuess);
                }
			}
		});
	}, 300);
}

function renderGame(shipTiles) {
    $("#game-load").hide();
    $("#game-view").show();
    
	for(x = 99; x >= 0; x--)
	{
        var pTile = '<img src="/images/water.png" class="game-tile" id="' + x + '">';
        var oTile = '<img src="/images/water.png" class="game-tile not-guessed" id="' + x + '">';
        $("#player-board").prepend(pTile);
        $("#opponent-board").prepend(oTile)
    }
    for (var i = 0; i < shipTiles.length; i++)
    {
        $("#player-board #" + shipTiles[i]).attr("src", "/images/ship.png");
    }
}

function generateShip(ship) {
    var orient = Math.floor(Math.random() * 2);
    if (orient) {
        var x = Math.floor(Math.random() * (11 - shipLengths[ship]));
        var y = 10 * Math.floor(Math.random() * 10)
    }
    else {
        var x = Math.floor(Math.random() * 10);
        var y = 10 * Math.floor(Math.random() * (11 - shipLengths[ship]));
    }
    var pos = y + x;
    var shipCoordinates = [pos];
    for(var i = 1; i < shipLengths[ship]; i++)
    {

        if(orient) {
            pos++;
            shipCoordinates[i] = pos;
        }
        else {
            pos += 10;
            shipCoordinates[i] = pos;
        }
    }
    return shipCoordinates;
}

function initializeGame() {
    var shipTiles = [];
    var shipCoordinates = [];
    for(var ship in gameData.ships) {
        var failed = true
        while(failed) {
            failed = false;
            shipCoordinates = generateShip(ship);
			for (var i = 0; i < shipCoordinates.length; i++) {
                for (var j = 0; j < shipTiles.length; j++) {
                    if (shipCoordinates[i] === shipTiles[j]) {
                        failed = true;
                        break;
                    }       
                }
            }
		}
        gameData.ships[ship] = shipCoordinates;
        shipTiles = shipTiles.concat(shipCoordinates);
    }
    submitShips();   
    renderGame(shipTiles);
};

$(document).ready(function() {
	$("#creategame").on("click", function() {createGame()});
	$("#joingame").on("click", function() {joinGame()});
});
