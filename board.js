$(document).ready(function() {

	var gameboard = "";

	var letter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

	var ships = [
		['', '', '', '', ''],
		['', '', '', '', 'x'],
		['', '', '', 'x', 'x'],
		['', '', '', 'x', 'x'],
		['', '', 'x', 'x', 'x']
	];

	
	for(x = 0; x < 10; x++)
	{
		gameboard += "<div>";
		for(y = 0; y < 10; y++)
		{
			gameboard += '<img src="sprites/water.png" class="tile" id="' + letter[x] + (y+1) + '">';
		}
		gameboard += "</div>";
	}

	$("#gameboard").html(gameboard);

	$("#generate").click(function(e){

		gameboard = ""

		var orient = 0;
		var start = "A1";
		var x_coord = 0;
		var y_coord = 0;
		var dir = [-1, 1];
		var dir_bool = 1;
		var used = [];
		var exists = 0;

		
		for(i = 0; i < 5; i++)
		{
			
			

			while(exists != 1)
			{

			orient = Math.floor(Math.random() * 2);
			x_coord = Math.floor(Math.random() * 10);
			y_coord = Math.floor(Math.random() * 10);
			dir_bool = 1;

			var start = [x_coord, y_coord];
			exists = 0;
			used = [];
			console.log("Ship number " + i);
			for(j = 0; j < 5; j++)
			{

				if(ships[i][j] != 'x')
				{
					ships[i][j] = letter[x_coord] + (y_coord + 1);
					console.log(ships[i][j]);

					if(orient == 1)
					{
						if((x_coord + 1) > 9)
						{
							x_coord = start[0];
							dir_bool = 0;
						}
						x_coord+=dir[dir_bool];
					} else {
						if((y_coord + 1) > 9)
						{
							y_coord = start[1];
							dir_bool = 0;
						}
						y_coord+=dir[dir_bool];
					}

					for(k = 0; k < used.length ; k++)
					{
						if (used[k] == letter[x_coord] + (y_coord + 1)) {exists = 1}
							else {used.push(letter[x_coord] + (y_coord + 1))};
					}

					
				
				}
			}
			}

		}
	


		var newtile = "A1";
		var shiptile = "A1";
		var tilestate = 0;


	for(x = 0; x < 10; x++)
	{
		gameboard += "<div>";
		for(y = 0; y < 10; y++)
		{
			newtile = letter[x] + (y+1);

			for(i = 0; i < 5; i++)
			{
				for(j = 0; j < 5; j++)
				{
					shiptile = ships[i][j];
					if (shiptile == newtile)
					{
						tilestate = 1;
					}
				}
			}

			if(tilestate == 1)
			{
				gameboard += '<img src="sprites/ship.png" class="tile" id="' + letter[x] + (y+1) + '">';
				tilestate = 0;
			}
			else
			{
				gameboard += '<img src="sprites/water.png" class="tile" id="' + letter[x] + (y+1) + '">';
			}
		}
		gameboard += "</div>";
	}

	$("#gameboard").html(gameboard);

	});

	$(".tile").click(function(e){
		var mytile = $(this).attr("id");
		console.log(mytile);
	});
});