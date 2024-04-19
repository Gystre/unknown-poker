// prettier-ignore
const deck = ["As", "2s", "3s", "4s", "5s", "6s", "7s", "8s", "9s", "Ts", "Js", "Qs", "Ks",
              "Ah", "2h", "3h", "4h", "5h", "6h", "7h", "8h", "9h", "Th", "Jh", "Qh", "Kh",
              "Ad", "2d", "3d", "4d", "5d", "6d", "7d", "8d", "9d", "Td", "Jd", "Qd", "Kd",
              "Ac", "2c", "3c", "4c", "5c", "6c", "7c", "8c", "9c", "Tc", "Jc", "Qc", "Kc"];

// card comes in format rankSuit
// ex. 2h = 2 of hearts

export class Card {
  private card: string;

  constructor(card: string) {
    if (!deck.includes(card)) {
      throw new Error(`Invalid card: ${card}`);
    }

    this.card = card;
  }

  // from omni calculator value calculation, don't know why they do it like this :P
  get value() {
    const rank = this.card.slice(0, -1);
    const suit = this.card.slice(-1);

    let value = 0;
    if (Number(rank)) {
      value += Number(rank);
    } else if (rank === "A") {
      value += 1;
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

  get name() {
    return this.card;
  }
}
