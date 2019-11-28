import React, { useState, useEffect } from 'react';
import { Table, Dropdown, Menu, Input, Modal, Button, Icon, Form, Row, Popover, Col } from 'antd';
import { error, success } from '../../../services/messages';

import moment from 'moment';

import '../style.css';

import axios from 'axios';

const { Column } = Table;

const EditableContext = React.createContext();

const EditableCell = props => {
  const renderCell = ({ getFieldDecorator }) => {
    const {
      editingKey,
      record,
      index,
      children,
      ...restProps
    } = props;

    return (
      <td {...restProps}>
        { editingKey && editingKey === record._id ? (
          <Form.Item style = {{ margin: 0 }}>
            { getFieldDecorator('title', {
              rules: [
                { required: true, message: 'Campo Obrigatório' },
              ],
              initialValue: record.title
            })(<Input />)}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  return <EditableContext.Consumer>{renderCell}</EditableContext.Consumer>;
}

const Categories = props => {
  const { setLoadingPage } = props;

  const [categories, setCategories] = useState([]);
  const [pageUpdate, setPageUpdate] = useState(false);
  const [editingKey, setEditingKey] = useState('');

  useEffect(() => {
    setLoadingPage(true);
    axios.get('/api/categories').then(res => {
      setCategories(res.data);
      setLoadingPage(false);
    }).catch((err) => {
      setLoadingPage(false);
      error(err);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageUpdate]);

  const createCategory = () => {
    setLoadingPage(true);

    axios.post('/api/categories', {
      title: 'Nova Categoria'
    }).then(res => {
      success();
      setPageUpdate(!pageUpdate);
    }).catch(err => {
      setLoadingPage(false);
      error(err);
    });
  };

  const updateCategory = (form, id) => {
    form.validateFields((err, values) => {
      if(!err) {
        axios.put('/api/categories', {
          id, title: values.title
        }).then(res => {
          success();
          setEditingKey('');
          setPageUpdate(!pageUpdate);
        }).catch(err => {
          error(err);
        });
      }
    });
  };

  const deleteCategory = (id) => {
    axios.delete(`/api/categories/${id}`).then(res => {
      success();
      setPageUpdate(!pageUpdate);
    }).catch(err => {
      error(err);
    });
  };

  return(
    <EditableContext.Provider value = {props.form}>
      <Row gutter = {24} type = "flex" justify = "end" style = {{ marginBottom: 18 }}>
        <Col span = {14} style = {{ textAlign: 'right' }}>
          <Button onClick = { createCategory } type = "primary" icon = "plus"> Nova Categoria </Button>
        </Col>
      </Row>

      <Table
        locale = {{ emptyText: 'Não há categorias.' }}
        dataSource = { categories }
        scroll = {{ x: 660 }}
        rowKey = { record => record._id }
        rowClassName = "editable-row"
        components = {{ body: { cell: EditableCell } }}
      >
        <Column
          title = "Título"
          key = "title"
          dataIndex = "title"
          editable
          sorter = {(a, b) => (a.title && b.title ? a.title.toLowerCase().localeCompare(b.title.toLowerCase()) : 1)}
          onCell = { record => ({
            record,
            editingKey: editingKey
          }) }
          filterIcon = { filtered => (
            <Icon type = "search" style = {{ color: filtered ? '#1890ff' : undefined }} />
          )}
          filterDropdown = { ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style = {{ padding: 8 }}>
              <Input
                placeholder = "Pesquisar por título"
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
          onFilter = { (value, record) => record.title.toLowerCase().includes(value.toLowerCase()) }
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

        <Column
          align = "right"
          key = "_id"
          dataIndex = "_id"
          width = { editingKey ? 71 : 20}
          render = {(id) =>
            editingKey && editingKey === id ? (
              <Row type = "flex">
                <EditableContext.Consumer>
                  { form => (
                    <Popover content = "Salvar">
                      <Icon onClick = { () => updateCategory(form, id) } type = "check" style = {{ marginRight: 10, cursor: 'pointer' }} className = "icon-check-color" />
                    </Popover>
                  )}
                </EditableContext.Consumer>

                <Popover content = "Cancelar">
                  <Icon onClick = { () => setEditingKey('') } type = "close" style = {{ cursor: 'pointer' }} className = "icon-close-color" />
                </Popover>
              </Row>
            ) : (
              <Dropdown
                overlay = {(
                  <Menu>
                    <Menu.Item onClick = { () => setEditingKey(id) }> <Icon type = "edit" /> Editar </Menu.Item>

                    <Menu.Item
                      onClick = { () => {
                        Modal.confirm({
                          title: 'Deseja realmente apagar esta categoria?',
                          content: 'Esta ação é permanente, não haverá forma de restaurar ação.',
                          okType: 'danger',
                          onOk() {
                            deleteCategory(id);
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
            )
          }
        />
      </Table>
    </EditableContext.Provider>
  );
};

const CategoriesForm = Form.create({ name: 'categories_form' })(Categories);
export default CategoriesForm;