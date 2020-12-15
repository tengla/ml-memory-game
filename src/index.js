import React, { useState, useEffect } from 'react'
import fetch from 'isomorphic-unfetch'
import { RspGame } from './rsp-game'
import { ResultReport } from './result-report'
import { Description } from './description'
import { Auth } from './auth';

export const GetTop = ({ scores }) => {

  const score = scores[0];
  if (!score) {
    return null;
  }

  return (
    <div>
      <h3>Topp 5</h3>
      {scores.slice(0, 5).map(score => {
        const time = (score.elapsed / 1000).toFixed(3);
        const k = score.name + ':' + time;
        return (
          <div key={k}>{score.name} - {time}s</div>
        )
      })}
    </div>
  );
};

export default () => {

  const [scores, setScores] = useState([]);
  const [state, setState] = useState({
    init: true
  });

  useEffect(async () => {

    console.log('fetch data');

    const scoreData = await fetch('/api/get-score')
      .then(res => res.json());

    const _scores = scoreData.scores.sort((a, b) => {
      return a.elapsed <= b.elapsed ? -1 : 1
    }).reduce((scores, score) => {
      if (scores.map(s => s.id).includes(score.id)) {
        return scores;
      }
      return scores.concat(score);
    }, []);

    setScores(_scores);

    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');

    if (!(state.count && name && email)) {
      return;
    }

    const text = await fetch('/api/beacon')
      .then(res => res.text())

    console.log(text);

    const data = await fetch('/api/set-score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name, email,
        elapsed: state.elapsed
      })
    }).then(res => res.json())

    console.log(data);
  }, [state.count]);

  if (state.init) {
    return (
      <Auth>
        <Description onReady={() => setState({})} />
        <GetTop scores={scores} />
      </Auth>
    );
  }

  const resultRep = () => {
    if (!state.count) {
      return null
    }
    return (
      <ResultReport
        key='report'
        elapsed={state.elapsed}
        count={state.count}
      />
    )
  }

  const tryAgain = (condition) => {
    if (!condition) {
      return null
    }
    return (
      <div>
        <button
          className='button'
          onClick={() => {
            setState({ init: true })
          }}>Prøv igjen</button>
      </div>
    );
  }

  return (
    <>
      {resultRep()}
      <RspGame
        key='game'
        url='https://teachablemachine.withgoogle.com/models/GMaTd1hua/'
        onDone={(result) => {
          setState(result)
        }}
      />
      {tryAgain(state.count)}
    </>
  )
}
