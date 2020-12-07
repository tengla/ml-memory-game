const Game = {
  currentHand: null,
  hands: ['rock', 'scissors', 'paper'],
  resolved: [],
  randomHand: () => {
    const d = () => {
      const idx = Math.floor(Math.random() * Game.hands.length);
      const hand = Game.hands[idx];
      if (Game.resolved.slice(-1).indexOf(hand) === -1) {
        return hand;
      }
      return d();
    };
    return d();
  },
  timeUsed: () => {
    return (Date.now() - Game.start) / 1000;
  },
  resolve: (hand) => {
    if (Game.resolved.length === 0) {
      Game.start = Date.now();
    }
    Game.resolved.push(hand);
    return Game.resolved;
  },
  shake: (a, b) => {
    return [
      'paper rock',
      'scissors paper',
      'rock scissors'
    ].includes(a + ' ' + b);
  }
};
