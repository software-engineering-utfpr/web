import React, { useEffect, useState } from 'react';
import { Table, Card, Icon, Input, Button, Avatar, Tag } from 'antd';

import axios from 'axios';
import moment from 'moment';

import MainLayout from '../../components/layout';
import { error } from '../../services/messages';

import './style.css';

const { Column } = Table;

const Users = props => {
  const [loadingPage, setLoadingPage] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setLoadingPage(true);

    axios.get('/api/users').then((res) => {
      setLoadingPage(false);
      setUsers(res.data);

    }).catch((err) => {
      setLoadingPage(false);
      error(err);
    });
  }, []);

  const formatPhone = (value) => {
    let text = value.replace(/\D/g, '').substring(0, 11);
		text = text.replace(/^(\d\d)(\d)/g, '($1) $2');
		text = text.replace(/(\d{5})(\d)/, '$1-$2');
		return text;
  };

  const formatCPF = (value) => {
		let text = value.replace(/\D/g, '').substring(0, 11);
		text = text.replace(/^(\d{3})(\d)/g, '$1.$2');
		text = text.replace(/(\d{3})(\d)/, '$1.$2');
		text = text.replace(/(\d{3})(\d)/, '$1-$2');
		return text;
	}

  return (
    <MainLayout page = "app" loading = { loadingPage } title = "Gerenciamento de Usuários App" breadcrumb = {['Gerenciamento', 'Usuários', 'App']}>
      <Card
        bordered = {false} className = "alert-card" style = {{ borderRadius: 5 }}
        title = {
          <>
            <Icon type = "area-chart" style = {{ marginRight: 6, color: '#00AD45' }} /> Usuários Cadastrados
          </>
        }
      >
        <Table
          locale = {{ emptyText: 'Não há usuários.' }}
          dataSource = { users }
          scroll = {{ x: 960 }}
          rowKey = { record => record._id }
        >
          <Column
            width = {64}
            key = "image"
            dataIndex = "image"
            render = { image => <Avatar src = {image} />}
          />

          <Column
            title = "Título"
            key = "name"
            dataIndex = "name"
            sorter = {(a, b) => (a.name && b.name ? a.name.toLowerCase().localeCompare(b.name.toLowerCase()) : 1)}
            filterIcon = { filtered => (
              <Icon type = "search" style = {{ color: filtered ? '#1890ff' : undefined }} />
            )}
            filterDropdown = { ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
              <div style = {{ padding: 8 }}>
                <Input
                  placeholder = "Pesquisar por nome"
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
                  Ok
                </Button>

                <Button onClick = {clearFilters} size = "small" style = {{ width: 90 }}>
                  Resetar
                </Button>
              </div>
            )}
            onFilter = { (value, record) => record.phone.toLowerCase().includes(value.toLowerCase()) }
          />

          <Column
            title = "Telefone"
            key = "phone"
            dataIndex = "phone"
            filterIcon = { filtered => (
              <Icon type = "search" style = {{ color: filtered ? '#1890ff' : undefined }} />
            )}
            filterDropdown = { ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
              <div style = {{ padding: 8 }}>
                <Input
                  placeholder = "Pesquisar por telefone"
                  value = {selectedKeys[0]}
                  onChange = {e => setSelectedKeys(e.target.value ? [formatPhone(e.target.value)] : [])}
                  style = {{ width: 188, marginBottom: 8, display: 'block' }}
                />

                <Button
                  type = "primary"
                  onClick = {() => { setSelectedKeys(selectedKeys); confirm(); }}
                  icon = "search"
                  size = "small"
                  style = {{ width: 90, marginRight: 8 }}
                >
                  Ok
                </Button>

                <Button onClick = {clearFilters} size = "small" style = {{ width: 90 }}>
                  Resetar
                </Button>
              </div>
            )}
            onFilter = { (value, record) => record.phone.toLowerCase().includes(value.toLowerCase()) }
          />

          <Column
            title = "CPF"
            key = "cpf"
            dataIndex = "cpf"
            filterIcon = { filtered => (
              <Icon type = "search" style = {{ color: filtered ? '#1890ff' : undefined }} />
            )}
            filterDropdown = { ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
              <div style = {{ padding: 8 }}>
                <Input
                  placeholder = "Pesquisar por CPF"
                  value = {selectedKeys[0]}
                  onChange = {e => setSelectedKeys(e.target.value ? [formatCPF(e.target.value)] : [])}
                  style = {{ width: 188, marginBottom: 8, display: 'block' }}
                />

                <Button
                  type = "primary"
                  onClick = {() => { setSelectedKeys(selectedKeys); confirm(); }}
                  icon = "search"
                  size = "small"
                  style = {{ width: 90, marginRight: 8 }}
                >
                  Ok
                </Button>

                <Button onClick = {clearFilters} size = "small" style = {{ width: 90 }}>
                  Resetar
                </Button>
              </div>
            )}
            onFilter = { (value, record) => record.cpf.toLowerCase().includes(value.toLowerCase()) }
          />

          <Column
            title = "Tipo"
            key = "facebookID"
            dataIndex = "facebookID"
            render = { item => <Tag color = { item ? '#4267B2' : '#F7B731' }> { item ? 'Facebook' : 'Normal' } </Tag> }
            filters = {[{
              text: 'Facebook',
              value: 'facebook'
            }, {
              text: 'Normal',
              value: 'normal'
            }]}
            onFilter = { (value, record) => (record.facebookID && value === 'facebook') || (!record.facebookID && value === 'normal') }
          />

          <Column
            align = "right"
            title = "Data Criação"
            key = "createdAt"
            dataIndex = "createdAt"
            sorter = { (a, b) => moment(a.createdAt).isBefore(moment(b.createdAt), 'day') ? 1 : moment(a.createdAt).isAfter(moment(b.createdAt), 'day') ? -1 : 0 }
            defaultSortOrder = "descend"
            render = { date => (<span> {moment(date).format('DD [de] MMMM [de] YYYY')} </span>) }
          />
        </Table>
      </Card>
    </MainLayout>
  );
};

export default Users;