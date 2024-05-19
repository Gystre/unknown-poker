export declare class Hand {
  id: number;
  cardPool: Card[];
  cards: Card[];
  suits: { [suit: string]: Card[] };
  values: Card[][];
  wilds: Card[];
  name: string;
  game: Game;
  sfLength: number;
  alwaysQualifies: boolean;
  rank: number;
  isPossible: boolean;

  // gives a description of the hand, "A High", "Pair of 2s", etc
  // will only exist when using table.solveHand(), this doesn't actually exist on the base class LOL
  descr: string;

  /**
   * Base Hand class that handles comparisons of full hands.
   */
  constructor(
    cards: (string | Card)[],
    name: string,
    game: Game,
    canDisqualify?: boolean
  );

  /**
   * Compare current hand with another to determine which is the winner.
   * @param  {Hand} a Hand to compare to.
   * @return {Number}
   */
  compare(a: Hand): number;

  /**
   * Determine whether a hand loses to another.
   * @param  {Hand} hand Hand to compare to.
   * @return {Boolean}
   */
  loseTo(hand: Hand): boolean;

  /**
   * Determine the number of cards in a hand of a rank.
   * @param  {Number} val Index of this.values.
   * @return {Number} Number of cards having the rank, including wild cards.
   */
  getNumCardsByRank(val: number): number;

  /**
   * Determine the cards in a suit for a flush.
   * @param  {String} suit Key for this.suits.
   * @param  {Boolean} setRanks Whether to set the ranks for the wild cards.
   * @return {Array} Cards having the suit, including wild cards.
   */
  getCardsForFlush(suit: string, setRanks: boolean): Card[];

  /**
   * Resets the rank and wild values of the wild cards.
   */
  resetWildCards(): void;

  /**
   * Highest card comparison.
   * @return {Array} Highest cards
   */
  nextHighest(): Card[];

  /**
   * Return list of contained cards in human readable format.
   * @return {String}
   */
  toString(): string;

  /**
   * Return array of contained cards.
   * @return {Array}
   */
  toArray(): string[];

  /**
   * Determine if qualifying hand.
   * @return {Boolean}
   */
  qualifiesHigh(): boolean;

  /**
   * Find highest ranked hands and remove any that don't qualify or lose to another hand.
   * @param  {Array} hands Hands to evaluate.
   * @return {Array}       Winning hands.
   */
  static winners(hands: Hand[]): Hand[];

  /**
   * Build and return the best hand.
   * @param  {Array} cards Array of cards (['Ad', '3c', 'Th', ...]).
   * @param  {String} game Game being played.
   * @param  {Boolean} canDisqualify Check for a qualified hand.
   * @return {Hand}       Best hand.
   */
  static solve(
    cards?: (string | Card)[],
    game?: Game | string,
    canDisqualify?: boolean
  ): Hand;

  /**
   * Separate cards based on if they are wild cards.
   * @param  {Array} cards Array of cards (['Ad', '3c', 'Th', ...]).
   * @param  {Game} game Game being played.
   * @return {Array} [wilds, nonWilds] Wild and non-Wild Cards.
   */
  static stripWilds(cards?: (string | Card)[], game?: Game): [Card[], Card[]];
}
