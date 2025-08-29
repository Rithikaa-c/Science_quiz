let allQuestions = [];
let workingSet = [];
let currentIndex = 0;
let correctStreak = 0;

const qText = document.getElementById('question-text');
const optionsDiv = document.getElementById('options');
const feedback = document.getElementById('feedback');
const congrats = document.getElementById('congrats');
const nextBtn = document.getElementById('next-btn');
const levelSelect = document.getElementById('level');
const gradeSelect = document.getElementById('grade');
const langSelect = document.getElementById('language');
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

async function init() {
    try {
        const res = await fetch('questions.json');
        allQuestions = await res.json();
    } catch (e) {
        console.error('Failed to load questions.json', e);
        qText.textContent = 'Failed to load questions. Check Live Server and file path.';
        return;
    }

    // restore saved settings
    const savedLang = localStorage.getItem('lang');
    const savedLevel = localStorage.getItem('level');
    const savedGrade = localStorage.getItem('grade');

    if (savedLang) langSelect.value = savedLang;
    if (savedLevel) levelSelect.value = savedLevel;
    if (savedGrade) gradeSelect.value = savedGrade;
}

function startQuiz() {
    startScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    buildWorkingSet();
    renderQuestion();
}

function saveSettings() {
    localStorage.setItem('lang', langSelect.value);
    localStorage.setItem('level', levelSelect.value);
    localStorage.setItem('grade', gradeSelect.value);
}

function buildWorkingSet() {
    const level = levelSelect.value;
    const grade = gradeSelect.value;

    workingSet = allQuestions.filter(
        q => q.level === level && q.grade === grade
    );

    shuffle(workingSet);
    currentIndex = 0;
    correctStreak = 0;
}

function renderQuestion() {
    feedback.textContent = '';
    congrats.textContent = '';
    nextBtn.style.display = "inline-block";

    if (workingSet.length === 0) {
        qText.textContent = 'No questions found for this grade and level.';
        optionsDiv.innerHTML = '';
        return;
    }

    if (currentIndex >= workingSet.length) {
        qText.textContent = '🎉 Quiz completed! Great job!';
        optionsDiv.innerHTML = '';
        nextBtn.style.display = "none";
        return;
    }

    const q = workingSet[currentIndex];
    const lang = langSelect.value;

    qText.textContent = lang === 'en' ? q.question_en : q.question_ta;
    optionsDiv.innerHTML = '';

    const opts = lang === 'en' ? q.options_en : q.options_ta;

    opts.forEach((text, idx) => {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.addEventListener('click', () => checkAnswer(idx, q.answer));
        optionsDiv.appendChild(btn);
    });
}

function checkAnswer(selected, correct) {
    [...optionsDiv.children].forEach(btn => btn.disabled = true);

    if (selected === correct) {
        feedback.textContent = langSelect.value === 'en' ? 'Correct!' : 'சரி!';
        feedback.style.color = '#15803d';
        optionsDiv.children[selected].style.background = "#4caf50";
        correctStreak++;

        if (correctStreak === 3) {
            congrats.textContent = langSelect.value === 'en'
                ? '🎉 Congratulations! 3 correct answers in a row!'
                : '🎉 வாழ்த்துக்கள்! தொடர்ந்து 3 சரியான பதில்கள்!';
            correctStreak = 0;
        }
    } else {
        feedback.textContent = langSelect.value === 'en' ? 'Wrong!' : 'தவறு!';
        feedback.style.color = '#dc2626';
        optionsDiv.children[selected].style.background = "#f44336";
        optionsDiv.children[correct].style.background = "#4caf50";
        correctStreak = 0;
    }
}

function nextQuestion() {
    currentIndex++;
    renderQuestion();
}

// New Back to Grades function
function goBackToGrade() {
    quizScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
}