// login.js

import React, { Component } from 'react';
import { Row, Typography } from 'antd';

const { Text } = Typography;

class Login extends Component {
  constructor() {
    super();

    this.state = { };
  }

  render() {
    return (
      <Row>
				<Row style = {{ textAlign: 'center', marginTop: 8 }}>
					<Text> Tela para fazer o Login. </Text>
				</Row>
      </Row>
    );
  }
}

export default Login;