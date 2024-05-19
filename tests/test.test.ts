import { TexasHoldem } from "../src/index";
// import fs from "fs";
// const v8Profiler = require("v8-profiler-next");

test("test", async () => {
  // v8Profiler.setGenerateType(1);

  const table = new TexasHoldem();
  table.setPlayer(["Kd", "6s"]);
  table.setTable(["5d", "3h", "Kh", "4c", "8h"]);
  table.addOpponent(["7c", "2c"], { name: "bruh" });
  // table.addOpponent(["5c", "5s"], { name: "bruh2" });
  table.addOpponent([]);
  table.addOpponent([]);
  table.addOpponent([]);
  table.addOpponent([]);
  table.addOpponent([]);
  table.addOpponent([]);
  table.addOpponent([]);

  // start timer
  // const start = Date.now();

  // const title = "test";
  // v8Profiler.startProfiling(title, true);

  const results = table.calculate();
  console.log(results.oppHandChances);
});
