// DOM Elements
const startScreen = document.getElementById('start-screen');
const questionContainer = document.getElementById('question-container');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const feedback = document.getElementById('feedback');
const progressBar = document.getElementById('progress');
const scoreElement = document.getElementById('score');
const totalElement = document.getElementById('total');
const themeToggle = document.getElementById('theme-toggle');

// Variables
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let shuffledQuestions = [];
let currentShuffledOptions = [];

// Theme toggle
themeToggle.addEventListener('click', () => {
    document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    themeToggle.textContent = document.body.dataset.theme === 'dark' ? '☀️' : '🌙';
});

// Load questions from JSON file
async function loadQuestions() {
    try {
        const response = await fetch('questions.json?v=' + Date.now());
        const data = await response.json();
        questions = data;  // Thay đổi này vì data không cần .questions nữa
        totalElement.textContent = questions.length;
        shuffledQuestions = [...questions]; // Khởi tạo shuffledQuestions
    } catch (error) {
        console.error('Error loading questions:', error);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    document.body.dataset.theme = 'light';
    themeToggle.textContent = '🌙';
    await loadQuestions();
});

// Shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Start quiz
function startQuiz() {
    shuffledQuestions = shuffleArray([...questions]);
    currentQuestionIndex = 0;
    score = 0;
    startScreen.classList.add('hidden');
    questionContainer.classList.remove('hidden');
    resultScreen.classList.add('hidden');
    showQuestion();
}

// Show question
function showQuestion() {
    const question = shuffledQuestions[currentQuestionIndex];
    questionText.textContent = question.question;
    optionsContainer.innerHTML = '';

    currentShuffledOptions = shuffleArray([...question.options]);

    currentShuffledOptions.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('option');
        optionElement.textContent = option;
        optionElement.addEventListener('click', () => checkAnswer(index));
        optionsContainer.appendChild(optionElement);
    });

    const progress = ((currentQuestionIndex) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
}

// Check answer
function checkAnswer(selectedIndex) {
    const question = shuffledQuestions[currentQuestionIndex];
    const selectedOption = currentShuffledOptions[selectedIndex];
    const correctAnswer = question.answer;
    const options = optionsContainer.children;

    Array.from(options).forEach(option => {
        option.style.pointerEvents = 'none';
    });

    if (selectedOption === correctAnswer) {
        options[selectedIndex].classList.add('correct');
        feedback.textContent = 'Correct!';
        feedback.style.color = 'var(--correct-color)';
        score++;
    } else {
        options[selectedIndex].classList.add('incorrect');
        for (let i = 0; i < currentShuffledOptions.length; i++) {
            if (currentShuffledOptions[i] === correctAnswer) {
                options[i].classList.add('correct');
                break;
            }
        }
        feedback.textContent = 'Incorrect!';
        feedback.style.color = 'var(--incorrect-color)';
    }

    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
            feedback.textContent = '';
        } else {
            showResults();
        }
    }, 1500);
}

// Show results
function showResults() {
    questionContainer.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    scoreElement.textContent = score;
}

// Event listeners
startBtn.addEventListener('click', startQuiz);
restartBtn.addEventListener('click', startQuiz);