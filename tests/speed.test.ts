import { TexasHoldem } from "../src/index";

/*
This is a terrible way to test bc I can't test previous versions of the package
and using numbers from a different testing environment will give inconsistent results

So this is just here to give me an idea of how optimizations are working ig
*/

test("speed", async () => {
  const table = new TexasHoldem();
  table.setPlayer(["Kd", "6s"]);
  table.setTable(["Ah", "3h", "2c", "5c", "8d"]);
  table.addOpponent([]);
  table.addOpponent([]);
  table.addOpponent([]);
  table.addOpponent([]);
  table.addOpponent([]);
  table.addOpponent([]);
  table.addOpponent([]);
  table.addOpponent([]);

  const NUM_RUNS = 5;

  // run a speed test 5 times and take the average
  let total = 0;
  for (let i = 0; i < NUM_RUNS; i++) {
    const start = Date.now();
    table.calculate();
    total += Date.now() - start;
  }
  console.log(`Avg time taken (${NUM_RUNS} runs): `, total / NUM_RUNS, "ms");
});
