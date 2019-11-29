import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Checkbox, Button, Modal, Tag, Divider, Icon, Typography, Popover, Carousel } from 'antd';
import { Redirect } from 'react-router-dom';
import { error, success } from '../../services/messages';

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
    value: 'aproved',
    color: '#00AD45',
    label: 'Aprovada'
  }, {
    value: 'reproved',
    color: '#EB3B5A',
    label: 'Reprovada'
  }];

  const [users, setUsers] = useState([]);
  const [occurrences, setOccurrences] = useState([]);
  const [occurrencesFiltered, setOccurrencesFiltered] = useState([]);
  const [loadingPage, setLoadingPage] = useState(false);
  const [pageUpdate, setPageUpdate] = useState(false);
  const [nav, setNav] = useState('');

  const [tagsActive, setTagsActive] = useState([]);

  const [detailsModal, setdetailsModal] = useState({
    item: '',
    visibility: false
  });

  useEffect(() => {
    setLoadingPage(true);

    const tagsFiltered = tagsActive.length ? tagsActive : ['pending'];
    setTagsActive(tagsFiltered);
    axios.get('/api/occurrences').then(res => {
      setOccurrences(res.data);
      setOccurrencesFiltered(res.data.filter(r => tagsFiltered.includes(r.status)));
      setLoadingPage(false);
    }).catch((err) => {
      setLoadingPage(false);
      error(err);
    });

    axios.get('/api/users').then(res => {
      setUsers(res.data);
    });
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageUpdate]);

  const openModal = (item) => setdetailsModal({ visibility: true, item });

  const closeModal = () => setdetailsModal({ visibility: false, item: '' });

  const onChangeOptions = (checkedValues) => {
    setOccurrencesFiltered(occurrences.filter(r => checkedValues.includes(r.status)));
    setTagsActive(checkedValues);
  };

  const changeStatusOccurrence = (status) => {
    setLoadingPage(true);

    axios.put('/api/occurrences', {
      id: detailsModal.item._id, status
    }).then(res => {
      closeModal();
      success();
      setPageUpdate(!pageUpdate);
    }).catch(err => {
      setLoadingPage(false);
      error(err);
    });
  };
  
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
            <Col sm = {14} xs = {24} style = {{ textAlign: 'right' }}>
              <Checkbox.Group
                options = {tags}
                value = {tagsActive}
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
          
          <Row style = {{ marginTop: 40 }}>
            { detailsModal.item && detailsModal.item.date &&
              <>
                <Text strong>Realizada em: </Text>
                <Text>
                  { moment(detailsModal.item.date).format('DD [de] MMMM [de] YYYY') }
                </Text>

                <br />
              </>
            }

            { detailsModal.item && detailsModal.item.user &&
              <>
                <Text strong>Usuário: </Text>
                <Text>
                  { users.length > 0 && users[users.map(e => e._id).indexOf(detailsModal.item.user)].name } {' '}
                  [{ users.length > 0 && users[users.map(e => e._id).indexOf(detailsModal.item.user)].phone }]
                </Text>

                <br />
              </>
            }

            { detailsModal.item.description &&
              <>
                <Text strong>Descrição: </Text>
                <Text>
                  { detailsModal.item.description }
                </Text>

                <br />
              </>
            }

            { detailsModal.item.location &&
              <>
                <Text strong>Endereço: </Text>
                <Text>
                  { detailsModal.item.location.address ? `${detailsModal.item.location.address}, ` : '' }
                  { detailsModal.item.location.number ? `nº ${detailsModal.item.location.number}. ` : '' }
                  { detailsModal.item.location.cep ? `(${detailsModal.item.location.cep})` : '' }
                </Text>
              </>
            }

            { detailsModal.item.location && detailsModal.item.location.referencePoint &&
              <>
                <br />

                <Text strong>Referência: </Text>
                <Text>
                  { detailsModal.item.location.referencePoint }
                </Text>

              </>
            }

            { detailsModal.item &&
              <Carousel style = {{ marginTop: 30 }}>
                { detailsModal.item.photos.map(item => (
                  <img key = {item} className = "image-carousel" alt = {item} src = {item} />
                ))}

                { detailsModal.item.video &&
                  <video onClick = { (e) => e.target.play() } className = "image-carousel video">
                    <source src = {detailsModal.item.video} type = "video/mp4" />
                  </video>
                }
              </Carousel>
            }
          </Row>
          
          { detailsModal.item && detailsModal.item.status === 'pending' &&
            <Row type = "flex" justify = "end" style = {{ marginTop: 36 }}>
              <Button onClick = { () => changeStatusOccurrence('reproved') } type = "danger" style = {{ marginRight: 10 }}> Reprovar </Button>
              <Button onClick = { () => changeStatusOccurrence('aproved') } type = "primary"> Aprovar </Button>
            </Row>
          }
        </Modal>
      </MainLayout>
    );
  }
};

export default Home;