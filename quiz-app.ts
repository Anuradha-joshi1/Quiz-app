type Questions = {
  question: string;
  options: string[];
  answer: number;
};
let currentIndex: number = 0;
let score: number = 0;
let selectedOption: number | null = null;

let questions: Questions[] = [];

const questionsEl = document.getElementById("questions")!;

const optionsEl = document.getElementById("options")!;
const nextBtn = document.getElementById("nextBtn")! as HTMLButtonElement;

function saveQuizState() {
  const state = {
    currentIndex,
    score,
    selectedOption
  };
  localStorage.setItem("quizState", JSON.stringify(state));
}

function loadQuizState() {
  const savedState = localStorage.getItem("quizState");

  if (savedState) {
    const state = JSON.parse(savedState);
    currentIndex = state.currentIndex;
    score = state.score;
    selectedOption = state.selectedOption;
  }
}


fetch("questions.json")
  .then(response => response.json())
  .then((data: Questions[]) => {
    questions = data;
     loadQuizState();
    loadQuestions();
  })
  .catch(error => {
    console.error("error loading questions :", error);
  })

function handleOptionClick(
  index: number,
  button: HTMLButtonElement
) {
  selectedOption = index;

  const allButtons = optionsEl.querySelectorAll("button");
  allButtons.forEach(btn => btn.classList.remove("selected"));

  button.classList.add("selected");
}

function renderOptions(options: string[]) {
  optionsEl.innerHTML = "";

  options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.innerText = option;

    btn.addEventListener("click", () =>
      handleOptionClick(index, btn)
    );

    optionsEl.append(btn);
  });
}


function loadQuestions() {
  selectedOption = null;

  const currentQuestion = questions[currentIndex];
  questionsEl.innerText = currentQuestion.question;
  renderOptions(currentQuestion.options);
}
nextBtn.addEventListener("click", () => {

  if (selectedOption === null) {
    const confirmSkip = confirm(
      "You haven't selected any answer. Do you want to skip this question?"
    );

    if (!confirmSkip) {
      return;
    }
  } else {

    if (selectedOption === questions[currentIndex].answer) {
      score++;
    }
  }

  currentIndex++;
  saveQuizState();

  if (currentIndex < questions.length) {
    loadQuestions();
  } else {
    showResult();
  }
});


function showResult() {
  questionsEl.innerText = "Quiz Completed!!";

  let message: string = "";

  if (score === questions.length) {
    message = "Excellent";
  } else if (score >= questions.length / 2) {
    message = "Good";
  } else {
    message = "Keep Practicing";
  }

  optionsEl.innerHTML = `
    <h3>Your Score: ${score} / ${questions.length}</h3>
    <p>${message}</p>
  `;

  nextBtn.style.display = "none";
  localStorage.removeItem("quizState");
}


