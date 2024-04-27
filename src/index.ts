import { Player } from "./Player";
import { Hand } from "./pokersolver.js";

export interface SimulationResults {
  // ex. 0.1, 0.2, etc.
  winChance: number;
  loseChance: number;
  tieChance: number;

  //! ex. { "Royal Flush": 0.1, "Straight Flush": 0.2, etc. }
  yourHandChances: { [key: string]: number };
  oppHandChances: { [key: string]: number };

  // ex. { "You": 0.1, "Opponent 1": 0.2, etc. }
  winnerChances: { [key: string]: number };
}

export class TexasHoldem {
  private numSimulations: number;
  private numOpponents: number = 0;
  private opponents: Player[] = [];
  private player: Player = new Player("You", []);
  private table: string[] = [];
  private deadCards: number = 0; // the number of unknown dead cards

  // used to check for duplicates
  // prettier-ignore
  private deck: { [key: string]: boolean } = {
    "As": true, "Ah": true, "Ad": true, "Ac": true,
    "2s": true, "2h": true, "2d": true, "2c": true,
    "3s": true, "3h": true, "3d": true, "3c": true,
    "4s": true, "4h": true, "4d": true, "4c": true,
    "5s": true, "5h": true, "5d": true, "5c": true,
    "6s": true, "6h": true, "6d": true, "6c": true,
    "7s": true, "7h": true, "7d": true, "7c": true,
    "8s": true, "8h": true, "8d": true, "8c": true,
    "9s": true, "9h": true, "9d": true, "9c": true,
    "Ts": true, "Th": true, "Td": true, "Tc": true,
    "Js": true, "Jh": true, "Jd": true, "Jc": true,
    "Qs": true, "Qh": true, "Qd": true, "Qc": true,
    "Ks": true, "Kh": true, "Kd": true, "Kc": true
   };

  constructor(numSimulations?: number) {
    this.numSimulations = numSimulations || 10000;
  }

  // couldn't remove the card return false as there is a duplicate
  private removeCard(card: string) {
    if (this.deck[card]) {
      this.deck[card] = false;
      return true;
    }

    return false;
  }

  setPlayer(cards: string[], name?: string) {
    if (cards.length > 2) {
      throw new Error("You can only have 2 cards");
    }

    if (cards.length == 1) {
      throw new Error("You must have 2 cards");
    }

    // check for duplicates
    for (let i = 0; i < cards.length; i++) {
      if (!this.removeCard(cards[i])) {
        throw new Error(`You: [${cards}], has a duplicate card: ${cards[i]}`);
      }
    }

    this.player = new Player(name || "You", cards);
  }

  addOpponent(
    cards: string[],
    options?: {
      name?: string;
      folded?: boolean;
    }
  ) {
    if (this.numOpponents >= 9) {
      throw new Error("You can only have 9 opponents");
    }

    let name = options?.name;
    if (!name) {
      name = "Opponent " + (this.numOpponents + 1);
    }

    if (cards.length > 2) {
      throw new Error(`${name} can only have 2 cards`);
    }

    if (cards.length == 1) {
      throw new Error(`${name} must have 2 cards`);
    }

    // check for duplicates
    for (let i = 0; i < cards.length; i++) {
      if (!this.removeCard(cards[i])) {
        throw new Error(
          `${name}: [${cards}], has a duplicate card: ${cards[i]}`
        );
      }
    }

    // if they've folded, they aren't considered an opponent and their cards are dead
    if (options?.folded && cards.length == 0) {
      this.deadCards += 2;
    } else {
      const player = new Player(name, cards);
      this.opponents.push(player);
      this.numOpponents++;
    }
  }

  setTable(cards: string[]) {
    for (let i = 0; i < cards.length; i++) {
      if (!this.removeCard(cards[i])) {
        throw new Error(`Table: [${cards}], has a duplicate card: ${cards[i]}`);
      }
    }

    this.table = cards;
  }

  calculate(): SimulationResults {
    if (this.player.cards.length == 0) {
      throw new Error("You have no cards. Set your cards with setPlayer()");
    }

    if (this.opponents.length == 0) {
      throw new Error(
        "You have no opponents. Add an opponent with addOpponent()"
      );
    }

    let results = this.runSimulation(
      this.player.cards,
      this.table,
      this.opponents.map((player) => player.cards)
    );

    function frequencies(arr: any[]): { [key: string]: number } {
      const result: { [key: string]: number } = {};

      return arr.reduce((acc, curr) => {
        acc[curr] = (acc[curr] ?? 0) + 1;

        if (acc[curr] >= 3) {
          result[curr] = acc[curr];
        }

        return acc;
      }, {} as { [key: string]: number });
    }

    let yourHandFrequencies = frequencies(results.yourhandnames);
    for (let [key, value] of Object.entries(yourHandFrequencies)) {
      yourHandFrequencies[key] = (value ?? 0) / this.numSimulations;
    }

    let oppHandFrequencies = frequencies(results.oppshandnames);
    for (let [key, value] of Object.entries(oppHandFrequencies)) {
      // every opponent has an equal chance of having these hands
      oppHandFrequencies[key] =
        (value ?? 0) / this.numSimulations / this.numOpponents;
    }

    let winnerFrequencies = frequencies(results.winners);
    let winnerChances = {
      [this.player.name]: (winnerFrequencies[0] ?? 0) / this.numSimulations,
    };

    for (let i = 0; i < this.numOpponents; i++) {
      const value = winnerFrequencies[i + 1];
      winnerChances[this.opponents[i].name] =
        (value ?? 0) / this.numSimulations;
    }

    return {
      winChance: results.won,
      loseChance: results.lost,
      tieChance: results.tied,
      yourHandChances: yourHandFrequencies,
      oppHandChances: oppHandFrequencies,
      winnerChances,
    };
  }

  private runSimulation(
    master_yourcards: string[],
    master_tablecards: string[],
    master_opponentscards: Array<string[]>
  ) {
    // Set up counters
    let num_times_you_won = 0,
      num_times_you_tied = 0,
      num_times_you_lost = 0;
    const yourhandnames = [];
    const opponenthandnames = [];
    const all_winners = [];

    // monte carlo simulation
    for (let simnum = 0; simnum < this.numSimulations; simnum++) {
      let deckDict = { ...this.deck };

      // choose random dead cards to kill
      for (let i = 0; i < this.deadCards; i++) {
        let keys = Object.keys(deckDict);

        let randomKey = keys[Math.floor(Math.random() * keys.length)];
        while (!deckDict[randomKey]) {
          randomKey = keys[Math.floor(Math.random() * keys.length)];
        }
        deckDict[randomKey] = false;
      }

      let deck: string[] = [];
      for (let key in deckDict) {
        if (deckDict[key]) {
          deck.push(key);
        }
      }

      // shuffle
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }

      let yourcards = master_yourcards.slice();
      let tablecards = master_tablecards.slice();
      let opponentscards = master_opponentscards.map((arr) => arr.slice());

      // fill the table
      while (tablecards.length < 5) {
        tablecards.push(deck.pop() as string);
      }

      // give opponents their cards
      for (let i = 0; i < this.numOpponents; i++) {
        while (opponentscards[i].length < 2) {
          opponentscards[i].push(deck.pop() as string);
        }
      }

      // console.log("Your cards: " + yourcards);
      // console.log("Table's cards: " + tablecards);
      // console.log("Opponents' cards: " + opponentscards);

      let hands = [];
      let yourhand = Hand.solve(yourcards.concat(tablecards));
      yourhand.id = 0;
      hands.push(yourhand);
      yourhandnames.push(yourhand.name);

      // create the opponent's hands
      for (let i = 0; i < this.numOpponents; i++) {
        let opphand = Hand.solve(opponentscards[i].concat(tablecards));
        opphand.id = i + 1;
        hands.push(opphand);
        opponenthandnames.push(opphand.name);
      }

      let winners = Hand.winners(hands).map((hand) => hand.id);
      if (winners.length === 1) {
        // only one winner
        let winner = winners[0];
        all_winners.push(winner);
        if (winner === 0) {
          // 0 is player
          num_times_you_won++;
        } else {
          num_times_you_lost++;
        }
      } else {
        // ties
        if (winners.includes(0)) {
          // 0 is player
          num_times_you_tied++;
        } else {
          num_times_you_lost++;
        }
      }
      // console.log("Winner: " + winners);
    }

    return {
      won: num_times_you_won / this.numSimulations,
      lost: num_times_you_lost / this.numSimulations,
      tied: num_times_you_tied / this.numSimulations,
      yourhandnames: yourhandnames,
      oppshandnames: opponenthandnames,
      winners: all_winners,
    };
  }
}
