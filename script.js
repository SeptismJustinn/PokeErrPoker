// ----- Global/Initial variables -----

/* Suits based off classic elements
"e" for Earth suit, "f" for Fire suit, "s" for Storm or air suit, "w" for Water suit.
*/
const suits = ["e", "f", "s", "w"];
const suitsClasses = ["earth", "fire", "storm", "water"];
// Cards being played for this round. Up to 5 cards played per round.
const playedCards = [];
// Turn alternates between 0: player turn > 1: between > 2: Computer turn > 1 > 0 and so on.
let turn = 0;
// Boolean switch to confirm restart.
let restartConfirm = false;
// Variable to store battle-text before restart.
let preRestartMessage = "";
// Variable to store dragged element.
let dragged;

// --- Elements to listen to ---
// - Buttons -
const startButton = document.querySelector("#start-button");
const restartButton = document.querySelector("#restart-button");
const acceptButton = document.querySelector("#accept-move-button");
const returnButton = document.querySelector("#return-move-button");
const sortButton = document.querySelector("#sort-hand-button");

// - Texts -
const battleText = document.querySelector("#battle-text");
const playedValue = document.querySelector("#played-value");
const computerValue = document.querySelector("#computer-value");
const playerTurn = document.querySelector("#player-turn");
const computerTurn = document.querySelector("#computer-turn");
const versus = document.querySelector("#versus");

// - Card Areas -
const playArea = document.querySelector("#play-area");
const handArea = document.querySelector("#player-hand");

// Prepare for game start.
function initialize() {
  playedCards.splice(0);
  areaElements.initialize();
  humanPlayer.initialize();
  computerPlayer.initialize();
}

// ----- Classes -----
/* CardElements class to store reference to div elements designated for cards and their associated functions.
 */
class CardElements {
  constructor(cardArr) {
    // Store array of cardElements
    this.cardArr = cardArr;
  }

  // Return cardElement according to index
  get(cardInd) {
    return this.cardArr[cardInd];
  }

  // Function to update number on card.
  printNum(cardEle, cardNum) {
    switch (cardNum) {
      case 1:
        // Ace
        cardEle.innerHTML = "A";
        break;
      case 11:
        // Jack
        cardEle.innerHTML = "J";
        break;
      case 12:
        // Queen
        cardEle.innerHTML = "Q";
        break;
      case 13:
        // King
        cardEle.innerHTML = "K";
        break;
      default:
        // Number
        cardEle.innerHTML = cardNum;
    }
    // If assigned a number, a suit will have already been assigned, therefore card is active and should be draggable.
    cardEle.draggable = true;
  }

  // Function to update card element with card string.
  updateCard(cardInd, cardStr = "") {
    const ele = this.cardArr[cardInd];
    for (const cardSuit of suitsClasses) {
      ele.classList.remove(cardSuit);
    }
    switch (cardStr.charAt(0)) {
      case "e":
        // Earth suit
        ele.classList.remove("inactive-card");
        ele.classList.add("earth");
        this.printNum(ele, Number(cardStr.slice(-2)));
        break;
      case "f":
        // Fire suit
        ele.classList.remove("inactive-card");
        ele.classList.add("fire");
        this.printNum(ele, Number(cardStr.slice(-2)));
        break;
      case "s":
        // Storm suit
        ele.classList.remove("inactive-card");
        ele.classList.add("storm");
        this.printNum(ele, Number(cardStr.slice(-2)));
        break;
      case "w":
        // Water suit
        ele.classList.remove("inactive-card");
        ele.classList.add("water");
        this.printNum(ele, Number(cardStr.slice(-2)));
        break;
      default:
        // Deactivate card
        ele.classList.add("inactive-card");
        ele.innerHTML = "";
        // Make deactivated cards non-draggable.
        ele.draggable = false;
    }
  }

  // Function to transfer card from an active area to an inactive area
  transferCard(fromEle, toEle) {
    // Add number to toEle
    toEle.innerText = fromEle.innerText;
    // Remove number from fromEle
    fromEle.innerText = "";

    // Check what suit fromEle possesses
    for (const suit of suitsClasses) {
      if (fromEle.classList.contains(suit)) {
        // Add suit to toEle
        toEle.classList.add(suit);
        // Remove suit from fromEle
        fromEle.classList.remove(suit);
        break;
      }
    }
    // Activate toEle
    toEle.classList.remove("inactive-card");
    toEle.draggable = true;

    // Deactivate fromEle
    fromEle.classList.add("inactive-card");
    fromEle.draggable = false;
  }

  // Function to swap two active cards
  swapCard(fromEle, toEle) {
    // Swap numbers
    const tempText = toEle.innerText;
    toEle.innerText = fromEle.innerText;
    fromEle.innerText = tempText;

    // Swap suits
    let toSuit;
    let fromSuit;
    // Find out what each card's suits are
    for (const suit of suitsClasses) {
      if (fromEle.classList.contains(suit)) {
        fromSuit = suit;
      }
      if (toEle.classList.contains(suit)) {
        toSuit = suit;
      }
    }
    // Swap suits over if they are not the same, otherwise leave it.
    if (toSuit !== fromSuit) {
      fromEle.classList.remove(fromSuit);
      toEle.classList.remove(toSuit);
      fromEle.classList.add(toSuit);
      toEle.classList.add(fromSuit);
    }
  }

  // Prepare for new game.
  initialize() {
    // Reset all cards to inactive, remove numbers and suit elements.
    for (let i = 0; i < this.cardArr.length; i++) {
      this.updateCard(i);
    }
  }
}

/* Character class to store references to document's div elements:
#health-counter, #health-bar. Each character is generated with an alive = true status
and a maxHealth property, taken from #health-counter's innerText when object first created.
 */
class Character {
  constructor(healthBar, healthCounter, damageBar) {
    // Store .health-bar div element.
    this.healthBar = healthBar;
    // Store .health-counter div element.
    this.healthCounter = healthCounter;
    // Store .damage-bar div element.
    this.damageBar = damageBar;
    // Stores initial health as max health as characters should be generated with full health.
    this.maxHealth = Number(this.healthCounter.innerText);
    // Each character generated as alive.
    this.alive = true;
  }

  /* Method to update health of character by amt. Amt expected to be a positive or negative number.
  If character's health is depleted, set health to 0 instead and deplete health bar.
  */
  updateHealth(amt) {
    const currHealth = Number(this.healthCounter.innerText) + amt;
    if (currHealth > 0) {
      this.healthCounter.innerText = currHealth;
      this.healthBar.style.width = `${Math.round(
        (currHealth / this.maxHealth) * 100
      )}%`;
    } else {
      this.healthCounter.innerText = 0;
      this.healthBar.style.width = 0;
      this.alive = false;
      // Insert ded function?
    }
  }

  // Method to update damage bar and hide it behind health bar.
  updateDamage() {
    this.damageBar.style.width = this.healthBar.style.width;
  }

  // Prepare for new game, reset char stats.
  initialize() {
    this.healthCounter.innerText = this.maxHealth;
    this.healthBar.style.width = "100%";
    this.alive = true;
  }
}

/* Player subclass to encapsulate functions that only human players will use,
such as drawing or playing cards.
*/
class Player extends Character {
  constructor(healthBar, healthCounter, damageBar, deckRef) {
    super(healthBar, healthCounter, damageBar);
    // Player's current hand.
    this.hand = [];
    // Reference to CardDeck class object that stores class elements.
    this.deckRef = deckRef;
  }

  updateCardEle() {
    for (let i = 0; i < 10; i++) {
      if (i >= this.hand.length) {
        this.deckRef.updateCard(i);
      } else {
        this.deckRef.updateCard(i, this.hand[i]);
      }
    }
  }

  /* Function to recursively add cards to player's hand. Suit and card number is randomly generated,
  so card can be any of the 4 suits and any of the 13 numbers (10 + 3 specials).
  Card numbers stored as 2 digits (01 to 13) so that last 2 chars of string can be referenced.
  This simulates drawing from a deck of infinite poker cards.
  */
  draw(amt) {
    if (amt <= 0) {
      this.updateCardEle();
      return;
    }
    // Randomize suit, generates 0 to 3.99...96, floored to 0 to 3.
    let card = suits[Math.floor(Math.random() * 4)];

    /* Randomize card number, generates 0 to 11.99...988, 
       ceiling'd to 0 to 12, incremented to 1 to 13.
    */
    const numb = Math.floor(Math.random() * 13) + 1;
    if (numb < 10) {
      // Ensures 2 digit card numbers.
      card += 0;
    }
    // Concatenate to suit string.
    card += numb;
    // Add card to Player hand.
    this.hand.push(card);
    // Recurse
    this.draw(amt - 1);
  }

  // Function to be passed through hand.sort();
  #cardSort(cardone, cardtwo) {
    if (cardone.charAt(0) === cardtwo.charAt(0)) {
      // If same suit, sort by number value.
      return Number(cardone.slice(1)) - Number(cardtwo.slice(1));
    } else {
      // If different suits,
      if (cardone.charAt(0) < cardtwo.charAt(0)) {
        // Return -1 to indicate that cardone's suit is alphabetically smaller.
        return -1;
      } else {
        // Return 1 if cardone's suit is alphabetically larger.
        return 1;
      }
    }
  }
  // Custom sort function.
  sort() {
    this.hand.sort(this.#cardSort);
    this.updateCardEle();
  }

  // Prepare for new game. Also reset player's cards.
  initialize() {
    super.initialize();
    this.hand.splice(0);
    this.deckRef.initialize();
  }
}

// --- Class Objects ---
// Cards in the play area (0-4 for one-fiv)
const areaElements = new CardElements([
  document.querySelector("#area-one"),
  document.querySelector("#area-two"),
  document.querySelector("#area-thr"),
  document.querySelector("#area-fou"),
  document.querySelector("#area-fiv"),
]);

// Cards in player's hand (0-9 for one-ten)
const cardElements = new CardElements([
  document.querySelector("#card-one"),
  document.querySelector("#card-two"),
  document.querySelector("#card-thr"),
  document.querySelector("#card-fou"),
  document.querySelector("#card-fiv"),
  document.querySelector("#card-six"),
  document.querySelector("#card-sev"),
  document.querySelector("#card-eig"),
  document.querySelector("#card-nin"),
  document.querySelector("#card-ten"),
]);

// Human player Character object
const humanPlayer = new Player(
  document.querySelector("#player-health-bar"),
  document.querySelector("#player-health-counter"),
  document.querySelector("#player-damage-bar"),
  cardElements
);

// Computer Character object
const computerPlayer = new Character(
  document.querySelector("#computer-health-bar"),
  document.querySelector("#player-health-counter"),
  document.querySelector("#computer-damage-bar")
);

// ----- Functions -----
// --- Button Functions ---
// Start game function, initialize game, disables start button and enables the others.
function startGame() {
  initialize();
  setTimeout(() => {
    humanPlayer.draw(10);
    acceptButton.disabled = false;
    sortButton.disabled = false;
    restartButton.disabled = false;
    versus.classList.remove("inactive-info");
    playedValue.classList.remove("inactive-info");
    playerTurn.classList.remove("inactive-info");
    computerValue.classList.remove("inactive-info");
    computerTurn.classList.remove("inactive-info");
    battleText.innerText = "You have the first attack!";
  }, 100);
  startButton.disabled = true;
}

// Function called on restart button click, different functionality based on restartConfirm switch
function confirmRestart() {
  if (!restartConfirm) {
    // If first click, commandeer battle-text and damage-info to display confirmation message.
    // Switch restartConfirm.
    restartConfirm = true;
    // Store battle-text at point of restart button click.
    preRestartMessage = battleText.innerText;
    // Display confirmation message.
    battleText.innerText =
      "Really restart?\n\nClick restart again to confirm or return to resume";
    // Disables damage-info texts.
    versus.classList.add("inactive-info");
    playedValue.classList.add("inactive-info");
    playerTurn.classList.add("inactive-info");
    computerValue.classList.add("inactive-info");
    computerTurn.classList.add("inactive-info");
    // Enable button in case it was still disabled.
    returnButton.disabled = false;
    // Remove default functionality of returnButton.
    returnButton.removeEventListener("click", returnCard);
    // Add new function to cancel restart.
    returnButton.addEventListener("click", cancelRestart, { once: true });
  } else {
    // Otherwise, re-initialize game.
    startGame();
    // Reset restartConfirm switch.
    restartConfirm = false;
    preRestartMessage = "";
    if (playedCards.length < 1) {
      // Disabled return button if no cards have been played, as it should be in this case.
      returnButton.disabled = true;
    }
    // Remove cancelRestart function of return button so that it does not linger for the next game session.
    returnButton.removeEventListener("click", cancelRestart);
    // Restore normal return button functionality.
    returnButton.addEventListener("click", returnCard);
  }
}

// Function called on return button click, after first restart button click.
function cancelRestart() {
  // Restore original functionality
  returnButton.addEventListener("click", returnCard);
  restartConfirm = false;
  // Restore battle-text and damage-info to pre-restart conditions.
  battleText.innerText = preRestartMessage;
  preRestartMessage = "";
  versus.classList.remove("inactive-info");
  playedValue.classList.remove("inactive-info");
  playerTurn.classList.remove("inactive-info");
  computerValue.classList.remove("inactive-info");
  computerTurn.classList.remove("inactive-info");
  if (playedCards.length < 1) {
    // Disabled return button if no cards have been played, as it should be in this case.
    returnButton.disabled = true;
  }
}

// Accept button function to progress to the next turn, based on let turn variable.
function progressTurn() {}

// Return button function to return last card played.
function returnCard() {}

// Sort button function to sort player hand.
function sortHand() {
  humanPlayer.sort();
}

// --- Card Area Functions ---
function dragStart(pointer) {
  dragged = pointer.target;
}

function dragDrop(pointer) {
  pointer.preventDefault();
  if (
    pointer.target.classList.contains("play-area-card") ||
    pointer.target.classList.contains("player-hand-card")
  ) {
    if (pointer.target.classList.contains("inactive-card")) {
      areaElements.transferCard(dragged, pointer.target);
    } else {
      areaElements.swapCard(dragged, pointer.target);
    }
  }
}

function dragEnd() {
  dragged = "";
}

// ----- Event Listening -----
// --- Menu Buttons ---
startButton.addEventListener("click", startGame, { once: true });
restartButton.addEventListener("click", confirmRestart);
acceptButton.addEventListener("click", progressTurn);
// To-Do, have restart button pause return button functionality, to then use return button to revert from restartConfirm = true
returnButton.addEventListener("click", returnCard);
sortButton.addEventListener("click", sortHand);

// --- Card Listeners ---
// - Play Area -
playArea.addEventListener("dragstart", dragStart);
playArea.addEventListener("dragover", (pointer) => {
  pointer.preventDefault();
});
playArea.addEventListener("drop", dragDrop);
playArea.addEventListener("dragend", dragEnd);

// - Player Hand Area -
handArea.addEventListener("dragstart", dragStart);
handArea.addEventListener("dragover", (pointer) => {
  pointer.preventDefault();
});
handArea.addEventListener("drop", dragDrop);
handArea.addEventListener("dragend", dragEnd);
