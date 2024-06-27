// JavaScript Document
/*eslint-env es6*/

//Variables and Constants
const first_background_top = 40;
const first_background_left = 10;
const delta_between_rows = 74;
const delta_between_columns = 54;
const first_card_top = first_background_top + 5 + delta_between_rows;
const first_card_left = first_background_left + 5 + delta_between_columns;
var timeDelay = 750;
var timeLeft;
var timerId = setInterval(countdown, 1000);
var max_num_rows;
var max_num_columns;
var selector_current_row;
var selector_current_column;
var first_selection_row;
var first_selection_column;
var selectedCard;
var selectorEnable;
var first_selection;
var second_selection;
var current_turn;
var paired_cards;
var max_paired_cards;
//var card_matrix = math.zeros(max_num_rows, max_num_columns);
var card_matrix;
var matched_card_matrix;


//Ask the user for the size of rows and columns of the game with restrictions
function userInput()
{
	//Convert the input from strings into numbers(integers)
	max_num_rows = Number( document.getElementById("userRows").value );
	max_num_columns = Number( document.getElementById("userColumns").value );
	//calculate the total number of cards
	let gameSize = max_num_rows *  max_num_columns;
	//total number of cards cannot exceed 20
	if ( gameSize > 20 )
	{
		console.log("ERROR: The maximum number of cards cannot exceed 20 !!!");
	}
	//total number of cards have to be an even number
	else if ( gameSize % 2 != 0 )
	{
		console.log("ERROR: The total number of cards must be an even number !!!");
	}
	//all input number must be positive
	else if ( max_num_rows < 1 || max_num_columns < 1 )
	{
		console.log("ERROR: The dimensions must be greater than zero !!!");
	}
	// if conditions are met run the game
	else
	{
		setup();
	}
}

//Function where all functions are located to be run on the tag "onload" in HTML
function setup()
{
	resetGame();
	drawBackground();
	drawCards();
	createSelector();
	keySelector();
	countdown()
	shuffle();
	centerTime();
	printCardMatrix();
	wonGame();
}

//Functions resets the 2 matrixes of the game
function resetMatrixes()
{
	card_matrix = Array.from(Array( max_num_rows ), () => new Array( max_num_columns ));
	matched_card_matrix = Array.from(Array( max_num_rows ), () => new Array( max_num_columns ));
	
	for (let i = 0; i < max_num_rows; i++)
	{
		for (let j = 0; j < max_num_columns; j++)
		{
			card_matrix[ i ][ j ] = 0;
			matched_card_matrix[ i ][ j ] = 0;
		}
	}
}

//this resets everything everytime the button "Start Game" is clicked
function resetGame()
{
	document.getElementById('images').innerHTML = "";
    selector_current_row = 0;
    selector_current_column = 0;
    first_selection_row = 0;
    first_selection_column = 0;
    selectedCard = 0;
	selectorEnable = 1;
    first_selection = 0;
    second_selection = 0;
    current_turn = 1;
    paired_cards = 0;
	timeLeft = Math.floor((( max_num_rows * max_num_columns ) * 1.4286) - 0.7143);
	max_paired_cards = eval(eval(max_num_rows * max_num_columns) / 2);
	resetMatrixes();
}

//Funtion that display the timer
function countdown() 
{
	//If the time reaches -1 the game will reset by calling the function resetGame()
	if (timeLeft == -1) 
	{
        clearTimeout(timerId);
        console.log("YOU LOSEEEEE!!");
		location.reload();
    } 
	// if the time left is between 0 - 9 concatinate 00:0 to the timeLeft
	else if (timeLeft < 10)
	{
        document.getElementById('secondsRemaining').innerHTML = "00:0" + timeLeft;
        timeLeft--;
	}
	// if the time left is greater than 9 concatinate 00: to the timeLeft
	else
	{
		document.getElementById('secondsRemaining').innerHTML = "00:" + timeLeft;
        timeLeft--;
	}
}

// The timer here is being centered on the top middle on the game no matter the size chosen for the user
function centerTime()
{
	// we call the Div from HTML and modify the CSS according to the size
	let Timer = document.getElementById('secondsRemaining');
	Timer.style.position = 'absolute';
	Timer.style.top = ( first_background_top + 17 ) + 'px';
	Timer.style.left = ((( first_background_left + ( delta_between_columns * (max_num_columns + 2) )) / 2)- 40) + 'px';
	Timer.style.zIndex = 1;
}

//Function that draw the cards on HTML using nested loops
function drawCards()
{
	for (let i = 0; i < max_num_rows; i++)
	{
		for (let j = 0; j < max_num_columns; j++)
		{
			let backCard = document.createElement('img');
			backCard.src = './images/card.png';
			backCard.id += "backCard" + i + j;
			backCard.style.position = 'absolute';
			backCard.style.top = ( first_card_top + ( delta_between_rows * i ) ) + 'px';
			backCard.style.left = ( first_card_left + ( delta_between_columns * j ) ) + 'px';
			backCard.style.zIndex = 1;
			document.getElementById('images').appendChild(backCard);
		}
	}
}

//Function that display selector on (0,0) "On top of first card"
function createSelector()
{
	let selector = document.createElement('img');
	selector.src = './images/selector.png';
	selector.id += "selector";
	selector.style.position = 'absolute';
	selector.style.top = first_card_top + 'px';
	selector.style.left = first_card_left + 'px';
	selector.style.zIndex = 2;	
	document.getElementById('images').appendChild(selector);
}

//Function that contains the Event Listener 'keydown'
function keySelector()
{
	document.addEventListener('keydown', onKeyDown);
}

//Function that recieves the data from keySelector and places it into a switch
function onKeyDown (event)
{
	switch (true)
		{
			// Up
			case ( event.code == "KeyW" || event.code == "ArrowUp" ):
				
				if (selector_current_row > 0)
					{
						selector_current_row -= 1;
					}
				else
					{
						selector_current_row = (max_num_rows - 1);
					}
				break;
			// Down
			case ( event.code == "KeyS" || event.code == "ArrowDown" ):
				if ((selector_current_row + 1) < max_num_rows)
					{
						selector_current_row += 1;
					}
				else
					{
						selector_current_row = 0;
					}
				break;
			// Left
			case ( event.code == "KeyA" || event.code == "ArrowLeft" ):
				if (selector_current_column > 0)
					{
						selector_current_column -= 1;
					}
				else
					{
						selector_current_column = (max_num_columns - 1);
					}	
				break;			
			// Right
			case ( event.code == "KeyD" || event.code == "ArrowRight" ):
				if ((selector_current_column + 1) < max_num_columns)
					{
						selector_current_column += 1;
					}
				else
					{
						selector_current_column = 0;
					}
				break;
			//Flip Card
			case event.code == "Enter" && selectorEnable == 1:
				flipCard();
				break;
		}
	moveSelector();
}

//Function that move selector using the variables changed on the onKeyDown function
function moveSelector()
{
	let selector = document.getElementById('selector');
	selector.style.top = ( first_card_top + ( delta_between_rows * selector_current_row ) ) + 'px';
	selector.style.left = ( first_card_left + ( delta_between_columns * selector_current_column ) ) + 'px';
}

//Function that "flips"/ check whether first card and second card selected are pair or no plus some other conditions
function flipCard()
{
	//store the current position in a variable when enter is being press to be checked later on following consitions
	selectedCard = document.getElementById('backCard' + selector_current_row + selector_current_column);
	console.log(card_matrix[ selector_current_row ][ selector_current_column ]);
	//check if card selected has already been matched.
	if (current_turn == 1)
	{
		if (matched_card_matrix[selector_current_row][selector_current_column] == 1)
		{
			console.log("Already matched");
		}
		//Replace selected back img card with front img card and store the number of the location of the 2D array into a variable to be check to the second selection
		else
		{
			selectedCard.src = './images/card' + card_matrix[ selector_current_row ][ selector_current_column ] + '.png'
			first_selection_row = selector_current_row;
			first_selection_column = selector_current_column;
			first_selection = card_matrix[ selector_current_row ][ selector_current_column ];
			current_turn++;
		}
	}
	//this is second turn if the first if is not true.
	else
	{
		//Check if user selected the same position (Card) than first selection
		if ((selector_current_row == first_selection_row) && (selector_current_column == first_selection_column))
		{
			console.log("Same position, 'tupid");
		}
		//Check if second selection is a card that already has been matched
		else if (matched_card_matrix[selector_current_row][selector_current_column] == 1)
		{
			console.log("Already matched");
		}
		//check if card selected is a pair or not.
		else
		{
			//store second selection into a variable to be checked to the first selection
			selectedCard.src = './images/card' + card_matrix[ selector_current_row ][ selector_current_column ] + '.png'
			second_selection = card_matrix[ selector_current_row ][ selector_current_column ];
			current_turn = 1;
			//check if two selections are a paired, if so add 1 to counter "paired_cards" and add 2 to timer
			if (first_selection == second_selection)
			{
				paired_cards++;
				console.log(paired_cards + " Paired Cards");
				console.log("MATCHED");
				wonGame();
				matched_card_matrix[first_selection_row][first_selection_column] = 1;
				matched_card_matrix[selector_current_row][selector_current_column] = 1;
				printCardMatrix();
				timeLeft += 2;
			}
			// if selected cards are not a pair then disable the "enter keycode" by assingning 0 to the variable "selectorEnable" and wait 1 second before calling noMatched function
			else
			{
				selectorEnable = 0;
				setTimeout(noMatched, timeDelay);
				console.log("TRY AGAIN");
			}
		}
	}
}
//Function used when selected cards are not a pair
function noMatched()
{
	//Replace back imgs to backcards of first and second selection also enables the enter key again
	selectedCard.src = './images/card.png';
	let firstCard = document.getElementById('backCard' + first_selection_row + first_selection_column);
	firstCard.src = './images/card.png';
	selectorEnable = 1;
}
//Function that draws BG dynamically
//
function drawBackground()
{
	for (let i = 0; i < max_num_rows + 2; i++)
	{
		for (let j = 0; j < max_num_columns + 2; j++)
		{
			let backGround = document.createElement('img');
			
			switch ("" + i + j)
				{
					case "00":
						backGround.src = './images/BG_NW.png';
						break;
					case "0" + eval(max_num_columns + 1):
						backGround.src = './images/BG_NE.png';
						break;
					case eval(max_num_rows + 1) + "0":
						backGround.src = './images/BG_SW.png';
						break;
					case "" + eval(max_num_rows + 1) + eval(max_num_columns + 1):
						backGround.src = './images/BG_SE.png';
						break;
					case "0" + j:
						backGround.src = './images/BG_N.png';
						break;
					case i + "0":
						backGround.src = './images/BG_W.png';
						break;
					case "" + eval(max_num_rows +1) + j:
						backGround.src = './images/BG_S.png';
						break;
					case "" + i + eval(max_num_columns + 1):
						backGround.src = './images/BG_E.png';
						break;
					default:
						backGround.src = './images/BG_C.png';
				}
			backGround.id += "BG_" + i + j;
			backGround.style.position = 'absolute';
			backGround.style.top = ( first_background_top + ( delta_between_rows * i ) ) + 'px';
			backGround.style.left = ( first_background_left + ( delta_between_columns * j ) ) + 'px';
			backGround.style.zIndex = 0;
			document.getElementById('images').appendChild(backGround);
		}
	}

}

//funtion to  test only, it shows the location of the cards in console log
function printCardMatrix()
{
	let row = "";
	for (let i = 0; i < max_num_rows; i++)
	{
		row = "Row " + i + " = ";
		for (let j = 0; j < max_num_columns; j++)
		{
			row += card_matrix[i][j] + ", ";
		}
		console.log(row);
	}
	
	for (let i = 0; i < max_num_rows; i++)
	{
		row = "Row " + i + " = ";
		for (let j = 0; j < max_num_columns; j++)
		{
			row += matched_card_matrix[i][j] + ", ";
		}
		console.log(row);
	}
}

//since I couldnt figure out how to generate random number that only repeat twice between 1 and 10, I used the RNG to shuffle the already preset numbers from 1 to 10

function shuffle()
{
	let counter = 1;
	let card = 1;
	let randomNumber;
	let arrayIndex;
	let arrayLength;
	let arrayShift;
	let tempCard;
	// with this loop we fill the 2D arrays with number from 1 to 10 repeating each number once ( 1, 1, 2, 2, 3, 3, ... 10, 10)
	for (let i = 0; i < max_num_rows; i++)
	{
		for (let j = 0; j < max_num_columns; j++)
		{
			card_matrix[ i ][ j ] = card;
			if( counter == 2 )
			{
			  	card++;
				counter = 1;
			}
			else
			{
			  	counter++;
			}
		}
	}
	//once the array is fill with the numbers we shuffle the array witht he following nested loop
	arrayLength = ( max_num_rows * max_num_columns ) + 1;
	for (let i = 0; i < max_num_rows; i++)
	{
		for (let j = 0; j < max_num_columns; j++)
		{
			arrayIndex = ( i * max_num_columns ) + j;
			arrayShift =  ( arrayLength - ( arrayIndex + 1 ) );
			randomNumber = Math.floor( ( Math.random() * arrayShift ) + arrayIndex );
			let iRandom = Math.floor( randomNumber / max_num_columns );
			let jRandom = randomNumber % max_num_columns;
			//console.log( "arrayIndex = " + arrayIndex + ", arrayShift = " + arrayShift + ", randomNumber = " + randomNumber + ", iRandom = " + iRandom + ", jRandom = " + jRandom );
			tempCard = card_matrix[ i ][ j ];
			card_matrix[ i ][ j ] = card_matrix[ iRandom ][ jRandom ];
			card_matrix[ iRandom ][ jRandom ] = tempCard;
		}
	}
}

//when paired cards are equal to total number of cards divided by too, the user won the game, clear the time.
function wonGame()
{
	if (paired_cards == max_paired_cards)
		{
			console.log("YOU WON!");
			clearTimeout(timerId);
		}
}