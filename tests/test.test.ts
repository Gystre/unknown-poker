import { TexasHoldem } from "../src/index";
// import fs from "fs";
// const v8Profiler = require("v8-profiler-next");

test("test", async () => {
  // v8Profiler.setGenerateType(1);

  const table = new TexasHoldem(10000);
  table.setPlayer(["Ah", "Kh"]);
  table.addOpponent([], {
    name: "bruh",
    folded: true,
  });
  table.addOpponent([], {
    name: "bruh2",
    folded: true,
  });
  table.addOpponent([]);

  // start timer
  const start = Date.now();

  // const title = "test";
  // v8Profiler.startProfiling(title, true);

  const results = table.calculate();

  // const profile = v8Profiler.stopProfiling(title);
  // profile.export(function (error: any, result: any) {
  //   fs.writeFileSync(`${title}.cpuprofile`, result);
  //   profile.delete();
  // });

  console.log("Time taken: ", Date.now() - start, "ms");

  console.log(results.winChance, results.tieChance, results.loseChance);
});
