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
    playerBox: document.querySelector(".card-box.framed#player-cards"),
    computer: document.getElementById("computer-field-card"),
    computerBox: document.querySelector(".card-box.framed#computer-cards"),
  },
  playersSides: {
  player: "player-cards",
  computer: "computer-cards",
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
  let cards = document.querySelector(".card-box.framed#computer-cards");
  let imageElements = cards.querySelectorAll("img");
  imageElements.forEach((img) => {
    img.remove();
  });

  cards = document.querySelector(".card-box.framed#player-cards");
  imageElements = cards.querySelectorAll("img");
  imageElements.forEach((img) => {
    img.remove();
  });
}

async function setCardsFields(playerCardId) {
  await removeAllCardsImage();

  let computerCardId = await getRandomCardId();

  state.fieldCards.player.style.display = "block";
  state.fieldCards.computer.style.display = "block";

  state.fieldCards.player.src = cardData[playerCardId].img;
  state.fieldCards.computer.src = cardData[computerCardId].img;

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

  if (fieldSide === playersSides.player) {
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

function init() {
  drawCards(5, playersSides.player);
  drawCards(5, playersSides.computer);
}

init();
