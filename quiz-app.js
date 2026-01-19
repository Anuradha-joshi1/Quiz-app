"use strict";
var currentIndex = 0;
var score = 0;
var selectedOption = null;
var questions = [];
var progressEl = document.getElementById("progress");
var questionsEl = document.getElementById("questions");
var optionsEl = document.getElementById("options");
var nextBtn = document.getElementById("nextBtn");
var startBtn = document.getElementById("startBtn");
var skipBtn = document.getElementById("skipBtn");
var submitBtn = document.getElementById("submitBtn");
questionsEl.style.display = "none";
optionsEl.style.display = "none";
nextBtn.style.display = "none";
skipBtn.style.display = "none";
progressEl.style.display = "none";
submitBtn.style.display = "none";
function updateProgress() {
    var total = questions.length;
    var current = currentIndex + 1;
    var left = total - current;
    progressEl.innerText = "".concat(left, " questions left");
}
function showQuizUI() {
    startBtn.style.display = "none";
    questionsEl.style.display = "block";
    optionsEl.style.display = "grid";
    nextBtn.style.display = "inline-block";
    skipBtn.style.display = "inline-block";
    submitBtn.style.display = "inline-block";
    progressEl.style.display = "block";
}
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
        btn.addEventListener("click", function () { return handleOptionClick(index, btn); });
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
    updateProgress();
    if (currentIndex === questions.length - 1) {
        nextBtn.style.display = "none";
        skipBtn.disabled = true;
        skipBtn.style.opacity = "0.5";
        skipBtn.style.cursor = "not-allowed";
    }
    else {
        nextBtn.style.display = "inline-block";
        skipBtn.disabled = false;
        skipBtn.style.opacity = "1";
        skipBtn.style.cursor = "pointer";
    }
}
function saveQuizState() {
    var state = {
        currentIndex: currentIndex,
        score: score,
        selectedOption: selectedOption,
        isQuizStarted: true,
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
startBtn.addEventListener("click", function () {
    showQuizUI();
    saveQuizState();
    loadQuestions();
});
nextBtn.addEventListener("click", function () {
    if (selectedOption === null) {
        alert("Please select an option before clicking Next");
        return;
    }
    if (selectedOption === questions[currentIndex].answer) {
        score++;
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
skipBtn.addEventListener("click", function () {
    currentIndex++;
    selectedOption = null;
    saveQuizState();
    if (currentIndex < questions.length) {
        loadQuestions();
    }
    else {
        showResult();
    }
});
submitBtn.addEventListener("click", function () {
    var confirmSubmit = confirm("Do you want to submit the quiz?");
    if (confirmSubmit) {
        showResult();
    }
});
fetch("questions.json")
    .then(function (response) { return response.json(); })
    .then(function (data) {
    questions = data;
    loadQuizState();
})
    .catch(function (error) {
    questionsEl.innerText = "Failed to load questions. Please try again later.";
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
    skipBtn.style.display = "none";
    submitBtn.style.display = "none";
    progressEl.style.display = "none";
    localStorage.removeItem("quizState");
}
