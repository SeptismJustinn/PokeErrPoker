class Character {
  constructor(healthBar, healthCounter, player = true) {
    // Store .health-bar div element.
    this.healthBar = healthBar;
    // Store .health-counter div element.
    this.healthCounter = healthCounter;
    // Boolean to check if is human or computer.
    this.player = player;
    // Stores initial health as max health as characters should be generated with full health.
    this.maxHealth = Number(this.healthCounter.innerText);
    // Each character generated as alive.
    this.alive = true;
  }

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

const humanPlayer = new Character(
  document.querySelector("#player-health-bar"),
  document.querySelector("#player-health-counter")
);

const computerPlayer = new Character(
  document.querySelector("#computer-health-bar"),
  document.querySelector("#player-health-counter", false)
);
