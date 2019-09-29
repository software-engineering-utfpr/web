import React, { useState, useEffect } from 'react';
import { Typography, Card, Button, Calendar, Icon } from 'antd';

import axios from 'axios';
import MainLayout from '../../components/layout';
import { error } from '../../services/messages';

import './style.css';

const { Text } = Typography;

const CalendarMainPge = props => {
  const [loadingPage, setLoadingPage] = useState(true);
  const [events, setEvents] = useState([]);
  const [eventsFiltered, setEventsFiltered] = useState([]);
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
 
  return (
    <MainLayout page = "calendario" loading = { loadingPage } title = "Gerenciamento de Eventos" breadcrumb = {['Calendário']}>
      <Card
        bordered = {false} className = "alert-card" style = {{ borderRadius: 5 }}
        title = {
          <>
            <Icon type = "area-chart" style = {{ marginRight: 6, color: '#00AD45' }} /> Eventos Cadastrados
          </>
        }
        extra = {<Button type = "primary" icon = "plus" onClick = { () => console.log() }> Adicionar Evento </Button>}
      >
        <Calendar style = {{ marginTop: 50 }} />
      </Card>
    </MainLayout>
  );
};

export default CalendarMainPge;