import { TexasHoldem } from "../src/index";

test("test", async () => {
  const table = new TexasHoldem();
  table.setPlayer(["Ah", "Kh"]);
  table.addOpponent([], "bob");
  table.addOpponent([], "bruh");
  table.addOpponent([]);

  const results = table.calculate();
  console.log(results.yourHandChances);
  console.log(results.yourHandChances);
  console.log(results.winnerChances);
});
