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
}

// Human player Character object
const humanPlayer = new Character(
  document.querySelector("#player-health-bar"),
  document.querySelector("#player-health-counter")
);

// Computer Character object
const computerPlayer = new Character(
  document.querySelector("#computer-health-bar"),
  document.querySelector("#player-health-counter")
);
