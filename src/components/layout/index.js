import React from 'react';
import { Layout, Row, Col, Spin, Icon, Breadcrumb, Typography, BackTop } from 'antd';
import { Link } from 'react-router-dom';

import NavBar from '../navbar';
import Footer from '../footer';

import './style.css';

const { Content } = Layout;
const { Text } = Typography;

const MainLayout = props => {
  return(
    <Spin spinning = { props.loading }>
      <Layout style = {{ minHeight: '100vh' }}>
        <BackTop style = {{ bottom: 100, right: 70 }} />
        <NavBar page = { props.page } />

        <Layout>
          <Content className = "main-content">
            <Row>
              <Col span = {20} push = {2}>
                <Row style = {{ marginBottom: 20, display: 'flex' }}>
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
            </Row>
          </Content>
        </Layout>

        <Footer />
      </Layout>
    </Spin>
  );
};

export default MainLayout;