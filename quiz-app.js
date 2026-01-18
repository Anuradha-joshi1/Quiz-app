"use strict";
var currentIndex = 0;
var score = 0;
var selectedOption = null;
var questions = [];
var questionsEl = document.getElementById("questions");
var optionsEl = document.getElementById("options");
var nextBtn = document.getElementById("nextBtn");
var startBtn = document.getElementById("startBtn");
questionsEl.style.display = "none";
optionsEl.style.display = "none";
nextBtn.style.display = "none";
function showQuizUI() {
    startBtn.style.display = "none";
    questionsEl.style.display = "block";
    optionsEl.style.display = "flex";
    nextBtn.style.display = "inline-block";
}
function saveQuizState() {
    var state = {
        currentIndex: currentIndex,
        score: score,
        selectedOption: selectedOption,
        isQuizStarted: true
    };
    localStorage.setItem("quizState", JSON.stringify(state));
}
function loadQuizState() {
    var savedState = localStorage.getItem("quizState");
    if (savedState) {
        var state = JSON.parse(savedState);
        currentIndex = state.currentIndex;
        score = state.score;
        selectedOption = state.selectedOption;
        if (state.isQuizStarted) {
            showQuizUI();
            loadQuestions();
        }
    }
}
fetch("questions.json")
    .then(function (response) { return response.json(); })
    .then(function (data) {
    questions = data;
    loadQuizState();
})
    .catch(function (error) {
    console.error("error loading questions :", error);
});
startBtn.addEventListener("click", function () {
    showQuizUI();
    saveQuizState();
    loadQuestions();
});
function handleOptionClick(index, button) {
    selectedOption = index;
    var allButtons = optionsEl.querySelectorAll("button");
    allButtons.forEach(function (btn) { return btn.classList.remove("selected"); });
    button.classList.add("selected");
}
function renderOptions(options) {
    optionsEl.innerHTML = "";
    options.forEach(function (option, index) {
        var btn = document.createElement("button");
        btn.innerText = option;
        btn.addEventListener("click", function () {
            return handleOptionClick(index, btn);
        });
        optionsEl.append(btn);
    });
}
function loadQuestions() {
    selectedOption = null;
    if (!questions[currentIndex])
        return;
    var currentQuestion = questions[currentIndex];
    questionsEl.innerText = currentQuestion.question;
    renderOptions(currentQuestion.options);
}
nextBtn.addEventListener("click", function () {
    if (selectedOption === null) {
        var confirmSkip = confirm("You haven't selected any answer. Do you want to skip this question?");
        if (!confirmSkip) {
            return;
        }
    }
    else {
        if (selectedOption === questions[currentIndex].answer) {
            score++;
        }
    }
    currentIndex++;
    saveQuizState();
    if (currentIndex < questions.length) {
        loadQuestions();
    }
    else {
        showResult();
    }
});
function showResult() {
    questionsEl.innerText = "Quiz Completed!!";
    var message = "";
    if (score === questions.length) {
        message = "Excellent";
    }
    else if (score >= questions.length / 2) {
        message = "Good";
    }
    else {
        message = "Keep Practicing";
    }
    optionsEl.innerHTML = "\n    <h3>Your Score: ".concat(score, " / ").concat(questions.length, "</h3>\n    <p>").concat(message, "</p>\n  ");
    nextBtn.style.display = "none";
    localStorage.removeItem("quizState");
}
