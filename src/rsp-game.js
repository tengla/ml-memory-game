import React, { useState, useRef, useEffect } from 'react';
import { createPredictor, Game } from './utils';

const url = "https://teachablemachine.withgoogle.com/models/Rza-yJgJW/";
const modelURL = url + "model.json";
const metadataURL = url + "metadata.json";
let iterations = 0;

export const RspGame = ({ onDone }) => {

  const [status, setStatus] = useState('loading');
  const [currentPrediction, setCurrentPrediction] = useState(null);
  const videoRef = useRef();
  const rafRef = useRef();
  const webcamRef = useRef();
  const modelRef = useRef();
  const predictRef = useRef();

  const loop = async () => {
    if (iterations % 8 === 0) {
      webcamRef.current.update();
      const cur = await predictRef.current(
        modelRef.current, webcamRef.current.canvas);
      if (cur) {
        const isWin = Game.shake(cur.className, Game.currentHand);
        if (isWin) {
          Game.resolve(Game.currentHand);
        } else if (Game.resolved.length > 1) {
          webcamRef.current.stop();
          const count = Game.resolved.length + 0;
          Game.resolved = [];
          onDone({
            timeUsed: Game.timeUsed(),
            count
          });
          return;
        } else {
          Game.resolved = [];
        }
        Game.currentHand = Game.randomHand();
        setCurrentPrediction(cur);
      }
    }
    rafRef.current = requestAnimationFrame(loop);
    iterations = iterations < 1000 ? iterations + 1 : 0;
  };

  useEffect(async () => {

    Game.currentHand = Game.randomHand();

    modelRef.current = await tmImage.load(modelURL, metadataURL);
    setStatus('initializing');

    const webcam = new window.tmImage.Webcam(200, 200, true); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    setStatus('ready');

    predictRef.current = createPredictor(modelRef.current, webcam.canvas);
    webcamRef.current = webcam;
    videoRef.current.appendChild(webcam.canvas);
    // start
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      return cancelAnimationFrame(rafRef.current);
    }
  }, []);

  const tr = hand => {
    const o = {
      rock: 'stein',
      scissors: 'saks',
      paper: 'papir',
      loading: 'Laster ml',
      initializing: 'Initialiserer webcam',
      ready: 'Klar til bruk'
    };
    return o[hand];
  };

  return (
    <div>
      <div>{tr(status)}</div>
      <div ref={videoRef}></div>
      <div style={{
        display: status === 'ready' ? 'block' : 'none'
      }}>
        <div>
          Prediction: {currentPrediction?.className} {currentPrediction?.probability.toFixed(2)}
        </div>
        <div>Hva slår {tr(Game.currentHand)}?</div>
        <ul style={{
          margin: '20px 0 0 0',
          padding: '0',
          listStyle: 'none'
        }}>{Game.resolved.map((res, idx) => {
          return <li
            key={`res-${idx}`}
            style={{
              padding: '5px',
              margin: '5px',
              border: '1px solid #ccc',
              backgroundColor: 'green',
              color: 'white',
              display: 'inline-block',
              borderRadius: '4px'
            }}
          >{tr(res)}</li>
        })}</ul>
      </div>
    </div>
  );
};
