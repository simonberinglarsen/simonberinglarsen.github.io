const STORAGE_KEY = "squaretrainer.streak";
const MAX_QUESTIONS = 64;

const screens = {
  streak: document.querySelector('[data-screen="streak"]'),
  question: document.querySelector('[data-screen="question"]'),
  result: document.querySelector('[data-screen="result"]'),
  congratz: document.querySelector('[data-screen="congratz"]'),
  debug: document.querySelector('[data-screen="debug"]'),
};

const streakCount = document.querySelector("#streak-count");
const streakBoard = document.querySelector("#streak-board");
const congratzBoard = document.querySelector("#congratz-board");
const questionNumber = document.querySelector("#question-number");
const questionText = document.querySelector("#question-text");
const answerDisplay = document.querySelector("#answer-display");
const answerPreview = document.querySelector("#answer-preview");
const letterKeypad = document.querySelector("#letter-keypad");
const digitKeypad = document.querySelector("#digit-keypad");
const colorKeypad = document.querySelector("#color-keypad");
const resultStatus = document.querySelector("#result-status");
const resultIcon = document.querySelector("#result-icon");
const resultText = document.querySelector("#result-text");
const resultAnswer = document.querySelector("#result-answer");
const resultYourAnswer = document.querySelector("#result-your-answer");
const submitAnswerButton = document.querySelector("#submit-answer");
const backspaceAnswerButton = document.querySelector("#backspace-answer");
const startQuestionButton = document.querySelector("#start-question");
const backToStreakButton = document.querySelector("#back-to-streak");
const restartSessionButton = document.querySelector("#restart-session");
const openDebugButton = document.querySelector("#open-debug");
const closeDebugButton = document.querySelector("#close-debug");
const debugOpenCorrectButton = document.querySelector("#debug-open-correct");
const debugOpenWrongButton = document.querySelector("#debug-open-wrong");
const debugCompleteSessionButton = document.querySelector("#debug-complete-session");
const debugClearAllButton = document.querySelector("#debug-clear-all");
const files = "abcdefgh";

function refreshIcons() {
  window.lucide?.createIcons();
}

refreshIcons();

let currentScreen = "streak";
let lastAnswerWasCorrect = true;
let streak = loadStreak();
let currentQuestion = createQuestion();
let currentAnswer = "";
let submittedAnswer = "";

function indexToFile(index) {
  return files[index];
}

function toSquare(fileIndex, rankIndex) {
  return `${indexToFile(fileIndex)}${rankIndex + 1}`;
}

function parseSquare(square) {
  return {
    fileIndex: square.charCodeAt(0) - 97,
    rankIndex: Number.parseInt(square[1], 10) - 1,
  };
}

function buildDiagonalSquares(startSquare, endSquare) {
  const start = parseSquare(startSquare);
  const end = parseSquare(endSquare);
  const fileStep = Math.sign(end.fileIndex - start.fileIndex);
  const rankStep = Math.sign(end.rankIndex - start.rankIndex);
  const squares = [];

  let fileIndex = start.fileIndex;
  let rankIndex = start.rankIndex;

  while (true) {
    squares.push(toSquare(fileIndex, rankIndex));

    if (fileIndex === end.fileIndex && rankIndex === end.rankIndex) {
      break;
    }

    fileIndex += fileStep;
    rankIndex += rankStep;
  }

  return squares;
}

function findDiagonalEndpoints(square) {
  const origin = parseSquare(square);

  let lowFile = origin.fileIndex;
  let lowRank = origin.rankIndex;

  while (lowFile > 0 && lowRank > 0) {
    lowFile -= 1;
    lowRank -= 1;
  }

  let highFile = origin.fileIndex;
  let highRank = origin.rankIndex;

  while (highFile < 7 && highRank < 7) {
    highFile += 1;
    highRank += 1;
  }

  const firstA = toSquare(lowFile, lowRank);
  const lastA = toSquare(highFile, highRank);

  lowFile = origin.fileIndex;
  lowRank = origin.rankIndex;

  while (lowFile < 7 && lowRank > 0) {
    lowFile += 1;
    lowRank -= 1;
  }

  highFile = origin.fileIndex;
  highRank = origin.rankIndex;

  while (highFile > 0 && highRank < 7) {
    highFile -= 1;
    highRank += 1;
  }

  const firstB = toSquare(lowFile, lowRank);
  const lastB = toSquare(highFile, highRank);

  return [
    [firstA, lastA],
    [firstB, lastB],
  ];
}

function createQuestion() {
  const generators = [
    createMentionSquaresInDiagonalQuestion,
    createKnightAttacksFromQuestion,
    createKnightAttacksTowardQuestion,
    createBishopDiagonalsThroughQuestion,
    createBishopAttacksFromQuestion,
    createSquareColorQuestion,
  ];

  return generators[Math.floor(Math.random() * generators.length)]();
}

function randomSquare() {
  const fileIndex = Math.floor(Math.random() * 8);
  const rankIndex = Math.floor(Math.random() * 8);
  return toSquare(fileIndex, rankIndex);
}

function compareSquares(a, b) {
  const squareA = parseSquare(a);
  const squareB = parseSquare(b);

  if (squareA.fileIndex !== squareB.fileIndex) {
    return squareA.fileIndex - squareB.fileIndex;
  }

  return squareA.rankIndex - squareB.rankIndex;
}

function sortSquares(squares) {
  return [...squares].sort(compareSquares);
}

function concatenateSquares(squares) {
  return sortSquares(squares).join("");
}

function orderDiagonal(startSquare, endSquare) {
  const start = parseSquare(startSquare);
  const end = parseSquare(endSquare);

  if (start.rankIndex < end.rankIndex) {
    return [startSquare, endSquare];
  }

  if (start.rankIndex > end.rankIndex) {
    return [endSquare, startSquare];
  }

  if (start.fileIndex <= end.fileIndex) {
    return [startSquare, endSquare];
  }

  return [endSquare, startSquare];
}

function compareDiagonalPairs([startA], [startB]) {
  return compareSquares(startA, startB);
}

function getKnightMoves(square) {
  const { fileIndex, rankIndex } = parseSquare(square);
  const offsets = [
    [-2, -1],
    [-2, 1],
    [-1, -2],
    [-1, 2],
    [1, -2],
    [1, 2],
    [2, -1],
    [2, 1],
  ];

  return offsets
    .map(([fileOffset, rankOffset]) => ({
      fileIndex: fileIndex + fileOffset,
      rankIndex: rankIndex + rankOffset,
    }))
    .filter(({ fileIndex: nextFile, rankIndex: nextRank }) =>
      nextFile >= 0 && nextFile < 8 && nextRank >= 0 && nextRank < 8)
    .map(({ fileIndex: nextFile, rankIndex: nextRank }) => toSquare(nextFile, nextRank));
}

function getBishopAttacks(square) {
  const { fileIndex, rankIndex } = parseSquare(square);
  const directions = [
    [1, 1],
    [-1, 1],
    [1, -1],
    [-1, -1],
  ];

  return directions.flatMap(([fileStep, rankStep]) => {
    const attackedSquares = [];
    let nextFile = fileIndex + fileStep;
    let nextRank = rankIndex + rankStep;

    while (nextFile >= 0 && nextFile < 8 && nextRank >= 0 && nextRank < 8) {
      attackedSquares.push(toSquare(nextFile, nextRank));
      nextFile += fileStep;
      nextRank += rankStep;
    }

    return attackedSquares;
  });
}

function getSquareColor(square) {
  const { fileIndex, rankIndex } = parseSquare(square);
  return (fileIndex + rankIndex) % 2 === 0 ? "dark" : "light";
}

function createMentionSquaresInDiagonalQuestion() {
  const square = randomSquare();
  const diagonals = findDiagonalEndpoints(square)
    .filter(([start, end]) => start !== end);
  const [start, end] = diagonals[Math.floor(Math.random() * diagonals.length)];

  return {
    prompt: `mention squares in diagonal, ${start}${end}`,
    answer: buildDiagonalSquares(start, end).join(""),
  };
}

function createKnightAttacksFromQuestion() {
  const square = randomSquare();
  return {
    prompt: `knight attacks from ${square}`,
    answer: concatenateSquares(getKnightMoves(square)),
  };
}

function createKnightAttacksTowardQuestion() {
  const square = randomSquare();
  return {
    prompt: `knight attacks toward ${square}`,
    answer: concatenateSquares(getKnightMoves(square)),
  };
}

function createBishopAttacksFromQuestion() {
  const square = randomSquare();
  return {
    prompt: `bishop attacks from ${square}`,
    answer: getBishopAttacks(square).join(""),
  };
}

function createSquareColorQuestion() {
  const square = randomSquare();
  return {
    prompt: `color of ${square}`,
    answer: getSquareColor(square),
  };
}

function createBishopDiagonalsThroughQuestion() {
  const square = randomSquare();
  const diagonals = findDiagonalEndpoints(square)
    .filter(([start, end]) => start !== end)
    .map(([start, end]) => orderDiagonal(start, end))
    .sort(compareDiagonalPairs);

  return {
    prompt: `bishop diagonals through ${square}`,
    answer: diagonals.map(([start, end]) => `${start}${end}`).join(""),
  };
}

function normalizeWhitespace(value) {
  return value.replace(/\s+/g, "").toLowerCase();
}

function splitSquareTokens(value) {
  const normalized = normalizeWhitespace(value);

  if (normalized.length % 2 !== 0) {
    return null;
  }

  const tokens = normalized.match(/.{1,2}/g) ?? [];

  if (tokens.some((token) => token.length !== 2)) {
    return null;
  }

  return tokens;
}

function normalizeSquareSetAnswer(value) {
  const tokens = splitSquareTokens(value);

  if (!tokens) {
    return normalizeWhitespace(value);
  }

  return sortSquares(tokens).join("");
}

function formatSquareSetAnswer(value) {
  const tokens = splitSquareTokens(value);

  if (!tokens || tokens.length === 0) {
    return "";
  }

  return sortSquares(tokens).join(" ");
}

function normalizeDiagonalAnswer(value) {
  const normalized = normalizeWhitespace(value);
  const tokens = normalized.match(/.{1,4}/g) ?? [];

  if (tokens.length !== 2 || tokens.some((token) => token.length !== 4)) {
    return normalized;
  }

  return tokens
    .map((token) => orderDiagonal(token.slice(0, 2), token.slice(2, 4)))
    .sort(compareDiagonalPairs)
    .map(([start, end]) => `${start}${end}`)
    .join("");
}

function normalizeColorAnswer(value) {
  const normalized = normalizeWhitespace(value);

  if (["w", "l", "light", "white"].includes(normalized)) {
    return "white";
  }

  if (["d", "b", "dark", "black"].includes(normalized)) {
    return "black";
  }

  return normalized;
}

function normalizeAnswer(question, answer) {
  if (question.prompt.startsWith("bishop diagonals through ")) {
    return normalizeDiagonalAnswer(answer);
  }

  if (question.prompt.startsWith("color of ")) {
    return normalizeColorAnswer(answer);
  }

  return normalizeSquareSetAnswer(answer);
}

function isColorQuestion(question) {
  return question.prompt.startsWith("color of ");
}

function expectsDigit(answer) {
  return answer.length % 2 === 1;
}

function hasPendingSquareAnswer(answer) {
  return !isColorQuestion(currentQuestion) && expectsDigit(answer);
}

function formatAnswerPreview(question, answer) {
  if (!answer.trim()) {
    return "";
  }

  if (question.prompt.startsWith("bishop diagonals through ")) {
    const normalized = normalizeDiagonalAnswer(answer);
    const tokens = normalized.match(/.{1,4}/g) ?? [];

    if (tokens.length === 0 || tokens.some((token) => token.length !== 4)) {
      return normalized;
    }

    return tokens
      .map((token) => `${token.slice(0, 2)} -> ${token.slice(2, 4)}`)
      .join(" | ");
  }

  if (question.prompt.startsWith("color of ")) {
    return normalizeColorAnswer(answer);
  }

  return formatSquareSetAnswer(answer);
}

function formatAnswerPreviewHtml(question, answer) {
  if (!answer.trim()) {
    return "";
  }

  if (question.prompt.startsWith("bishop diagonals through ")) {
    const normalized = normalizeDiagonalAnswer(answer);
    const tokens = normalized.match(/.{1,4}/g) ?? [];

    if (tokens.length === 0 || tokens.some((token) => token.length !== 4)) {
      return normalized;
    }

    return tokens
      .map((token) =>
        `${token.slice(0, 2)} <i class="icon" data-lucide="arrow-right"></i> ${token.slice(2, 4)}`)
      .join(" | ");
  }

  return formatAnswerPreview(question, answer);
}

function renderAnswerPreview() {
  if (!answerPreview) {
    return;
  }

  const preview = formatAnswerPreviewHtml(currentQuestion, currentAnswer);
  answerPreview.innerHTML = preview ? `Ordered: ${preview}` : "";
  refreshIcons();
}

function renderAnswerDisplay() {
  if (!answerDisplay) {
    return;
  }

  if (!currentAnswer) {
    answerDisplay.textContent = "Answer:";
    return;
  }

  if (isColorQuestion(currentQuestion)) {
    answerDisplay.textContent = `Answer: ${currentAnswer}`;
    return;
  }

  const completeTokens = currentAnswer.slice(0, currentAnswer.length - (currentAnswer.length % 2))
    .match(/.{1,2}/g) ?? [];
  const pendingToken = currentAnswer.length % 2 === 1 ? currentAnswer.slice(-1) : "";
  const parts = [...completeTokens];

  if (pendingToken) {
    parts.push(`${pendingToken}_`);
  }

  answerDisplay.textContent = `Answer: ${parts.join(" ")}`;
}

function renderKeypad() {
  const colorQuestion = isColorQuestion(currentQuestion);

  if (colorKeypad) {
    colorKeypad.hidden = !colorQuestion;
  }

  if (letterKeypad) {
    letterKeypad.hidden = colorQuestion || expectsDigit(currentAnswer);
  }

  if (digitKeypad) {
    digitKeypad.hidden = colorQuestion || !expectsDigit(currentAnswer);
  }

  if (submitAnswerButton) {
    submitAnswerButton.disabled = !currentAnswer || hasPendingSquareAnswer(currentAnswer);
  }
}

function loadStreak() {
  const savedValue = Number.parseInt(localStorage.getItem(STORAGE_KEY) ?? "0", 10);

  if (Number.isNaN(savedValue) || savedValue < 0) {
    return 0;
  }

  return Math.min(savedValue, MAX_QUESTIONS);
}

function saveStreak() {
  localStorage.setItem(STORAGE_KEY, String(streak));
}

function renderBoard() {
  if (!streakBoard) {
    return;
  }

  renderBoardInto(streakBoard, streak);
}

function renderBoardInto(board, filledSquares) {
  if (!board) {
    return;
  }

  board.replaceChildren();

  for (let index = 0; index < MAX_QUESTIONS; index += 1) {
    const square = document.createElement("div");
    square.className = "square";

    if (index < filledSquares) {
      square.classList.add("is-complete");
    }

    board.append(square);
  }
}

function renderStreakScreen() {
  if (streakCount) {
    streakCount.textContent = `Current streak: ${streak} / ${MAX_QUESTIONS}`;
  }

  renderBoard();
}

function renderQuestionScreen() {
  if (questionNumber) {
    questionNumber.textContent = String(Math.min(streak + 1, MAX_QUESTIONS));
  }

  if (questionText) {
    questionText.textContent = currentQuestion.prompt;
  }

  currentAnswer = "";
  renderAnswerDisplay();
  renderKeypad();
  renderAnswerPreview();
}

function renderResultScreen() {
  if (resultStatus) {
    resultStatus.classList.toggle("is-correct", lastAnswerWasCorrect);
    resultStatus.classList.toggle("is-wrong", !lastAnswerWasCorrect);
  }

  if (resultIcon) {
    resultIcon.setAttribute(
      "data-lucide",
      lastAnswerWasCorrect ? "circle-check-big" : "circle-x");
  }

  if (resultText) {
    resultText.textContent = lastAnswerWasCorrect ? "Correct" : "Wrong - streak reset";
  }

  if (resultAnswer) {
    const expectedPreview =
      formatAnswerPreviewHtml(currentQuestion, currentQuestion.answer) || currentQuestion.answer;
    resultAnswer.innerHTML = lastAnswerWasCorrect
      ? `Answer: ${expectedPreview}`
      : `Correct: ${expectedPreview}`;
  }

  if (resultYourAnswer) {
    if (lastAnswerWasCorrect) {
      resultYourAnswer.innerHTML = "";
      return;
    }

    const yourPreview =
      formatAnswerPreviewHtml(currentQuestion, submittedAnswer) || submittedAnswer || "(empty)";
    resultYourAnswer.innerHTML = `Your answer: ${yourPreview}`;
  }

  refreshIcons();
}

function renderCongratzScreen() {
  renderBoardInto(congratzBoard, MAX_QUESTIONS);
}

function renderScreen() {
  Object.entries(screens).forEach(([name, screen]) => {
    screen.hidden = name !== currentScreen;
  });

  if (currentScreen === "streak") {
    renderStreakScreen();
  } else if (currentScreen === "question") {
    renderQuestionScreen();
  } else if (currentScreen === "result") {
    renderResultScreen();
  } else if (currentScreen === "congratz") {
    renderCongratzScreen();
  }
}

function showQuestionScreen() {
  try {
    currentQuestion = createQuestion();
  } catch (error) {
    currentQuestion = {
      prompt: "color of a1",
      answer: "dark",
    };
    console.error("Failed to create question", error);
  }

  currentScreen = "question";
  renderScreen();
}

function showStreakScreen() {
  currentScreen = "streak";
  renderScreen();
}

function restartSession() {
  streak = 0;
  saveStreak();
  submittedAnswer = "";
  currentAnswer = "";
  currentQuestion = createQuestion();
  currentScreen = "streak";
  renderScreen();
}

function showDebugScreen() {
  currentScreen = "debug";
  renderScreen();
}

function completeSessionForDebug() {
  streak = MAX_QUESTIONS;
  saveStreak();
  currentScreen = "congratz";
  renderScreen();
}

function openCorrectResultForDebug() {
  currentQuestion = {
    prompt: "color of a1",
    answer: "black",
  };
  submittedAnswer = "b";
  lastAnswerWasCorrect = true;
  currentScreen = "result";
  renderScreen();
}

function openWrongResultForDebug() {
  currentQuestion = {
    prompt: "bishop diagonals through d3",
    answer: "b1h7f1a6",
  };
  submittedAnswer = "b1h7";
  lastAnswerWasCorrect = false;
  currentScreen = "result";
  renderScreen();
}

function clearAllForDebug() {
  localStorage.removeItem(STORAGE_KEY);
  streak = 0;
  submittedAnswer = "";
  currentAnswer = "";
  currentQuestion = createQuestion();
  lastAnswerWasCorrect = true;
  currentScreen = "streak";
  renderScreen();
}

function submitAnswer() {
  submittedAnswer = currentAnswer;
  lastAnswerWasCorrect =
    normalizeAnswer(currentQuestion, submittedAnswer) ===
    normalizeAnswer(currentQuestion, currentQuestion.answer);

  if (lastAnswerWasCorrect) {
    streak = Math.min(streak + 1, MAX_QUESTIONS);
  } else {
    streak = 0;
  }

  saveStreak();
  currentScreen = lastAnswerWasCorrect && streak === MAX_QUESTIONS
    ? "congratz"
    : "result";
  renderScreen();
}

function appendAnswerKey(key) {
  if (isColorQuestion(currentQuestion)) {
    currentAnswer = key;
  } else {
    currentAnswer += key;
  }

  renderAnswerDisplay();
  renderKeypad();
  renderAnswerPreview();
}

function backspaceAnswer() {
  currentAnswer = currentAnswer.slice(0, -1);
  renderAnswerDisplay();
  renderKeypad();
  renderAnswerPreview();
}

startQuestionButton?.addEventListener("click", showQuestionScreen);
backToStreakButton?.addEventListener("click", showStreakScreen);
restartSessionButton?.addEventListener("click", restartSession);
openDebugButton?.addEventListener("click", showDebugScreen);
closeDebugButton?.addEventListener("click", showStreakScreen);
debugOpenCorrectButton?.addEventListener("click", openCorrectResultForDebug);
debugOpenWrongButton?.addEventListener("click", openWrongResultForDebug);
debugCompleteSessionButton?.addEventListener("click", completeSessionForDebug);
debugClearAllButton?.addEventListener("click", clearAllForDebug);
submitAnswerButton?.addEventListener("click", submitAnswer);
backspaceAnswerButton?.addEventListener("click", backspaceAnswer);
document.querySelectorAll("[data-key]").forEach((button) => {
  button.addEventListener("click", () => {
    appendAnswerKey(button.dataset.key ?? "");
  });
});

renderScreen();
