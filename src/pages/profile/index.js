import React, { useState, useEffect } from 'react';
import { Typography, Button, Row, Col, Icon, List, Avatar, Badge, Popover, Card, Upload, message, Form, Input } from 'antd';
import { error, success } from '../../services/messages';

import MainLayout from '../../components/layout';

import './style.css';

import axios from 'axios';

import { getID } from '../../services/auth' ;

const { Text } = Typography;


const Profile = props => {
  
  const[loadingPage, setLoadingPage] = useState(true);
  const[pageUpdate, setPageUpdate] = useState(false);
  const[manager, setManager] = useState({});
  const[profilePhoto, setProfilePhoto] = useState([]);
  const[newProfilePhoto, setNewProfilePhoto] = useState([]);

  const { getFieldDecorator, setFieldsValue } = props.form;

  useEffect(() => {
    axios.get(`/api/managers/${getID()}`).then(res => {
      setManager(res.data);
      setProfilePhoto(res.data.image);
      setFieldsValue({ 
        userNameUpdate: res.data.name,
        emailUpdate: res.data.email
      }); 
      setLoadingPage(false);
    }).catch((err) => {
      setLoadingPage(false);
      error(err);
    });
  },[pageUpdate]);

  function beforeUploadPhoto (file) {
    if (file.type === 'image/jpeg' || file.type === 'image/png') {
      const arquivos = [file];
      setNewProfilePhoto(arquivos);
      return true;
    }
    message.error('Extensão Inválida! Permitido apenas imagens');
    setNewProfilePhoto([]);
    return false;
  }

  function changeProfilePhoto () {
    const formData = new FormData();
    formData.append('api_key', '584136724691346');
    formData.append('timestamp', (Date.now() / 1000));
    formData.append('upload_preset', 'p9jvf6ai');
    formData.append('file', { uri: newProfilePhoto[0] });
    axios.post('https://api.cloudinary.com/v1_1/dnnkqjrbi/image/upload', formData, {
      headers: { 'X-Requested-With': 'XMLHttpRequest' }
    }).then(res => {
      const image = res.data.secure_url;
      axios.put('https://rio-campo-limpo.herokuapp.com/api/managers', {
        id: manager._id, image
      }).then(res => {
        setProfilePhoto(image);
        success();
      }).catch(err => {
        error(err);
      });
    }).catch(err => {
      error(err);
    });
  };

  function compareToFirstPasswordUpdate (rule, value, callback) {
    const { form } = props;
    if (value && value !== form.getFieldValue('passwordUpdate')) {
      callback('senha de confirmação incompativel!');
    } else {
      callback();
    }
  };

  function passwordValidatorUpdate (rule, value, callback) {
    if(value !== '') {
      if (value.length < 6) {
        callback('digitos minimos: 6');
      }
    }
    callback();
  };

  const handleUpdate = e => {
    setLoadingPage(true);
    props.form.validateFields(['userNameUpdate', 'emailUpdate', 'passwordUpdate', 'confirmPasswordUpdate'], (err, values) => {
      if (!err) {
        var { userNameUpdate, emailUpdate, passwordUpdate, } = values;
        if(passwordUpdate === ' '){
          passwordUpdate = manager.password
        }
        axios.put('/api/managers/', { id: manager._id ,email: emailUpdate, name: userNameUpdate, password: passwordUpdate, superuser: manager.superuser, image: manager.image }).then(() => {
          success();
          setPageUpdate(!pageUpdate);
          setLoadingPage(false);

        }).catch((err) => {
          setLoadingPage(false);
          error(err);
        });
      } else {
          error(err);
          setLoadingPage(false);
      }
    }).catch((err) => {
      error(err);
      setLoadingPage(false);
    });
    setLoadingPage(false);
  };
  
  return (
    <MainLayout page = "Perfil" loading = {loadingPage} title = "Pefil do Usuário" breadcrumb = {['Meu Perfil']}>
      <Card
        bordered = {false} className = "alert-card" style = {{ borderRadius: 5 }}
        title = {
          <>
            <Icon type = "user" style = {{ marginRight: 6, color: '#00AD45' }} />Meu Perfil
          </>
        }
        extra = {
          <Button type = "primary" onClick = {() => handleUpdate()} style = {{ color: "white"}} > Salvar Mudanças </Button>
        }
      >
        <Row type = "flex" jutify = "center">
          <Col span = {4} offset = {2}>
            <Avatar shape = "square" size = {200} src = { newProfilePhoto.length === 0 ? profilePhoto : newProfilePhoto } />
            <Upload beforeUpload = { beforeUploadPhoto } customRequest = { changeProfilePhoto } fileList = { newProfilePhoto } showUploadList = {false} accept = "image/*">
              <Button icon = "plus" type = "primary" style = {{ backgroundColor: '#383A3F', borderColor: '#383A3F', position: 'absolute', bottom: 5, left: 12 }}> Adicionar Imagem </Button>
            </Upload>
          </Col>
          <Col span = {10} offset = {1}>
            <Form layout = "vertical">
              <Form.Item>
                {getFieldDecorator('userNameUpdate', {
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
      </Card>
    </MainLayout>
  );
};

const WrappedProfileForm = Form.create({ name: 'Profile' })(Profile);
export default WrappedProfileForm;