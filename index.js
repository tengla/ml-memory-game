import React from 'react';
import ReactDOM from 'react-dom';
import App from './src';

/*import fetch from 'isomorphic-unfetch';
fetch('/api/get-score')
  .then(res => res.json())
  .then(data => console.log(data));*/

ReactDOM.render(<App />,
  document.querySelector('#container'));
