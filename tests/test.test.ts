import { TexasHoldem } from "../src/index";

test("test", async () => {
  for (let i = 0; i < 4; i++) {
    const table = new TexasHoldem();
    table.setPlayer(["Ah", "Kh"]);
    table.addOpponent([]);
    table.addOpponent([]);
    table.addOpponent([]);

    const results = table.calculate();
    console.log(results);
  }
});
