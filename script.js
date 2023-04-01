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

// --- Elements to listen to ---
// - Buttons -
const startButton = document.querySelector("#start-button");
const restartButton = document.querySelector("#restart-button");
const acceptButton = document.querySelector("#accept-move-button");
const returnButton = document.querySelector("#return-move-button");
const sortButton = document.querySelector("#sort-hand-button");

function initialize() {
  playedCards.splice(0);
  const allCards = [];
  allCards.push(...areaCards, ...cardHand);

  // Reset all cards to inactive, remove numbers and suit elements.
  for (const cardElement of allCards) {
    cardElement.innerHTML = "";
    cardElement.classList.add("inactive-card");
    for (const cardSuit of suitsClasses) {
      cardElement.classList.remove(cardSuit);
    }
  }
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
}

/* Player subclass to encapsulate functions that only human players will use,
such as drawing or playing cards.
*/
class Player extends Character {
  constructor(healthBar, healthCounter, deckRef) {
    super(healthBar, healthCounter);
    // Player's current hand.
    this.hand = [];
    // Reference to CardDeck class object that stores class elements.
    this.deckRef = deckRef;
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

// Function to update card element with card string.
function updateCard(cardEle, cardStr) {
  switch (cardStr.charAt(0)) {
    case "e":
      break;
    case "f":
      break;
    case "s":
      break;
    case "w":
      break;
  }
}

// ----- Event Listening -----
startButton.addEventListener("click", (pointer) => {
  initialize();
  humanPlayer.draw(10);
});
