// ----- Global/Initial variables -----

/* Suits based off classic elements
"e" for Earth suit, "f" for Fire suit, "s" for Storm or air suit, "w" for Water suit.
*/
const suits = ["e", "f", "s", "w"];
const suitsClasses = ["earth", "fire", "storm", "water"];
// Turn alternates between 0: player turn > 1: between > 2: Computer turn > 1 > 0 and so on.
let turn = 0;
// Array of messages to display each turn.
const turnMessages = ["Attack!", "\nAccept to continue", "Defend!"];
// Boolean switch to confirm restart.
let restartConfirm = false;
// Variable to store battle-text before restart.
let preRestartMessage = "";
// Variable to store dragged element.
let dragged = "";
// Boolean switch to check if game over.
let gameover = false;

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

// - Character Images -
const playerImg = document.querySelector("#player-image");
const computerImg = document.querySelector("#computer-image");

// Prepare for game start.
function initialize() {
  turn = 0;
  gameover = false;
  playElements.initialize();
  handElements.initialize();
  humanPlayer.initialize();
  computerPlayer.initialize();
  playerImg.src = "PlayerV1.png";
  computerImg.src = "ErrV1.png";
  if (playerTurn.classList.contains("block-text")) {
    swapTurn();
  }
}

// ----- Classes -----
// --- Card Classes ---
/* CardElements class to store reference to div elements designated for cards and their associated functions.
 */
class CardElements {
  constructor(cardArr) {
    // Store array of cardElements
    this.cardArr = cardArr;
    // Empty array on construction to store card strings from Player hand or Play area.
    this.cards = ["", "", "", "", ""];
  }

  // Counts number of occupied spaces to return number of cards present.
  getCardsLength() {
    let counter = 0;
    for (const item of this.cards) {
      if (item !== "") {
        counter++;
      }
    }
    return counter;
  }

  // Function to get indices of active card areas. CardElements has to have been synced before this function can be used.
  getOccupiedInd() {
    const indArr = [];
    for (let i = 0; i < this.cards.length; i++) {
      if (this.cards[i] !== "") {
        indArr.push(i);
      }
    }
    return indArr;
  }

  // Function to get indices of inactive card areas. CardElements has to have been synced before this function can be used.
  getEmptyInd() {
    const indArr = [];
    for (let i = 0; i < this.cards.length; i++) {
      if (this.cards[i] === "") {
        indArr.push(i);
      }
    }
    return indArr;
  }

  // Getter to return card element at index.
  cardEleAt(ind) {
    return this.cardArr[ind];
  }

  // Add cardStr to cards array.
  pushCardStr(cardStr) {
    for (let i = 0; i < this.cards.length; i++) {
      if (this.cards[i] === "") {
        this.cards[i] = cardStr;
        break;
      }
    }
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
  updateCardEle(cardInd, active = false) {
    const ele = this.cardArr[cardInd];
    const cardStr = active ? this.cards[cardInd] : "";
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

  /* Function to calculate score in this.cards. Only calculate first 5 cards since primarily used in play area.
  All 5 cards played are consumed to give the sum as move value. Bonus value is awarded for forming poker hands.
  Returns array, containing score and message describing hand played.
  */
  calculateScore() {
    // Parse this.cards to get suits info and numbers.
    let sameSuit = true;
    let lastSuit = "";
    // Message to indicated hand played.
    let message = "";
    // Sum of card values played.
    let numSum;
    const numberValues = [];
    // Iterate through first 5 cardStr.
    for (let i = 0; i < 5; i++) {
      // Check if any single card has a different suit from another, sameSuit = false if so.
      if (this.cards[i] === "") {
        continue;
      } else if (lastSuit === "") {
        lastSuit = this.cards[i].slice(0, 1);
      } else {
        if (this.cards[i].slice(0, 1) !== lastSuit) {
          sameSuit = false;
        }
      }
      // Convert number portion of card string and push to array.
      numberValues.push(Number(this.cards[i].slice(1)));
    }
    // Sort in numerical order.
    numberValues.sort((first, second) => first - second);
    // Check if sequential.
    let isSequence = true;
    numSum = numberValues.reduce(
      (accumulator, value) => accumulator + value,
      0
    );
    for (let i = 0; i < 4; i++) {
      isSequence = numberValues[i + 1] - numberValues[i] === 1;
      if (!isSequence) {
        break;
      }
    }
    if (sameSuit) {
      switch (lastSuit) {
        case "e":
          message = " of Earth!";
          break;
        case "f":
          message = " of Fire!";
          break;
        case "s":
          message = " of Storm!";
          break;
        case "w":
          message = " of Water!";
          break;
      }
      if (
        numberValues.includes(1) &&
        numberValues.includes(10) &&
        numberValues.includes(11) &&
        numberValues.includes(12) &&
        numberValues.includes(13)
      ) {
        // 1) Royal Flush (200 flat) - Same suit, A 10 J Q K
        return [200, "Royal Force" + message];
      } else if (isSequence) {
        // 2) Straight Flush (bonus 50) - Same suit, 5 in a row.
        return [numSum + 50, "Supreme Force" + message];
      } else {
        // 5) Flush (bonus 25) - Same suit, no sequence
        return [numSum + 25, message.slice(4, -1) + " Force!"];
      }
    } else if (isSequence) {
      // 6) Straight (bonus 20) - 5 in a row
      if (turn === 0) {
        return [numSum + 20, "Impale!"];
      } else {
        return [numSum + 20, "Impede!"];
      }
    } else {
      const numCount = {};
      let numStr;
      for (let i = 0; i < 5; i++) {
        numStr = String(numberValues[i]);
        if (Object.keys(numCount).includes(numStr)) {
          numCount[numStr] += 1;
        } else {
          numCount[numStr] = 1;
        }
      }
      // Flag for four of a kind present.
      let fourOfAKind = false;
      // Flag for three of a kind present.
      let threeOfAKind = false;
      // Flag for pair present.
      let pair = false;
      // Flag for 2 pairs.
      let pairOfPairs = false;
      // Iterate through numCount values to look at number counts. Loops up to 5 times if 5 high cards input.
      for (const num of Object.values(numCount)) {
        if (num >= 4) {
          fourOfAKind = true;
          break;
        } else if (num === 3) {
          threeOfAKind = true;
        } else if (num === 2) {
          if (pair) {
            pairOfPairs = true;
          } else {
            pair = true;
          }
        }
      }
      if (fourOfAKind) {
        // 3) Four of a kind (bonus 40)- 4 same numbers.
        if (turn === 0) {
          return [numSum + 40, "Stab Flurry!"];
        } else {
          return [numSum + 40, "Spin Deflect!"];
        }
      } else if (pairOfPairs) {
        // 8) Two Pairs - 2 same + 2 same (bonus 10)
        if (turn === 0) {
          return [numSum + 10, "Double Stab!"];
        } else {
          return [numSum + 10, "Double Step!"];
        }
      } else if (threeOfAKind) {
        if (pair) {
          // 4) Full House - 3 same + 2 same (bonus 30)
          if (turn === 0) {
            return [numSum + 30, "Full Impact!"];
          } else {
            return [numSum + 30, "Full Guard!"];
          }
        } else {
          // 7) Three of a kind (bonus 15) - 3 same
          if (turn === 0) {
            return [numSum + 15, "Triple Pierce!"];
          } else {
            return [numSum + 15, "Triple Jump!"];
          }
        }
      } else if (pair) {
        // 9) Pair (bonus 5)- 2 same
        if (turn === 0) {
          return [numSum + 5, "Thrust!"];
        } else {
          return [numSum + 5, "Handle Deflect!"];
        }
      } else {
        // 10) High Card (no bonus) - 1 card
        if (turn === 0) {
          return [numSum, "Slash!"];
        } else {
          return [numSum, "Stand Firm!"];
        }
      }
    }
  }

  // Function to sync card string array with card elements array.
  syncCardEle() {
    for (let i = 0; i < this.cards.length; i++) {
      if (this.cards[i] === "") {
        this.updateCardEle(i);
      } else {
        this.updateCardEle(i, true);
      }
    }
  }

  // Function to sync card elements array with card string array
  syncCardStr() {
    let cardString;
    let cardClassList;
    for (let i = 0; i < this.cardArr.length; i++) {
      cardClassList = this.cardArr[i].classList;
      if (cardClassList.contains("inactive-card")) {
        this.cards[i] = "";
      } else {
        if (cardClassList.contains("earth")) {
          cardString = "e";
        } else if (cardClassList.contains("fire")) {
          cardString = "f";
        } else if (cardClassList.contains("storm")) {
          cardString = "s";
        } else if (cardClassList.contains("water")) {
          cardString = "w";
        }

        switch (this.cardArr[i].innerText) {
          case "A":
            cardString += "01";
            break;
          case "J":
            cardString += "11";
            break;
          case "Q":
            cardString += "12";
            break;
          case "K":
            cardString += "13";
            break;
          case "10":
            cardString += "10";
            break;
          default:
            cardString += `0${this.cardArr[i].innerText}`;
        }
        this.cards[i] = cardString;
      }
    }
  }

  // Function to be passed through hand.sort();
  #cardSort(cardone, cardtwo) {
    if (cardone.charAt(0) === cardtwo.charAt(0) && cardone !== "") {
      // If same suit and not empty, sort by number value.
      return Number(cardone.slice(1)) - Number(cardtwo.slice(1));
    } else if (cardone !== "" && cardtwo !== "") {
      // If different suits and not empty,
      if (cardone.charAt(0) < cardtwo.charAt(0)) {
        // Return -1 to indicate that cardone's suit is alphabetically smaller.
        return -1;
      } else {
        // Return 1 if cardone's suit is alphabetically larger.
        return 1;
      }
    } else {
      return cardone === "" ? 1 : -1;
    }
  }
  // Custom sort function.
  sort() {
    this.cards.sort(this.#cardSort);
    this.syncCardEle();
  }

  // Static function to transfer card from an active area to an inactive area
  static transferCard(fromEle, toEle) {
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

    playElements.syncCardStr();
    handElements.syncCardStr();
  }

  // Static function to swap two active cards
  static swapCard(fromEle, toEle) {
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

    playElements.syncCardStr();
    handElements.syncCardStr();
  }

  // Prepare for new game.
  initialize() {
    this.cards = ["", "", "", "", ""];
    // Reset all cards to inactive, remove numbers and suit elements.
    for (let i = 0; i < this.cardArr.length; i++) {
      this.updateCardEle(i);
    }
  }
}

/* PlayerCardElements subclass to store references to player's card elements and possessed cards.
Contains functions that interact with player cards' elements and the player hand array.
*/
class PlayerCardElements extends CardElements {
  constructor(cardArr) {
    // Card Array of 10 card elements
    super(cardArr);
    this.cards = ["", "", "", "", "", "", "", "", "", ""];
  }

  /* Function to recursively add cards to player's hand. Suit and card number is randomly generated,
  so card can be any of the 4 suits and any of the 13 numbers (10 + 3 specials).
  Card numbers stored as 2 digits (01 to 13) so that last 2 chars of string can be referenced.
  This simulates drawing from a deck of infinite poker cards.
  */
  draw(amt) {
    if (amt <= 0) {
      this.syncCardEle();
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
    this.pushCardStr(card);
    // Recurse
    this.draw(amt - 1);
  }

  initialize() {
    super.initialize();
    this.cards = ["", "", "", "", "", "", "", "", "", ""];
  }
}

// --- Character Class ---
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
    this.damageBar.style.width = "100%";
    this.alive = true;
  }
}

// --- Class Objects ---
// Cards in the play area (0-4 for one-fiv)
const playElements = new CardElements([
  document.querySelector("#area-one"),
  document.querySelector("#area-two"),
  document.querySelector("#area-thr"),
  document.querySelector("#area-fou"),
  document.querySelector("#area-fiv"),
]);

// Cards in player's hand (0-9 for one-ten)
const handElements = new PlayerCardElements([
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
const humanPlayer = new Character(
  document.querySelector("#player-health-bar"),
  document.querySelector("#player-health-counter"),
  document.querySelector("#player-damage-bar")
);

// Computer Character object
const computerPlayer = new Character(
  document.querySelector("#computer-health-bar"),
  document.querySelector("#computer-health-counter"),
  document.querySelector("#computer-damage-bar")
);

// ----- Functions -----
// Function to update battle-info based on array returned by CardElements.calculateScore().
function updateBattleInfo(infoArr) {
  playedValue.innerText = infoArr[0];
  battleText.innerText = infoArr[1];
}

// Function to update comptuer move value.
function updateCPUInfo(roll) {
  computerValue.innerText = roll;
}

/* Function to generate CPU move value. Returns at least 10 move value.
Math.random transformed exponentially to make it less likely to roll high numbers.
*/
function rollCPU() {
  const roll = Math.round(Math.random() ** 3 * 50);
  return roll >= 10 ? roll : 10;
}

// Function for juggling turns around. If player attacked last turn, they are defending now and vice versa for computer.
function swapTurn() {
  const tempTurn = playerTurn.innerText;
  playerTurn.innerText = computerTurn.innerText;
  computerTurn.innerText = tempTurn;
  if (playerTurn.classList.contains("damage-text")) {
    playerTurn.classList.remove("damage-text");
    playerTurn.classList.add("block-text");
  } else {
    playerTurn.classList.remove("block-text");
    playerTurn.classList.add("damage-text");
  }
  if (computerTurn.classList.contains("block-text")) {
    computerTurn.classList.remove("block-text");
    computerTurn.classList.add("damage-text");
  } else {
    computerTurn.classList.remove("damage-text");
    computerTurn.classList.add("block-text");
  }
}

// Function to check if any player is dead and cue win or end game. Otherwise do nothing.
// Boolean return value used to check if accept button is to be re-enabled in progressTurn.
function checkDed() {
  if (!humanPlayer.alive) {
    gameWin(false);
    return true;
  } else if (!computerPlayer.alive) {
    gameWin(true);
    return true;
  } else {
    return false;
  }
}

function gameWin(winCheck) {
  // Remove numeric battle-info elements.
  gameover = true;
  versus.classList.add("inactive-info");
  playedValue.classList.add("inactive-info");
  playerTurn.classList.add("inactive-info");
  computerValue.classList.add("inactive-info");
  computerTurn.classList.add("inactive-info");
  acceptButton.disabled = true;
  sortButton.disabled = true;
  handElements.initialize();
  if (winCheck) {
    // Player wins.
    battleText.innerText =
      "You win! Err is slain!\nRestart to challenge Err again!";
    computerImg.src = "ErrV1-down.png";
  } else {
    // Computer wins
    battleText.innerText =
      "You are defeated,\nErr rampages along...\nRestart to try again";
    playerImg.src = "PlayerV1-down.png";
  }
}

// --- Button Functions ---
// Start game function, initialize game, disables start button and enables the others.
function startGame() {
  initialize();
  setTimeout(() => {
    handElements.draw(10);
    sortButton.disabled = false;
    restartButton.disabled = false;
    versus.classList.remove("inactive-info");
    playedValue.classList.remove("inactive-info");
    playerTurn.classList.remove("inactive-info");
    computerValue.classList.remove("inactive-info");
    computerTurn.classList.remove("inactive-info");
    battleText.innerText = "You have the first attack!";
    playedValue.innerText = 0;
    updateCPUInfo(rollCPU());
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
    if (playElements.getCardsLength() < 1) {
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
  if (playElements.getCardsLength().length < 1) {
    // Disabled return button if no cards have been played, as it should be in this case.
    returnButton.disabled = true;
  }
}

// Accept button function to progress to the next turn, based on let turn variable.
function progressTurn() {
  // Temporarily disable accept button to give reading time.
  acceptButton.disabled = true;
  const acceptDelay = setTimeout(() => {
    acceptButton.disabled = false;
  }, 500);
  let netMoveValue = 0;
  switch (turn) {
    case 0:
      // Player attack. No takebacks.
      returnButton.disabled = true;
      // Net value of move after deducting player attack from computer defence. To be passed into updateHealth.
      netMoveValue =
        Number(computerValue.innerText) - Number(playedValue.innerText);
      if (netMoveValue < 0) {
        // If player does more damage than computer defence,
        computerPlayer.updateHealth(netMoveValue);
        battleText.innerText = `You attack for ${netMoveValue * -1} damage! ${
          turnMessages[1]
        }`;
      } else {
        battleText.innerText = `Err shrugs off your attack! ${turnMessages[1]}`;
      }
      turn++;
      break;
    case 1:
      // Consolidate health bars.
      humanPlayer.updateDamage();
      computerPlayer.updateDamage();
      // Clear play area.
      playElements.initialize();
      if (checkDed()) {
        clearTimeout(acceptDelay);
      } else {
        turn++;
        battleText.innerText = turnMessages[turn];
        // Update CPU move value and reset player move value.
        updateCPUInfo(rollCPU());
        playedValue.innerText = 0;
        // Swap turns around.
        swapTurn();
        // Refill hand.
        handElements.draw(5);
      }
      break;
    case 2:
      // Player defence. No takebacks.
      returnButton.disabled = true;
      // Net value of move after deducting computer attack from player defence. To be passed into updateHealth.
      netMoveValue =
        Number(playedValue.innerText) - Number(computerValue.innerText);
      if (netMoveValue < 0) {
        // If player does more damage than computer defence,
        humanPlayer.updateHealth(netMoveValue);
        battleText.innerText = `Err attacks for ${netMoveValue * -1} damage! ${
          turnMessages[1]
        }`;
      } else {
        battleText.innerText = `Your defence negates Err's attack! ${turnMessages[1]}`;
      }
      turn++;
      break;
    case 3:
      humanPlayer.updateDamage();
      computerPlayer.updateDamage();
      // Clear play area.
      playElements.initialize();
      if (checkDed()) {
        clearTimeout(acceptDelay);
      } else {
        turn = 0;
        battleText.innerText = turnMessages[turn];
        // Update CPU move value and reset player move value.
        updateCPUInfo(rollCPU());
        playedValue.innerText = 0;
        // Swap turns around.
        swapTurn();
        // Refill hand.
        handElements.draw(5);
      }
      break;
  }
}

// Return button function to return all cards played.
function returnCard() {
  // Get array of indices of occupied play area slots.
  const occupiedPlay = playElements.getOccupiedInd();
  // Get array of indices of empty hand area slots.
  const emptyHand = handElements.getEmptyInd();
  for (let i = 0; i < occupiedPlay.length; i++) {
    CardElements.transferCard(
      playElements.cardEleAt(occupiedPlay[i]),
      handElements.cardEleAt(emptyHand[i])
    );
  }
  // Since all elements returned, disable return button and restore default turn message.
  returnButton.disabled = true;
  updateBattleInfo([0, turnMessages[turn]]);
}

// Sort button function to sort player hand.
function sortHand() {
  handElements.sort();
}

// --- Card Area Functions ---
/* There will always be 10/15 active cards in game. When card is played, the 5 inactive cards also shift around.
Each time card is moved into play area, push the card into filoQueue. If the card is moved out of play area, remove from filoQueue.
Pop filoQueue from end if return button is hit.
*/
function dragStart(pointer) {
  // Bind dragged element to dragged variable.
  if (
    pointer.target.classList.contains("inactive-card") ||
    !pointer.target.classList.contains("play-area-card") ||
    !pointer.target.classList.contains("player-hand-card")
  ) {
    return;
  }
  dragged = pointer.target;
}

// Function to drag card element from one card area to another.
function dragDrop(pointer) {
  pointer.preventDefault();
  // If card was dragged out of an area then returned to the exact same area, ignore the move.
  if (pointer.target === dragged || dragged === "") {
    return;
  }
  // Otherwise, obtain dropped target's classList
  const targetList = pointer.target.classList;
  if (
    targetList.contains("play-area-card") ||
    targetList.contains("player-hand-card")
  ) {
    // If droppped target is an appropriate area,
    if (targetList.contains("inactive-card")) {
      // Transfer card from dragged area to dropped area.
      CardElements.transferCard(dragged, pointer.target);
    } else {
      // Swap cards between dragged area and dropped area.
      CardElements.swapCard(dragged, pointer.target);
    }
  }
  // Enable return button if more than 1 element in play area.
  returnButton.disabled = playElements.getCardsLength() < 1;
  // Enable accept button if 5 cards have been played.
  acceptButton.disabled = playElements.getCardsLength() !== 5;
  if (playElements.getCardsLength() === 5) {
    // If 5 cards have been played, calculate score and display message.
    updateBattleInfo(playElements.calculateScore());
  } else {
    // Otherwise, revert to default message and clear damage value.
    updateBattleInfo([0, turnMessages[turn]]);
  }
}

function dragEnd() {
  // Reset dragged variable.
  dragged = "";
}

// On card click, move card to available empty slots, ignore otherwise.
function cardClick(pointer) {
  const targetList = pointer.target.classList;
  if (targetList.contains("inactive-card")) {
    // Ignore move if inactive card clicked.
    return;
  } else if (targetList.contains("player-hand-card")) {
    // If player hand card is clicked, check for empty spaces in play area.
    const targetIndices = playElements.getEmptyInd();
    if (targetIndices.length === 0) {
      // If no empty spaces, ignore the click.
      return;
    }
    CardElements.transferCard(
      pointer.target,
      playElements.cardEleAt(targetIndices[0])
    );
  } else if (targetList.contains("play-area-card")) {
    // If play area card is clicked, return to first empty space from the left.
    const targetIndices = handElements.getEmptyInd();
    if (targetIndices.length === 0) {
      // If no empty spaces, ignore the click.
      return;
    }
    CardElements.transferCard(
      pointer.target,
      handElements.cardEleAt(targetIndices[0])
    );
  }
  // Enable return button if more than 1 element in play area.
  returnButton.disabled = playElements.getCardsLength() < 1;
  // Enable accept button if 5 cards have been played.
  acceptButton.disabled = playElements.getCardsLength() !== 5;

  if (playElements.getCardsLength() === 5) {
    // If 5 cards have been played, calculate score and display message.
    updateBattleInfo(playElements.calculateScore());
  } else if (gameover) {
    // Do nothing if game is over, this flag prevents calling updateBattleInfo.
    return;
  } else {
    // Otherwise, revert to default message and clear damage value.
    updateBattleInfo([0, turnMessages[turn]]);
  }
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
playArea.addEventListener("click", cardClick);

// - Player Hand Area -
handArea.addEventListener("dragstart", dragStart);
handArea.addEventListener("dragover", (pointer) => {
  pointer.preventDefault();
});
handArea.addEventListener("drop", dragDrop);
handArea.addEventListener("dragend", dragEnd);
handArea.addEventListener("click", cardClick);

//#region ----- Debug Functions -----
function generateRF() {
  playElements.cards = ["e01", "e10", "e11", "e12", "e13"];
  playElements.syncCardEle();
}

function generateSF() {
  playElements.cards = ["e09", "e10", "e11", "e12", "e13"];
  playElements.syncCardEle();
}

function generateFOK() {
  playElements.cards = ["e13", "s13", "f13", "w13", "e13"];
  playElements.syncCardEle();
}

function generateTOK() {
  playElements.cards = ["e13", "s13", "f13", "w12", "e11"];
  playElements.syncCardEle();
}

function generateFH() {
  playElements.cards = ["e13", "s13", "f13", "w12", "e12"];
  playElements.syncCardEle();
}

function generateTP() {
  playElements.cards = ["e13", "s13", "f11", "w12", "e12"];
  playElements.syncCardEle();
}

function generateFlush() {
  playElements.cards = ["e08", "e10", "e11", "e12", "e13"];
  playElements.syncCardEle();
}

function testRoll() {
  let lo = 0;
  let me = 0;
  let hi = 0;
  let roll;
  for (let i = 0; i < 100; i++) {
    roll = rollCPU();
    if (roll === 10) {
      lo++;
    } else if (roll > 33) {
      hi++;
    } else {
      me++;
    }
  }
  console.log(`${hi} greater than 33 rolls, ${me} 11-33 rolls, ${lo} 10 rolls`);
}

function forceWin() {
  gameWin(true);
}

function forceLose() {
  gameWin(false);
}
//#endregion
