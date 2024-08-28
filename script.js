'use strict';

// Selecting elements
const playerEls = [
    document.querySelector('.player--0'),
    document.querySelector('.player--1'),
    document.querySelector('.player--2'),
    document.querySelector('.player--3')
];
const scoreEls = [
    document.querySelector('#score--0'),
    document.querySelector('#score--1'),
    document.querySelector('#score--2'),
    document.querySelector('#score--3')
];
const currentEls = [
    document.querySelector('#current--0'),
    document.querySelector('#current--1'),
    document.querySelector('#current--2'),
    document.querySelector('#current--3')
];
const nameEls = [
    document.querySelector('#name--0'),
    document.querySelector('#name--1'),
    document.querySelector('#name--2'),
    document.querySelector('#name--3')
];
const diceEl = document.querySelector('.dice');
const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');
const namesForm = document.querySelector('#names-form');
const winningScoreForm = document.querySelector('#winning-score-form');
const winningScoreInput = document.querySelector('#winning-score');
const overlay = document.querySelector('#start-overlay');
const playerSelectionOverlay = document.querySelector('#start-overlay'); // Updated to match the correct ID
const btnSelectPlayers = document.querySelectorAll('.btn--select-player');

let scores, currentScore, activePlayer, playing, winningScore, numPlayers;

// Starting conditions
const init = function () {
    scores = Array(numPlayers).fill(0);
    currentScore = 0;
    activePlayer = 0;
    playing = true;

    // Set the default winning score
    winningScore = parseInt(winningScoreInput.value, 10) || 100;

    scoreEls.forEach(scoreEl => scoreEl.textContent = 0);
    currentEls.forEach(currentEl => currentEl.textContent = 0);

    diceEl.classList.add('hidden');
    playerEls.forEach((playerEl, index) => {
        playerEl.classList.remove('player--winner');
        playerEl.classList.remove('player--active');
        playerEl.classList.toggle('hidden', index >= numPlayers);
    });
    playerEls[0].classList.add('player--active');
};

// Function to switch player
const switchPlayer = function () {
    currentEls[activePlayer].textContent = 0;
    currentScore = 0;
    activePlayer = (activePlayer + 1) % numPlayers;
    playerEls.forEach((playerEl, index) => {
        playerEl.classList.toggle('player--active', index === activePlayer);
    });
};

// Rolling dice functionality
btnRoll.addEventListener('click', function () {
    if (playing) {
        // 1. Generating a random dice roll
        const dice = Math.trunc(Math.random() * 6) + 1;

        // 2. Display dice
        diceEl.classList.remove('hidden');
        diceEl.src = `dice-${dice}.png`;

        // 3. Check for rolled 1
        if (dice !== 1) {
            // Add dice to current score
            currentScore += dice;
            currentEls[activePlayer].textContent = currentScore;
        } else {
            // Switch to next player
            switchPlayer();
        }
    }
});

// Holding score functionality
btnHold.addEventListener('click', function () {
    if (playing) {
        // 1. Add current score to active player's score
        scores[activePlayer] += currentScore;
        scoreEls[activePlayer].textContent = scores[activePlayer];

        // 2. Check if player's score is >= winning score
        if (scores[activePlayer] >= winningScore) {
            // Finish the game
            playing = false;
            diceEl.classList.add('hidden');
            playerEls[activePlayer].classList.add('player--winner');
            playerEls[activePlayer].classList.remove('player--active');
        } else {
            // Switch to the next player
            switchPlayer();
        }
    }
});

// New game functionality
btnNew.addEventListener('click', init);

// Set names and show the winning score form
namesForm.addEventListener('submit', function (e) {
    e.preventDefault();

    for (let i = 0; i < numPlayers; i++) {
        const playerName = document.querySelector(`#player${i + 1}-name`).value || `Player ${i + 1}`;
        nameEls[i].textContent = playerName;
    }

    // Show the winning score form and hide the names form
    namesForm.classList.add('hidden');
    winningScoreForm.classList.remove('hidden');
});

// Set winning score and hide overlay
winningScoreForm.addEventListener('submit', function (e) {
    e.preventDefault();
    winningScore = parseInt(winningScoreInput.value, 10);

    // Hide the winning score form and start the game
    winningScoreForm.classList.add('hidden');
    overlay.classList.add('hidden');
    startGame(); // Initialize game with names and winning score
});

// Function to start the game after setting names and winning score
const startGame = function () {
    // Ensure the game starts correctly after the setup
    init();
};

// Player selection buttons
btnSelectPlayers.forEach(button => {
    button.addEventListener('click', function () {
        numPlayers = parseInt(this.dataset.players, 10);
        playerSelectionOverlay.classList.add('hidden');
        selectPlayers(numPlayers);
    });
});

// Function to handle player selection
function selectPlayers(players) {
    numPlayers = players;
    
    // Adjust the player name input form
    const playerNamesDiv = document.getElementById('player-names');
    playerNamesDiv.innerHTML = '';
    for (let i = 1; i <= players; i++) {
        const label = document.createElement('label');
        label.setAttribute('for', `player${i}-name`);
        label.textContent = `Player ${i} Name:`;
        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('id', `player${i}-name`);
        input.required = true;
        playerNamesDiv.appendChild(label);
        playerNamesDiv.appendChild(input);
    }

    // Show the names form
    namesForm.classList.remove('hidden');
}


/*                WORKS               */