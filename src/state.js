import { useState } from 'react';

export const getState = () => {
  const [state, _setState] = useState({})
  const setState = (newState) => {
    _setState(s => {
      return {
        ...s,
        ...newState
      }
    })
  };
  return { state, setState };
};
