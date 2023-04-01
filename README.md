# PokeErrPoker

Poker-inspired card combat HTML game, in which a player faces off against an RNG-driven computer opponent. Each turn, the player plays poker hands, either to attack the computer or to defend against its own attacks. However, the computer will also roll its own set of moves to diminish the player's attacks or overcome their defences.

To display the character elements, the page layout was setup such that the player character was visible on the left side of the page and the computer character on the right side, these elements flanking a space in the center of the page dedicated to displaying cards that would be played and information about what was occurring during a turn. The bottom half of the screen was primarily occupied by the player's hand and game controls, such as buttons to start/restart the game or to accept/reset moves.

A script was written in JavaScript to provide game logic, generating the cards that would compose the player's hand, providing logic to calculate the value of the player's moves depending on the cards played as well as A.I. logic for the computer's moves, primarily based on JavaScript's Math.random function to dictate the computer's action.

In order to make the game take up as much space on the page as possible to facilitate visibility of elements, a major hurdle encountered was to account for varying screen sizes.
