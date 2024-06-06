// מאזין לאירוע 'DOMContentLoaded' של המסמך ומפעיל פונקציה כאשר המסמך נטען
document.addEventListener("DOMContentLoaded", () => { 
    // הגדרת רשימת סמלים למשחק קל, כל סמל מופיע פעמיים
    const emojisEasy = ['🥝', '🥝', '🍉', '🍉', '🍇', '🍇', '🍌', '🍌', '🍒', '🍒', '🍓', '🍓', '🍐', '🍐', '🍎', '🍎', '🥥', '🥥'];
    // הגדרת רשימת סמלים למשחק בינוני, כולל הסמלים של המשחק הקל ועוד סמלים נוספים
    const emojisMedium = [...emojisEasy, '🍍', '🍍', '🍋', '🍋', '🍏', '🍏', '🍈', '🍈', '🍑', '🍑', '🥭', '🥭'];
    // הגדרת רשימת סמלים למשחק קשה, כולל הסמלים של המשחק הבינוני ועוד סמלים נוספים
    const emojisHard = [...emojisMedium, '🍅', '🍅', '🍆', '🍆', '🍊', '🍊', '🌽', '🌽', '🍠', '🍠', '🍯', '🍯', '🍞', '🍞', '🍳', '🍳', '🥓', '🥓'];

    // משתנה חדש שצובר את הניקוד הנוכחי של כל המשחקים
    let currentPoints = 0; 
    // משתנה לניקוד של המשחק הנוכחי בלבד
    let currentGamePoints = 0; 

    // קבלת המשתמש הנוכחי מה-localStorage
    const currentUser = localStorage.getItem('currentUser');
    // אם יש משתמש נוכחי, עדכון הטקסט של האלמנט המתאים עם שם המשתמש
    if (currentUser) {
        const currentPlayerElement = document.getElementById("currentPlayer");
        currentPlayerElement.textContent = ` ${currentUser}`;
    }

    // שמירת אלמנט לוח המשחק מה-DOM במשתנה
    let gameBoard = document.getElementById("gameBoard");
    // שמירת אלמנט כפתור איפוס המשחק מה-DOM במשתנה
    let resetBtn = document.getElementById("resetBtn");
    // שמירת אלמנט שעון המשחק מה-DOM במשתנה
    let timerElement = document.getElementById("timer");
    // שמירת אלמנט בחירת רמת הקושי מה-DOM במשתנה
    let difficultySelect = document.getElementById("difficulty");
    // משתנה לשמירת קלפים שהופכים
    let flippedCards = [];
    // משתנה לשמירת מספר הקלפים שהתאימו
    let matchedCards = 0;
    // משתנה לשמירת טיימר המשחק
    let countdown;
    // משתנה לשמירת הסמלים של המשחק הנוכחי
    let currentEmojis = [];
    // משתנה לשמירת זמן המשחק
    let gameDuration;

    // פונקציה לערבוב רשימת סמלים
    function shuffleArray(array) {
        // לולאה שמתחילה מהאיבר האחרון ברשימה ועד הראשון
        for (let i = array.length - 1; i > 0; i--) {
            // בחירת אינדקס רנדומלי מתוך הטווח הנוכחי של הלולאה
            const j = Math.floor(Math.random() * (i + 1));
            // החלפת האיבר הנוכחי עם האיבר הרנדומלי שנבחר
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // פונקציה שמעדכנת את הניקוד הנוכחי של המשחק בטקסט המתאים בדף
    function updateCurrentGameScore(points) {
        document.getElementById("currentPoints").textContent = points;
    }

    // מאזין ללחיצה על כפתור התצוגה של טבלת התוצאות
    document.getElementById('scoreBtn').addEventListener('click', function() {
        const scoreContent = document.getElementById('scoreContent');
        // בדיקה אם טבלת התוצאות מוסתרת או מוצגת, ושינוי מצב התצוגה בהתאם
        if (scoreContent.style.display === 'none') {
            // קבלת רשימת המשתמשים מ-localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];
            // מיון המשתמשים לפי ניקוד בסדר יורד והצגת שלושת המקומות הראשונים
            const topUsers = users.sort((a, b) => b.points - a.points).slice(0, 3);
            // עדכון טקסט האלמנט של מקום ראשון עם שם המשתמש והניקוד או הודעה אם אין נתונים
            document.getElementById('firstPlace').textContent = `מקום ראשון: ${topUsers[0]?.username || 'אין נתונים'} (${topUsers[0]?.points || 0} נקודות)`;
            // עדכון טקסט האלמנט של מקום שני עם שם המשתמש והניקוד או הודעה אם אין נתונים
            document.getElementById('secondPlace').textContent = `מקום שני: ${topUsers[1]?.username || 'אין נתונים'} (${topUsers[1]?.points || 0} נקודות)`;
            // עדכון טקסט האלמנט של מקום שלישי עם שם המשתמש והניקוד או הודעה אם אין נתונים
            document.getElementById('thirdPlace').textContent = `מקום שלישי: ${topUsers[2]?.username || 'אין נתונים'} (${topUsers[2]?.points || 0} נקודות)`;
            // הצגת טבלת התוצאות
            scoreContent.style.display = 'block';
        } else {
            // הסתרת טבלת התוצאות אם היא כבר מוצגת
            scoreContent.style.display = 'none';
        }
    });

    // פונקציה ליצירת לוח המשחק
    function createBoard() {
        // ריקון לוח המשחק מכל תוכן קודם
        gameBoard.innerHTML = "";
        // קבלת רמת הקושי הנבחרת מהאלמנט המתאים
        let selectedDifficulty = difficultySelect.value;
        // בחירת רשימת הסמלים וזמן המשחק בהתאם לרמת הקושי הנבחרת
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
        // ערבוב רשימת הסמלים
        shuffleArray(currentEmojis);
        // יצירת קלפים עם הסמלים והוספתם ללוח המשחק
        for (let emoji of currentEmojis) {
            let card = document.createElement("div");
            card.classList.add("card");
            card.dataset.emoji = emoji;
            card.addEventListener("click", flipCard);
            gameBoard.appendChild(card);
        }
        // התחלת הטיימר למשחק
        startTimer(gameDuration);
    }
    

    // פונקציה להפיכת קלף
    function flipCard() {
        // בדיקה אם ניתן להפוך את הקלף (פחות משני קלפים הפוכים ולא הפוך כבר)
        if (flippedCards.length < 2 && !this.classList.contains("flipped")) {
            // הפיכת הקלף ועדכון התוכן שלו עם הסמל
            this.classList.add("flipped");
            this.textContent = this.dataset.emoji;
            this.style.backgroundImage = "none";
            flippedCards.push(this);
            // אם יש שני קלפים הפוכים, לבדוק אם יש התאמה
            if (flippedCards.length === 2) {
                setTimeout(checkMatch, 1000);
            }
        }
    }

    // קבלת רשימת המשתמשים מה-localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // פונקציה להוספת ניקוד למשתמש ב-20 נקודות
    function addPoints20(username) {
        // מציאת המשתמש לפי שם המשתמש
        const user = users.find(user => user.username === username);
        if (user) {
            // הוספת 20 נקודות למשתמש
            user.points += 20;
            // עדכון הניקוד למשחק הנוכחי
            currentGamePoints += 20; 
            // עדכון הניקוד בדף
            updateCurrentGameScore(currentGamePoints); 
            // הצגת הודעה עם הניקוד החדש של המשתמש
            console.log(`User ${username} now has ${user.points} points`);
            // שמירת הרשימה המעודכנת ב-localStorage
            localStorage.setItem('users', JSON.stringify(users));
        }
    }

   // הוספת ניקוד למשתמש ב-30 נקודות
function addPoints30(username) {
    // מציאת המשתמש לפי שם המשתמש ברשימת המשתמשים
    const user = users.find(user => user.username === username);
    // אם המשתמש נמצא
    if (user) {
        // הוספת 30 נקודות למשתמש
        user.points += 30;
        // עדכון הניקוד למשחק הנוכחי ב-30 נקודות
        currentGamePoints += 30; 
        // עדכון הניקוד בדף
        updateCurrentGameScore(currentGamePoints); 
        // הצגת הודעה עם הניקוד החדש של המשתמש
        console.log(`User ${username} now has ${user.points} points`);
        // שמירת הרשימה המעודכנת ב-localStorage
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// הוספת ניקוד למשתמש ב-45 נקודות
function addPoints45(username) {
    // מציאת המשתמש לפי שם המשתמש ברשימת המשתמשים
    const user = users.find(user => user.username === username);
    // אם המשתמש נמצא
    if (user) {
        // הוספת 45 נקודות למשתמש
        user.points += 45;
        // עדכון הניקוד למשחק הנוכחי ב-45 נקודות
        currentGamePoints += 45; 
        // עדכון הניקוד בדף
        updateCurrentGameScore(currentGamePoints); 
        // הצגת הודעה עם הניקוד החדש של המשתמש
        console.log(`User ${username} now has ${user.points} points`);
        // שמירת הרשימה המעודכנת ב-localStorage
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// פונקציה לבדיקת התאמה בין שני קלפים שהופכו
function checkMatch() {
    // שמירת שני הקלפים שהופכו במשתנים
    let [card1, card2] = flippedCards;
    // אם הסמלים של שני הקלפים זהים
    if (card1.dataset.emoji === card2.dataset.emoji) {
        // הוספת מחלקת "matched" לקלפים כדי לסמן שהם תואמים
        card1.classList.add("matched");
        card2.classList.add("matched");
        // הגדלת מונה הקלפים שהותאמו ב-2
        matchedCards += 2;
        // אם כל הקלפים הותאמו
        if (matchedCards === currentEmojis.length) {
            // עצירת הטיימר
            clearInterval(countdown);
            // קבלת רמת הקושי הנבחרת
            let difficulty = difficultySelect.value;
            // קבלת המשתמש הנוכחי מה-localStorage
            let currentUser = localStorage.getItem('currentUser');
            // הוספת ניקוד בהתאם לרמת הקושי
            if (difficulty === "easy") {
                addPoints20(currentUser);
            } else if (difficulty === "medium") {
                addPoints30(currentUser);
            } else if (difficulty === "hard") {
                addPoints45(currentUser);
            }

                 // יצירת משתנה של הודעת ניצחון
    let message = document.createElement("p");
    message.textContent = "ניצחתם!";
    message.style.color = "#47e2cb";
    message.style.fontSize = "60px"
    document.getElementById("gameStatus").appendChild(message); // הוספת הודעת הניצחון ל-div עם id של gameStatus
    }
    } else { // במקרה שהקלפים אינם תואמים
        // הסרת המחלקה "flipped" מהקלף הראשון
        card1.classList.remove("flipped");
        // איפוס תוכן הטקסט של הקלף הראשון
        card1.textContent = "";
        // שינוי התמונה לרקע המקורי של הקלף הראשון
        card1.style.backgroundImage = "url('../Default_einstein_2.jpg')";
        // הסרת המחלקה "flipped" מהקלף השני
        card2.classList.remove("flipped");
        // איפוס תוכן הטקסט של הקלף השני
        card2.textContent = "";
        // שינוי התמונה לרקע המקורי של הקלף השני
        card2.style.backgroundImage = "url('../Default_einstein_2.jpg')";
    }
    // ריקון רשימת הקלפים שהופכו
    flippedCards = [];
}

// פונקציה שמתחילה את הטיימר
function startTimer(duration) {
    // הגדרת הטיימר לזמן הנבחר (בדקות ושניות)
    let timer = duration, minutes, seconds;
    // הגדרת משתנה שמעדכן את הטיימר כל שניה
    countdown = setInterval(() => {
        // חישוב הדקות הנותרות
        minutes = Math.floor(timer / 60);
        // חישוב השניות הנותרות
        seconds = timer % 60;

        // הוספת אפסים מובילים אם צריך
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        // עדכון האלמנט של הטיימר עם הזמן הנותר
        timerElement.textContent = minutes + ":" + seconds;

        // אם הזמן נגמר
        if (--timer < 0) {
            // עצירת הטיימר
            clearInterval(countdown);
            // יצירת הודעת סיום הזמן
            let message = document.createElement("p");
            message.textContent = "תם הזמן!";
            message.style.color = "red";
            // הוספת הודעת סיום הזמן ל-div עם id של gameStatus
            document.getElementById("gameStatus").appendChild(message);
        }
    }, 1000); // רץ כל שניה
}

// פונקציה לאיפוס המשחק
function resetGame() {
    // איפוס מספר הקלפים שתואמו והקלפים שהופכו
    matchedCards = 0;
    flippedCards = [];
    
    // עדכון הניקוד הנוכחי בעמוד
    updateCurrentGameScore(currentGamePoints); 
    // ניקוי לוח המשחק
    gameBoard.innerHTML = ""; 
    // יצירת לוח המשחק מחדש
    createBoard();
    // ניקוי הודעות הסטטוס של המשחק
    let gameStatus = document.getElementById("gameStatus");
    gameStatus.innerHTML = ""; 
}

// הוספת מאזין אירועים ללחצן האיפוס
resetBtn.addEventListener("click", () => {
    // עצירת הטיימר
    clearInterval(countdown);
    // איפוס המשחק
    resetGame();
});

// הוספת מאזין אירועים לשינוי ברמת הקושי
difficultySelect.addEventListener("change", () => {
    // עצירת הטיימר
    clearInterval(countdown);
    // איפוס המשחק
    resetGame();
});

// יצירת לוח המשחק בתחילת העמוד
createBoard();
});

// הגדרת משתנים לאלמנטים של ההוראות והמודאל של ההוראות
const instructionsBtn = document.getElementById("instructionsBtn");
const instructionsModal = document.getElementById("instructionsModal");
const closeBtn = document.querySelector(".close");

// הוספת מאזין אירועים ללחצן ההוראות להצגת המודאל
instructionsBtn.addEventListener("click", () => {
    instructionsModal.style.display = "block";
});

// הוספת מאזין אירועים ללחצן הסגירה לסגירת המודאל
closeBtn.addEventListener("click", () => {
    instructionsModal.style.display = "none";
});

// הוספת מאזין אירועים לחלון לסגירת המודאל כאשר לוחצים מחוץ לו
window.addEventListener("click", (event) => {
    if (event.target === instructionsModal) {
        instructionsModal.style.display = "none";
    }
});

// פונקציה לניתוק המשתמש
function logout() {
    // ניקוי המידע של המשתמש הנוכחי מ-localStorage
    localStorage.removeItem('currentUser');
    // ניתוב לעמוד ההתחברות
    window.location.href = "landing.html";
}

// קישור הפונקציה לכפתור הניתוק
document.getElementById('logoutBtn').addEventListener('click', logout);

