import React, { useState, useRef, useEffect } from 'react';
import { createPredictor, createGame, tr } from './utils';
import { ResolvedHands } from './resolved-hands';
import { Prediction } from './prediction';

// https://teachablemachine.withgoogle.com/models/Rza-yJgJW/;
// https://teachablemachine.withgoogle.com/models/xf82yR2IE/

let iterations = 0;
const game = createGame();

export const RspGame = ({ url, onDone }) => {

  const modelURL = url + "model.json";
  const metadataURL = url + "metadata.json";

  const [status, setStatus] = useState('loading');
  const [errMsg, setErrMsg] = useState('');
  const [currentPrediction, setCurrentPrediction] = useState(null);
  const videoRef = useRef();
  const rafRef = useRef();
  const webcamRef = useRef();
  const modelRef = useRef();
  const predictRef = useRef();

  const loop = async () => {
    if (iterations % 8 === 0) {
      webcamRef.current.update();
      const cur = await predictRef.current.predict(
        modelRef.current, webcamRef.current.canvas);

      setCurrentPrediction(cur);

      if (cur && game.hands.includes(cur.className)) {
        const isWin = game.shake(cur.className, game.currentHand);
        if (isWin) {
          game.resolve(game.currentHand);
        } else if (game.resolved.length > 1) {
          webcamRef.current.stop();
          const count = game.resolved.length + 0;
          game.resolved = [];
          setStatus('done');
          onDone({
            timeUsed: game.timeUsed(),
            count,
            details: {
              currentHand: game.currentHand.toString(),
              prediction: cur.className
            }
          });
          return;
        } else {
          game.resolved = [];
        }
        game.assignRandomCurrentHand();
      }
    }
    rafRef.current = requestAnimationFrame(loop);
    iterations = iterations < 1000 ? iterations + 1 : 0;
  };

  useEffect(async () => {

    game.assignRandomCurrentHand();

    modelRef.current = await tmImage.load(modelURL, metadataURL);
    setStatus('initializing');

    const webcam = new window.tmImage.Webcam(200, 200, true); // width, height, flip
    try {
      await webcam.setup(); // request access to the webcam
      await webcam.play();
      setStatus('ready');
    } catch (err) {
      console.log(err);
      setErrMsg(err.toString());
      setStatus('error');
    }

    predictRef.current = {
      predict: createPredictor(modelRef.current, webcam.canvas)
    };

    webcamRef.current = webcam;
    videoRef.current.appendChild(webcam.canvas);
    // start
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      return cancelAnimationFrame(rafRef.current);
    }
  }, []);

  return (
    <div className='game'>
      <h2>{tr(status)}</h2>
      <div>err: {errMsg}</div>
      <div ref={videoRef}></div>
      <div style={{
        display: status === 'ready' ? 'block' : 'none'
      }}>
        <Prediction prediction={currentPrediction} />
        <div style={{
          margin: '10px 0',
          fontWeight: 'bold'
        }}
        >Hva slår {tr(game.currentHand)}?</div>
        <ResolvedHands game={game} />
      </div>
    </div>
  );
};
