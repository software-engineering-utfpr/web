import React, { useEffect, useState } from 'react';
import { Typography, Table, Menu, Dropdown, DatePicker, Col, Row, Card, Icon, Input, Button, Modal, Divider, Form } from 'antd';

import axios from 'axios';
import moment from 'moment';
import MainLayout from '../../components/layout';
import { error, success } from '../../services/messages';

import './style.css';

const { Column } = Table;
const { Paragraph } = Typography;
const { Search } = Input;

const Forms = props => {
  const { getFieldDecorator, setFieldsValue, resetFields, validateFields } = props.form;

  const [loadingPage, setLoadingPage] = useState(true);
  const [forms, setForms] = useState([]);
  const [formsFiltered, setFormsFiltered] = useState([]);
  const [formModal, setFormModal] = useState({
    formID: '',
    loading: false,
    visibility: false
  });
  const [pageUpdate, setPageUpdate] = useState(false);

  useEffect(() => {
    setLoadingPage(true);

    axios.get('/api/forms').then((res) => {
      setLoadingPage(false);
      setForms(res.data);
      setFormsFiltered(res.data);

    }).catch((err) => {
      setLoadingPage(false);
      error(err);
    });
  }, [pageUpdate]);

  const searchByName = (e) => setFormsFiltered(forms.filter(r => r.title.toLowerCase().includes(e.target.value.toLowerCase()) || r.description.toLowerCase().includes(e.target.value.toLowerCase())));

  const openNewFormModal = () => {
    setFormModal({ ...formModal, formID: '', visibility: true });
  }

  const openUpdateFormModal = (form) => {
    setFormModal({ ...formModal, visibility: true, formID: form._id });
    setFieldsValue({
      link: form.link,
      expireDate: moment(form.expireDate)
    });
  }

  const closeFormModal = () => {
    resetFields(['link', 'expireDate']);
    setFormModal({
      ...formModal,
      formID: '',
      loading: false,
      visibility: false
    });
  }

  const linkValidation = (rule, value, callback) => {
    const linkFormatted = value.match(/([^/]+)(?=\/[^/]+\/?$)/g)[0];

    axios.get(`/api/forms/searchByLink/${linkFormatted}`).then((res) => {
      if((forms[forms.map((e) => e.link).indexOf(value)] && !formModal.formID) || (forms[forms.map((e) => e.link).indexOf(value)] && formModal.formID && forms[forms.map((e) => e.link).indexOf(value)].link !== value)) {
        callback('Formulário já cadastrado.');
      } else {
        callback();
      }
    }).catch((err) => {
      callback('Link Inválido.');
    });
  }

  const handleNewForm = e => {
    setFormModal({ ...formModal, loading: true });
    e.preventDefault();

    validateFields(['link', 'expireDate'], (err, values) => {
      if(!err) {
        const { link, expireDate } = values;
        const linkFormatted = link.match(/([^/]+)(?=\/[^/]+\/?$)/g)[0];

        axios.get(`/api/forms/searchByLink/${linkFormatted}`).then((res) => {
          const { title, description } = res.data;

          axios.post('/api/forms', { title, description, link, expireDate }).then(res => {
            setPageUpdate(!pageUpdate);
            closeFormModal();
            success();
          }).catch(err => {
            closeFormModal();
            error(err);
          });
        }).catch((err) => {
          setLoadingPage(false);
          error(err);
        });
      } else {
        setFormModal({ ...formModal, loading: true });
      }
    });
  }

  const handleEditForm = e => {
    setFormModal({ ...formModal, loading: true });
    e.preventDefault();

    validateFields(['link', 'expireDate'], (err, values) => {
      if(!err) {
        const { link, expireDate } = values;
        const linkFormatted = link.match(/([^/]+)(?=\/[^/]+\/?$)/g)[0];

        axios.get(`/api/forms/searchByLink/${linkFormatted}`).then((res) => {
          const { title, description } = res.data;

          axios.put('/api/forms', { id: formModal.formID, title, description, link, expireDate }).then(res => {
            setPageUpdate(!pageUpdate);
            closeFormModal();
            success();
          }).catch(err => {
            closeFormModal();
            error(err);
          });
        }).catch((err) => {
          setLoadingPage(false);
          error(err);
        });
      } else {
        setFormModal({ ...formModal, loading: true });
      }
    });
  }

  const deleteForm = (id) => {
    axios.delete(`/api/forms/${id}`).then(res => {
      success();
      setPageUpdate(!pageUpdate);
    }).catch(err => {
      error(err);
    });
  }

  return (
    <MainLayout page = "formulario" loading = { loadingPage } title = "Gerenciamento de Formulários" breadcrumb = {['Gerenciamento', 'Formulário']}>
      <Card
        bordered = {false} className = "alert-card" style = {{ borderRadius: 5 }}
        title = {
          <>
            <Icon type = "area-chart" style = {{ marginRight: 6, color: '#00AD45' }} /> Formulários Cadastrados
          </>
        }
        extra = {<Button type = "primary" icon = "plus" onClick = { openNewFormModal }> Adicionar Formulário </Button>}
      >
        <Row gutter = {24} type = "flex" justify = "end" style = {{ marginBottom: 18 }}>
          <Col span = {14}>
            <Search
              placeholder = "Pesquise por nome ou descrição"
              onChange = { e => searchByName(e) }
              size = "default"
            />
          </Col>
        </Row>

        <Table
          locale = {{ emptyText: 'Não há formulários.' }}
          dataSource = { formsFiltered }
          rowKey = { record => record._id }
        >
          <Column
            title = "Título"
            key = "title"
            dataIndex = "title"
            sorter = {(a, b) => (a.title && b.title ? a.title.toLowerCase().localeCompare(b.title.toLowerCase()) : 1)}
          />

          <Column
            align = "right"
            title = "Data Expiração"
            key = "expireDate"
            dataIndex = "expireDate"
            sorter = { (a, b) => moment(a.expireDate).isBefore(moment(b.expireDate), 'day') ? 1 : moment(a.expireDate).isAfter(moment(b.expireDate), 'day') ? -1 : 0 }
            defaultSortOrder = "descend"
            render = { date => (<span> {moment(date).format('DD')} de {moment(date).format('MMMM')} de {moment(date).format('YYYY')} </span>) }
          />

          <Column
            align = "right"
            key = "_id"
            dataIndex = "_id"
            width = {20}
            render = {(id, record) => (
              <Dropdown
                overlay = {(
                  <Menu>
                    <Menu.Item> <a target = "_blank" rel = "noopener noreferrer" href = {record.link}> <Icon type = "global" /> Ver Formulário </a> </Menu.Item>
                    <Menu.Item onClick = { () => openUpdateFormModal(record) }> <Icon type = "edit" /> Editar </Menu.Item>

                    <Menu.Item
                      onClick = { () => {
                        Modal.confirm({
                          title: 'Deseja realmente apagar este formulário?',
                          content: 'Esta ação é permanente, não haverá forma de restaurar ação.',
                          okType: 'danger',
                          onOk() {
                            deleteForm(id);
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
                <Icon style = {{ cursor: 'pointer' }} type = "more" />
              </Dropdown>
            )}
          />
        </Table>
      </Card>

      <Modal visible = { formModal.visibility } onCancel = { closeFormModal } footer = { null }>
        <Paragraph style = {{ fontSize: 30, textAlign: 'center', marginBottom: 5 }}> { formModal.formID ? 'Editar Formulário' : 'Novo Formulário' } </Paragraph>

        <Divider style = {{ fontSize: 20, minWidth: '60%', width: '60%', marginTop: 0, marginLeft: 'auto', marginRight: 'auto' }}>
          <Icon type = { formModal.formID ? 'edit' : 'plus' } />
        </Divider>

        <Form onSubmit = { formModal.formID ? handleEditForm : handleNewForm }>
          <Form.Item label = "Link do Formulário">
            { getFieldDecorator('link', {
              rules: [
                { required: true, message: 'Por favor, insira um link!' },
                { validator: linkValidation }
              ]
            })(
              <Input prefix = {<Icon type = "link" style = {{ color: 'rgba(0, 0, 0, .25)' }} />} placeholder = "Link do Google Forms" />
            )}
          </Form.Item>

          <Form.Item label = "Data de Expiração">
            { getFieldDecorator('expireDate', {
              initialValue: moment().add(1, 'month'),
              rules: [{ required: true, message: 'Por favor, insira uma data válida!' }]
            })(
              <DatePicker disabledDate = { (current) => current && current < moment().subtract(1, 'day').endOf('day') } format = "DD/MM/YYYY" />
            )}
          </Form.Item>

          <Row style = {{ textAlign: 'right' }}>
            <Button size = "default" onClick = { closeFormModal } style = {{ marginRight: 8 }}> Cancelar </Button>
            <Button loading = { formModal.loading } type = "primary" htmlType = "submit" size = "default"> { formModal.formID ? 'Atualizar' : 'Criar' } </Button>
          </Row>
        </Form>
      </Modal>
    </MainLayout>
  );
};

const WrappedNormalForm = Form.create({ name: 'form_form' })(Forms);
export default WrappedNormalForm;