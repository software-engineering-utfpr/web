import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Menu, Affix, Avatar, Button, Card, Icon, message, Typography, Popover } from 'antd';
import { Link, Redirect, withRouter } from 'react-router-dom';

import axios from 'axios';

import { logout, getID } from '../../services/auth';
import { error } from '../../services/messages';

import './style.css';

const logo = require('../../images/logo.png');

const { Header } = Layout;
const { Text } = Typography;

const NavBar = props => {
  const [nav, setNav] = useState('');
  const [user, setUser] = useState({
    name: '',
    image: '',
    email: ''
  });
  const [affixed, setAffixed] = useState(false);

  useEffect(() => {
    axios.get(`/api/managers/${getID()}`).then(res => {
      setUser(res.data);
    }).catch(err => {
      setNav('/');
      error(err);
    });
  }, []);

  const signout = () => {
    const hide = message.loading('Bye Bye 👋', 0);

    setTimeout(() => {
      setTimeout(hide, 1500);

      logout();
      setNav('/');
    }, 1500);
  }

  if(nav) return (<Redirect to = {nav} />);
  else {
    return(
      <Affix offsetTop = {-100} onChange = { affixed => setAffixed(affixed) }>
        <Header className = { !affixed ? 'haccoon-header' : 'haccoon-header-affixed' }>
          <Row className = "header-content">
            <Link to = "/home">
              <img style = {{ height: affixed ? 45 : 55 }} src = {logo} alt = "Logo Rio do Campo Limpo" />
            </Link>

            <Menu className = "header-menu" selectedKeys = {[props.page]} mode = "horizontal">
              <Menu.Item key = "home" style = {{ paddingRight: 0, paddingLeft: 40 }}>
                <Link to = "/home">
                  <Icon type = "home" style = {{ margin: 0 }} /> &nbsp; Home
                </Link>
              </Menu.Item>

              <Menu.Item key = "calendario" style = {{ paddingRight: 0 }}>
                <Link to = "/calendario"> Calendário </Link>
              </Menu.Item>
              
              <Menu.SubMenu title = "Gerenciamento">
                <Menu.Item key = "web">
                  <Link to = "/usuarios-web">
                    <Icon type = "laptop" />
                    <span> Usuários Web </span>
                  </Link>
                </Menu.Item>

                <Menu.Item key = "cartilha">
                  <Link to = "/cartilha">
                    <Icon type = "question-circle" />
                    <span> Cartilha </span>
                  </Link>
                </Menu.Item>

                <Menu.Item key = "formulario">
                  <Link to = "/formulario">
                    <Icon type = "form" />
                    <span> Formulário </span>
                  </Link>
                </Menu.Item>

                <Menu.Item key = "jogos">
                  <Link to = "/jogos">
                    <Icon type = "trophy" />
                    <span> Jogos </span>
                  </Link>
                </Menu.Item>
              </Menu.SubMenu>
            </Menu>

            <Col className = "header-outer-options">
              <Popover
                overlayClassName = "header-popover-card"
                placement = "bottomRight"
                content = {(
                  <Card className = "card-width" style = {{ width: 350 }} bordered = {false}>
                    <Card.Meta
                      className = "header-card-info"
                      style = {{ padding: '2rem 1rem', background: '#F3F5F9', margin: 0 }}
                      avatar = {<Avatar shape = "square" size = {60} style = {{ filter: 'grayscale(50%)' }} src = { user.image } />}
                      title = {<Text strong> { user.name } </Text>}
                      description = {<Text type = "secondary" ellipsis style = {{ width: '100%' }}> { user.email } </Text>}
                    />

                    <Menu className = "header-card-list-options">
                      <Menu.Item key = "perfil">
                        <Link to = "/edit/profile" replace>
                          <Card.Meta
                            avatar = {<Icon style = {{ fontSize: 20 }} type = "idcard" />}
                            title = {<Text style = {{ fontSize: 13 }}> Meu Perfil </Text>}
                            description = {<Text type = "secondary" ellipsis style = {{ width: '100%', fontSize: 11 }}> Edite as suas Informações de perfil e sua senha. </Text>}
                          />
                          <Icon className = "header-card-right-icon" type = "right" />
                        </Link>
                      </Menu.Item>

                      <Menu.Divider />
                    </Menu>

                    <Button type = "danger" size = "small" icon = "frown" style = {{ margin: 10 }} onClick = { signout }> Sair </Button>
                  </Card>
                )}
              >
                <span style = {{ marginLeft: 10, fontSize: 13, cursor: 'pointer' }}>
                  <Text> Olá, </Text> <Text className = "username" strong> { user.name.replace(/ .*/, '') } </Text>
                  <Avatar shape = "square" size = { affixed ? 40 : 45 } style = {{ marginLeft: 4 }} src = { user.image } />
                </span>
              </Popover>
            </Col>
          </Row>
        </Header>
      </Affix>
    );
  }
}

export default withRouter(NavBar);
