import React from 'react';
import ReactDOM from 'react-dom';

import axios from 'axios';

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

axios.defaults.baseURL = 'https://rio-campo-limpo.herokuapp.com/';
// axios.defaults.headers.common['Authorization'] = 'AUTH TOKEN';
axios.defaults.headers.common = {
  ...axios.defaults.headers.common,
  'Access-Control-Allow-Origin': 'http://localhost:3000',
  "Content-Type": 'application/json'
};

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();
