import React, { useState, useEffect } from 'react';
// import { Button, Avatar, Select, List, Card, Form, Col, Icon, Divider, Row, Modal, Input, Typography, Tag, Spin, Popover, notification } from 'antd';

import axios from 'axios';
import { Typography, List, Col, Row, Card, Icon, Input, Button, Modal, Popover, Form, Upload, Avatar } from 'antd';
import MainLayout from '../../components/layout';
import { err503, err401, errGeneral, success } from '../../services/messages';

import './style.css';

// const { Meta } = Card;
// const { Title, Paragraph, Text } = Typography;
// const { Search } = Input;
// const { Option } = Select;


const { Text, Title } = Typography;
const { Search } = Input;
// const { Link } = Anchor;


const Games = props => {

  const { getFieldDecorator } = props.form;
  const [data, setData] = useState([]);
  const [newProfilePhoto, setNewProfilePhoto] = useState([]);
  const [profilePhoto, setProfilePhoto]  = useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIlDl_IghRICLwvSmLHU3PbYTr9SWR6XZ_ZPN50_X3998nmxaH");
  const[modalGameCadastro, setModalGameCadastro] = useState(false);
  const[modalGameUpdate, setModalGameUpdate] = useState(false);
  const[idModal, setIdModal] = useState(false);

  const showGameCadastroModal = () => {
    setModalGameCadastro(true);
  };

  const handleGameCadastroOk = e => {
    e.preventDefault();

    props.form.validateFields(['name', 'link'], (err, values) => {
      if (!err) {
        const { name, link } = values;
        const image = profilePhoto
        axios.post('/api/games', { name, link, image }).then(res => {
          setModalGameCadastro(false);
          success();
        }).catch(err => {
          setModalGameCadastro(false);
          if(err.response && err.response.status === 503) err503();
          else if(err.response && err.response.status === 401) err401();
          else errGeneral();
        });
        }
    });
  };

  const handleGameCadastroCancel = e => {
    setModalGameCadastro(false);
  };

  const showGameUpdateModal = (id, name, link) => {
    setIdModal(id);
    props.form.setFieldsValue({
      nameUpdate: name,
      linkUpdate: link
    })
    setModalGameUpdate(true);
  };

  const handleGameUpdateOk = e => {
    e.preventDefault();

    props.form.validateFields(['nameUpdate', 'linkUpdate'], (err, values) => {
      if (!err) {
        const { nameUpdate, linkUpdate } = values;
        const name = nameUpdate;
        const link = linkUpdate;
        const image = profilePhoto
        const id = idModal;
        axios.put('/api/games', { id, name, link, image }).then(res => {
          setModalGameUpdate(false);
          success();
        }).catch(err => {
          setModalGameUpdate(false);
          if(err.response && err.response.status === 503) err503();
          else if(err.response && err.response.status === 401) err401();
          else errGeneral();
        });
      }
    });
  };

  const handleGameUpdateCancel = e => {
    setModalGameUpdate(false);
  };

  useEffect(() => {
    axios.get('/api/games').then((res) => {
      setData(res.data);
    }).catch((err) => {
      if(err.response && err.response.status === 503) err503();
      else if(err.response && err.response.status === 401) err401();
      else errGeneral();
    });
  }, []);

  // searchByName = (e) => {
  //   if (e.target.value === '') { this.componentWillMount(); }

  //   axios.get(`/api/games/search/${e.target.value}`).then(res => {
  //     const members = res.data;

  //     members.sort((obj1, obj2) => (obj1.status < obj2.status ? -1 : (obj1.status > obj2.status ? 1 : 0)));

  //     this.setState({ members });
  //   }).catch(err => {
  //     console.log(err);
  //   });
  // }

  const deleteGame = (id) => {
    console.log("entrei", id);
    axios.delete('/api/games', { id }).then(res => {
      console.log(res);
      success();
    }).catch(err => {
      setModalGameCadastro(false);
      if(err.response && err.response.status === 503) err503();
      else if(err.response && err.response.status === 401) err401();
      else errGeneral();
    });
  }

  const beforeUploadPhoto = (file) => {
    if (file.type === 'image/jpeg' || file.type === 'image/png') {
      const arquivos = [file];
      setNewProfilePhoto(arquivos);
      return true;
    }else {
      errGeneral();
      setNewProfilePhoto([]);
      return false;
    }
  }

  const changeProfilePhoto = () => {

    const formData = new FormData();
    formData.append('api_key', '784737987534174');
    formData.append('timestamp', (Date.now() / 1000));
    formData.append('upload_preset', 'hatsxc2p');
    formData.append('file', newProfilePhoto[0]);

    axios.post('https://api.cloudinary.com/v1_1/haken/image/upload', formData, {
      headers: { 'X-Requested-With': 'XMLHttpRequest' }
    }).then(res => {
        setProfilePhoto(res.data.secure_url);
    }).catch(err => {
        setNewProfilePhoto([]);
    });
  }

  return (
    <MainLayout page="jogos">
      <Row style={{ marginBottom: 20, marginLeft: 50 }}>
        <Title level = {2}>Gerenciamento de Jogos</Title>
      </Row>
      <Row gutter={24} type="flex" justify="end">
        <Col span={10}>
          <Search
            placeholder="Pesquise pelo nome do jogo"
            onChange={e => this.searchByName(e)}
            style={{ marginBottom: 18 }}
            size="default"
          />
        </Col>
        <Col span = {5} >
          <Button
            type = "primary"
            style = {{ color: "white"}}
            onClick = {showGameCadastroModal}
          > Adicionar Jogo </Button>
        </Col>
      </Row>
      <Row style={{ marginBottom: 50 }}>
        <Col span={22} offset={1}>
          <List
            grid={{ gutter: 16, column: 4 }}
            size="small"
            dataSource={data}
            renderItem={(item) => (
              <Col style={{ paddingTop: 30 }} span={6}>
                <a href = {item.link} target="_blank" rel="noopener noreferrer">
                  <Card 
                    hoverable
                    bordered = {false}
                  >
                    <Col span={22} offset={1} type="flex" justify="center">
                      <Row type="flex" justify="center">
                        <Avatar shape="square" style={{width: 200, height: 130, marginLeft: 4 }} src={item.image} />
                      </Row>
                      <Row>
                        <Col span={19} offset={1}>
                          <Text>{item.name}</Text>
                        </Col>
                        <Col span={2} offset={1}>
                          <Popover placement="topLeft" content={
                            <Col>
                              <Row>
                                <Button type="link" icon = "edit" onClick = {() => showGameUpdateModal(item._id, item.name, item.link)}>Editar Jogo</Button>
                              </Row>
                              <Row>
                                <Button type="link" icon = "close" style = {{color: "red"}} onClick = {() => deleteGame(item._id)}>Excluir Jogo</Button>
                              </Row>
                            </Col>
                          }>
                            <Icon type="more" key="more" /> 
                          </Popover>
                        </Col>
                      </Row>
                    </Col>
                  </Card>
                </a>
              </Col>
            )}
          />
        </Col>
      </Row>
      <Modal
          title="Adicionar Jogo"
          visible={modalGameCadastro}
          onOk={handleGameCadastroOk}
          onCancel={handleGameCadastroCancel}
          footer={[
            <Button key="back" onClick={handleGameCadastroCancel}>
              Cancelar
            </Button>,
            <Button key="submit" type="primary" onClick={handleGameCadastroOk}>
              Cadastrar
            </Button>,
          ]}
        >
          <Row span = {8} type="flex" justify="center">
            <Avatar shape = "square" size = {100} src = {profilePhoto} />
            <Upload beforeUpload = { beforeUploadPhoto } customRequest = { changeProfilePhoto } fileList = { newProfilePhoto } showUploadList = {false} accept = "image/*">
              <Button icon = "plus" type = "primary" style = {{ backgroundColor: '#383A3F', borderColor: '#383A3F', position: 'absolute', bottom: 5, left: 12 }}> Adicionar Imagem </Button>
            </Upload>
          </Row>

          <Form onSubmit = {handleGameCadastroOk} className = "cadastra-form" style = {{ marginTop: 30 }}>
            <Form.Item label = "Nome">
              { getFieldDecorator('name', {
                rules: [
                  { required: true, message: 'Por favor, digite um nome!' }
                ]
              })(
                <Input
                  prefix = {<Icon type = "edit" style = {{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder = "Nome do jogo" size = "large" style = {{ fontSize: 13 }}
                />
              )}
            </Form.Item>
            <Form.Item label = "Link">
              { getFieldDecorator('link', {
                rules: [
                  { required: true, message: 'Por favor, insira uma link!' }
                ]
              })(
                <Input
                  prefix = {<Icon type = "link" style = {{ color: 'rgba(0, 0, 0, .25)' }} />}
                  placeholder = "Link da pagina do jogo" size = "large" style = {{ fontSize: 13 }}
                />
              )}
            </Form.Item>
          </Form>
        </Modal>
      <Modal
        title="Atualizar Jogo"
        visible={modalGameUpdate}
        onOk={handleGameUpdateOk}
        onCancel={handleGameUpdateCancel}
        footer={[
          <Button key="back" onClick={handleGameUpdateCancel}>
            Cancelar
          </Button>,
          <Button key="submit" type="primary" onClick={handleGameUpdateOk}>
            Atualizar
          </Button>,
        ]}
      >
        <Row span = {8} type="flex" justify="center">
          <Avatar shape = "square" size = {100} src = {profilePhoto} />
          <Upload beforeUpload = { beforeUploadPhoto } customRequest = { changeProfilePhoto } fileList = { newProfilePhoto } showUploadList = {false} accept = "image/*">
            <Button icon = "plus" type = "primary" style = {{ backgroundColor: '#383A3F', borderColor: '#383A3F', position: 'absolute', bottom: 5, left: 12 }}> Adicionar Imagem </Button>
          </Upload>
        </Row>

        <Form onSubmit = {handleGameUpdateOk} className = "atualiza-form" style = {{ marginTop: 30 }}>
          <Form.Item label = "Nome">
            { getFieldDecorator('nameUpdate', {
              rules: [
                { required: true, message: 'Por favor, digite um nome!' }
              ]
            })(
              <Input
                prefix = {<Icon type = "edit" style = {{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder = "Nome do jogo" size = "large" style = {{ fontSize: 13 }}
              />
            )}
          </Form.Item>
          <Form.Item label = "Link">
            { getFieldDecorator('linkUpdate', {
              rules: [
                { required: true, message: 'Por favor, insira uma link!' }
              ]
            })(
              <Input
                prefix = {<Icon type = "link" style = {{ color: 'rgba(0, 0, 0, .25)' }} />}
                placeholder = "Link da pagina do jogo" size = "large" style = {{ fontSize: 13 }}
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
    </MainLayout>
  );
};

const WrappedNormalGameForm = Form.create({ name: 'game' })(Games);
export default WrappedNormalGameForm;

