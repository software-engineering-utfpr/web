import React, { useState } from 'react';
import { Typography, Button, Row, Col, Modal } from 'antd';

import MainLayout from '../../components/layout';

import './style.css';

const { Text } = Typography;

const UsersWeb = props => {

  const[modalCadastro, setModalCadastro] = useState(false);
  
  const showCadastroModal = () => {
    setModalCadastro(true);
  };

  const handleOk = e => {
    // console.log(e);
    setModalCadastro(false);
  };

  const handleCancel = e => {
    // console.log(e);
    setModalCadastro(false);
  };

  return (
    <MainLayout page = "web">
      <Row>
        <Col span = {4} offset = {20}>
          <Button
            type = "primary"
            style = {{ color: "white"}}
            onClick = {showCadastroModal}
          > Adicionar Usuário </Button>
        </Col>
      </Row>
      <Modal
          title="Basic Modal"
          visible={modalCadastro}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
    </MainLayout>
  );
};

export default UsersWeb;