import React from 'react';
import { Row, Typography } from 'antd';

import MainLayout from '../../components/layout';

const { Text } = Typography;

const Login = props => {
	return (
    <MainLayout>
      <Row style = {{ textAlign: 'center', marginTop: 8 }}>
        <Text> Tela para fazer o Login. </Text>
      </Row>
    </MainLayout>
	);
};

export default Login;
