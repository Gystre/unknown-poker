import { TexasHoldem } from "../src/index";

test("test", async () => {
  const table = new TexasHoldem();
  table.setPlayer(["Ah", "Kh"]);
  table.addOpponent([], "bob");
  table.addOpponent([], "bruh");
  table.addOpponent([]);

  // start timer
  const start = Date.now();

  const results = table.calculate();

  console.log("Time taken: ", Date.now() - start, "ms");

  console.log(results.winChance, results.tieChance, results.loseChance);
  // console.log(results.winnerChances);
});
