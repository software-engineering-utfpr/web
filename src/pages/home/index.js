import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Checkbox, Button, Modal, Tag, Divider, Icon, Typography, Popover } from 'antd';
import { Redirect } from 'react-router-dom';
import { error } from '../../services/messages';

import MainLayout from '../../components/layout';
import GoogleMapReact from 'google-map-react';

import axios from 'axios';
import moment from 'moment';

import './style.css';

axios.defaults.baseURL = 'https://rio-campo-limpo.herokuapp.com/';

const { Text, Paragraph } = Typography;
const GOOGLE_MAPS_APIKEY = "AIzaSyAwDqlhR0aPR6lYhzkE2nWdUz6ufbzStLk";
const pinIcon = require('../../images/icons/pin-maps.png');

const Home = props => {
  const tags = [{
    value: 'pending',
    color: '#2F80ED',
    label: 'Pendente'
  }, {
    value: 'approved',
    color: '#00AD45',
    label: 'Aprovado'
  }, {
    value: 'reproved',
    color: '#FF7D7A',
    label: 'Reprovado'
  }];

  const [users, setUsers] = useState([]);
  const [occurrences, setOccurrences] = useState([]);
  const [occurrencesFiltered, setOccurrencesFiltered] = useState([]);
  const [loadingPage, setLoadingPage] = useState(false);
  const [nav, setNav] = useState('');

  const [detailsModal, setdetailsModal] = useState({
    item: '',
    visibility: false
  });

  useEffect(() => {
    setLoadingPage(true);

    axios.get('/api/occurrences').then(res => {
      setOccurrences(res.data);
      setOccurrencesFiltered(res.data.filter(r => ['pending', 'approved'].includes(r.status)));
      setLoadingPage(false);
    }).catch((err) => {
      setLoadingPage(false);
      error(err);
    });

    axios.get('/api/users').then(res => {
      setUsers(res.data);
    });
  }, []);

  const openModal = (item) => setdetailsModal({ visibility: true, item });

  const closeModal = () => setdetailsModal({ visibility: false, item: '' });

  const onChangeOptions = (checkedValues) => setOccurrencesFiltered(occurrences.filter(r => checkedValues.includes(r.status)));
  
  if(nav) return (<Redirect to = {nav} />);
  else {
    return (
      <MainLayout page = "home" loading = { loadingPage } >
        <Card
          bordered = {false} className = "alert-card" style = {{ borderRadius: 5 }}
          title = {
            <>
              <Icon type = "area-chart" style = {{ marginRight: 6, color: '#00AD45' }} /> Ocorrências Registradas
            </>
          }
          extra = {<Button type = "primary" icon = "align-left" onClick = { () => setNav('/ocorrencias') }> Ver todas Ocorrências </Button>}
        >
          <Row gutter = {24} type = "flex" justify = "end" style = {{ marginBottom: 18 }}>
            <Col span = {14} style = {{ textAlign: 'right' }}>
              <Checkbox.Group
                options = {tags}
                defaultValue = {['pending', 'approved']}
                onChange = {onChangeOptions}
              />
            </Col>
          </Row>

          <Row style = {{ height: '80vh', width: '100%' }}>
            <GoogleMapReact
              bootstrapURLKeys = {{ key: GOOGLE_MAPS_APIKEY }}
              defaultCenter = {{
                lat: -24.046,
                lng: -52.3838
              }}
              defaultZoom = {14}
            >
              { occurrencesFiltered.map(item => (
                <Popover
                  overlayClassName = "popover-minimal"
                  overlayStyle = {{ width: 300 }}
                  key = { item._id }
                  title = {(
                    <>
                      <Text style = {{ marginRight: 8 }}> #{ item._id.substring(6) } </Text>
                      <Tag color = { tags[tags.map(e => e.value).indexOf(item.status)].color }> { tags[tags.map(e => e.value).indexOf(item.status)].label } </Tag>
                    </>
                  )}
                  content = {(
                    <>
                      <Text style = {{ fontStyle: 'italic' }} type = "secondary">
                        Ocorrência realizada { moment(item.date).fromNow() }
                      </Text>

                      <br />
                      <br />

                      <Text strong>Endereço: </Text>
                      <Text>
                        { item.location.address ? `${item.location.address}, ` : '' }
                        { item.location.number ? `nº ${item.location.number}. ` : '' }
                        { item.location.cep ? `(${item.location.cep})` : '' }
                      </Text>

                      { item.location.referencePoint &&
                        <>
                          <br />

                          <Text strong>Referência: </Text>
                          <Text>
                            { item.location.referencePoint }
                          </Text>
                        </>
                      }

                      { item.user &&
                        <>
                          <br />

                          <Text strong>Usuário: </Text>
                          <Text>
                            { users.length > 0 && users[users.map(e => e._id).indexOf(item.user)].name }
                          </Text>
                        </>
                      }

                      <br />
                      <br />

                      <Button type = "link" onClick = { () => openModal(item) }> Ver mais informações </Button>
                    </>
                  )}
                  lat = { item.location.latitude }
                  lng = { item.location.longitude }
                >
                  <img src = { pinIcon } className = "img-icon" alt = "map-pin" />
                </Popover>
              ))}
            </GoogleMapReact>
          </Row>
        </Card>

        <Modal className = "modal-details" visible = { detailsModal.visibility } onCancel = { closeModal } centered footer = { null }>
          <Paragraph style = {{ fontSize: 30, textAlign: 'center', marginBottom: 5 }}> #{ detailsModal.item._id } </Paragraph>

          <Divider style = {{ fontSize: 20, minWidth: '60%', width: '60%', marginTop: 0, marginLeft: 'auto', marginRight: 'auto' }}>
            <Icon type = "environment" />
          </Divider>
          
          mmmm
        </Modal>
      </MainLayout>
    );
  }
};

export default Home;