import React, { useState, useEffect } from 'react';
import { Typography, Button, Row, Col, Modal, Input, Form, Icon, List, Avatar, Badge, Popover, Card } from 'antd';
import { error, success } from '../../services/messages';

// import { Redirect } from 'react-router-dom';

import axios from 'axios';

import MainLayout from '../../components/layout';

import './style.css';

import { isAdmin } from '../../services/auth' ;

const { Search } = Input;

const { Text } = Typography;

const UsersWeb = props => {

  const { getFieldDecorator, setFieldsValue } = props.form;

  const[modalCadastro, setModalCadastro] = useState(false);
  const[modalUpdate, setModalUpdate] = useState(false);
  const[managers, setManagers] = useState([{}]);
  const[managersFiltered, setManagersFiltered] = useState([{}])
  const[confirmLoading, setConfirmLoading] = useState(false);
  const[loadingPage, setLoadingPage] = useState(true);
  const[itemUpdate, setItemUpdate] = useState({});
  const[pageUpdate, setPageUpdate] = useState(false);

  useEffect(() => {
    setLoadingPage(true);
    axios.get('/api/managers/').then(res => {
      // const Users = res.data;
      setManagers(res.data);
      setManagersFiltered(res.data);
      setLoadingPage(false);
    }).catch((err) => {
      setLoadingPage(false);
      error(err);
    });
  },[pageUpdate]); // só re-renderiza se users.length mudar

  function cleanInputs(){
    const form = props.form;
    form.setFieldsValue({ userName: ''});
    form.setFieldsValue({ email: ''});
    form.setFieldsValue({ password: ''});
    form.setFieldsValue({ confirmPassword: ''});
    form.setFieldsValue({ userNameUpdate: ''});
    form.setFieldsValue({ emailUpdate: ''});
    form.setFieldsValue({ passwordUpdate: ''});
    form.setFieldsValue({ confirmPasswordUpdate: ''});

  }

  // Modal functions ------------------------------------------------------------------------
  const showCadastroModal = () => {
    setModalCadastro(true);
  };

  const handleCadastroOk = e => {
    setConfirmLoading(true);
    props.form.validateFields(['userName', 'email', 'password', 'confirmPassword'], (err, values) => {
      if (!err) {
        const { userName, email, password, } = values;
        const name = userName;

        axios.post('/api/managers/', { email, name, password }).then(() => {
          success();
          setConfirmLoading(false);
          setModalCadastro(false);
          cleanInputs();
          setPageUpdate(!pageUpdate);
        }).catch((err) => {
          setConfirmLoading(false);
          setModalCadastro(false);
          error(err);
<<<<<<< HEAD
        });
      } else {
          error(err);
=======
          });
      } else {
>>>>>>> ee95c4d9ca00e5d71d43ccf92f8d150440151968
          setConfirmLoading(false);
          setModalCadastro(false);
      }
    }).catch((err) => {
      error(err);
      setConfirmLoading(false);
      setModalCadastro(false);
    });
    setConfirmLoading(false);
    setModalCadastro(false);
  };

  const handleCadastroCancel = e => {
    setModalCadastro(false);
    setConfirmLoading(false);
  };

  const showUpdateModal = (item) => {
    setFieldsValue({
      userNameUpdate: item.name,
      emailUpdate: item.email,
    });
    setItemUpdate(item);
    setModalUpdate(true);
  };

  const handleUpdateOk = e => {
    setConfirmLoading(true);
    props.form.validateFields(['userNameUpdate', 'emailUpdate', 'passwordUpdate', 'confirmPasswordUpdate'], (err, values) => {
      if (!err) {
        var { userNameUpdate, emailUpdate, passwordUpdate, } = values;
        if(passwordUpdate === ' '){
          passwordUpdate = itemUpdate.password
        }
        axios.put('/api/managers/', { id: itemUpdate._id ,email: emailUpdate, name: userNameUpdate, password: passwordUpdate, superuser: itemUpdate.superuser, image: itemUpdate.image }).then(() => {
          success();
          setConfirmLoading(false);
          setModalUpdate(false);
          cleanInputs();
          setPageUpdate(!pageUpdate);

        }).catch((err) => {
          setConfirmLoading(false);
          setModalUpdate(false);
          error(err);
        });
      } else {
          error(err);
          setConfirmLoading(false);
          setModalUpdate(false);
      }
    }).catch((err) => {
      error(err);
      setConfirmLoading(false);
      setModalUpdate(false);
    });
    setConfirmLoading(false);
    setModalUpdate(false);
  };

  const handleUpdateCancel = e => {
    setModalUpdate(false);
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

  function compareToFirstPasswordUpdate (rule, value, callback) {
    const { form } = props;
    if (value && value !== form.getFieldValue('passwordUpdate')) {
      callback('senha de confirmação incompativel!');
    } else {
      callback();
    }
  };

  function passwordValidator (rule, value, callback) {
    if (value.length < 6) {
      callback('digitos minimos: 6');
    }
    callback();
  };

  function passwordValidatorUpdate (rule, value, callback) {
    if(value !== '') {
      if (value.length < 6) {
        callback('digitos minimos: 6');
      }
    }
    callback();
  };
  // End validators ------------------------------------------------------------------------

  const searchByName = (e) => setManagersFiltered(managers.filter(r => r.name.toLowerCase().includes(e.target.value.toLowerCase())));

  function changePriority (item) {
    setConfirmLoading(true);
    const superuser = !item.superuser;
    console.log(item.superuser, superuser);
    axios.put('/api/managers/', { id: item._id , superuser  }).then(() => {
      success();
      setConfirmLoading(false);
      setPageUpdate(!pageUpdate);
    }).catch((err) => {
      setConfirmLoading(false);
      error(err);
      });
  };

  const deleteManager = (id) => {
    axios.delete(`/api/managers/${id}`).then(res => {
      success();
      setPageUpdate(!pageUpdate);
    }).catch(err => {
      error(err);
    });
  }

  return (
    <MainLayout page = "web" loading = {loadingPage} title = "Gerenciamento de Usuários Web" breadcrumb = {['Gerenciamento', 'Web']}>
     <Card
        bordered = {false} className = "alert-card" style = {{ borderRadius: 5 }}
        title = {
          <>
            <Icon type = "container" style = {{ marginRight: 6, color: '#00AD45' }} /> Usuários cadastrados
          </>
        }
        extra = {
          isAdmin() === 'true' ? (
            <Button type = "primary" style = {{ color: "white"}} onClick = {showCadastroModal} > Adicionar Usuário </Button>
          ) : null
        }
      >
        <Row gutter = {24} type = "flex" justify = "end" style = {{ marginBottom: 18 }}>
          <Col span = {10}>
            <Search
              placeholder = "Pesquise por nome"
              onChange = { e => searchByName(e) }
              size = "default"
            />
          </Col>
        </Row>
        <Row>
          <Col span = {22} type = "flex" justify = "center">
            <List
              itemLayout="vertical"
              size="large"
              dataSource = { managersFiltered }
              renderItem = {(item) => (
                <List.Item
                  key={item.Name}
                  actions={
                    isAdmin() === 'true' ? ([
                    <Popover content = "editar usuário">
                      <Icon type="edit" onClick = {() => changePriority(item)} />
                    </Popover>,
                    <Popover content = "deletar usuário">
                      <Icon type="delete"
                            onClick = { () => {
                            Modal.confirm({
                              title: 'Deseja realmente apagar este Usuário?',
                              content: 'Esta ação é permanente, não haverá forma de restaurar ação.',
                              okType: 'danger',
                              onOk() {
                                deleteManager(item._id)
                              },
                              onCancel() {}
                            });
                          }}
                          style = {{ color: "red" }}  />
                    </Popover>,
                    <Popover content = "!Superuser">
                      <Button onClick = {() => changePriority(item)} > !Superuser </Button>
                    </Popover>
                    ]) : ([])
                  }
                >
                  <List.Item.Meta
                    avatar={
                      item.superuser ? 
                      <Badge count={<Popover content={"Esse é um administrador"}> <Icon type = "star" style = {{ color: 'yellow' }}/> </Popover>}>
                        <Avatar shape="square" size={64} src={item.image} />
                      </Badge> :
                      <Avatar shape="square" size={64} src={item.image} />
                    }
                    
                      title={<Text>{item.name}</Text>}
                    description={item.email}
                  />
                </List.Item>
              )}
            />
          </Col>
        </Row>
      </Card>
      <Modal
          title="Adicionar Usuário"
          visible={modalCadastro}
          onOk={handleCadastroOk}
          onCancel={handleCadastroCancel}
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
      <Modal
        title="Adicionar Usuário"
        visible={modalUpdate}
        onOk={handleUpdateOk}
        onCancel={handleUpdateCancel}
        confirmLoading={confirmLoading}
      >
        <Row style = {{ textAlign : "center" }}>
          <Col span = {18} offset = {3}>
            <Form layout = "vertical">
              <Form.Item>
                {getFieldDecorator('userNameUpdate', {
                  // initialValue : ' ',
                  rules: [{ required: true, message: 'Please input your username!' }],
                })(
                  <Input
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Nome do Usuário"
                  />,
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('emailUpdate', {
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
                {getFieldDecorator('passwordUpdate', {
                  initialValue : '',
                  rules: [{validator: passwordValidatorUpdate }],
                })(
                  <Input.Password
                    prefix={<Icon type="unlock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Senha"
                  />,
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('confirmPasswordUpdate', {
                  initialValue : '',
                  rules: [{validator: compareToFirstPasswordUpdate }],
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