import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Modal, Input, Form, Icon, notification } from 'antd';
// import { Redirect } from 'react-router-dom';

import axios from 'axios';

import MainLayout from '../../components/layout';

import './style.css';

// const { Text } = Typography;

const UsersWeb = props => {

  const { getFieldDecorator } = props.form;

  const[modalCadastro, setModalCadastro] = useState(false);
  const[managers, setManagers] = useState([{}]);
  const[confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    axios.get('/api/managers/').then(res => {
      // const Users = res.data;
      setManagers(res.data);
    }).catch((err) => {
    });
  },[managers.length]); // só re-renderiza se users.length mudar

  function cleanInputs(){
    const form = props.form;
    form.setFieldsValue({ userName: ''});
    form.setFieldsValue({ email: ''});
    form.setFieldsValue({ password: ''});
    form.setFieldsValue({ confirmPassword: ''});
  }

  // Modal functions ------------------------------------------------------------------------
  const showCadastroModal = () => {
    setModalCadastro(true);
  };

  const handleOk = e => {
    setConfirmLoading(true);
    props.form.validateFields(['userName', 'email', 'password', 'confirmPassword'], (err, values) => {
      if (!err) {
        const { userName, email, password, } = values;
        const name = userName;

        axios.post('/api/managers/', { email, name, password }).then(() => {
          notification.success({
            message: 'Tudo Certo!',
            description: 'Novo usuário cadastrado!'
          });
          setConfirmLoading(false);
          setModalCadastro(false);
          cleanInputs();

        }).catch(() => {
          setConfirmLoading(false);
          setModalCadastro(false);
          notification.error({
            message: 'Opa!',
            description: 'Houve um problema aqui: Não conseguimos enviar dados no Servidor.'
          });
        });
      } else {
        notification.error({
          message: 'Opa!',
          description: 'Dados inseridos incorretos, Corrija e tente novamente.'
        });
        setConfirmLoading(false);
        setModalCadastro(false);
      }
    }).catch(() => {
      notification.error({
        message: 'Opa!',
        description: 'Probreminha.'
      });
    });
  };

  const handleCancel = e => {
    setModalCadastro(false);
    setConfirmLoading(false);
  };
  // End Modal Functions ------------------------------------------------------------------------

  // validators ------------------------------------------------------------------------
  function usernameValidation (rule, value, callback) {
    if (managers[managers.map((e) => e.name).indexOf(value)]) {
      callback('Username já Cadastrado!');
    } else {
      callback();
    }
  }

  function compareToFirstPassword (rule, value, callback) {
    const { form } = props;
    if (value && value !== form.getFieldValue('password')) {
      callback('senha de confirmação incompativel!');
    } else {
      callback();
    }
  };

  function passwordValidator (rule, value, callback) {
    const { form } = props;
    if (value.length < 6) {
      callback('digitos minimos: 6');
    }
    callback();
  };
  // End validators ------------------------------------------------------------------------

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
          title="Adicionar Usuário"
          visible={modalCadastro}
          onOk={handleOk}
          onCancel={handleCancel}
          confirmLoading={confirmLoading}
        >
          <Row style = {{ textAlign : "center" }}>
            <Col span = {18} offset = {3}>
              <Form layout = "vertical">
                <Form.Item>
                  {getFieldDecorator('userName', {
                    // initialValue : ' ',
                    rules: [{ required: true, message: 'Please input your username!' },
                    {validator: usernameValidation}
                    ],
                  })(
                    <Input
                      prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      placeholder="Nome do Usuário"
                    />,
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('email', {
                    // initialValue : ' '  ,
                    rules: [{type: 'email', message: 'Email Inválido'},
                      { required: true, message: 'Please input your email!' },
                    ],
                  })(
                    <Input
                      prefix={<Icon type="google" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      placeholder="E-mail"
                    />,
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('password', {
                    // initialValue : ' ',
                    rules: [{ required: true, message: 'Please input your password!' },
                    {validator: passwordValidator }
                    ],
                  })(
                    <Input.Password
                      prefix={<Icon type="unlock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      placeholder="Senha"
                    />,
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('confirmPassword', {
                    // initialValue : ' ',
                    rules: [{ required: true, message: 'Please input your confirmPassword!' },
                    {validator: compareToFirstPassword },
                  ],
                  })(
                    <Input.Password
                      prefix={<Icon type="unlock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      placeholder="Confirmação de senha"
                    />,
                  )}
                </Form.Item>
              </Form>
            </Col>
          </Row> 
        </Modal>
    </MainLayout>
  );
};

const WrappedNormalUsersWebForm = Form.create({ name: 'memberSignIn' })(UsersWeb);
export default WrappedNormalUsersWebForm;