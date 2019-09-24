import React from 'react';
import { Layout, BackTop } from 'antd';

import NavBar from '../navbar';
import Footer from '../footer';

import './style.css';

const { Content } = Layout;

const MainLayout = props => {
  return(
    <Layout style = {{ minHeight: '200vh' }}>
      <BackTop style = {{ bottom: 100, right: 70 }} />
      <NavBar page = { props.page } />

      <Layout>
        <Content className = "main-content">
          { props.children }
        </Content>
      </Layout>

      <Footer />
    </Layout>
  );
};

export default MainLayout;