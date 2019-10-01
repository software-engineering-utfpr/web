import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://rio-campo-limpo.herokuapp.com/'
});

// instance.defaults.headers.common = {
//   ...axios.defaults.headers.common,
//   'Access-Control-Allow-Origin': 'http://localhost:3000',
//   "Content-Type": 'application/json'
// };
instance.defaults.headers.post['Content-Type'] = 'application/json';
instance.defaults.headers.post['Access-Control-Allow-Origin'] = true;

// instance.defaults.headers.common['Authorization'] = 'AUTH TOKEN FROM INSTANCE';

export default instance;