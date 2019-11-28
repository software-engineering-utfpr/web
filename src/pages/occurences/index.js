import React, { useEffect, useState } from 'react';
import { Table, Col, Row, Card, Icon, Input, Typography, Button, Tag, Carousel } from 'antd';
import GoogleMapReact from 'google-map-react';

import axios from 'axios';
import moment from 'moment';
import MainLayout from '../../components/layout';
import { error } from '../../services/messages';

import './style.css';

const pinIcon = require('../../images/icons/pin-maps.png');

const { Column } = Table;
const { Search } = Input;
const { Text } = Typography;

const GOOGLE_MAPS_APIKEY = "AIzaSyAwDqlhR0aPR6lYhzkE2nWdUz6ufbzStLk";

const Occurrences = props => {
  const tags = [{
    value: 'pending',
    color: '#2F80ED',
    label: 'Pendente'
  }, {
    value: 'aproved',
    color: '#00AD45',
    label: 'Aprovado'
  }, {
    value: 'reproved',
    color: '#FF7D7A',
    label: 'Reprovado'
  }];

  const [loadingPage, setLoadingPage] = useState(true);
  const [occurrences, setOccurrences] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [occurrencesFiltered, setOccurrencesFiltered] = useState([]);

  useEffect(() => {
    setLoadingPage(true);

    axios.get('/api/categories').then((res) => {
      setCategories(res.data);
    });

    axios.get('/api/users').then((res) => {
      setUsers(res.data);
    });

    axios.get('/api/occurrences').then((res) => {
      setLoadingPage(false);
      setOccurrences(res.data);
      setOccurrencesFiltered(res.data);
    }).catch((err) => {
      setLoadingPage(false);
      error(err);
    });
  }, []);

  const searchByName = (e) => setOccurrencesFiltered(occurrences.filter(r => r._id.toLowerCase().includes(e.target.value.toLowerCase())));

  return (
    <MainLayout page = "home" loading = { loadingPage } title = "Lista de Ocorrências" breadcrumb = {['Ocorrências']}>
      <Card
        bordered = {false} className = "alert-card" style = {{ borderRadius: 5 }}
        title = {
          <>
            <Icon type = "area-chart" style = {{ marginRight: 6, color: '#00AD45' }} /> Ocorrências Registradas
          </>
        }
      >
        <Row gutter = {24} type = "flex" justify = "end" style = {{ marginBottom: 18 }}>
          <Col span = {14}>
            <Search
              placeholder = "Pesquise pelo id"
              onChange = { e => searchByName(e) }
              size = "default"
            />
          </Col>
        </Row>

        <Table
          locale = {{ emptyText: 'Não há ocorrências.' }}
          dataSource = { occurrencesFiltered }
          rowKey = { record => record._id }
          scroll = {{ x: 1000 }}
          expandedRowRender = {record => (
            <>
              <Row type = "flex">
                <div
                  style = {{
                    width: 300,
                    boxSizing: 'border-box'
                  }}
                >
                  <Carousel>
                    { record.photos.map(item => (
                      <img key = {item} className = "image-carousel" alt = {item} src = {item} />
                    ))}

                    { record.video &&
                      <video onClick = { (e) => e.target.play() } className = "image-carousel video">
                        <source src = {record.video} type = "video/mp4" />
                      </video>
                    }
                  </Carousel>
                </div>

                <Row style = {{ height: 300, width: 'calc(100% - 350px)', marginLeft: 30 }}>
                  <GoogleMapReact
                    bootstrapURLKeys = {{ key: GOOGLE_MAPS_APIKEY }}
                    defaultCenter = {{
                      lat: parseFloat(record.location.latitude),
                      lng: parseFloat(record.location.longitude)
                    }}
                    defaultZoom = {15}
                  >
                    <img
                      src = {pinIcon}
                      lat = { record.location.latitude }
                      lng = { record.location.longitude }
                      className = "img-icon"
                      alt = "pinMap"
                    />
                  </GoogleMapReact>
                </Row>
              </Row>

              <div style = {{ marginTop: 50 }}>
                { record.description &&
                  <>
                    <Text strong>Descrição: </Text>
                    <Text>
                      { record.description }
                    </Text>

                    <br />
                  </>
                }

                <Text strong>Endereço: </Text>
                <Text>
                  { record.location.address ? `${record.location.address}, ` : '' }
                  { record.location.number ? `nº ${record.location.number}. ` : '' }
                  { record.location.cep ? `(${record.location.cep})` : '' }
                </Text>

                { record.location.referencePoint &&
                  <>
                    <br />

                    <Text strong>Referência: </Text>
                    <Text>
                      { record.location.referencePoint }
                    </Text>
                  </>
                }
              </div>
            </>
          )}
        >
          <Column
            title = "#"
            key = "_id"
            dataIndex = "_id"
            render = {value => value.substring(12)}
          />

          <Column
            align = "right"
            title = "Usuário"
            key = "user"
            dataIndex = "user"
            filterIcon = { filtered => (
              <Icon type = "search" style = {{ color: filtered ? '#1890ff' : undefined }} />
            )}
            filterDropdown = { ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
              <div style = {{ padding: 8 }}>
                <Input
                  placeholder = "Pesquisar usuário"
                  value = {selectedKeys[0]}
                  onChange = {e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                  style = {{ width: 188, marginBottom: 8, display: 'block' }}
                />

                <Button
                  type = "primary"
                  onClick = {() => { setSelectedKeys(selectedKeys); confirm(); }}
                  icon = "search"
                  size = "small"
                  style = {{ width: 90, marginRight: 8 }}
                >
                  Pesquisar
                </Button>

                <Button onClick = {clearFilters} size = "small" style = {{ width: 90 }}>
                  Resetar
                </Button>
              </div>
            )}
            onFilter = { (value, record) => users.length > 0 && record.user && users[users.map(e => e._id).indexOf(record.user)].name.toLowerCase().includes(value.toLowerCase()) }
            render = { value => value && users.length > 0 ? users[users.map(e => e._id).indexOf(value)].name : '---' }
          />

          <Column
            align = "right"
            title = "Categoria"
            key = "category"
            dataIndex = "category"
            render = { value => categories.length > 0 ? categories[categories.map(e => e._id).indexOf(value)].title : '---' }
            filters = { categories && categories.map(e => { return { text: e.title, value: e._id } } )}
            onFilter = { (value, record) => record.category.indexOf(value) === 0 }
          />

          <Column
            align = "right"
            title = "Status"
            key = "status"
            dataIndex = "status"
            render = {status => <Tag color = {tags[tags.map(e => e.value).indexOf(status)].color}> { tags[tags.map(e => e.value).indexOf(status)].label } </Tag>}
            filters = { tags.map(e => { return { text: e.label, value: e.value } } )}
            onFilter = { (value, record) => record.status.indexOf(value) === 0 }
          />

          <Column
            align = "right"
            title = "Data"
            key = "date"
            dataIndex = "date"
            sorter = { (a, b) => moment(a.date).isBefore(moment(b.date), 'day') ? 1 : moment(a.date).isAfter(moment(b.date), 'day') ? -1 : 0 }
            defaultSortOrder = "descend"
            render = { date => (<span> {moment(date).format('DD [de] MMMM [de] YYYY')} </span>) }
          />
        </Table>
      </Card>
    </MainLayout>
  );
};

export default Occurrences;