import React, { useState, useEffect } from 'react';
import { Typography, List, Col, Row, Card, Icon, Input, Select, Spin, Button, Modal, Rate, Dropdown, Menu, Divider, Form, Avatar, Popover } from 'antd';

import axios from 'axios';
import MainLayout from '../../components/layout';
import { error, success } from '../../services/messages';

import './style.css';

const { Text, Paragraph } = Typography;
const { Search } = Input;

const Games = props => {
  const { getFieldDecorator, setFieldsValue, resetFields, validateFields } = props.form;

  const [loadingPage, setLoadingPage] = useState(true);
  const [games, setGames] = useState([]);
  const [gamesFiltered, setGamesFiltered] = useState([]);
  const [gameModal, setGameModal] = useState({
    gameID: '',
    loading: false,
    visibility: false,
    games: [],
    fetching: true
  });
  const [pageUpdate, setPageUpdate] = useState(false);

  useEffect(() => {
    setLoadingPage(true);

    axios.get('/api/games').then((res) => {
      setLoadingPage(false);
      setGames(res.data);
      setGamesFiltered(res.data);

    }).catch((err) => {
      setLoadingPage(false);
      error(err);
    });
  }, [pageUpdate]);

  const searchByName = (e) => setGamesFiltered(games.filter(r => r.name.toLowerCase().includes(e.target.value.toLowerCase())));

  const openNewGameModal = () => {
    setGameModal({ ...gameModal, gameID: '', visibility: true });
  }

  const openUpdateGameModal = (game) => {
    setGameModal({ ...gameModal, games: [{ appId: game.appId, icon: game.image, title: game.name }], fetching: false, visibility: true, gameID: game._id });
    setFieldsValue({ game: game.appId });
  }

  const closeGameModal = () => {
    resetFields(['game']);
    setGameModal({
      ...gameModal,
      gameID: '',
      loading: false,
      visibility: false
    });
  }

  const getGooglePlayGames = (value) => {
    setGameModal({ ...gameModal, games: [], fetching: true });

    if(value.trim()) {
      axios.get(`/api/games/searchByLink/${value}`).then(res => {
        setGameModal({ ...gameModal, games: res.data, fetching: false });
      });
    }
  }

  const filteredOptions = (value, option) => {
    return true;
  }

  const gameValidation = (rule, value, callback) => {
    if(games[games.map((e) => e.appId).indexOf(value)]) {
      callback('Jogo já cadastrado.');
    } else {
      callback();
    }
  }

  const handleNewGame = e => {
    setGameModal({ ...gameModal, loading: true });
    e.preventDefault();

    validateFields(['game'], (err, values) => {
      if(!err) {
        axios.get(`/api/games/getById/${values.game}`).then(res => {
          const { title, appId, developer, url, scoreText, icon } = res.data;
          axios.post('/api/games', { appId, name: title, link: url, image: icon, developer, score: scoreText }).then(res => {
            setPageUpdate(!pageUpdate);
            closeGameModal();
            success();
          }).catch(err => {
            closeGameModal();
            error(err);
          });
        });
      } else {
        setGameModal({ ...gameModal, loading: true });
      }
    });
  }

  const handleEditGame = e => {
    setGameModal({ ...gameModal, loading: true });
    e.preventDefault();

    validateFields(['game'], (err, values) => {
      if(!err) {
        axios.get(`/api/games/getById/${values.game}`).then(res => {
          const { title, appId, developer, url, scoreText, icon } = res.data;
          axios.put('/api/games', { id: gameModal.gameID, appId, name: title, link: url, image: icon, developer, score: scoreText }).then(res => {
            setPageUpdate(!pageUpdate);
            closeGameModal();
            success();
          }).catch(err => {
            closeGameModal();
            error(err);
          });
        });
      } else {
        setGameModal({ ...gameModal, loading: true });
      }
    });
  }

  const deleteGame = (id) => {
    axios.delete(`/api/games/${id}`).then(res => {
      success();
      setPageUpdate(!pageUpdate);
    }).catch(err => {
      error(err);
    });
  }

  return (
    <MainLayout page = "jogos" loading = { loadingPage } title = "Gerenciamento de Jogos" breadcrumb = {['Gerenciamento', 'Jogos']}>
      <Card
        bordered = {false} className = "alert-card" style = {{ borderRadius: 5 }}
        title = {
          <>
            <Icon type = "area-chart" style = {{ marginRight: 6, color: '#00AD45' }} /> Jogos Cadastrados
          </>
        }
        extra = {<Button type = "primary" icon = "plus" onClick = { openNewGameModal }> Adicionar Jogo </Button>}
      >
        <Row gutter = {24} type = "flex" justify = "end" style = {{ marginBottom: 18 }}>
          <Col sm = {14} xs = {24}>
            <Search
              placeholder = "Pesquise por nome"
              onChange = { e => searchByName(e) }
              size = "default"
            />
          </Col>
        </Row>

        <List
          size = "small" dataSource = { gamesFiltered }
          grid = {{ gutter: 32, xs: 2, sm: 3, md: 4, lg: 4, xl: 6, xxl: 4 }}
          renderItem = {(item) => (
            <List.Item className = "game-list-item" style = {{ height: '100%' }}>
              <Avatar shape = "square" style = {{ background: `url(${item.image}) 10px 10px / calc(100% - 20px) no-repeat`, backgroundPositionY: 'center' }} />

              <Row style = {{ textAlign: 'left', height: 100 }}>
                <Popover content = { item.name }>
                  <Text style = {{ overflow: 'hidden', width: '100%', paddingRight: 13, fontWeight: 500 }} ellipsis> { item.name } </Text>
                </Popover>
                
                <Popover content = { item.developer }>
                  <Text style = {{ overflow: 'hidden', width: '100%', paddingRight: 13, fontSize: 13, marginTop: -20 }} type = "secondary" ellipsis> { item.developer } </Text>
                </Popover>
                <Rate allowHalf disabled style = {{ fontSize: 14 }} defaultValue = { parseFloat((Math.round(item.score/0.5) * 0.5).toFixed(2)) } />

                <Dropdown
                  overlay = {(
                    <Menu>
                      <Menu.Item onClick = { () => openUpdateGameModal(item) }> <Icon type = "edit" /> Editar </Menu.Item>

                      <Menu.Item
                        onClick = { () => {
                          Modal.confirm({
                            title: 'Deseja realmente apagar este jogo?',
                            content: 'Esta ação é permanente, não haverá forma de restaurar ação.',
                            okType: 'danger',
                            onOk() {
                              deleteGame(item._id)
                            },
                            onCancel() {}
                          });
                        }}
                      >
                        <Icon type = "delete" /> Excluir
                      </Menu.Item>
                    </Menu>
                  )}
                  placement = "topRight"
                >
                  <Icon style = {{ position: 'absolute', right: 0, top: 0, cursor: 'pointer' }} type = "more" />
                </Dropdown>
              </Row>
            </List.Item>
          )}
        />
      </Card>

      <Modal visible = { gameModal.visibility } onCancel = { closeGameModal } footer = { null }>
        <Paragraph style = {{ fontSize: 30, textAlign: 'center', marginBottom: 5 }}> { gameModal.gameID ? 'Editar Jogo' : 'Novo Jogo' } </Paragraph>

        <Divider style = {{ fontSize: 20, minWidth: '60%', width: '60%', marginTop: 0, marginLeft: 'auto', marginRight: 'auto' }}>
          <Icon type = { gameModal.gameID ? 'edit' : 'plus' } />
        </Divider>

        <Form onSubmit = { gameModal.gameID ? handleEditGame : handleNewGame }>
          <Form.Item label = "Aplicativo">
            { getFieldDecorator('game', {
              rules: [
                { required: true, message: 'Por favor, insira um nome!' },
                { validator: gameValidation }
              ]
            })(
              <Select
                notFoundContent = { gameModal.fetching ? <Spin size = "small" /> : undefined }
                onSearch = { getGooglePlayGames } onChange = { () => setGameModal({ ...gameModal, fetching: false }) }
                showSearch placeholder = "Procure Aplicativo pelo Nome" filterOption = { filteredOptions } showArrow = {false}
              >
                { gameModal.games.map(game => (
                  <Select.Option key = { game.title } value = { game.appId }>
                    <Avatar size = {20} shape = "square" src = { game.icon } /> &nbsp; 
                    { game.title }
                  </Select.Option>
                )) }
              </Select>
            )}
          </Form.Item>

          <Row style = {{ textAlign: 'right' }}>
            <Button size = "default" onClick = { closeGameModal } style = {{ marginRight: 8 }}> Cancelar </Button>
            <Button loading = { gameModal.loading } type = "primary" htmlType = "submit" size = "default"> { gameModal.gameID ? 'Atualizar' : 'Criar' } </Button>
          </Row>
        </Form>
      </Modal>
    </MainLayout>
  );
};

const WrappedNormalGameForm = Form.create({ name: 'game_form' })(Games);
export default WrappedNormalGameForm;

