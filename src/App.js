import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';

import ptBR from 'antd/lib/locale-provider/pt_BR';
import moment from 'moment';

import Login from './pages/login';
import Home from './pages/home';
import Profile from './pages/profile';

import Calendar from './pages/calendar';
import Forms from './pages/forms';
import Games from './pages/games';
import Primer from './pages/primer';

import UsersApp from './pages/users-app';
import UsersWeb from './pages/users-web';

import Settings from './pages/settings';

import 'moment/locale/pt-br';
import './App.css';

import axios from 'axios';

axios.defaults.baseURL = 'https://rio-campo-limpo.herokuapp.com/';

moment.locale('pt-BR');

const App = () => {
  return (
    <ConfigProvider locale = {ptBR}>
      <BrowserRouter>
        <Switch>
          <Route path = "/" exact component = { Login } />
          <Route path = "/home" exact component = { Home } />
          <Route path = "/edit/profile" exact component = { Profile } />

          <Route path = "/calendario" exact component = { Calendar } />
          <Route path = "/formulario" exact component = { Forms } />
          <Route path = "/jogos" exact component = { Games } />
          <Route path = "/cartilha" exact component = { Primer } />

          <Route path = "/usuarios-app" exact component = { UsersApp } />
          <Route path = "/usuarios-web" exact component = { UsersWeb } />

          <Route path = "/configuracoes" exact component = { Settings } />

          <Route path = "/*" component = { Login } />
        </Switch>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;