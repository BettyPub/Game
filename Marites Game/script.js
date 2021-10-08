$(function () {

	//DECLARATION OF VARIABLES
	const memoryBoard = $('#memory-game');

	//array for the memory cards or tiles

	let cardArray = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2', 'E1', 'E2', 'F1', 'F2', 'G1', 'G2', 'H1', 'H2', 'J1', 'J2', 'K1', 'K2', 'L1', 'L2', 'M1', 'M2', 'N1', 'N2', 'O1', 'O2'];

	let easyArray = cardArray.slice(0, 8);
	let normalArray = cardArray.slice(0, 16);
	let hardArray = cardArray;
	let gameMode = [];
	let array = [];
	let gameModes = ["EASY", "NORMAL", "HARD"];

	let gameModeContainer = document.querySelector('.modecontainer');

	let comparisonArray = [];

	let attempts = 0; //counts how many attempts or guesses a player has made
	let stars = '<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>'; //stores the stars to display
	let clickCount = 0; //counts if this is the first click in an attempt
	let pairs = 0; //counts how many pairs have been matched
	let cardID = ''; //stores the card ID of matched pairs


	let seconds = 60 * 1000; //1 minute in JS
	let minutes = 00;
	let Interval;
	let flipAudio = new Audio("plop.mp3");
	let matchAudio = new Audio("win.mp3");
	let winEndGameAudio = new Audio("endgame.mp3");
	let loseEndGameAudio = new Audio("fail.mp3");

	let modal = document.getElementById("popup1");


	//on page load

	restart();
	goBack();

	//EVENT TRIGGERS

	//reloading the page when undo is clicked
	function restart() {
		document.querySelectorAll(".fa-undo").forEach(undoButton => {
			undoButton.addEventListener("click", function () {
				location.reload();
			});
		});
	};

	//go back to main menu when sign out icon is clicked
	function goBack() {
		document.querySelectorAll(".fa-sign-out-alt").forEach(backButton => {
			backButton.addEventListener("click", function () {
				window.open("index.html", "_self");
			});
		});
	};

    function startTimer() {
		if (seconds == 60000)
			time = setInterval(startTimer, 1000)
		seconds -= 1000;
		document.getElementById("timer").innerHTML = '00:' + seconds / 1000;
		if ((seconds / 1000) % 60 < 10)
			document.getElementById("timer").innerHTML = '00:0' + seconds / 1000;
		if (seconds <= 0) {
			clearInterval(time);
			gameOver();
		}
	}

	///function when all cards are matched or time is up
	function gameOver() {
		stopWatch();

		document.querySelectorAll(".container").forEach(cardContainer => {
			cardContainer.classList.add("animated", "infinite", "bounceOut");
		});
		if (seconds > 0 && pairs === (array.length) / 2) {
     		winEndGameAudio.play();
			messageWinning();
		} else {
			loseEndGameAudio.play();
			messageLosing();
		}
	}

	// $('.card').click(function (event) {
    function cardClicked(event) {

        //starting the stopwatch on the first card click
    
        if (attempts === 0) {
            startTimer();
        };
    
    
        //flip the card if it isn't already open or the comparison array full
    
        if ($(this).hasClass("flipped") || $(this).hasClass("solved") || comparisonArray.length >= 2) {
            return;
    
        } else {
    
            flipCard($(event.target).parent());
        };
    
    
        //open the card and store the card information in an array
    
        comparisonArray.push($(this).data("card-type"));
    
        //if this is the first card clicked simply count the click and number of attempts
    
        if (clickCount === 0) {
    
            clickCount++;
            recordAttempts();
    
        } else {
    
            //if this is the second card clicked compare whether it is the same as the other stored card. If yes, add to the number of pairs and change the css attribute to permanently leave the card open.
    
            if (comparisonArray[0].charAt(0) === comparisonArray[1].charAt(0)) {
    
                $("[data-card-type=" + comparisonArray[0] + "]").removeClass('flipped').addClass('solved');
    
                $("[data-card-type=" + comparisonArray[1] + "]").removeClass('flipped').addClass('solved');
    
                $("[data-card-type=" + comparisonArray[0] + "]").parent().addClass('animated pulse');
    
                matchAudio.play();
    
                pairs++;

								if(pairs === (array.length) / 2) {
									gameOver();
								}
            };
    
            //close all unsuccessfully opened cards and clear the comparison array with a short delay
    
            setTimeout(function () {
                flipCard($('.flipped'));
                comparisonArray = [];
    
            }, 500);
    
            //reset the click count
    
            clickCount = 0;
    
        }
    }  
	
    //setting the game mode 

	gameModes.forEach(gameMode => {

		let gameModeButton = document.createElement('button');
		gameModeButton.textContent = gameMode; // creating buttons

		let comparisonArray = '';

		if (gameMode == "EASY") {
			comparisonArray = 'easyArray';
		} else if (gameMode == "NORMAL") {
			comparisonArray = 'normalArray';
		} else if (gameMode == "HARD") {
			comparisonArray = 'hardArray';
		}

		gameModeButton.setAttribute('data-comparison-array', comparisonArray);
		gameModeButton.addEventListener('click', createBoard);
        gameModeButton.addEventListener('click', resetAttempts);
        gameModeButton.addEventListener('click', resetTimer);

		gameModeContainer.appendChild(gameModeButton);
	});



    function createBoard(event) {
		let comparisonArray = event.target.getAttribute('data-comparison-array');
		let shuffledArray = shuffle(eval(comparisonArray));
		array = shuffledArray;

		memoryBoard.html('');

		for (i = 1; i <= shuffledArray.length; i++) {

            let container = document.createElement('div');
            container.className = 'container';
            let card = document.createElement('div');
            card.className = 'card';
            card.setAttribute('data-card-type', shuffledArray[i-1]);
            card.innerHTML = "<figure class='front'></figure><figure class='back'></figure>";
            card.addEventListener('click', cardClicked);
            container.appendChild(card);
            memoryBoard.append(container);
		}
	}

	//FUNCTIONS

	//function to flip cards
	function flipCard(element) {
		$(element).toggleClass('flipped');
		flipAudio.play();
	}

	// function to record the number of attempts of a player and to reduce the number of stars based on performance

	function recordAttempts() {
		attempts++;
		$('#attempts').html(attempts);

		if (attempts > 16 && attempts < 28) {
			stars = '<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="far fa-star"></i>';
			$('#stars').html(stars);
		} else if (attempts >= 28 && attempts < 36) {
			stars = '<i class="fas fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i>';
			$('#stars').html(stars);
		} else if (attempts >= 36) {
			stars = '<i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i>';
			$('#stars').html(stars);
		} else {
			return;
		};

	}

	// function to shuffle the card using Fisher–Yates
	function shuffle(array) {
		var currentIndex = array.length,
			temporaryValue, randomIndex;

		while (currentIndex !== 0) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	}

	//function for the stopwatch

	function stopWatch() {
		clearInterval(time);
	}

    //function to reset clickcounts or attempts

    function resetAttempts(){
        attempts = 0;
        document.getElementById("attempts").innerHTML = "0";
    }

	// function reset timer

	function resetTimer() {
        clearInterval(time);
             document.getElementById("timer").innerHTML = "01:00";
             time = seconds = 60 * 1000;
	}

   
	function messageWinning() {

		$(`<section class="game-over"><div class="message-box">
        <h2>Isa kang tunay na Mosa! 🎉</h2><p>Number of attempts: ${attempts}</p>
        <p>Total Time: ${60-(seconds/1000)} seconds<p>Rating: ${stars} 
        </p><p><i class="fas fa-undo"></i><i class="fas fa-sign-out-alt">
        </i><object data="leaderboard.svg"></object>
        </p></div></section>`).insertAfter($('.gamebg'));
		restart(); goBack();
		$('.message-box').fadeIn(1000); 
	}

    //function for you lose message
    function messageLosing() {

        $(`<section class="game-over"><div class="message-box"><h2>Try harder Marites 😔</h2>
        <h3>Kulang ang almusal mong tsismis</h3>
        <p>Number of attempts: ${attempts}</p>
        <p>Total Time: ${60-(seconds/1000)} seconds <p>Rating: ${stars} </p><p><i class="fas fa-undo"></i><i class="fas fa-sign-out-alt"></i><object data="leaderboard.svg"></object>
        </p></div></section>`).insertAfter($('.gamebg'));
        restart(); goBack();
        $('.message-box').fadeIn(1000);
    }

});

