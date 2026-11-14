
'use strict';

// Emoji symbols available on each reel.
const symbols = [
  '🍒', '🍋', '🍀', '⭐',
  '🍇', '🔔', '💎', '🍉'
];

// Store the reel elements.
const reels = [
  document.getElementById('reel-1'),
  document.getElementById('reel-2'),
  document.getElementById('reel-3')
];

const spinButton = document.getElementById('spin-button');
const buttonText = document.getElementById('button-text');
const resultIcon = document.getElementById('result-icon');
const resultTitle = document.getElementById('result-title');
const resultText = document.getElementById('result-text');
const helperText = document.getElementById('helper-text');
const gameCard = document.querySelector('.game-card');

// Each reel has its own interval and final symbol.
const reelStates = reels.map(() => ({
  intervalId: null,
  finalSymbol: null
}));

let isSpinning = false;

// Generate a random emoji.
function getRandomSymbol() {
  const randomIndex = Math.floor(
    Math.random() * symbols.length
  );

  return symbols[randomIndex];
}

// Update the result message.
function showResult(icon, title, message) {
  resultIcon.textContent = icon;
  resultTitle.textContent = title;
  resultText.textContent = message;
}

// Start an individual reel.
function startReel(index) {
  const reel = reels[index];

  reel.classList.add('spinning');

  reelStates[index].intervalId = setInterval(() => {
    reel.textContent = getRandomSymbol();
  }, 90);
}

// Stop an individual reel.
function stopReel(index) {
  const state = reelStates[index];

  if (state.intervalId !== null) {
    clearInterval(state.intervalId);
    state.intervalId = null;
  }

  const finalSymbol = getRandomSymbol();

  state.finalSymbol = finalSymbol;

  reels[index].textContent = finalSymbol;
  reels[index].classList.remove('spinning');
}

// Check if all three emojis match.
function checkJackpot() {
  const [first, second, third] =
    reelStates.map(state => state.finalSymbol);

  const isJackpot =
    first === second && second === third;

  if (isJackpot) {
    gameCard.classList.add('jackpot');

    showResult(
      '🏆',
      'JACKPOT! Three of a kind!',
      `All three reels landed on ${first}. You found the matching trio!`
    );

    helperText.textContent =
      'Incredible match! Spin again for another round.';

  } else {
    gameCard.classList.remove('jackpot');

    showResult(
      '🎯',
      'Round complete!',
      `${first} · ${second} · ${third} — no matching trio this time.`
    );

    helperText.textContent =
      'So close! Give it another spin.';
  }
}

// Enable the button after the round finishes.
function finishSpin() {
  isSpinning = false;
  spinButton.disabled = false;
  buttonText.textContent = 'SPIN AGAIN';
}

// Main spin function.
function spin() {

  // Prevent multiple simultaneous spins.
  if (isSpinning) return;

  isSpinning = true;

  spinButton.disabled = true;
  buttonText.textContent = 'SPINNING...';

  gameCard.classList.remove('jackpot');

  showResult(
    '✨',
    'Reels in motion...',
    'Good luck! The reels are stopping one by one.'
  );

  helperText.textContent =
    'Please wait until all three reels stop.';

  // Start all three reels.
  reels.forEach((_, index) => {
    startReel(index);
  });

  // Each reel stops at a different time.
  const stopDelays = [1100, 1750, 2400];

  stopDelays.forEach((delay, index) => {

    setTimeout(() => {

      stopReel(index);

      // Check results after the final reel stops.
      if (index === reels.length - 1) {
        checkJackpot();
        finishSpin();
      }

    }, delay);

  });
}

// Attach the click event.
spinButton.addEventListener('click', spin);

// Initial screen message.
showResult(
  '✨',
  'Ready when you are!',
  'Press SPIN to start your first round.'
);
