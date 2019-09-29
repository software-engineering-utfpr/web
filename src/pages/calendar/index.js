import React, { useState, useEffect } from 'react';
import { Typography, Row, Card, Button, Checkbox, DatePicker, Calendar, Input, Form, Modal, Divider, Icon } from 'antd';

import axios from 'axios';
import moment from 'moment';
import MainLayout from '../../components/layout';
import { error } from '../../services/messages';

import './style.css';

const { Paragraph } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const CalendarMainPage = props => {
  const { getFieldDecorator, getFieldError, getFieldValue } = props.form;

  const [loadingPage, setLoadingPage] = useState(true);
  const [events, setEvents] = useState([]);
  const [eventsFiltered, setEventsFiltered] = useState([]);
  const [calendarModal, setCalendarModal] = useState({
    eventID: '',
    loading: false,
    visibility: false
  });
  const [pageUpdate, setPageUpdate] = useState(false);

  useEffect(() => {
    setLoadingPage(true);

    axios.get('/api/events').then((res) => {
      setLoadingPage(false);
      setEvents(res.data);
      setEventsFiltered(res.data);

    }).catch((err) => {
      setLoadingPage(false);
      error(err);
    });
  }, [pageUpdate]);

  const openNewCalendarModal = () => {
    setCalendarModal({ ...calendarModal, eventID: '', visibility: true });
  }

  const openUpdateCalendarModal = (event) => {
    setCalendarModal({ ...calendarModal, visibility: true, eventID: event._id });
    // setFieldsValue({ game: game.appId });
  }

  const closeCalendarModal = () => {
    // resetFields(['game']);
    setCalendarModal({
      ...calendarModal,
      eventID: '',
      loading: false,
      visibility: false
    });
  }

  const dateValidation = (rule, value, callback) => {
    if (value && value[0].isAfter(value[1])) {
      callback('Data Inicial deve ser menor que Data Final');
    } else {
      callback();
    }
  }

  const handleNewEvent = e => {
    setCalendarModal({ ...calendarModal, loading: true });
    e.preventDefault();

    // validateFields(['game'], (err, values) => {
    //   if(!err) {
    //     axios.get(`/api/games/getById/${values.game}`).then(res => {
    //       const { title, appId, developer, url, scoreText, icon } = res.data;
    //       axios.post('/api/games', { appId, name: title, link: url, image: icon, developer, score: scoreText }).then(res => {
    //         setPageUpdate(!pageUpdate);
    //         closeGameModal();
    //         success();
    //       }).catch(err => {
    //         closeGameModal();
    //         error(err);
    //       });
    //     });
    //   } else {
    //     setGameModal({ ...gameModal, loading: true });
    //   }
    // });
  }

  const handleEditEvent = e => {
    setCalendarModal({ ...calendarModal, loading: true });
    e.preventDefault();

    // validateFields(['game'], (err, values) => {
    //   if(!err) {
    //     axios.get(`/api/games/getById/${values.game}`).then(res => {
    //       const { title, appId, developer, url, scoreText, icon } = res.data;
    //       axios.put('/api/games', { id: gameModal.gameID, appId, name: title, link: url, image: icon, developer, score: scoreText }).then(res => {
    //         setPageUpdate(!pageUpdate);
    //         closeGameModal();
    //         success();
    //       }).catch(err => {
    //         closeGameModal();
    //         error(err);
    //       });
    //     });
    //   } else {
    //     setGameModal({ ...gameModal, loading: true });
    //   }
    // });
  }
 
  return (
    <MainLayout page = "calendario" loading = { loadingPage } title = "Gerenciamento de Eventos" breadcrumb = {['Calendário']}>
      <Card
        bordered = {false} className = "alert-card" style = {{ borderRadius: 5 }}
        title = {
          <>
            <Icon type = "area-chart" style = {{ marginRight: 6, color: '#00AD45' }} /> Eventos Cadastrados
          </>
        }
        extra = {<Button type = "primary" icon = "plus" onClick = { openNewCalendarModal }> Adicionar Evento </Button>}
      >
        <Calendar style = {{ marginTop: 50 }} />
      </Card>

      <Modal visible = { calendarModal.visibility } onCancel = { closeCalendarModal } footer = { null }>
        <Paragraph style = {{ fontSize: 30, textAlign: 'center', marginBottom: 5 }}> { calendarModal.eventID ? 'Editar Evento' : 'Novo Evento' } </Paragraph>

        <Divider style = {{ fontSize: 20, minWidth: '60%', width: '60%', marginTop: 0, marginLeft: 'auto', marginRight: 'auto' }}>
          <Icon type = { calendarModal.gameID ? 'edit' : 'plus' } />
        </Divider>

        <Form onSubmit = { calendarModal.gameID ? handleEditEvent : handleNewEvent }>
          <Form.Item label = "Nome">
            { getFieldDecorator('name', {
              rules: [{ required: true, whitespace: true, message: 'Por favor, insira um nome!' }]
            })(
              <Input
                prefix = { <Icon type = "user" style = {{ color: 'rgba(0, 0, 0, 0.25)' }} /> }
                placeholder = "Nome"
              />
            )}
          </Form.Item>

          <Form.Item style = {{ marginBottom: 5 }} label = "Data do Evento">
            { getFieldDecorator('date', {
              initialValue: [moment(), moment()],
              rules: [
                { required: true, message: 'Por favor, insira uma data!' },
                { validator: dateValidation }
              ]
            })(
              <RangePicker separator = "---" showTime = { !getFieldValue('allDay') } style = {{ width: '100%' }} placeholder = "Data" format = { getFieldValue('allDay') ? 'DD/MM/YYYY' : 'DD/MM/YYYY - HH:mm' } allowClear = {false} />
            )}
          </Form.Item>

          { getFieldDecorator('allDay', {
            valuePropName: 'checked',
            initialValue: true
          })(
            <Checkbox style = {{ marginBottom: 25 }}> Dia Inteiro </Checkbox>
          )}

          <Form.Item label = "Descrição">
            { getFieldDecorator('description')(
              <TextArea rows = {4} placeholder = "Descrição" />
            )}
          </Form.Item>
          
          <Row style = {{ textAlign: 'right' }}>
            <Button size = "default" onClick = { closeCalendarModal } style = {{ marginRight: 8 }}> Cancelar </Button>
            <Button loading = { calendarModal.loading } type = "primary" htmlType = "submit" size = "default"> { calendarModal.gameID ? 'Atualizar' : 'Criar' } </Button>
          </Row>
        </Form>
      </Modal>
    </MainLayout>
  );
};

const WrappedNormalCalendarForm = Form.create({ name: 'game_form' })(CalendarMainPage);
export default WrappedNormalCalendarForm;