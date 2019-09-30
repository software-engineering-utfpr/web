import React, { useState, useEffect } from 'react';
import { Typography, Button, Row, Col, Modal, Input, Form, Icon, List, Dropdown, Menu, Divider, Avatar, Badge, Popover, Card } from 'antd';
import { error, success } from '../../services/messages';

import axios from 'axios';

import { isAdmin, getID } from '../../services/auth' ;
import MainLayout from '../../components/layout';

import './style.css';

const { Search } = Input;
const { Text, Paragraph } = Typography;

const UsersWeb = props => {
  const { getFieldDecorator, setFieldsValue, resetFields, getFieldValue, validateFields } = props.form;

  const [loadingPage, setLoadingPage] = useState(true);
  const [managers, setManagers] = useState([]);
  const [managersFiltered, setManagersFiltered] = useState([]);
  const [adminModal, setAdminModal] = useState({
    adminID: '',
    loading: false,
    visibility: false
  });
  const [pageUpdate, setPageUpdate] = useState(false);

  useEffect(() => {
    setLoadingPage(true);
    axios.get('/https://rio-campo-limpo.herokuapp.com/api/managers/').then(res => {
      setManagers(res.data);
      setManagersFiltered(res.data);
      setLoadingPage(false);
    }).catch((err) => {
      setLoadingPage(false);
      error(err);
    });
  }, [pageUpdate]);
  
  const searchAdmins = (e) => setManagersFiltered(managers.filter(r => r.name.toLowerCase().includes(e.target.value.toLowerCase()) || r.email.toLowerCase().includes(e.target.value.toLowerCase())));

  const openNewAdminModal = () => {
    setAdminModal({ ...adminModal, adminID: '', visibility: true });
  }

  const openUpdateAdminModel = (admin) => {
    setAdminModal({ ...adminModal, visibility: true, adminID: admin._id });
    setFieldsValue({
      name: admin.name,
      email: admin.email
    });
  }

  const closeAdminModal = () => {
    resetFields(['name', 'email', 'password', 'confirmPassword']);
    setAdminModal({
      ...adminModal,
      adminID: '',
      loading: false,
      visibility: false
    });
  }

  const emailValidation = (rule, value, callback) => {
    if((value && managers[managers.map((e) => e.email).indexOf(value)] && !adminModal.adminID) ||
    (value && adminModal.adminID && managers[managers.map((e) => e.email).indexOf(value)] && managers[managers.map((e) => e._id).indexOf(adminModal.adminID)].email !== value)) {
      callback('Email já Cadastrado!');
    } else {
      callback();
    }
  }

  const validateToNextPassword = (rule, value, callback) => {
    if (value && getFieldValue('confirmPassword')) {
      validateFields(['confirmPassword'], { force: true });
    }
    callback();
  }

  const compareToFirstPassword = (rule, value, callback) => {
    if(value && value !== getFieldValue('password')) {
      callback('Senhas Incompatíveis!');
    } else {
      callback();
    }
  }

  const handleNewAdmin = e => {
    setAdminModal({ ...adminModal, loading: true });
    e.preventDefault();

    props.form.validateFields(['name', 'email', 'password', 'confirmPassword'], (err, values) => {
      if(!err) {
        const { name, email, password } = values;

        axios.post('/https://rio-campo-limpo.herokuapp.com/api/managers/', { email, name, password }).then(() => {
          setPageUpdate(!pageUpdate);
          closeAdminModal();
          success();
        }).catch((err) => {
          closeAdminModal();
          error(err);
        });
      } else {
        setAdminModal({ ...adminModal, loading: false });
      }
    });
  }

  const handleEditAdmin = e => {
    setAdminModal({ ...adminModal, loading: true });
    e.preventDefault();

    props.form.validateFields(['name', 'email'], (err, values) => {
      if(!err) {
        const { name, email, password } = values;

        axios.put('/https://rio-campo-limpo.herokuapp.com/api/managers/', { id: adminModal.adminID, email, name, superuser: '', password }).then(() => {
          setPageUpdate(!pageUpdate);
          closeAdminModal();
          success();
        }).catch((err) => {
          closeAdminModal();
          error(err);
        });
      } else {
        setAdminModal({ ...adminModal, loading: false });
      }
    });
  }

  const changePriority = (item) => {
    const superuser = !item.superuser;
    axios.put('/https://rio-campo-limpo.herokuapp.com/api/managers/', { id: item._id , superuser }).then(() => {
      success();
      setPageUpdate(!pageUpdate);
    }).catch((err) => {
      error(err);
    });
  }

  const deleteManager = (id) => {
    axios.delete(`/api/managers/${id}`).then(res => {
      success();
      setPageUpdate(!pageUpdate);
    }).catch(err => {
      error(err);
    });
  }

  return (
    <MainLayout page = "web" loading = { loadingPage } title = "Gerenciamento de Usuários Web" breadcrumb = {['Gerenciamento', 'Usuários', 'Web']}>
    <Card
        bordered = {false} className = "alert-card" style = {{ borderRadius: 5 }}
        title = {
          <>
            <Icon type = "container" style = {{ marginRight: 6, color: '#00AD45' }} /> Usuários Cadastrados
          </>
        }
        extra = {
          isAdmin() === 'true' ? (
            <Button type = "primary" icon = "plus" onClick = { openNewAdminModal } > Adicionar Usuário </Button>
          ) : null
        }
      >
        <Row gutter = {24} type = "flex" justify = "end" style = {{ marginBottom: 18 }}>
          <Col span = {14}>
            <Search
              placeholder = "Pesquise por nome ou email"
              onChange = { e => searchAdmins(e) }
              size = "default"
            />
          </Col>
        </Row>

        <List
          itemLayout = "vertical"
          size = "large"
          dataSource = { managersFiltered }
          renderItem = {(item) => (
            <List.Item key = { item._id }>
              <Row>
                { item._id !== getID() ? (
                  <Button.Group style = {{ fontSize: 17, position: 'absolute', right: 0, top: 0 }}>
                    { item.superuser === false ? (
                      <Popover placement = "left" content = "Tornar Administrador">
                        <Button style = {{ backgroundColor: '#FFFFFF', color: '#5ECC62', borderColor: '#5ECC62' }} size = "small" onClick = { () => changePriority(item) } icon = "vertical-align-top" />
                      </Popover>
                    ) : ( 
                      <Popover placement = "left" content = "Retirar Administração">
                        <Button style = {{ backgroundColor: '#FFFFFF', color: '#FF5154', borderColor: '#FF5154' }} size = "small" onClick = { () => changePriority(item) } icon = "vertical-align-bottom" />
                      </Popover>
                    )}

                    <Dropdown
                      overlay = {(
                        <Menu>
                          <Menu.Item onClick = { () => openUpdateAdminModel(item) }> <Icon type = "edit" /> Editar </Menu.Item>
                          
                          <Menu.Item
                            onClick = { () => {
                              Modal.confirm({
                                title: 'Deseja realmente apagar este usuário?',
                                content: 'Esta ação é permanente, não haverá forma de restaurar ação.',
                                okType: 'danger',
                                onOk() {
                                  deleteManager(item._id)
                                },
                                onCancel() {}
                              });
                            }}
                          >
                            <Icon type = "delete" /> Excluir
                          </Menu.Item>
                        </Menu>
                      )}
                      placement = "bottomRight"
                    >
                      <Button size = "small" style = {{ backgroundColor: '#FFFFFF', color: '#2D2E2E', borderColor: '#2D2E2E65' }} icon = "more" />
                    </Dropdown>
                  </Button.Group>
                ) : null }
              </Row>

              <List.Item.Meta
                style = {{ marginBottom: 0 }}
                className = "card-list-users-web"
                avatar = {
                  item.superuser ? (
                    <Badge count = {<Popover placement = "right" content = "Administrador"> <Icon type = "star" theme = "filled" style = {{ color: '#FFFFFF', background: '#2F80ED', borderRadius: '50%', padding: 5 }}/> </Popover>}>
                      <Avatar shape = "square" size = {80} src = { item.image } />
                    </Badge>
                  ) : (
                    <Avatar shape = "square" size = {80} src = { item.image } />
                  )
                }
                title = {<Text strong> { item.name } </Text>}
                description = {<Text type = "secondary" ellipsis style = {{ width: '100%' }}> { item.email } </Text>}
              />
            </List.Item>
          )}
        />
      </Card>

      <Modal visible = { adminModal.visibility } onCancel = { closeAdminModal } footer = { null }>
        <Paragraph style = {{ fontSize: 30, textAlign: 'center', marginBottom: 5 }}> { adminModal.adminID ? 'Editar Usuário' : 'Novo Usuário' } </Paragraph>

        <Divider style = {{ fontSize: 20, minWidth: '60%', width: '60%', marginTop: 0, marginLeft: 'auto', marginRight: 'auto' }}>
          <Icon type = { adminModal.adminID ? 'edit' : 'plus' } />
        </Divider>

        <Form onSubmit = { adminModal.adminID ? handleEditAdmin : handleNewAdmin }>
          <Form.Item label = "Nome">
            { getFieldDecorator('name', {
              rules: [{ required: true, message: 'Por favor, insira um nome!' }]
            })(
              <Input
                prefix = {<Icon type = "user" style = {{ color: 'rgba(0, 0, 0, .25)' }} />}
                placeholder = "Seu Nome"
              />
            )}
          </Form.Item>

          <Form.Item label = "Email">
            { getFieldDecorator('email', {
              rules: [
                { required: true, message: 'Por favor, digite um email!' },
                { type: 'email', message: 'Por favor, digite um email válido!' },
                { validator: emailValidation }
              ]
            })(
              <Input
                prefix = {<Icon type = "mail" style = {{ color: 'rgba(0, 0, 0, .25)' }} />}
                placeholder = "nome@exemplo.com" style = {{ fontSize: 13 }}
              />
            )}
          </Form.Item>

          { !adminModal.adminID ? (
            <Row gutter = {16}>
              <Col span = {12}>
                <Form.Item label = "Senha">
                  { getFieldDecorator('password', {
                    rules: [
                      { required: true, message: 'Por favor, insira uma senha!' },
                      { min: 8, message: 'Por favor, insira uma senha maior que 7!' },
                      { validator: validateToNextPassword }
                    ]
                  })(
                    <Input.Password
                      prefix = {<Icon type = "lock" style = {{ color: 'rgba(0, 0, 0, .25)' }} />}
                      placeholder = "senha" style = {{ fontSize: 13 }}
                    />
                  )}
                </Form.Item>
              </Col>

              <Col span = {12}>
                <Form.Item label = "Confirmar Senha">
                  { getFieldDecorator('confirmPassword', {
                    rules: [
                      { required: true, message: 'Por favor, confirme sua senha!' },
                      { min: 8, message: 'Por favor, insira uma senha maior que 7!' },
                      { validator: compareToFirstPassword }
                    ]
                  })(
                    <Input.Password
                      prefix = {<Icon type = "lock" style = {{ color: 'rgba(0, 0, 0, .25)' }} />}
                      placeholder = "senha" style = {{ fontSize: 13 }}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
          ) : null }

          <Row style = {{ textAlign: 'right' }}>
            <Button size = "default" onClick = { closeAdminModal } style = {{ marginRight: 8 }}> Cancelar </Button>
            <Button loading = { adminModal.loading } type = "primary" htmlType = "submit" size = "default"> { adminModal.adminID ? 'Atualizar' : 'Criar' } </Button>
          </Row>
        </Form>
      </Modal>
    </MainLayout>
  );
};

const WrappedNormalUsersWebForm = Form.create({ name: 'memberSignIn' })(UsersWeb);
export default WrappedNormalUsersWebForm;