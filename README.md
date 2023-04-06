# PokeErrPoker - https://septismjustinn.github.io/PokeErrPoker/

## Concept

"Slay the Spire"-inspired poker card combat HTML game, in which a player faces off against an RNG-driven computer opponent.

### Gameplay

Each turn, the player plays poker hands, either to attack the computer or to defend against its own attacks. However, the computer will also roll its own set of moves to diminish the player's attacks or overcome their defences.

Player chooses from a randomly drawn set of 10 cards. Cards are numbered from 2 to 9 or are picture cards (A, J, Q, K)

## Technologies used

### HTML

HTML was used to set up the page. All elements used are present and hidden via the script's switching of the elements class and consequently the class-associated css styling.

To display the character elements, the page layout was setup such that the player character was visible on the left side of the page and the computer character on the right side, these elements flanking a space in the center of the page dedicated to displaying cards that would be played and information about what was occurring during a turn. The bottom half of the screen was primarily occupied by the player's hand and game controls, such as buttons to start/restart the game or to accept/reset moves.

### CSS

A CSS was used to shape and position the HTML elements. Class-specific styling was heavily utilized to provide graphics for suits or to hide inactive elements.

### JavaScript

A script was written in JavaScript to provide game logic, randomizing the cards to compromise the player's hand and functions to update

## Challenges

In order to make the game take up as much space on the page as possible to facilitate visibility of elements, a major hurdle encountered was to account for varying screen sizes.

Due to the interactability of the many HTML elements in the page, another big challenge was to discover and test for every case of elements being clicked or dragged and to ensure that correct elements were being interacted with and the correct output was obtained.
