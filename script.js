'use strict';

// Selecting elements
const player0El = document.querySelector('.player--0');
const player1El = document.querySelector('.player--1');
const score0El = document.querySelector('#score--0');
const score1El = document.querySelector('#score--1');
const current0El = document.querySelector('#current--0');
const current1El = document.querySelector('#current--1');
const name0El = document.querySelector('#name--0');
const name1El = document.querySelector('#name--1');
const diceEl = document.querySelector('.dice');
const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');
const namesForm = document.querySelector('#names-form');
const winningScoreForm = document.querySelector('#winning-score-form');
const winningScoreInput = document.querySelector('#winning-score');
const overlay = document.querySelector('#start-overlay');

let scores, currentScore, activePlayer, playing, winningScore;

// Starting conditions
const init = function () {
    scores = [0, 0];
    currentScore = 0;
    activePlayer = 0;
    playing = true;

    // Set the default winning score
    winningScore = parseInt(winningScoreInput.value, 10) || 100;

    score0El.textContent = 0;
    score1El.textContent = 0;
    current0El.textContent = 0;
    current1El.textContent = 0;

    diceEl.classList.add('hidden');
    player0El.classList.remove('player--winner');
    player1El.classList.remove('player--winner');
    player0El.classList.add('player--active');
    player1El.classList.remove('player--active');
};

// Initialize the game and show the overlay
init();

// Function to switch player
const switchPlayer = function () {
    document.getElementById(`current--${activePlayer}`).textContent = 0;
    currentScore = 0;
    activePlayer = activePlayer === 0 ? 1 : 0;
    player0El.classList.toggle('player--active');
    player1El.classList.toggle('player--active');
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
            document.getElementById(`current--${activePlayer}`).textContent = currentScore;
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
        document.getElementById(`score--${activePlayer}`).textContent = scores[activePlayer];

        // 2. Check if player's score is >= winning score
        if (scores[activePlayer] >= winningScore) {
            // Finish the game
            playing = false;
            diceEl.classList.add('hidden');
            document.querySelector(`.player--${activePlayer}`).classList.add('player--winner');
            document.querySelector(`.player--${activePlayer}`).classList.remove('player--active');
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
    const player1Name = document.querySelector('#player1-name').value;
    const player2Name = document.querySelector('#player2-name').value;

    // Set player names or default to "Player 1" and "Player 2"
    name0El.textContent = player1Name || 'Player 1';
    name1El.textContent = player2Name || 'Player 2';

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
