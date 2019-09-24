import React from 'react';
import { Layout, Row, Col, Icon, Popover, Typography } from 'antd';

import './style.css';

const { Footer } = Layout;
const { Text } = Typography;

const FooterContent = props => {
  return (
    <Footer style = {{ background: '#FFFFFF', padding: 30, textAlign: 'center' }}>
      <Row className = "footer-redes-sociais">
        <Col span = {12} style = {{ textAlign: 'left', marginTop: 20 }}>
          <Text strong style = {{ color: '#2D2E2E', fontSize: 11 }}> © 2019. </Text>
          <Text style = {{ color: '#2D2E2E', fontSize: 11 }}> Rio do Campo Limpo </Text>
        </Col>

        <Col span = {12} style = {{ textAlign: 'right', marginTop: 20 }}>
          <Popover content = "Facebook">
            <a href = "https://www.facebook.com/ProjetoRiodoCampoLimpo/" rel = "noopener noreferrer" target = "_blank">
              <Icon style = {{ color: '#3B5998' }} type = "facebook" />
            </a>
          </Popover>

          <Popover content = "Instagram">
            <a href = "https://www.instagram.com/riodocampolimpocm/" rel = "noopener noreferrer" target = "_blank" style = {{ marginLeft: 20 }}>
              <Icon style = {{ color: '#E33F5F' }} type = "instagram" />
            </a>
          </Popover>
        </Col>
      </Row>
    </Footer>
  );
}

export default FooterContent;