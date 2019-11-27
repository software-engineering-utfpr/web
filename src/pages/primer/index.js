import React, { useState, useEffect } from 'react';
import { Typography, Card, Icon, Button, List, Row, Col, Dropdown, Menu, Modal, Avatar, Input, Form, Divider, Upload } from 'antd';
import GoogleMapReact from 'google-map-react';

import { error, success } from '../../services/messages';
import MainLayout from '../../components/layout';

import axios from 'axios';

import './style.css';

const pinIcon = require('../../images/icons/pin-maps.png');
const { Text, Paragraph } = Typography;
const { Search, TextArea } = Input;

const GOOGLE_MAPS_APIKEY = "AIzaSyAwDqlhR0aPR6lYhzkE2nWdUz6ufbzStLk";

const Primer = props => {
  const { getFieldDecorator, setFieldsValue, resetFields } = props.form;

  const [loadingPage, setLoadingPage] = useState(false);
  const [pageUpdate, setPageUpdate] = useState(false);

  const [residue, setResidue] = useState([]);
  const [residueFiltered, setResidueFiltered] = useState([]);

  const [photo, setPhoto] = useState({
    filePhotos: [],
    loading: false
  });

  const [residueModal, setResidueModal] = useState({
    residueID: '',
    visibility: false,
    loading: false,
    coordinates: {
      lat: -24.046,
      lng: -52.3838 
    },
  });

  const [visualizationModal, setVisualizationModal] = useState({
    visibility: false,
    residue: ''
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

  const searchResidue = (e) => setResidueFiltered(residue.filter(r => r.name.toLowerCase().includes(e.target.value.toLowerCase()) || r.description.toLowerCase().includes(e.target.value.toLowerCase())));

  const openVisualizationModal = (item) => setVisualizationModal({ visibility: true, residue: item });

  const closeVisualizationModal = () => setVisualizationModal({ visibility: false, residue: '' });

  const openNewResidueModal = () => setResidueModal({ ...residueModal, residueID: '', visibility: true });

  const openUpdateResidueModel = (item) => {
    setResidueModal({
      ...residue,
      residueID: item._id,
      visibility: true,
      coordinates: {
        lat: item.latitude,
        lng: item.longitude
      }
    });

    setPhoto({
      filePhotos: [{
        uid: item._id,
        name: item.name,
        url: item.image,
        response: { status: 'success' },
        linkProps: { download: 'image' },
        thumbUrl: item.image
      }]
    });

    setFieldsValue({
      name: item.name,
      description: item.description
    });
  };

  const closeResidueModal = () => {
    setResidueModal({
      loading: false,
      visibility: false,
      coordinates: {
        lat: -24.046,
        lng: -52.3838
      }
    });

    setPhoto({ filePhotos: [] });
    resetFields(['name', 'description']);

  };

  const beforeUploadPhoto = (file) => {
    if(file.type === 'image/jpeg' || file.type === 'image/png') {
      setPhoto({ ...photo, filePhotos: [file] });
      return true;
    }

    error('Extensão Inválida! Permitido apenas imagens');
    return false;
  };

  const uploadPhoto = (id) => {
    setPhoto({ ...photo, loading: true });

    const formData = new FormData();
    formData.append('api_key', '584136724691346');
    formData.append('timestamp', (Date.now() / 1000));
    formData.append('upload_preset', 'p9jvf6ai');
    formData.append('file', photo.filePhotos[0]);

    axios.post('https://api.cloudinary.com/v1_1/dnnkqjrbi/image/upload', formData, {
      headers: { 'X-Requested-With': 'XMLHttpRequest' }
    }).then(res => {
      const image = res.data.secure_url;

      setPhoto({
        filePhotos: [{
          uid: photo.filePhotos[0].uid,
          name: photo.filePhotos[0].name,
          response: { status: 'success' },
          linkProps: { download: 'image' },
          url: image,
          thumbUrl: image
        }],
        loading: false
      });
      setPageUpdate(!pageUpdate);
    }).catch(err => {
      setPhoto({ ...photo, loading: false });
      error(err);
    });
  };

  const handleNewResidue = e => {
    setResidueModal({ ...residueModal, loading: true });
    e.preventDefault();

    props.form.validateFields(['name', 'description'], (err, values) => {
      if(!err) {
        const { name, description } = values;

        axios.post('/api/leavings/', {
          name, description,
          latitude: residueModal.coordinates.lat,
          longitude: residueModal.coordinates.lng,
          image: photo.filePhotos.length === 0 ? undefined : photo.filePhotos[0].url
        }).then(() => {
          closeResidueModal();
          setPageUpdate(!pageUpdate);
          success();
        }).catch((err) => {
          error(err);
        });
      } else {
        setResidueModal({ ...residueModal, loading: false });
      }
    });
  };

  const handleEditResidue = e => {
    setResidueModal({ ...residueModal, loading: true });
    e.preventDefault();

    props.form.validateFields(['name', 'description'], (err, values) => {
      if(!err) {
        const { name, description } = values;

        axios.put('/api/leavings/', {
          id: residueModal.residueID,
          name, description,
          latitude: residueModal.coordinates.lat,
          longitude: residueModal.coordinates.lng,
          image: photo.filePhotos.length === 0 ? undefined : photo.filePhotos[0].url
        }).then(() => {
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
  };

  const deleteResidue = (id) => {
    axios.delete(`/api/leavings/${id}`).then(res => {
      success();
      setPageUpdate(!pageUpdate);
    }).catch(err => {
      error(err);
    });
  };

  return (
    <MainLayout page = "cartilha" loading = { loadingPage } title = "Gerenciamento de Resíduos" breadcrumb = {['Gerenciamento', 'Cartilha']}>
      <Card
        bordered = {false} className = "alert-card" style = {{ borderRadius: 5 }}
        title = {
          <>
            <Icon type = "container" style = {{ marginRight: 6, color: '#00AD45' }} /> Resíduos Cadastrados
          </>
        }
        extra = {
          <Button onClick = { openNewResidueModal } type = "primary" icon = "plus" > Adicionar Resíduo </Button>
        }
      >
        <Row gutter = {24} type = "flex" justify = "end" style = {{ marginBottom: 18 }}>
          <Col span = {14}>
            <Search
              placeholder = "Pesquise por nome ou descrição"
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
                <Button.Group style = {{ fontSize: 17, position: 'absolute', right: 0, top: 0 }}>
                  <Button style = {{ backgroundColor: '#FFFFFF', color: '#2F80ED', borderColor: '#2F80ED' }} onClick = {() => openVisualizationModal(item)} size = "small" icon = "eye" />
                  <Dropdown
                    overlay = {(
                      <Menu>
                        <Menu.Item onClick = { () => openUpdateResidueModel(item) } > <Icon type = "edit" /> Editar </Menu.Item>
                        
                        <Menu.Item
                          onClick = { () => {
                            Modal.confirm({
                              title: 'Deseja realmente apagar este resíduo?',
                              content: 'Esta ação é permanente, não haverá forma de restaurar ação.',
                              okType: 'danger',
                              onOk() {
                                deleteResidue(item._id)
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
              </Row>

              <List.Item.Meta
                style = {{ marginBottom: 0 }}
                className = "card-list-users-web"
                avatar = {
                  <Avatar className = "avatar-contain" shape = "square" size = {80} src = { item.image } />
                }
                title = {<Text strong> { item.name } </Text>}
                description = {<Paragraph type = "secondary" ellipsis={{ rows: 1, expandable: true }} style = {{ width: '100%' }}> { item.description } </Paragraph>}
              />
            </List.Item>
          )}
        />
      </Card>

      <Modal className = "modal-map" visible = { residueModal.visibility } onCancel = { closeResidueModal } footer = { null }>
        <Paragraph style = {{ fontSize: 30, textAlign: 'center', marginBottom: 5 }}> { residueModal.residueID ? 'Editar Resíduo' : 'Novo Resíduo' } </Paragraph>

        <Divider style = {{ fontSize: 20, minWidth: '60%', width: '60%', marginTop: 0, marginLeft: 'auto', marginRight: 'auto' }}>
          <Icon type = { residueModal.residueID ? 'edit' : 'plus' } />
        </Divider>

        <Form onSubmit = { residueModal.residueID ? handleEditResidue : handleNewResidue }>
          <Form.Item label = "Título">
            { getFieldDecorator('name', {
              rules: [{ required: true, message: 'Por favor, insira um título!' }]
            })(
              <Input
                prefix = {<Icon type = "font-size" style = {{ color: 'rgba(0, 0, 0, .25)' }} />}
                placeholder = "Insira o título"
              />
            )}
          </Form.Item>

          <Form.Item label = "Descrição">
            { getFieldDecorator('description', {
              rules: [
                { required: true, message: 'Por favor, digite uma descrição!' }
              ]
            })(
              <TextArea
                prefix = {<Icon type = "text" style = {{ color: 'rgba(0, 0, 0, .25)' }} />}
                placeholder = "Digite uma descrição" style = {{ fontSize: 13 }}
                rows = {5}
              />
            )}
          </Form.Item>

          <Form.Item>
            <Upload 
              beforeUpload = { beforeUploadPhoto }
              customRequest = { () => uploadPhoto(residueModal.residueID) }
              fileList = { photo.filePhotos }
              listType = "picture"
              showUploadList = { !photo.loading }
              accept = "image/*"
              onRemove = { () => setPhoto({...photo, filePhotos: [] }) }
              className = "upload-list-inline"
            >
              <Button loading = { photo.loading } icon = {residueModal.residueID ? "edit" : "plus"}> {residueModal.residueID ? "Editar Imagem" : "Adicionar Imagem"} </Button>
            </Upload>
          </Form.Item>

          <Row style = {{ height: '30vh', width: '100%', marginBottom: 20 }}>
            <GoogleMapReact
              bootstrapURLKeys = {{ key: GOOGLE_MAPS_APIKEY }}
              center = { residueModal.coordinates }
              defaultZoom = {15}
              onClick = { ({x, y, lat, lng, event}) => setResidueModal({ ...residueModal, coordinates: { lat, lng } }) }
            >
              <Row 
                lat = { residueModal.coordinates.lat }
                lng = { residueModal.coordinates.lng }
              >
                <img src = { pinIcon } className = "img-icon" alt = "pinMap"/>
              </Row>
            </GoogleMapReact>
          </Row>

          <Row style = {{ textAlign: 'right' }}>
            <Button size = "default" onClick = { closeResidueModal } style = {{ marginRight: 8 }}> Cancelar </Button>
            <Button loading = { residueModal.loading } type = "primary" htmlType = "submit" size = "default"> { residueModal.residueID ? 'Atualizar' : 'Criar' } </Button>
          </Row>
        </Form>
      </Modal>

      <Modal className = "modal-map" visible = { visualizationModal.visibility } onCancel = { closeVisualizationModal } footer = { null }>
        <Paragraph style = {{ fontSize: 30, textAlign: 'center', marginBottom: 5 }}> {visualizationModal.residue.name} </Paragraph>

        <Divider style = {{ fontSize: 20, minWidth: '60%', width: '60%', marginTop: 0, marginLeft: 'auto', marginRight: 'auto' }}>
          <Avatar className = "avatar-contain" size = {30} src = { visualizationModal.residue.image } />
        </Divider>
      
        <Paragraph>{visualizationModal.residue.description}</Paragraph>

        <Row style = {{ height: '30vh', width: '100%' }}>
          <GoogleMapReact
            bootstrapURLKeys = {{ key: GOOGLE_MAPS_APIKEY }}
            center = {{
              lat: visualizationModal.residue.latitude,
              lng: visualizationModal.residue.longitude,
            }}
            defaultZoom = {15}
          >
            <img
              src = {pinIcon}
              lat = { visualizationModal.residue.latitude }
              lng = { visualizationModal.residue.longitude }
              className = "img-icon"
              alt = "pinMap"
            />
          </GoogleMapReact>
        </Row>      
      </Modal>
    </MainLayout>
  );
};

const WrappedNormalPrimerForm = Form.create({ name: 'PrimerUpdate' })(Primer);
export default WrappedNormalPrimerForm;