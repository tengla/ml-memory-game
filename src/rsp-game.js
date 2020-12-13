import React, { useState, useRef, useEffect } from 'react'
import { createPredictor, createGame, tr } from './utils'
import { ResolvedHands } from './resolved-hands'
import { Debug } from './debug'

let iterations = 0
const game = createGame()

export const RspGame = ({ url, onDone }) => {

  const modelURL = url + 'model.json?v=2'
  const metadataURL = url + 'metadata.json?v=2'
  const [status, setStatus] = useState('loading')
  const [errMsg, setErrMsg] = useState('')
  const [currentPrediction, setCurrentPrediction] = useState(null)
  const [wins, setWins] = useState([]);
  const videoRef = useRef()
  const rafRef = useRef()
  const webcamRef = useRef()
  const modelRef = useRef()
  const predictRef = useRef()

  const loop = async () => {
    if (iterations % 4 === 0) {
      webcamRef.current.update()
      const cur = await predictRef.current.predict()
      setCurrentPrediction(cur?.className||null);
    }
    rafRef.current = window.requestAnimationFrame(loop)
    iterations = iterations < 1000 ? iterations + 1 : 0
  }

  useEffect(() => {
    if(!currentPrediction || !game.hands.includes(currentPrediction)) {
      return;
    }
    if (game.isWin(currentPrediction, game.currentHand)) {
      setWins(wins => wins.concat(currentPrediction))
    }
  }, [currentPrediction]);

  useEffect(() => {
    if(wins.length >= 20) {
      webcamRef.current.stop()
      setStatus('done')
      const _wins = wins.slice()
      setWins([])
      game.resolved = []
      onDone({
        timeUsed: game.timeUsed(),
        count: wins.length,
        details: {
          wins: _wins
        }
      })
    }
  }, [wins]);

  useEffect(async () => {
    game.assignRandomCurrentHand()

    modelRef.current = await window.tmImage.load(modelURL, metadataURL)
    setStatus('initializing')

    const webcam = new window.tmImage.Webcam(200, 200, true) // width, height, flip
    try {
      await webcam.setup() // request access to the webcam
      await webcam.play()
      setStatus('ready')
    } catch (err) {
      console.log(err)
      setErrMsg(err.toString())
      setStatus('error')
    }

    predictRef.current = {
      predict: createPredictor(modelRef.current, webcam.canvas, {
        threshold: 0.75
      })
    }

    webcamRef.current = webcam
    videoRef.current.appendChild(webcam.canvas)
    // start
    rafRef.current = window.requestAnimationFrame(loop)
    return () => {
      return window.cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div className='game'>
      <Debug data={currentPrediction} disable />
      <h2>{tr(status)}</h2>
      <div style={{ color: 'red' }}>{errMsg}</div>
      <div ref={videoRef} />
      <div style={{
        display: status === 'ready' ? 'block' : 'none'
      }}
      >
        <div style={{
          margin: '10px 0',
          fontWeight: 'bold'
        }}
        >Hva slår {tr(game.currentHand)}?
        </div>
        <ResolvedHands game={game} />
      </div>
    </div>
  )
}
