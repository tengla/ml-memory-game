import React, { useLayoutEffect, useState } from 'react'
import './resolved-hands.css';

export const Item = ({ name, value }) => {
  const [state, setState] = useState(0);
  useLayoutEffect(() => {
    const id = setTimeout(() => {
      setState(s => 1);
    }, 10);
    return () => clearTimeout(id);
  }, []);
  const klass = state < 1 ? 'a' : 'b';
  return (
    <li>
      <div className={`circle ${klass}`}>
        <span>{value}</span>
        <span style={{ display: 'none' }}>{name}</span>
      </div>
    </li>
  );
};

export const Fill = ({value}) => {
  return (
    <li>
      <div className={`circle fill`}>
        <span>{value}</span>
      </div>
    </li>
  );
};

export const ResolvedHands = ({ resolved, max }) => {

  const fills = [...Array(max - resolved.length).keys()].map((_,idx) => {
    return idx + resolved.length + 1;
  });

  return (
    <ul className='ul'>
      {
        resolved.map((name, idx) => {
          return <Item
            key={`res-${idx}`}
            value={idx + 1}
            name={name}
          />
        })
      }
      {
        fills.map(value => {
          return <Fill key={`res-fill-${value}`} value={value} />
        })
      }
    </ul>
  )
}
