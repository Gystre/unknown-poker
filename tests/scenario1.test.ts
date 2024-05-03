import { TexasHoldem } from "../src/index";

test("scenario1", async () => {
  const table = new TexasHoldem(10000);
  table.setPlayer(["4h", "6s"]);
  table.setTable(["Ac", "6d", "Tc", "4c"]);
  table.addOpponent([]);
  table.addOpponent([]);
  table.addOpponent([]);
  table.addOpponent([]);
  table.addOpponent([]);

  const results = table.calculate();

  expect(results.winChance).toBeCloseTo(0.35, 1);

  console.log("win chance is ", results.winChance, "which is close to 0.35");
});
