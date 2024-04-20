import { Player } from "./Player";
import { Hand } from "./pokersolver.js";

export class TexasHoldem {
  private numSimulations: number;
  private numOpponents: number = 0;
  private opponents: Player[] = [];
  private player: Player = new Player("You", []);
  private table: string[] = [];

  // used to check for duplicates
  // prettier-ignore
  private deck = ["As", "2s", "3s", "4s", "5s", "6s", "7s", "8s", "9s", "Ts", "Js", "Qs", "Ks",
                  "Ah", "2h", "3h", "4h", "5h", "6h", "7h", "8h", "9h", "Th", "Jh", "Qh", "Kh",
                  "Ad", "2d", "3d", "4d", "5d", "6d", "7d", "8d", "9d", "Td", "Jd", "Qd", "Kd",
                  "Ac", "2c", "3c", "4c", "5c", "6c", "7c", "8c", "9c", "Tc", "Jc", "Qc", "Kc"];

  constructor(numSimulations?: number) {
    this.numSimulations = numSimulations || 10000;
  }

  // check for duplicates by removing the card from the deck
  private isDuplicate(card: string) {
    for (let i = 0; i < this.deck.length; i++) {
      if (this.deck[i] === card) {
        this.deck.splice(i, 1);
        return false;
      }
    }

    // went through the deck and didn't find anything
    return true;
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
      if (this.isDuplicate(cards[i])) {
        throw new Error(`You: [${cards}], has a duplicate card: ${cards[i]}`);
      }
    }

    this.player = new Player(name || "You", cards);
  }

  addOpponent(cards: string[], name?: string) {
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
      if (this.isDuplicate(cards[i])) {
        throw new Error(
          `${name}: [${cards}], has a duplicate card: ${cards[i]}`
        );
      }
    }

    const player = new Player(name, cards);
    this.opponents.push(player);
    this.numOpponents++;
  }

  setTable(cards: string[]) {
    for (let i = 0; i < cards.length; i++) {
      if (this.isDuplicate(cards[i])) {
        throw new Error(`Table: [${cards}], has a duplicate card: ${cards[i]}`);
      }
    }

    this.table = cards;
  }

  calculate() {
    if (this.player.cards.length == 0) {
      throw new Error("You have no cards. Set your cards with setPlayer()");
    }

    if (this.opponents.length == 0) {
      throw new Error(
        "You have no opponents. Add an opponent with addOpponent()"
      );
    }

    let results = this.run_simulations(
      this.player.cards.map(this.cardToValue),
      this.table.map(this.cardToValue),
      this.opponents.map((player) => player.cards.map(this.cardToValue))
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

  // As -> 101
  private cardToValue(card: string) {
    const rank = card.slice(0, -1);
    const suit = card.slice(-1);

    let value = 0;
    if (Number(rank)) {
      value += Number(rank);
    } else if (rank === "A") {
      value += 1;
    } else if (rank === "T") {
      value += 10;
    } else if (rank === "J") {
      value += 11;
    } else if (rank === "Q") {
      value += 12;
    } else if (rank === "K") {
      value += 13;
    }

    if (suit === "h") {
      value += 100;
    } else if (suit === "s") {
      value += 200;
    } else if (suit === "d") {
      value += 300;
    } else if (suit === "c") {
      value += 400;
    }

    return value;
  }

  private valueToCard(value: number) {
    let card = "";
    const rank = value % 100;
    const suit = value - rank;

    if (rank === 1) {
      card += "A";
    } else if (rank === 10) {
      card += "T";
    } else if (rank === 11) {
      card += "J";
    } else if (rank === 12) {
      card += "Q";
    } else if (rank === 13) {
      card += "K";
    } else {
      card += rank;
    }

    if (suit === 100) {
      card += "h";
    } else if (suit === 200) {
      card += "s";
    } else if (suit === 300) {
      card += "d";
    } else if (suit === 400) {
      card += "c";
    }

    return card;
  }

  private run_simulations(
    master_yourcards: number[],
    master_tablecards: number[],
    master_opponentscards: Array<number[]>
  ) {
    // Set up counters
    let num_times_you_won = 0,
      num_times_you_tied = 0,
      num_times_you_lost = 0;
    const yourhandnames = [];
    const opponenthandnames = [];
    const all_winners = [];

    // Filter out 0s (empty cards)
    master_yourcards = master_yourcards.filter((c) => c !== 0);
    master_tablecards = master_tablecards.filter((c) => c !== 0);
    master_opponentscards = master_opponentscards.map((arr) =>
      arr.filter((c) => c !== 0)
    );

    // monte carlo simulation
    for (let simnum = 0; simnum < this.numSimulations; simnum++) {
      let stringDeck = this.deck.slice();
      for (let i = stringDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [stringDeck[i], stringDeck[j]] = [stringDeck[j], stringDeck[i]];
      }

      // convert to numbers
      let deck = stringDeck.map(this.cardToValue);

      let yourcards = master_yourcards.slice();
      let tablecards = master_tablecards.slice();
      let opponentscards = master_opponentscards.map((arr) => arr.slice());

      // pad them with cards drawn
      while (yourcards.length < 2) {
        yourcards.push(deck.pop() as number);
      }
      while (tablecards.length < 5) {
        tablecards.push(deck.pop() as number);
      }
      for (let i = 0; i < this.numOpponents; i++) {
        while (opponentscards[i].length < 2) {
          opponentscards[i].push(deck.pop() as number);
        }
      }

      // convert them to strings
      const yourcardsStr = yourcards.map(this.valueToCard);
      const tablecardsStr = tablecards.map(this.valueToCard);
      const opponentscardsStr = opponentscards.map((arr) =>
        arr.map(this.valueToCard)
      );

      // console.log("Your cards: " + yourcards);
      // console.log("Table's cards: " + tablecards);
      // console.log("Opponents' cards: " + opponentscards);

      let hands = [];
      let yourhand = Hand.solve(yourcardsStr.concat(tablecardsStr));
      yourhand.id = 0;
      hands.push(yourhand);
      yourhandnames.push(yourhand.name);

      // create the opponent's hands
      for (let i = 0; i < this.numOpponents; i++) {
        let opphand = Hand.solve(opponentscardsStr[i].concat(tablecardsStr));
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
