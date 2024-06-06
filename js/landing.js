// מנסה לקרוא מה-localStorage את המפתח 'users' וממיר אותו למערך. אם לא קיים, יוצר מערך ריק
const users = JSON.parse(localStorage.getItem('users')) || [];

// פונקציה לרישום משתמש חדש
function signUp() {
    // קבלת ערכי השדות מתוך הטופס
    const username = document.getElementById('signupUsername').value;
    const lastname = document.getElementById('signupLastName').value;
    const firstName = document.getElementById('signupFirstName').value;
    const password = document.getElementById('signupPassword').value;
    // אלמנט להצגת הודעות
    const message = document.getElementById('signupMessage');

    // בדיקה אם כל השדות מלאים
    if (!username || !lastname || !password || !firstName) {
        message.textContent = 'אנא מלא את כל השדות';
        message.style.color = 'red';
        return; // יציאה מהפונקציה אם השדות לא מלאים
    }

    // בדיקה אם הסיסמה באורך של לפחות 6 תווים
    if (password.length < 6) {
        message.textContent = 'הסיסמה חייבת להיות באורך של לפחות 6 תווים ולהכיל לפחות אות אחת ותו מיוחד אחד (!@#$%^&*)';
        message.style.color = 'red';
        return; // יציאה מהפונקציה אם הסיסמה קצרה מדי
    }

    // בדיקה אם הסיסמה מכילה לפחות אות אחת ותו מיוחד אחד
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);
    if (!hasLetter || !hasSpecialChar) {
        message.textContent = 'הסיסמה חייבת להכיל לפחות אות אחת ותו מיוחד אחד (!@#$%^&*)';
        message.style.color = 'red';
        return; // יציאה מהפונקציה אם הסיסמה לא מכילה את הדרישות
    }

    // בדיקה אם שם המשתמש כבר קיים
    if (users.find(user => user.username === username)) {
        message.textContent = 'שם משתמש כבר קיים';
        message.style.color = 'red';
        return; // יציאה מהפונקציה אם שם המשתמש כבר קיים
    }

    // נקודות התחלתי למשתמש חדש
    let points = 0;

    // הוספת המשתמש החדש למערך המשתמשים
    users.push({ username, lastname, password, firstName, points });
    // שמירת מערך המשתמשים ב-localStorage
    localStorage.setItem('users', JSON.stringify(users));
    // הודעה על רישום מוצלח
    message.textContent = 'הרישום בוצע בהצלחה';
    message.style.color = 'green';
    // מעבר לעמוד האפליקציה לאחר רישום מוצלח
    return window.location.href = "application.html";
}

// פונקציה לכניסת משתמש קיים
function login() {
    // קבלת ערכי השדות מתוך הטופס
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    // אלמנט להצגת הודעות
    const message = document.getElementById('loginMessage');

    // בדיקה אם כל השדות מלאים
    if (!username || !password) {
        message.textContent = 'אנא מלא את כל השדות';
        message.style.color = 'red';
        return; // יציאה מהפונקציה אם השדות לא מלאים
    }

    // בדיקה אם שם המשתמש והסיסמה תואמים משתמש קיים
    const user = users.find(user => user.username === username && user.password === password);

    // אם המשתמש נמצא, מעבר לעמוד האפליקציה ושמירת שם המשתמש ב-localStorage
    if (user) {
        localStorage.setItem('currentUser', username);
        message.textContent = 'התגעגענו';
        message.style.color = 'green';
        return window.location.href = "application.html";
    } else {
        // הודעה על שם משתמש או סיסמה לא תקינים
        message.textContent = 'שם משתמש או סיסמה לא חוקיים';
        message.style.color = 'red';
    }
}

// פונקציה להצגת טופס הרישום והסתרת טופס הכניסה
function showSignUp() {
    document.querySelector('.containerLogin').style.display = 'none';
    document.querySelector('.containerSignUp').style.display = 'block';
}

// פונקציה להצגת טופס הכניסה והסתרת טופס הרישום
function showLogin() {
    document.querySelector('.containerSignUp').style.display = 'none';
    document.querySelector('.containerLogin').style.display = 'block';
}

// קישור פונקציות לאירועים המתאימים
document.getElementById('signUpBtn').addEventListener('click', signUp);
document.getElementById('loginBtn').addEventListener('click', login);
document.getElementById('showSignUpBtn').addEventListener('click', showSignUp);
document.getElementById('showLoginBtn').addEventListener('click', showLogin);

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('homeBtn').addEventListener('click', () => {
        window.location.href = 'index.html'; // ניתוב לעמוד הבית
    });
});
