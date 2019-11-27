import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Spin, Icon, Breadcrumb, Menu, Typography, BackTop } from 'antd';
import { Link, Redirect } from 'react-router-dom';

import NavBar from '../navbar';
import Footer from '../footer';

import { getToken } from '../../services/auth';

import './style.css';

const { Content, Sider } = Layout;
const { Text } = Typography;

const MainLayout = props => {
  const [nav, setNav] = useState('');

  useEffect(() => {
    if(!getToken()) setNav('/');
  }, []);

  if(nav) return (<Redirect to = {nav} />);
  else {
    return(
      <Layout style = {{ minHeight: '100vh' }}>
        <Sider theme = "light" className = "mobile-menu" breakpoint = "lg" collapsedWidth = "0">
          <Menu style = {{ paddingTop: 90 }} selectedKeys = {[props.page]}>
            <Menu.Item key = "home">
              <Link to = "/home">
                <Icon type = "home" />
                <span> Home </span>
              </Link>
            </Menu.Item>

            <Menu.Item key = "calendario">
              <Link to = "/calendario">
                <Icon type = "calendar" />
                <span> Calendário </span>
              </Link>
            </Menu.Item>

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
          </Menu>
        </Sider>

        <Layout>
          <BackTop style = {{ bottom: 100, right: 70 }} />
          <NavBar page = { props.page } />

          <Content className = "main-content">
            <Spin spinning = { props.loading }>

              <Col span = {20} push = {2}>
                <Row className = "menu-breadcrumb" style = {{ marginBottom: 20, display: 'flex' }}>
                  <Text style = {{ fontSize: 16, fontWeight: 500, marginRight: 16 }}> { props.title } </Text>

                  { props.breadcrumb ? (
                    <Breadcrumb className = "main-layout-breadcrumb" separator = {<div className = "main-layout-breadcrumb-separator" />}>
                      <Breadcrumb.Item style = {{ verticalAlign: 'sub' }}>
                        <Link to = "/home">
                          <Icon type = "home" />
                        </Link>
                      </Breadcrumb.Item>

                      { props.breadcrumb.map(item => (
                        <Breadcrumb.Item key = {item} style = {{ cursor: 'pointer', verticalAlign: 'sub' }}> {item} </Breadcrumb.Item>
                      ))}
                    </Breadcrumb>
                  ) : null }
                </Row>

                { props.children }
              </Col>
            </Spin>
          </Content>

          <Footer />
        </Layout>
      </Layout>
    );
  }
};

export default MainLayout;