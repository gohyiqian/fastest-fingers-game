"use strict";

let timer = 30; // timer to type all words

let score = 0; // total score
let isPlaying = false; // if playing or not

let stage = 0; // (normal mode)

let life = 3;
let totalLives = ["❤️", "❤️", "❤️"];

let chosenModes;
let selectedMode;

// DOM
let wordInput = document.querySelector("#word-input");
let currentWord = document.querySelector("#current-word");
let showScore = document.querySelector("#score");
let timeBar = document.querySelector("#timebar");
let showTime = document.querySelector("#time");
let showMessage = document.querySelector("#message");
let showSeconds = document.querySelector("#seconds");

// buttons
let startButton = document.querySelector("#start-button");
let restartButton = document.querySelector("#restart-button");

// options
let modesMessage = document.querySelector("#option-message");
let normalModeButton = document.querySelector("#normal-mode-button");
let phrasesModeButton = document.querySelector("#phrases-mode-button");
let backButton = document.querySelector("#back-button");
let endButton = document.querySelector("#end-button");

// grab bar
let progressBar = document.querySelector("progress");
let overlayScreen = document.querySelector("#overlay-screen");
let overlayBox = document.querySelector(".overlay-box");
let gameoverScreen = document.querySelector("#gameover-screen");
let gameoverBox = document.querySelector(".gameover-box");
let gameoverMessage = document.querySelector(".gameover-message");
let gamePlayScreen = document.querySelector("#gameplay-screen");

let floatingScore = document.querySelector(".floating-score");
let counter = 3; // countdown 3,2,1 and start game
let livesLeft = document.querySelector("#lives");
let backgroundOST = document.getElementById("background");

//// SOUNDS ////

// sound effect for gameover
function gameOverSound() {
  let gameOverSfx = document.getElementById("gameover");
  gameOverSfx.play();
}

// sound effect for gameover
function countdownBeep() {
  let countdownbeep = document.getElementById("countdownbeep");
  countdownbeep.play();
}

// sound effect for correct answer
function correctAnswer() {
  let right = document.getElementById("correct");
  right.play();
  timer = timer + 3;
  if (timer > 45) {
    timer = 45;
  }
}

// sound effect for correct answer
function incorrectAnswer() {
  let wrong = document.getElementById("incorrect");
  wrong.play();
  setTimeout(function () {
    wordInput.classList.add("shake");
  }, 100);
  setTimeout(function () {
    wordInput.classList.remove("shake");
  }, 200);
  life--;
  totalLives.pop();
  livesLeft.innerHTML = totalLives.join("");
  //console.log("print" + totalLives.length);
}

// sound effect for buttons
function buttonHover() {
  let hover = document.getElementById("hoverbutton");
  let buttons = document.querySelectorAll("button");
  buttons.forEach(function (item) {
    item.addEventListener("mouseover", function () {
      hover.play();
    });
  });
}

buttonHover();

////  BASIC FUNCTIONS  ////

// clear input
function clearInput() {
  document.querySelector("#word-input").value = "";
}

// creating lives
function createHealth() {
  for (let i = 0; i < totalLives.length; i++) {
    let hearts = document.createElement("span");
    hearts.classList.add("hearts" + [i]);
    hearts.innerHTML = totalLives[i];
    livesLeft.appendChild(hearts);
  }
}

// creating top timebar
function createTimeBar() {
  timeBar.classList.add("timeleft");
  let barCountdown = setInterval(function () {
    timeBar.setAttribute("value", timer);
  }, 10);
}

// timer
function gameTimer() {
  let countdownTimer = setInterval(function () {
    timer--;
    console.log(timer, isPlaying);
    if (timer === 0 || life === 0 || life === -1 || stage === 999) {
      isPlaying = false;
      checkStatus();
      clearInterval(countdownTimer);
      console.log(timer);
      console.log(life);
    }
    showTime.innerHTML = timer;
  }, 1000);
  console.log(timer);
  timer = 45;
}

// initialize game
function initGame() {
  wordInput.disabled = false;
  wordInput.focus();
  startGame();
}

// select mode
function normalMode() {
  chosenModes = 1;
  selectedMode = words;
  stage = 0;
  backButton.style.display = "inline-block";
  startButton.style.display = "inline-block";
  phrasesModeButton.style.display = "none";
  normalModeButton.style.display = "none";
  modesMessage.innerHTML =
    "<h3>You chose to play <span class=\"selected\">Words</span></h3><span class=\"selected\">Difficulty: <strong>Easy</strong></span><br>In this mode you'll be typing words that start with 'R'... Press the 'START' button to begin the game!<br><br>";
  console.log("normal clicked" + chosenModes);
}

function phrasesMode() {
  chosenModes = 2;
  selectedMode = phrases;
  stage = 0;
  backButton.style.display = "inline-block";
  startButton.style.display = "inline-block";
  phrasesModeButton.style.display = "none";
  normalModeButton.style.display = "none";
  modesMessage.innerHTML =
    '<h3>You chose to play <span class="selected">Phrases</span></h3><span class="selected">Difficulty: <strong>Medium</strong></span><br>In this mode you\'ll be typing random phrases... or quotes from famous movies! Press the \'START\' button to begin the game!<br><br>';
  console.log("normal clicked" + chosenModes);
}

function rechooseModes() {
  chosenModes = null;
  cssModeButton.style.display = "inline-block";
  normalModeButton.style.display = "inline-block";
  phrasesModeButton.style.display = "inline-block";
  startButton.style.display = "none";
  backButton.style.display = "none";
  modesMessage.innerHTML = "First, select your preferred mode:<br><br>";
}

// end game button
function endGame() {
  gameOverSound();
  currentWord.textContent = " ";
  showMessage.textContent = " ";
  clearInput();
  wordInput.disabled = true;
  gameoverScreen.style.visibility = "visible";
  gameoverBox.classList.add("bounce-in");
  backgroundOST.pause();
  backgroundOST.currentTime = 0;
  endGameScore();
  timer = 45;
  totalLives = [];
  stage = 999;
  isPlaying = false;
}

// <actually> start game
function startGame() {
  wordInput.focus();
  showWord(words);
  gameTimer();
  timer = 45;
  stage = 0;
  score = 0;
  createHealth();
  createTimeBar();
  console.log(timer);
  backgroundOST.play();
  backgroundOST.loop = true;
  backgroundOST.volume = 0.3;
  isPlaying = true;
  setInterval(checkStatus, 50);
  gamePlayScreen.style.visibility = "visible";
  timeBar.style.visibility = "visible";
  floatingScore.style.visibility = "visible";
  wordInput.onkeypress = function (event) {
    if (event.keyCode === 13) {
      if (checkMatch()) {
        stage++;
        console.log(timer);
        //console.log(stage);
        // have to put it here if not first correct answer = 0
        switch (stage) {
          case 1:
            showMessage.innerHTML = "Not too bad....";
            break;
          case 5:
            showMessage.innerHTML = "Doing well so far hey!";
            break;
          case 10:
            showMessage.innerHTML = "It's just gonna get harder from here!";
            break;
          case 15:
            showMessage.innerHTML = "Wow ok you're still here 🤨";
            break;
          case 20:
            showMessage.innerHTML = "You're doing better than the average!";
            break;
          case 25:
            showMessage.innerHTML =
              "From here on it's REALLY gonna get supercalifragileistically HARDER!";
            break;
          default:
            showMessage.innerHTML =
              'Good job!! Keep going!! <img class="icons" src="img/up.svg">';
          //console.log(stage);
        }
        // console.log("user stage" + stage); // tested and stage works
        clearInput();
      } else {
        // timer--;
        showMessage.innerHTML =
          'I don\'t think that\'s quite right... <img class="icons" src="img/oops.svg">';
        clearInput();
      }
    }
  };
}

// // restarts game immediately
// function restartGame() {
//     gameoverScreen.style.visibility = "hidden";
//     initGame();
//     timer = 45;
//     totalLives = ["❤️", "❤️", "❤️", "❤️", "❤️"];
//     life = 5;
//     score = 0;
//     counter = 3;
//     livesLeft.innerHTML = totalLives.join("");
//     console.log(timer);
//     console.log(totalLives);
// }

function totalRestart() {
  chosenModes = null;
  isPlaying = false;
  gameoverScreen.style.visibility = "hidden";
  totalLives = ["❤️", "❤️", "❤️"];
  timer = 45;
  life = 3;
  counter = 3;
  showScore.innerHTML = "0";
  livesLeft.innerHTML = "";
  showTime.innerHTML = "45";
  buttons.style.display = "block";
  gamePlayScreen.style.display = "none";
  startButton.style.display = "none";
  backButton.style.display = "none";
  timeBar.style.visibility = "hidden";
  floatingScore.style.visibility = "hidden";
  cssModeButton.style.display = "inline-block";
  normalModeButton.style.display = "inline-block";
  phrasesModeButton.style.display = "inline-block";
  gameoverBox.classList.remove("bounce-in");
  modesMessage.innerHTML = "First, select your preferred mode:<br><br>";
}

// generate words
function showWord(words, phrases, css) {
  if (stage < 4) {
    let maxWords = selectedMode.easy.length; // ALL of the objects in word.easy array
    let wordIndex = Math.floor(Math.random() * (maxWords - 0)); // random int
    currentWord.textContent = selectedMode.easy[wordIndex];
  } else if (stage >= 4 && stage < 12) {
    let maxWords = selectedMode.medium.length; // ALL of the objects in word.medium array
    let wordIndex = Math.floor(Math.random() * (maxWords - 0)); // random int
    currentWord.textContent = selectedMode.medium[wordIndex];
  } else if (stage >= 12 && stage < 20) {
    let maxWords = selectedMode.hard.length; // ALL of the objects in word.hard array
    let wordIndex = Math.floor(Math.random() * (maxWords - 0)); // random int
    currentWord.textContent = selectedMode.hard[wordIndex];
  } else if (stage >= 20) {
    let maxWords = selectedMode.superhard.length; // ALL of the objects in word.superhard array
    let wordIndex = Math.floor(Math.random() * (maxWords - 0)); // random int
    currentWord.textContent = selectedMode.superhard[wordIndex];
  }
}

// check word match
function checkMatch() {
  if (wordInput.value === currentWord.textContent) {
    calculateScore();
    showWord(words);
    correctAnswer();
    return true;
  } else {
    // adding shakey shakey animation
    incorrectAnswer();
    return false;
  }
  clearInput();
}

// check game status
function checkStatus() {
  if (life === -1) {
    life = 0;
  }
  if ((!isPlaying && timer === 0) || (!isPlaying && life === 0)) {
    //gameoverBox.innerHTML = 'Game Over!!!';
    currentWord.textContent = " ";
    showMessage.textContent = " ";
    clearInput();
    wordInput.disabled = true;
    console.log(isPlaying);
    gameoverScreen.style.visibility = "visible";
    gameoverBox.classList.add("bounce-in");
    backgroundOST.pause();
    backgroundOST.currentTime = 0;
    endGameScore();
    totalLives = [];
    timeBar.style.visibility = "hidden";
    setTimeout(function () {
      gameOverSound();
    }, 10);
    setTimeout(function () {
      life = 3;
      timer = 45;
      console.log(life);
    }, 2000);
  }
}

function endGameScore() {
  if (score <= 50) {
    gameoverMessage.innerHTML =
      'Wow you\'re horrible at this.... <img class="icons" src="img/down.svg"><br>You got ' +
      score +
      " points";
  } else if (score > 50 && score <= 150) {
    gameoverMessage.innerHTML =
      'You\'re pretty shite <img class="icons" src="img/down.svg"><br>You got ' +
      score +
      " points";
  } else if (score >= 150 && score < 250) {
    gameoverMessage.innerHTML =
      'You can do better than this....  <img class="icons" src="img/down.svg"><br>You got ' +
      score +
      " points";
  } else if (score >= 250 && score < 350) {
    gameoverMessage.innerHTML =
      'BELOW AVERAGE <img class="icons" src="img/down.svg"><br>You got ' +
      score +
      " points";
  } else if (score >= 350 && score < 450) {
    gameoverMessage.innerHTML =
      "Meh, not too bad.. You're average like everyone else <br>You got " +
      score +
      " points";
  } else if (score >= 450 && score < 550) {
    gameoverMessage.innerHTML =
      "Just ok... Slightly above average. This is like a grade C. <br>You got " +
      score +
      " points";
  } else if (score >= 550 && score < 650) {
    gameoverMessage.innerHTML =
      "Kinda impressive?? But not really. <br>You got " + score + " points";
  } else if (score >= 650) {
    gameoverMessage.innerHTML =
      "WOW ok now I am impressed!! <br>You got " + score + " points";
  }
}

// calculate scores
function calculateScore() {
  let wordContent = currentWord.textContent;
  let wordLen = wordContent.length;
  if (wordLen >= 15) {
    score = score + 20;
    //console.log("this word is " + wordLen + " letters long");
  } else if (wordLen >= 10) {
    score = score + 15;
    //console.log("this word is " + wordLen + " letters long");
  } else if (wordLen >= 5) {
    score = score + 10;
    //console.log("this word is " + wordLen + " letters long");
  }
  showScore.innerHTML = score;
}

// to load countdown loading screen after start button is pressed
function loadingScreen() {
  gamePlayScreen.style.display = "block";
  buttons.style.display = "none";
  overlayScreen.style.visibility = "visible";
  countdownBeep();
  let loadCountdown = setInterval(function () {
    counter = counter - 1;
    console.log("print count" + counter);
    overlayBox.innerHTML = counter;
    if (counter === 0) {
      overlayBox.innerHTML = "GO";
      counter = 4;
    }
  }, 1000);
  setTimeout(function () {
    initGame();
    clearInterval(loadCountdown);
    overlayScreen.style.visibility = "hidden";
  }, 4000);
  wordInput.focus();
}
