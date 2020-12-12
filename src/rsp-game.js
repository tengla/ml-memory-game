import React, { useState, useRef, useEffect } from 'react'
import { createPredictor, createGame, tr } from './utils'
import { ResolvedHands } from './resolved-hands'
import { Debug } from './debug'

// https://teachablemachine.withgoogle.com/models/Rza-yJgJW/;
// https://teachablemachine.withgoogle.com/models/xf82yR2IE/

let iterations = 0
const game = createGame()

export const RspGame = ({ url, onDone }) => {
  const modelURL = url + 'model.json?v=2'
  const metadataURL = url + 'metadata.json?v=2'

  const [status, setStatus] = useState('loading')
  const [errMsg, setErrMsg] = useState('')
  const [currentPrediction, setCurrentPrediction] = useState(null)
  const videoRef = useRef()
  const rafRef = useRef()
  const webcamRef = useRef()
  const modelRef = useRef()
  const predictRef = useRef()

  const loop = async () => {
    if (iterations % 8 === 0) {
      webcamRef.current.update()
      const cur = await predictRef.current.predict(
        modelRef.current, webcamRef.current.canvas)

      setCurrentPrediction(cur)

      if (cur && game.hands.includes(cur.className)) {
        const isWin = game.shake(cur.className, game.currentHand)
        if (isWin) {
          game.resolve(game.currentHand)
        } else if (game.resolved.length > 1) {
          webcamRef.current.stop()
          const count = game.resolved.length + 0
          game.resolved = []
          setStatus('done')
          onDone({
            timeUsed: game.timeUsed(),
            count,
            details: {
              currentHand: game.currentHand.toString(),
              prediction: cur.className
            }
          })
          return
        } else {
          game.resolved = []
        }
        game.assignRandomCurrentHand()
      }
    }
    rafRef.current = window.requestAnimationFrame(loop)
    iterations = iterations < 1000 ? iterations + 1 : 0
  }

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
