# unknown-poker

[![Latest Stable Version](https://img.shields.io/npm/v/unknown-poker.svg)](https://www.npmjs.com/package/unknown-poker)

Poker odds calculator with support for unknown cards. Uses the monte carlo simulation from omni calculator (https://www.omnicalculator.com/other/poker-odds) and poker-solver (https://github.com/goldfire/pokersolver/). Not the fastest thing in the world but it gets the job done.

## Usage

```
import { TexasHoldem } from "unknown-poker";

const table = new TexasHoldem();
table.setPlayer(["Ah", "Kh"]); // must always set the player's hand
table.addOpponent([]); // opponent hands can be empty or have cards in them
table.addOpponent([], "bob"); // you can also give your opponents names to make the results easier to understand
table.addOpponent([]);

const results = table.calculate();
console.log(results);
```
