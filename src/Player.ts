import { Card } from "./Card";

export class Player {
  name: string;
  cards: Card[];

  constructor(name: string, cards: Card[]) {
    this.name = name;
    this.cards = cards;
  }
}
