import React, { useState } from 'react';
import { Typography, Button } from 'antd';

import MainLayout from '../../components/layout';

import './style.css';

const { Text } = Typography;

const UsersWeb = props => {
  return (
    <MainLayout page = "web">
      <Text>Users_Web</Text>
      <Button type = "primary" style = {{ color: "white"}}> New User </Button>
    </MainLayout>
  );
};

export default UsersWeb;