import { Card } from "./Card";
import { Player } from "./Player";

export class TexasHoldem {
  private numSimulations: number;
  private numOpponents: number = 0;
  private opponents: Player[] = [];
  private player: Player = new Player("You", []);
  private table: Card[] = [];

  // used to check for duplicates
  // prettier-ignore
  private deck = [
	new Card("As"), new Card("2s"), new Card("3s"), new Card("4s"), new Card("5s"),
	new Card("6s"), new Card("7s"), new Card("8s"), new Card("9s"), new Card("Ts"),
	new Card("Js"), new Card("Qs"), new Card("Ks"),

	new Card("Ah"), new Card("2h"), new Card("3h"), new Card("4h"), new Card("5h"),
	new Card("6h"), new Card("7h"), new Card("8h"), new Card("9h"), new Card("Th"),
	new Card("Jh"), new Card("Qh"), new Card("Kh"),

	new Card("Ad"), new Card("2d"), new Card("3d"), new Card("4d"), new Card("5d"),
	new Card("6d"), new Card("7d"), new Card("8d"), new Card("9d"), new Card("Td"),
	new Card("Jd"), new Card("Qd"), new Card("Kd"),

	new Card("Ac"), new Card("2c"), new Card("3c"), new Card("4c"), new Card("5c"),
	new Card("6c"), new Card("7c"), new Card("8c"), new Card("9c"), new Card("Tc"),
	new Card("Jc"), new Card("Qc"), new Card("Kc")
  ];

  constructor(numSimulations?: number) {
    this.numSimulations = numSimulations || 10000;
  }

  // check for duplicates by removing the card from the deck
  private isDuplicate(card: Card) {
    for (let i = 0; i < this.deck.length; i++) {
      if (this.deck[i].name === card.name) {
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

    let convertedCards = cards.map((card) => new Card(card));

    // check for duplicates
    for (let i = 0; i < cards.length; i++) {
      if (this.isDuplicate(convertedCards[i])) {
        throw new Error(`You: [${cards}], has a duplicate card: ${cards[i]}`);
      }
    }

    this.player = new Player(name || "You", convertedCards);
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

    const convertedCards = cards.map((card) => new Card(card));

    // check for duplicates
    for (let i = 0; i < cards.length; i++) {
      cards[i];
      if (this.isDuplicate(convertedCards[i])) {
        throw new Error(
          `${name}: [${cards}], has a duplicate card: ${cards[i]}`
        );
      }
    }

    const player = new Player(name, convertedCards);
    this.opponents.push(player);
    this.numOpponents++;
  }

  setTable(cards: string[]) {
    const convertedCards = cards.map((card) => new Card(card));
    for (let i = 0; i < cards.length; i++) {
      if (this.isDuplicate(convertedCards[i])) {
        throw new Error(`Table: [${cards}], has a duplicate card: ${cards[i]}`);
      }
    }

    this.table = convertedCards;
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
  }

  //   private run_simulations(
  //     master_yourcards: number[],
  //     master_tablecards: number[],
  //     master_opponentscards: Array<number[]>
  //   ) {
  //     const num_opponents = master_opponentscards.length;

  //     // Set up counters
  //     var num_times_you_won = 0,
  //       num_times_you_tied = 0,
  //       num_times_you_lost = 0;
  //     const yourhandnames = [];
  //     const opponenthandnames = [];
  //     const all_winners = [];

  //     // Filter out 0s (empty cards)
  //     master_yourcards = master_yourcards.filter((c) => c !== 0);
  //     master_tablecards = master_tablecards.filter((c) => c !== 0);
  //     master_opponentscards = master_opponentscards.map((arr) =>
  //       arr.filter((c) => c !== 0)
  //     );

  //     // create a copy of this.deck
  //     // const master_deck = this.deck.slice();

  //     // Do this many times:
  //     for (var simnum = 0; simnum < this.numSimulations; simnum++) {
  //       // copies for this simulation
  //       var deck = master_deck.shuffled();
  //       var yourcards = master_yourcards.slice();
  //       var tablecards = master_tablecards.slice();
  //       var opponentscards = master_opponentscards.map((arr) => arr.slice());

  //       // pad them with cards drawn
  //       while (yourcards.length < 2) {
  //         yourcards.push(deck.pop());
  //       }
  //       while (tablecards.length < 5) {
  //         tablecards.push(deck.pop());
  //       }
  //       for (var i = 0; i < num_opponents; i++) {
  //         while (opponentscards[i].length < 2) {
  //           opponentscards[i].push(deck.pop());
  //         }
  //       }

  //       // convert them to strings
  //       yourcards = yourcards.map(convert_card_number_to_text);
  //       tablecards = tablecards.map(convert_card_number_to_text);
  //       opponentscards = opponentscards.map((arr) =>
  //         arr.map(convert_card_number_to_text)
  //       );

  //       // console.log("Your cards: " + yourcards)
  //       // console.log("Table's cards: " + tablecards)
  //       // console.log("Opponents' cards: " + opponentscards)

  //       var hands = [];
  //       var yourhand = Hand.solve(yourcards.concat(tablecards));
  //       yourhand.id = 0;
  //       hands.push(yourhand);
  //       yourhandnames.push(yourhand.name);
  //       for (var i = 0; i < num_opponents; i++) {
  //         var opphand = Hand.solve(opponentscards[i].concat(tablecards));
  //         opphand.id = i + 1;
  //         hands.push(opphand);
  //         opponenthandnames.push(opphand.name);
  //       }
  //       var winners = Hand.winners(hands).map((hand) => hand.id);
  //       if (winners.length === 1) {
  //         // only one winner
  //         var winner = winners[0];
  //         all_winners.push(winner);
  //         if (winner === 0) {
  //           // 0 is player
  //           num_times_you_won++;
  //         } else {
  //           num_times_you_lost++;
  //         }
  //       } else {
  //         // ties
  //         if (winners.includes(0)) {
  //           // 0 is player
  //           num_times_you_tied++;
  //         } else {
  //           num_times_you_lost++;
  //         }
  //       }
  //       // console.log("Winner: " + winners)
  //     }

  //     return {
  //       won: num_times_you_won / this.numSimulations,
  //       lost: num_times_you_lost / this.numSimulations,
  //       tied: num_times_you_tied / this.numSimulations,
  //       yourhandnames: yourhandnames,
  //       oppshandnames: opponenthandnames,
  //       winners: all_winners,
  //     };
  //   }
}
