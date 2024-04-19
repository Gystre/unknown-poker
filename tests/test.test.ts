import { TexasHoldem } from "../src/index";

test("test", async () => {
  const table = new TexasHoldem();
  table.addOpponent(["As", "Ks"]);
  table.addOpponent(["5h", "Ts"]);
  table.setTable(["5h"]);
});
