import React, { Component } from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';

import ptBR from 'antd/lib/locale-provider/pt_BR';
import moment from 'moment';

import Login from './pages/login/login';

import 'moment/locale/pt-br';
import './App.css';

moment.locale('pt-BR');

class App extends Component {
  render() {
    return (
      <ConfigProvider locale = {ptBR}>
        <BrowserRouter>
          <Switch>
            <Route path = "/*" exact component = { Login } />
          </Switch>
        </BrowserRouter>
      </ConfigProvider>
    );
  }
}

export default App;