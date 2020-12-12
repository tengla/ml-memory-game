
export const getP = (prediction) => {
  const p = prediction.reduce((prev, cur) => {
    if (cur.probability > prev.probability) {
      return cur
    }
    return prev
  }, { className: '', probability: 0 })
  return p
}

export const eq = (a, b) => {
  return (a && b) && (a.className === b.className)
}

export const createPredictor = (model, canvas, options = {}) => {
  const threshold = options.threshold || 0.8;
  let cur, last
  return async function predict () {
    const prediction = await model.predict(canvas)
    cur = getP(prediction)
    if (cur.probability < threshold || eq(cur, last)) {
      return
    }
    last = cur
    return cur
  }
}

export const createGame = function () {
  const game = {
    currentHand: null,
    hands: ['rock', 'scissors', 'paper'],
    resolved: [],
    randomHand: () => {
      const d = () => {
        const idx = Math.floor(Math.random() * game.hands.length)
        const hand = game.hands[idx]
        if (game.resolved.slice(-1).indexOf(hand) === -1) {
          return hand
        }
        return d()
      }
      return d()
    },
    assignRandomCurrentHand: () => {
      game.currentHand = game.randomHand()
    },
    timeUsed: () => {
      return Date.now() - game.start
    },
    resolve: (hand) => {
      if (game.resolved.length === 0) {
        game.start = Date.now()
      }
      game.resolved.push(hand)
      return game.resolved
    },
    shake: (a, b) => {
      return [
        'paper rock',
        'scissors paper',
        'rock scissors'
      ].includes(a + ' ' + b)
    },
    clear: () => {
      game.resolved = []
      game.currentHand = null
    }
  }
  return game
}

export const tr = hand => {
  const o = {
    rock: 'stein',
    scissors: 'saks',
    paper: 'papir',
    loading: 'Laster ml',
    initializing: 'Initialiserer webcam',
    ready: 'Gjør noen hånd gester nå!',
    error: 'Noe gikk galt. Sannsynligvis fikk vi ikke tilgang til kamera!'
  }
  return o[hand]
}
