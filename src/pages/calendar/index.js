import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Button, Checkbox, DatePicker, Avatar, Calendar, Popover, Input, Form, Modal, Divider, Icon } from 'antd';

import axios from 'axios';
import moment from 'moment';
import MainLayout from '../../components/layout';
import { error, success } from '../../services/messages';

import './style.css';

const { Title, Text, Paragraph } = Typography;
const { TextArea, Search } = Input;
const { RangePicker } = DatePicker;

const CalendarMainPage = props => {
  const { getFieldDecorator, validateFields, setFieldsValue, resetFields, getFieldValue } = props.form;

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

  const searchEvents = (e) => setEventsFiltered(events.filter(r => r.name.toLowerCase().includes(e.target.value.toLowerCase()) || (r.description && r.description.toLowerCase().includes(e.target.value.toLowerCase()))));

  const openNewCalendarModal = () => {
    setCalendarModal({ ...calendarModal, eventID: '', visibility: true });
  }

  const openUpdateCalendarModal = (event) => {
    setCalendarModal({ ...calendarModal, visibility: true, eventID: event._id });
    setFieldsValue({
      name: event.name,
      date: [moment(event.initialDate), moment(event.finalDate)],
      allDay: event.allDay,
      description: event.description
    });
  }

  const closeCalendarModal = () => {
    resetFields(['name', 'date', 'allDay', 'description']);
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

  const dateCellRender = (value) => {
    if(eventsFiltered.length > 0) {
      const valueFormatted = moment(value);

      return (
        <ul style = {{ padding: 0 }}>
          { eventsFiltered.map(item => (
            valueFormatted.isSameOrAfter(moment(item.initialDate), 'day') && valueFormatted.isSameOrBefore(moment(item.finalDate), 'day') ? (
              <Popover
                key = { item._id }
                placement = "topLeft"
                trigger = "click"
                overlayStyle = {{ zIndex: 30 }}
                content = {(
                  <div style = {{ padding: 10, width: 400 }}>
                    <Row style = {{ textAlign: 'right', marginBottom: 10 }}>
                      <Icon onClick = { () => openUpdateCalendarModal(item) } className = "calendar-edit-event" style = {{ cursor: 'pointer', marginRight: 10 }} type = "edit" />
                      <Icon onClick = { () => handleDelete(item) } className = "calendar-delete-event" style = {{ cursor: 'pointer' }} type = "delete" />
                    </Row>

                    <Row>
                      <Col>
                        <Title level = {4} style = {{ marginBottom: 0, paddingBottom: 6, borderBottom: '1px solid #E9E9E9', fontWeight: 500 }}>
                          { item.name }
                        </Title>

                        <div style = {{ height: 10 }} />

                        <Text>
                          <Icon type = "calendar" style = {{ marginRight: 5 }} /> { (moment(item.finalDate).diff(moment(item.initialDate), 'days')) === 0 ? item.allDay ? moment(item.initialDate).format('dddd, D MMMM') : `${moment(item.initialDate).format('dddd, D MMMM')} ⠂${moment(item.initialDate).format('HH:mm')} - ${moment(item.finalDate).format('HH:mm')}` : item.allDay ? `${moment(item.initialDate).format('D')} - ${moment(item.finalDate).format('D')} de ${moment(item.finalDate).format('MMMM')} de ${moment(item.finalDate).format('YYYY')}` : `${moment(item.initialDate).format('D MMMM YYYY, HH:mm')} - ${moment(item.finalDate).format('D MMMM YYYY, HH:mm')}` }
                        </Text>

                        <div style = {{ height: 10 }} />

                        <Text>
                          { item.description ? <Icon type = "align-left" style = {{ marginRight: 5 }} /> : null} { item.description }
                        </Text>
                      </Col>
                    </Row>
                  </div>
                )}
              >
                <Paragraph ellipsis style = {{ fontSize: 11, cursor: 'pointer !important', marginBottom: 0, marginTop: 0 }}>
                  <Avatar size = {8} style = {{ backgroundColor: moment(item.initialDate).isSame(moment(item.finalDate)) ? '#2F80ED' : '#FF5154', verticalAlign: 'baseline', marginRight: 5 }} />
                  { moment(item.initialDate).isSame(moment(item.finalDate), 'day') ? item.name : `${item.name} (Dia ${(moment(item.finalDate).diff(moment(item.initialDate), 'days')) - moment(item.finalDate).endOf('day').diff(valueFormatted, 'days') + 1} - ${moment(item.finalDate).diff(moment(item.initialDate), 'days') + 1})` }
                </Paragraph>
              </Popover>
            ) : null
          )) }
        </ul>
      );
    }
    return (<span />);
  }

  const handleNewEvent = e => {
    setCalendarModal({ ...calendarModal, loading: true });
    e.preventDefault();

    validateFields(['name', 'date', 'allDay', 'description'], (err, values) => {
      if(!err) {
        const { name, date, allDay, description } = values;

        axios.post('/api/events', { name, initialDate: date[0], finalDate: date[1], allDay, description }).then(res => {
          setPageUpdate(!pageUpdate);
          closeCalendarModal();
          success();
        }).catch(err => {
          closeCalendarModal();
          error(err);
        });
      } else {
        setCalendarModal({ ...calendarModal, loading: false });
      }
    });
  }

  const handleEditEvent = e => {
    setCalendarModal({ ...calendarModal, loading: true });
    e.preventDefault();

    validateFields(['name', 'date', 'allDay', 'description'], (err, values) => {
      if(!err) {
        const { name, date, allDay, description } = values;

        axios.put('/api/events', { id: calendarModal.eventID, name, initialDate: date[0], finalDate: date[1], allDay, description }).then(res => {
          setPageUpdate(!pageUpdate);
          closeCalendarModal();
          success();
        }).catch(err => {
          closeCalendarModal();
          error(err);
        });
      } else {
        setCalendarModal({ ...calendarModal, loading: true });
      }
    });
  }

  const handleDelete = (event) => {
    Modal.confirm({
      title: 'Deseja realmente apagar este evento?',
      content: 'Esta ação é permanente, não haverá forma de restaurar ação.',
      okType: 'danger',
      onOk() {
        axios.delete(`/api/events/${event._id}`).then(res => {
          success();
          setPageUpdate(!pageUpdate);
        }).catch(err => {
          error(err);
        });
      },
      onCancel() {}
    });
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
        <Row gutter = {24} type = "flex" justify = "end" style = {{ marginBottom: 18 }}>
          <Col span = {14}>
            <Search
              placeholder = "Pesquise por nome ou descrição do evento"
              onChange = { e => searchEvents(e) }
              size = "default"
            />
          </Col>
        </Row>

        <Calendar style = {{ marginTop: 50 }} dateCellRender = { dateCellRender } />
      </Card>

      <Modal visible = { calendarModal.visibility } onCancel = { closeCalendarModal } footer = { null }>
        <Paragraph style = {{ fontSize: 30, textAlign: 'center', marginBottom: 5 }}> { calendarModal.eventID ? 'Editar Evento' : 'Novo Evento' } </Paragraph>

        <Divider style = {{ fontSize: 20, minWidth: '60%', width: '60%', marginTop: 0, marginLeft: 'auto', marginRight: 'auto' }}>
          <Icon type = { calendarModal.eventID ? 'edit' : 'plus' } />
        </Divider>

        <Form onSubmit = { calendarModal.eventID ? handleEditEvent : handleNewEvent }>
          <Form.Item label = "Nome do Evento">
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
            <Button loading = { calendarModal.loading } type = "primary" htmlType = "submit" size = "default"> { calendarModal.eventID ? 'Atualizar' : 'Criar' } </Button>
          </Row>
        </Form>
      </Modal>
    </MainLayout>
  );
};

const WrappedNormalCalendarForm = Form.create({ name: 'event_form' })(CalendarMainPage);
export default WrappedNormalCalendarForm;