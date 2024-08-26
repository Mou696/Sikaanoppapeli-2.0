'use strict';

// Selecting elements
const playerEls = [document.querySelector('.player--0'), document.querySelector('.player--1')];
const diceEls = [document.querySelector('.dice--1'), document.querySelector('.dice--2')];
const scoreEls = [document.getElementById('score--0'), document.getElementById('score--1')];
const currentScoreEls = [document.getElementById('current--0'), document.getElementById('current--1')];
const nameEls = [document.getElementById('name--0'), document.getElementById('name--1')];
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');
const btnNew = document.querySelector('.btn--new');
const overlay = document.getElementById('start-overlay');
const namesForm = document.getElementById('names-form');
const winningScoreForm = document.getElementById('winning-score-form');
const playerCountInput = document.getElementById('player-count');
const playerNameInputs = [document.getElementById('player1-name'), document.getElementById('player2-name')];
const winningScoreInput = document.getElementById('winning-score');

// Game variables
let scores, currentScore, activePlayer, playing, diceRolls, winningScore;
let playerCount = 2;

// Initialize game
const init = () => {
    scores = [0, 0];
    currentScore = 0;
    activePlayer = 0;
    playing = true;
    diceRolls = [];
    winningScore = 100;

    scoreEls.forEach(scoreEl => scoreEl.textContent = '0');
    currentScoreEls.forEach(currentScoreEl => currentScoreEl.textContent = '0');
    diceEls.forEach(diceEl => diceEl.classList.add('hidden'));

    playerEls.forEach((playerEl, i) => {
        playerEl.classList.remove('player--winner', 'player--active');
        if (i === 0) playerEl.classList.add('player--active');
    });

    nameEls.forEach((nameEl, i) => nameEl.textContent = `Player ${i + 1}`);

    overlay.classList.remove('hidden');
};

// Switch player
const switchPlayer = () => {
    currentScoreEls[activePlayer].textContent = '0';
    currentScore = 0;
    activePlayer = activePlayer === 0 ? 1 : 0;
    playerEls.forEach(playerEl => playerEl.classList.toggle('player--active'));
};

// Roll dice function
btnRoll.addEventListener('click', () => {
    if (playing) {
        // Generate two random dice rolls
        const dice1 = Math.trunc(Math.random() * 6) + 1;
        const dice2 = Math.trunc(Math.random() * 6) + 1;

        diceRolls.push([dice1, dice2]);

        diceEls[0].src = `dice-${dice1}.png`;
        diceEls[1].src = `dice-${dice2}.png`;

        diceEls.forEach(diceEl => diceEl.classList.remove('hidden'));

        if (dice1 === 1 && dice2 === 1) {
            // Two 1s
            scores[activePlayer] += 25;
            scoreEls[activePlayer].textContent = scores[activePlayer];
            switchPlayer();
        } else if (dice1 === 1 || dice2 === 1) {
            // One 1
            switchPlayer();
        } else if (dice1 === dice2) {
            // Doubles
            currentScore += (dice1 + dice2) * 2;
            currentScoreEls[activePlayer].textContent = currentScore;
        } else {
            // Normal roll
            currentScore += dice1 + dice2;
            currentScoreEls[activePlayer].textContent = currentScore;
        }

        // Check for three consecutive doubles
        if (diceRolls.length > 2 && diceRolls[diceRolls.length - 1][0] === diceRolls[diceRolls.length - 2][0] && diceRolls[diceRolls.length - 1][1] === diceRolls[diceRolls.length - 2][1]) {
            if (diceRolls[diceRolls.length - 2][0] === diceRolls[diceRolls.length - 3][0] && diceRolls[diceRolls.length - 2][1] === diceRolls[diceRolls.length - 3][1]) {
                // Three doubles in a row
                switchPlayer();
            }
        }
    }
});

// Hold function
btnHold.addEventListener('click', () => {
    if (playing) {
        scores[activePlayer] += currentScore;
        scoreEls[activePlayer].textContent = scores[activePlayer];
        
        if (scores[activePlayer] >= winningScore) {
            playing = false;
            playerEls[activePlayer].classList.add('player--winner');
            diceEls.forEach(diceEl => diceEl.classList.add('hidden'));
        } else {
            switchPlayer();
        }
    }
});

// New game function
btnNew.addEventListener('click', init);

// Setup names and winning score
namesForm.addEventListener('submit', (e) => {
    e.preventDefault();
    playerCount = parseInt(playerCountInput.value);
    playerNameInputs.forEach((input, i) => {
        if (i < playerCount) {
            nameEls[i].textContent = input.value;
        } else {
            nameEls[i].textContent = `Player ${i + 1}`;
        }
    });
    overlay.classList.add('hidden');
    init();
});

winningScoreForm.addEventListener('submit', (e) => {
    e.preventDefault();
    winningScore = parseInt(winningScoreInput.value);
});
