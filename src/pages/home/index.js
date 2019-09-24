import React from 'react';
import { Typography } from 'antd';

import MainLayout from '../../components/layout';

import './style.css';

const { Text } = Typography;

const Home = props => {
  return (
    <MainLayout page = "home">
      <Text>oioio</Text>
    </MainLayout>
  );
};

export default Home;