import React, { useState } from 'react';
import { RspGame } from './rsp-game';
import { ResultReport } from './result-report';
import { Description } from './description';

export default () => {

  const [state, setState] = useState({
    init: true
  });

  if (state.init) {
    return <Description onReady={() => setState({})} />
  }

  const resultRep = () => {
    if (!state.count) {
      return null;
    }
    return (
      <ResultReport
        key='report'
        timeUsed={state.timeUsed}
        count={state.count}
        onReset={() => setState({ init: true })}
      />
    )
  };

  return <>
    {resultRep()}
    <RspGame
      key='game'
      url='https://teachablemachine.withgoogle.com/models/xf82yR2IE/'
      onDone={(result) => {
        setState(result);
      }} />
  </>
};
