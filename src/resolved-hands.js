import React from 'react';
import { tr } from './utils';

const styles = {
  ul: {
    margin: '20px 0 0 0',
    padding: '0',
    listStyle: 'none'
  },
  li: {
    padding: '5px',
    margin: '5px',
    border: '1px solid #ccc',
    backgroundColor: 'green',
    color: 'white',
    display: 'inline-block',
    borderRadius: '4px'
  }
};

export const ResolvedHands = ({ game }) => {
  return <ul
    style={styles.ul}
  >{game.resolved.map((res, idx) => {
    return <li
      key={`res-${idx}`}
      style={styles.li}
    >{idx + 1}</li>
  })}</ul>
};
