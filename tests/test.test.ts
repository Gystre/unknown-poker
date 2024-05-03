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
  console.log(results.namedOppHandChances);

  return;

  // const profile = v8Profiler.stopProfiling(title);
  // profile.export(function (error: any, result: any) {
  //   fs.writeFileSync(`${title}.cpuprofile`, result);
  //   profile.delete();
  // });

  // console.log("Time taken: ", Date.now() - start, "ms");

  // console.log(results.winnerChances);

  // bruh and bruh2 are on my team, add our chances together and average them
  const team = ["bruh", "bruh2"];
  const totalHandChances = results.yourHandChances;

  for (const player of team) {
    const chances = results.namedOppHandChances[player];

    // add up all the chances and initialize any keys that don't exist
    for (const hand in chances) {
      if (!totalHandChances[hand]) {
        totalHandChances[hand] = chances[hand];
      }
      totalHandChances[hand] += chances[hand];
    }
  }

  // average it out
  for (const hand in totalHandChances) {
    totalHandChances[hand] /= team.length;
  }

  console.log("your chances", results.yourHandChances);
  console.log("everyone else's chances", results.namedOppHandChances);
  console.log(totalHandChances);
});
