# unknown-poker

[![Latest Stable Version](https://img.shields.io/npm/v/unknown-poker.svg)](https://www.npmjs.com/package/unknown-poker)

Poker odds calculator with support for unknown cards. Uses a modified monte carlo simulation from omni calculator (https://www.omnicalculator.com/other/poker-odds) and poker-solver (https://github.com/goldfire/pokersolver/). Not the fastest thing in the world but it gets the job done.

## Usage

```
import { TexasHoldem } from "unknown-poker";

const table = new TexasHoldem();

// must always set the player's hand
table.setPlayer(["Ah", "Kh"]);

// opponent hands can be empty
table.addOpponent([]);

// or have cards in them
table.addOpponent(["2s", "4c"]);

// mark opponents as having folded in the optional js object
table.addOpponent([], {
	folded: true,
});

// you can also add names to your opponents to make them easier to identify in the results
table.addOpponent([], {
	name: "bruh2",
});

const results = table.calculate();
console.log(results);
```
