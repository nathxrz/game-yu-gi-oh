const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox: document.getElementById("score_points"),
  },
  cardSprites: {
    avatar: document.getElementById("card-image"),
    name: document.getElementById("card-name"),
    type: document.getElementById("card-type"),
  },
  fieldCards: {
    player: document.getElementById("player-field-card"),
    computer: document.getElementById("computer-field-card"),
  },
  playersSides: {
    player: "player-cards",
    playerBox: document.querySelector("#player-cards"),

    computer: "computer-cards",
    computerBox: document.querySelector("#computer-cards"),
  },
  button: document.getElementById("next-duel"),
};

const cardData = [
  {
    id: 0,
    name: "Blue Eyes White Dragon",
    type: "Paper",
    img: "./src/assets/icons/dragon.png",
    WinOf: [1],
    LoseOf: [2],
  },
  {
    id: 1,
    name: "Dark Magician",
    type: "Rock",
    img: "./src/assets/icons/magician.png",
    WinOf: [2],
    LoseOf: [0],
  },
  {
    id: 2,
    name: "Exodia",
    type: "Scissors",
    img: "./src/assets/icons/exodia.png",
    WinOf: [0],
    LoseOf: [1],
  },
];

async function getRandomCardId() {
  const index = Math.floor(Math.random() * cardData.length);
  return cardData[index].id;
}

async function drawSelectCard(index) {
  state.cardSprites.avatar.src = cardData[index].img;
  state.cardSprites.name.innerText = cardData[index].name;
  state.cardSprites.type.innerText = cardData[index].type;
}

async function removeAllCardsImage() {
  let { playerBox, computerBox } = state.playersSides;
  let imageElements = playerBox.querySelectorAll("img");
  imageElements.forEach((img) => {
    img.remove();
  });

  imageElements = computerBox.querySelectorAll("img");
  imageElements.forEach((img) => {
    img.remove();
  });
}

async function checkDuelResults(idPlayer, idComputer) {
  let duelResults = "draw";

  let playerCard = cardData[idPlayer];

  if (playerCard.WinOf.includes(idComputer)) {
    duelResults = "win";
    state.score.playerScore++;
    playAudio(duelResults);
  }

  if (playerCard.LoseOf.includes(idComputer)) {
    duelResults = "lose";
    state.score.computerScore++;
    playAudio(duelResults);
  }

  return duelResults;
}

async function drawButton(result) {
  state.button.innerText = result.toUpperCase();
  state.button.style.display = "block";
}

async function updateScore() {
  state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function setCardsFields(playerCardId) {
  await removeAllCardsImage();

  let computerCardId = await getRandomCardId();

  await ShowHiddenCardFieldsImages(true);

  await DrawCardsInfields(playerCardId, computerCardId);

  let duelResults = await checkDuelResults(playerCardId, computerCardId);

  await updateScore();
  await drawButton(duelResults);
}

async function createCardImage(idCard, fieldSide) {
  const cardImage = document.createElement("img");
  cardImage.setAttribute("height", "100px");
  cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
  cardImage.setAttribute("data-id", idCard);
  cardImage.classList.add("card");

  if (fieldSide === state.playersSides.player) {
    cardImage.addEventListener("mouseover", () => {
      drawSelectCard(idCard);
    });

    cardImage.addEventListener("click", () => {
      setCardsFields(cardImage.getAttribute("data-id"));
    });
  }

  return cardImage;
}

async function drawCards(cardNumbers, fieldSide) {
  for (let i = 0; i < cardNumbers; i++) {
    const randomIdCard = await getRandomCardId();
    const cardImage = await createCardImage(randomIdCard, fieldSide);

    document.getElementById(fieldSide).appendChild(cardImage);
  }
}

async function playAudio(status) {
  const audio = new Audio(`./src/assets/audios/${status}.wav`);
  audio.play();
}

async function resetDuel() {
  state.cardSprites.avatar.src = "";
  state.button.style.display = "none";

  init();
}

// Extract to Method
async function ShowHiddenCardFieldsImages(value) {
  if (value) {
    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";
  } else {
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";
  }
}

async function DrawCardsInfields(playerCardId, computerCardId) {
  state.fieldCards.player.src = cardData[playerCardId].img;
  state.fieldCards.computer.src = cardData[computerCardId].img;
}

function init() {
  ShowHiddenCardFieldsImages(false);

  drawCards(5, state.playersSides.player);
  drawCards(5, state.playersSides.computer);

  const bgm = document.getElementById("bgm");
  bgm.play();
}

init();
