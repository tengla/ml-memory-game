import React, { useState } from 'react';
import { RspGame } from './rsp-game';

const calculateTime = (count, timeUsed) => {
  const avg = timeUsed / count;
  return [timeUsed, avg]
};

export const TimeReport = ({ count, timeUsed }) => {
  const [time, avg] = calculateTime(count, timeUsed);
  const ctime = (time / 1000).toFixed(2);
  const cavg = (avg / 1000).toFixed(2)
  return (
    <div>På {ctime}s! Det er {cavg}s per trekk!</div>
  )
};

export default () => {

  const [state, setState] = useState({});

  if (state.count) {
    return (
      <div>
        <h3>Grats!</h3>
        <p>Du klarte {state.count} trekk.</p>
        <TimeReport count={state.count} timeUsed={state.timeUsed} />
        <button style={{
          margin: '10px',
          display: 'block'
        }} onClick={() => {
          setState({});
        }}>Prøv igjen</button>
      </div>
    );
  }

  return <RspGame onDone={(state) => {
    setState(state);
  }} />
};
