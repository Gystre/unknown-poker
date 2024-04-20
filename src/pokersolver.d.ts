export declare class Hand {
  id: number;
  name: string;
  static solve(cards: string[], game?: string, canDisqualify?: boolean): Hand;
  static winners(hands: Hand[]): Hand[];
}
