import { TexasHoldem } from "../src/index";

test("solveHand", () => {
  const table = new TexasHoldem(10000);
  table.setPlayer(["4h", "6s"]);
  table.setTable(["Ac", "6d", "Tc", "4c"]);

  //   console.time("solveHand");
  const hand = table.solveHand(["2s", "3c"]);
  //   console.timeEnd("solveHand");

  console.log(hand);
});
