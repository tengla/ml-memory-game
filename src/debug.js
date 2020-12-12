import React, { useEffect } from 'react';

let memory = [];

const style = {
  position: 'absolute',
  right: '0px',
  top: '0px',
  backgroundColor: '#ddd',
  padding: '5px 10px',
  zIndex: -1,
  fontSize: '0.8em',
  fontFamily: 'monospace'
};

export const Debug = ({ data, disable = false }) => {

  if (disable) {
    return null
  }

  const str = JSON.stringify(data, null, 2)
  const slice = memory.slice(-15)

  useEffect(() => {
    memory.push(str);
  }, [str])
  useEffect(() => {
    return () => {
      memory = [];
    }
  },[])
  return (
    <div style={style}>{slice.map((mem, idx) => {
      const offset = memory.length - 15
      const n = offset > 0 ? offset + idx : idx
      const k = `mem-${n}`
      return <div data-key={k} key={k}>{mem || 'undefined'}</div>
    })}</div>
  )
};
