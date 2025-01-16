document.addEventListener('DOMContentLoaded', () => {
    const menu = document.getElementById('menu');
    const gameBoard = document.getElementById('game-board');
    const statusBar = document.getElementById('status-bar');
    const movesCount = document.getElementById('moves-count');
    const timerDisplay = document.getElementById('timer');
    const restartButton = document.getElementById('restart');
    let timer, moves, time, flippedCards, matchedCards, cardValues, gridSize;

    const difficulties = {
        easy: { rows: 3, cols: 4 },
        medium: { rows: 4, cols: 4 },
        hard: { rows: 6, cols: 6 },
    };

    function startGame(difficulty) {
        menu.classList.add('hidden');
        gameBoard.classList.remove('hidden');
        statusBar.classList.remove('hidden');
        gridSize = difficulties[difficulty];
        initializeGame();
    }

    function initializeGame() {
        moves = 0;
        time = 0;
        flippedCards = [];
        matchedCards = 0;
        clearInterval(timer);
        timer = setInterval(updateTime, 1000);
        movesCount.textContent = moves;
        timerDisplay.textContent = formatTime(time);
        generateBoard();
    }

    function generateBoard() {
        const totalCards = gridSize.rows * gridSize.cols;
        cardValues = Array.from({ length: totalCards / 2 }, (_, i) => i + 1)
            .concat(Array.from({ length: totalCards / 2 }, (_, i) => i + 1))
            .sort(() => Math.random() - 0.5);

        gameBoard.style.gridTemplateRows = `repeat(${gridSize.rows}, 1fr)`;
        gameBoard.style.gridTemplateColumns = `repeat(${gridSize.cols}, 1fr)`;
        gameBoard.innerHTML = '';

        cardValues.forEach((value) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.value = value;

            const img = document.createElement('img');
            img.src = `images/img${value}.png`; // Assumes images are named img1.png, img2.png, etc.
            card.appendChild(img);

            card.addEventListener('click', () => flipCard(card));
            gameBoard.appendChild(card);
        });
    }

    function flipCard(card) {
        if (flippedCards.length === 2 || card.classList.contains('flipped') || card.classList.contains('matched')) return;
        card.classList.add('flipped');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            moves++;
            movesCount.textContent = moves;
            checkMatch();
        }
    }

    function checkMatch() {
        const [card1, card2] = flippedCards;
        if (card1.dataset.value === card2.dataset.value) {
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedCards += 2;
            if (matchedCards === cardValues.length) {
                clearInterval(timer);
                showConfetti();
            }
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
            }, 1000);
        }
        flippedCards = [];
    }

    function updateTime() {
        time++;
        timerDisplay.textContent = formatTime(time);
    }

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    let confettiInterval;

    function showConfetti() {
        confettiInterval = setInterval(() => {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.setProperty('--color', `hsl(${Math.random() * 360}, 100%, 50%)`);
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
            document.body.appendChild(confetti);

            // Remove confetti after it falls
            setTimeout(() => confetti.remove(), 3000);
        }, 100); // Generate confetti every 100ms
    }

    // Hint button functionality
    function revealCardsTemporarily() {
        const cards = document.querySelectorAll('.card'); // Get all cards
        cards.forEach(card => card.classList.add('flipped')); // Flip all cards

        // Hide cards again after 2 seconds
        setTimeout(() => {
            cards.forEach(card => {
                if (!card.classList.contains('matched')) {
                    card.classList.remove('flipped'); // Unflip unmatched cards
                }
            });
        }, 2000); // 2 seconds
    }

    // Add event listener to the Hint button
    const hintButton = document.getElementById('hint');
    hintButton.addEventListener('click', revealCardsTemporarily);

    function restartGame() {
        clearInterval(timer); // Stops the timer
        clearInterval(confettiInterval); // Stops the confetti effect
        menu.classList.remove('hidden');
        gameBoard.classList.add('hidden');
        statusBar.classList.add('hidden');
        gameBoard.innerHTML = ''; // Resets the game board
    }
    

    restartButton.addEventListener('click', restartGame);

    document.getElementById('easy').addEventListener('click', () => startGame('easy'));
    document.getElementById('medium').addEventListener('click', () => startGame('medium'));
    document.getElementById('hard').addEventListener('click', () => startGame('hard'));
});
