
export const getP = (prediction) => {
  const p = prediction.reduce((prev, cur) => {
    if (cur.probability > prev.probability) {
      return cur;
    }
    return prev;
  }, { className: '', probability: 0 });
  return p;
};

export const eq = (a, b) => {
  return (a && b) && (a.className === b.className);
};

export function createPredictor (model,canvas) {
  let cur, last;
  return async function predict() {
    const prediction = await model.predict(canvas);
    cur = getP(prediction);
    if (cur.probability < 0.80 || eq(cur, last)) {
      return;
    }
    last = cur;
    return cur;
  }
};

export const Game = {
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
    return Date.now() - Game.start;
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
