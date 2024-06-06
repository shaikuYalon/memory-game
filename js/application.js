document.addEventListener("DOMContentLoaded", () => { 
    const emojisEasy = ['🥝', '🥝', '🍉', '🍉', '🍇', '🍇', '🍌', '🍌', '🍒', '🍒', '🍓', '🍓', '🍐', '🍐', '🍎', '🍎', '🥥', '🥥'];
    const emojisMedium = [...emojisEasy, '🍍', '🍍', '🍋', '🍋', '🍏', '🍏', '🍈', '🍈', '🍑', '🍑', '🥭', '🥭'];
    const emojisHard = [...emojisMedium, '🍅', '🍅', '🍆', '🍆', '🍊', '🍊', '🌽', '🌽', '🍠', '🍠', '🍯', '🍯', '🍞', '🍞', '🍳', '🍳', '🥓', '🥓'];

    let currentPoints = 0; 
    let currentGamePoints = 0; 

    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const currentPlayerElement = document.getElementById("currentPlayer");
        currentPlayerElement.textContent = ` ${currentUser}`;
    }

    let gameBoard = document.getElementById("gameBoard");
    let resetBtn = document.getElementById("resetBtn");
    let timerElement = document.getElementById("timer");
    let difficultySelect = document.getElementById("difficulty");
    let flippedCards = [];
    let matchedCards = 0;
    let countdown;
    let currentEmojis = [];
    let gameDuration;
    let gameActive = true; // משתנה חדש לבדיקת מצב המשחק

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function updateCurrentGameScore(points) {
        document.getElementById("currentPoints").textContent = points;
    }

    document.getElementById('scoreBtn').addEventListener('click', function() {
        const scoreContent = document.getElementById('scoreContent');
        if (scoreContent.style.display === 'none') {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const topUsers = users.sort((a, b) => b.points - a.points).slice(0, 3);
            document.getElementById('firstPlace').textContent = `מקום ראשון: ${topUsers[0]?.username || 'אין נתונים'} (${topUsers[0]?.points || 0} נקודות)`;
            document.getElementById('secondPlace').textContent = `מקום שני: ${topUsers[1]?.username || 'אין נתונים'} (${topUsers[1]?.points || 0} נקודות)`;
            document.getElementById('thirdPlace').textContent = `מקום שלישי: ${topUsers[2]?.username || 'אין נתונים'} (${topUsers[2]?.points || 0} נקודות)`;
            scoreContent.style.display = 'block';
        } else {
            scoreContent.style.display = 'none';
        }
    });

    function createBoard() {
        gameBoard.innerHTML = "";
        let selectedDifficulty = difficultySelect.value;
        switch (selectedDifficulty) {
            case "easy":
                currentEmojis = [...emojisEasy];
                gameBoard.className = "game-board easy";
                gameDuration = 2 * 60;
                break;
            case "medium":
                currentEmojis = [...emojisMedium];
                gameBoard.className = "game-board medium";
                gameDuration = 3.5 * 60;
                break;
            case "hard":
                currentEmojis = [...emojisHard];
                gameBoard.className = "game-board hard";
                gameDuration = 5 * 60;
                break;
        }
        shuffleArray(currentEmojis);
        for (let emoji of currentEmojis) {
            let card = document.createElement("div");
            card.classList.add("card");
            card.dataset.emoji = emoji;
            card.addEventListener("click", flipCard);
            gameBoard.appendChild(card);
        }
        startTimer(gameDuration);
    }

    function flipCard() {
        if (!gameActive || flippedCards.length >= 2 || this.classList.contains("flipped")) {
            return;
        }
        this.classList.add("flipped");
        this.textContent = this.dataset.emoji;
        this.style.backgroundImage = "none";
        flippedCards.push(this);
        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 1000);
        }
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];

    function addPoints20(username) {
        const user = users.find(user => user.username === username);
        if (user) {
            user.points += 20;
            currentGamePoints += 20; 
            updateCurrentGameScore(currentGamePoints); 
            console.log(`User ${username} now has ${user.points} points`);
            localStorage.setItem('users', JSON.stringify(users));
        }
    }

    function addPoints30(username) {
        const user = users.find(user => user.username === username);
        if (user) {
            user.points += 30;
            currentGamePoints += 30; 
            updateCurrentGameScore(currentGamePoints); 
            console.log(`User ${username} now has ${user.points} points`);
            localStorage.setItem('users', JSON.stringify(users));
        }
    }

    function addPoints45(username) {
        const user = users.find(user => user.username === username);
        if (user) {
            user.points += 45;
            currentGamePoints += 45; 
            updateCurrentGameScore(currentGamePoints); 
            console.log(`User ${username} now has ${user.points} points`);
            localStorage.setItem('users', JSON.stringify(users));
        }
    }

    function checkMatch() {
        let [card1, card2] = flippedCards;
        if (card1.dataset.emoji === card2.dataset.emoji) {
            card1.classList.add("matched");
            card2.classList.add("matched");
            matchedCards += 2;
            if (matchedCards === currentEmojis.length) {
                clearInterval(countdown);
                let difficulty = difficultySelect.value;
                let currentUser = localStorage.getItem('currentUser');
                if (difficulty === "easy") {
                    addPoints20(currentUser);
                } else if (difficulty === "medium") {
                    addPoints30(currentUser);
                } else if (difficulty === "hard") {
                    addPoints45(currentUser);
                }
                let message = document.createElement("p");
                message.textContent = "ניצחתם!";
                message.style.color = "#47e2cb";
                message.style.fontSize = "60px";
                document.getElementById("gameStatus").appendChild(message);
                gameActive = false; // עדכון מצב המשחק כלא פעיל
            }
        } else {
            card1.classList.remove("flipped");
            card1.textContent = "";
            card1.style.backgroundImage = "url('../Default_einstein_2.jpg')";
            card2.classList.remove("flipped");
            card2.textContent = "";
            card2.style.backgroundImage = "url('../Default_einstein_2.jpg')";
        }
        flippedCards = [];
    }

    function startTimer(duration) {
        let timer = duration, minutes, seconds;
        countdown = setInterval(() => {
            minutes = Math.floor(timer / 60);
            seconds = timer % 60;
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            timerElement.textContent = minutes + ":" + seconds;
            if (--timer < 0) {
                clearInterval(countdown);
                let message = document.createElement("p");
                message.textContent = "תם הזמן!";
                message.style.color = "red";
                document.getElementById("gameStatus").appendChild(message);
                gameActive = false; // עדכון מצב המשחק כלא פעיל
            }
        }, 1000);
    }

    function resetGame() {
        matchedCards = 0;
        flippedCards = [];
        updateCurrentGameScore(currentGamePoints); 
        gameBoard.innerHTML = ""; 
        createBoard();
        let gameStatus = document.getElementById("gameStatus");
        gameStatus.innerHTML = ""; 
        gameActive = true; // עדכון מצב המשחק כפעיל מחדש
    }

    resetBtn.addEventListener("click", () => {
        clearInterval(countdown);
        resetGame();
    });

    difficultySelect.addEventListener("change", () => {
        clearInterval(countdown);
        resetGame();
    });

    createBoard();
    
    // פונקציית הניתוק
    function logout() {
        localStorage.removeItem('currentUser');
        window.location.href = "login.html"; // הנחיית המשתמש חזרה לעמוד ההתחברות
    }

    document.getElementById('logoutBtn').addEventListener('click', logout);

    const instructionsBtn = document.getElementById('instructionsBtn');
    const instructionsModal = document.getElementById('instructionsModal');
    const closeBtn = document.getElementsByClassName('close')[0];

    instructionsBtn.addEventListener('click', () => {
        instructionsModal.style.display = 'block';
    });

    closeBtn.addEventListener('click', () => {
        instructionsModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == instructionsModal) {
            instructionsModal.style.display = 'none';
        }
    });
});
