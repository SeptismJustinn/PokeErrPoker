const suits = ["Clubs", "Diamonds", "Spades", "Hearts"];

/* Character class to store references to document's div elements:
#health-counter, #health-bar. Each character is generated with an alive = true status
and a maxHealth property, taken from #health-counter's innerText when object first created.
 */
class Character {
  constructor(healthBar, healthCounter) {
    // Store .health-bar div element.
    this.healthBar = healthBar;
    // Store .health-counter div element.
    this.healthCounter = healthCounter;
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
}

/* Player subclass to encapsulate functions that only human players will use,
such as drawing or playing cards.
*/
class Player extends Character {
  constructor(healthBar, healthCounter) {
    super(healthBar, healthCounter);
    // Player's current hand.
    this.hand = [];
    // Cards in the play area, might relocate to listener function.
    this.playedCards = [];
  }

  /* Function to recursively add cards to player's hand. Suit and card number is randomly generated,
  so card can be any of the 4 suits and any of the 13 numbers (10 + 3 specials).
  Card numbers stored as 2 digits (01 to 13) so that last 2 chars of string can be referenced.
  This simulates drawing from a deck of infinite poker cards.
  */
  draw(amt) {
    if (amt <= 0) {
      return;
    }
    // Randomize suit.
    let card = suits[Math.round(Math.random() * 4) - 1];
    // Randomize card number.
    const numb = Math.round(Math.random() * 13);
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
}

// Human player Character object
const humanPlayer = new Player(
  document.querySelector("#player-health-bar"),
  document.querySelector("#player-health-counter")
);

// Computer Character object
const computerPlayer = new Character(
  document.querySelector("#computer-health-bar"),
  document.querySelector("#player-health-counter")
);
