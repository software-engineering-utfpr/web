import React, { useState, useEffect } from 'react';
import { Typography, Card, Icon, Button, List, Row, Col, Popover, Dropdown, Menu, Modal, Badge, Avatar, Input, Form, Divider, Upload } from 'antd';
import { error, success } from '../../services/messages';

import MainLayout from '../../components/layout';
import { isAdmin, getID } from '../../services/auth' ;

import axios from 'axios';

import './style.css';

const { Text, Paragraph } = Typography;
const { Search } = Input;

const Primer = props => {

  const { getFieldDecorator, setFieldsValue, resetFields, getFieldValue, validateFields } = props.form;

  const [loadingPage, setLoadingPage] = useState(false);
  const [residue, setResidue] = useState([]);
  const [residueFiltered, setResidueFiltered] = useState([]);
  const [pageUpdate, setPageUpdate] = useState(false);
  const [photo, setPhoto] = useState({
    residuePhoto: [],
    newResiduePhoto: [],
    loading: false
  });
  const [residueModal, setResidueModal] = useState({
    _id: '',
    visibility: false,
    loading: false
  });

  useEffect(() => {
    setLoadingPage(true);
    axios.get('/api/leavings/').then(res => {
      setResidue(res.data);
      setResidueFiltered(res.data);
      setLoadingPage(false);
    }).catch((err) => {
      setLoadingPage(false);
      error(err);
    });
  }, [pageUpdate]);

  const searchResidue = (e) => setResidueFiltered(residue.filter(r => r.name.toLowerCase().includes(e.target.value.toLowerCase())));

  const openNewResidueModal = () => {
    setResidueModal({ ...residueModal, _id: '', visibility: true });
  }

  const openUpdateResidueModel = (admin) => {
    setResidueModal({ ...residue, _id: admin._id, visibility: true });
    setFieldsValue({
      name: residue.name,
      description: residue.description,
      image: residue.image
    });
  }

  const beforeUploadPhoto = (file) => {
    if(file.type === 'image/jpeg' || file.type === 'image/png') {
      const arquivos = [file];
      setPhoto({ ...photo, newResiduePhoto: arquivos });
      return true;
    }
    error('Extensão Inválida! Permitido apenas imagens');
    setPhoto({ ...photo, newResiduePhoto: [] });
    return false;
  }

  const changeResidue = (residueChange) => {
    setPhoto({ ...photo, loading: true });
    
    const formData = new FormData();
    formData.append('api_key', '584136724691346');
    formData.append('timestamp', (Date.now() / 1000));
    formData.append('upload_preset', 'p9jvf6ai');
    formData.append('file', photo.newResiduePhoto[0]);

    axios.post('https://api.cloudinary.com/v1_1/dnnkqjrbi/image/upload', formData, {
      headers: { 'X-Requested-With': 'XMLHttpRequest' }
    }).then(res => {
      const image = res.data.secure_url;

      axios.put('/api/residue', { id: residueChange._id, image }).then(res => {
        setPhoto({ ...photo, loading: false });
        setPageUpdate(!pageUpdate);
        success();
      }).catch(err => {
        setPhoto({ ...photo, loading: false });
        error(err);
      });
    }).catch(err => {
      setPhoto({ ...photo, loading: false });
      error(err);
    });
  }

  const handleNewAdmin = e => {
    setResidueModal({ ...residueModal, loading: true });
    e.preventDefault();

    props.form.validateFields(['name', 'description'], (err, values) => {
      if(!err) {
        const { name, description, password } = values;

        axios.post('/api/leavings/', { description, name, password }).then(() => {
          setPageUpdate(!pageUpdate);
          closeResidueModal();
          success();
        }).catch((err) => {
          closeResidueModal();
          error(err);
        });
      } else {
        setResidueModal({ ...residueModal, loading: false });
      }
    });
  }

  const handleEditAdmin = e => {
    setResidueModal({ ...residueModal, loading: true });
    e.preventDefault();

    props.form.validateFields(['name', 'description'], (err, values) => {
      if(!err) {
        const { name, description, password } = values;

        axios.put('/api/leavings/', { id: residueModal.adminID, description, name, superuser: '', password }).then(() => {
          setPageUpdate(!pageUpdate);
          closeResidueModal();
          success();
        }).catch((err) => {
          closeResidueModal();
          error(err);
        });
      } else {
        setResidueModal({ ...residueModal, loading: false });
      }
    });
  }


  const closeResidueModal = () => {
    resetFields(['name', 'description']);
    setResidueModal({
      loading: false,
      visibility: false
    });
  }

  return (
    <MainLayout page = "cartilha" loading = { loadingPage } title = "Gerenciamento de Residuos" breadcrumb = {['Gerenciamento ','Cartilha']}>
      <Card
        bordered = {false} className = "alert-card" style = {{ borderRadius: 5 }}
        title = {
          <>
            <Icon type = "container" style = {{ marginRight: 6, color: '#00AD45' }} /> Redíduos Cadastrados
          </>
        }
        extra = {
          isAdmin() === 'true' ? (
            <Button onClick = { () => openNewResidueModal() } type = "primary" icon = "plus" > Adicionar Resíduo </Button>
          ) : null
        }
      >
        <Row gutter = {24} type = "flex" justify = "end" style = {{ marginBottom: 18 }}>
          <Col span = {14}>
            <Search
              placeholder = "Pesquise por um residuo"
              onChange = { e => searchResidue(e) }
              size = "default"
            />
          </Col>
        </Row>

        <List
          itemLayout = "vertical"
          size = "large"
          dataSource = { residueFiltered }
          renderItem = {(item) => (
            <List.Item key = { item._id }>
              <Row>
                { item._id !== getID() ? (
                  <Button.Group style = {{ fontSize: 17, position: 'absolute', right: 0, top: 0 }}>
                     {/* { item.superuser === false ? (
                      <Popover placement = "left" content = "Tornar Administrador">
                        <Button style = {{ backgroundColor: '#FFFFFF', color: '#5ECC62', borderColor: '#5ECC62' }} size = "small" onClick = { () => changePriority(item) } icon = "vertical-align-top" />
                      </Popover>
                    ) : ( 
                      <Popover placement = "left" content = "Retirar Administração">
                        <Button style = {{ backgroundColor: '#FFFFFF', color: '#FF5154', borderColor: '#FF5154' }} size = "small" onClick = { () => changePriority(item) } icon = "vertical-align-bottom" />
                      </Popover>
                    )} */}

                    <Dropdown
                      overlay = {(
                        <Menu>
                          <Menu.Item onClick = { () => openUpdateResidueModel(item) } > <Icon type = "edit" /> Editar </Menu.Item>
                          
                          <Menu.Item
                            onClick = { () => {
                              Modal.confirm({
                                title: 'Deseja realmente apagar este usuário?',
                                content: 'Esta ação é permanente, não haverá forma de restaurar ação.',
                                okType: 'danger',
                                onOk() {
                                  // deleteManager(item._id)
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
      <Modal visible = { residueModal.visibility } onCancel = { closeResidueModal } footer = { null }>
        <Paragraph style = {{ fontSize: 30, textAlign: 'center', marginBottom: 5 }}> { residueModal._id ? 'Editar Residuo' : 'Novo Residuo' } </Paragraph>

        <Divider style = {{ fontSize: 20, minWidth: '60%', width: '60%', marginTop: 0, marginLeft: 'auto', marginRight: 'auto' }}>
          <Icon type = { residueModal._id ? 'edit' : 'plus' } />
        </Divider>

        <Form onSubmit = { residueModal._id ? handleEditAdmin : handleNewAdmin }>
          <Form.Item label = "Foto do Resíduo">
            { getFieldDecorator('fotoDoResiduo')(
              <Row>
                <Avatar shape = "square" size = {200} src = { photo.newResiduePhoto.length === 0 ? photo.profilePhoto : photo.newResiduePhoto } />

                <Upload beforeUpload = { beforeUploadPhoto } customRequest = { () => changeResidue(residueModal._id) } fileList = { photo.newResiduePhoto } showUploadList = {false} accept = "image/*">
                  <Button loading = { photo.loading } icon = "plus" type = "primary" style = {{ backgroundColor: '#2D2E2E', borderColor: '#2D2E2E', position: 'absolute', bottom: 2, left: 2 }}> Adicionar Imagem </Button>
                </Upload>
              </Row>
            )}
          </Form.Item>
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

          <Form.Item label = "Descrição">
            { getFieldDecorator('description', {
              rules: [
                { required: true, message: 'Por favor, digite um email!' }
              ]
            })(
              <Input
                prefix = {<Icon type = "mail" style = {{ color: 'rgba(0, 0, 0, .25)' }} />}
                placeholder = "descrição" style = {{ fontSize: 13 }}
              />
            )}
          </Form.Item>

          <Row style = {{ textAlign: 'right' }}>
            <Button size = "default" onClick = { closeResidueModal } style = {{ marginRight: 8 }}> Cancelar </Button>
            <Button loading = { residueModal.loading } type = "primary" htmlType = "submit" size = "default"> { residueModal._id === 1 ? 'Atualizar' : 'Criar' } </Button>
          </Row>
        </Form>
      </Modal>
    </MainLayout>
  );
};
const WrappedNormalPrimerForm = Form.create({ name: 'PrimerUpdate' })(Primer);
export default WrappedNormalPrimerForm;