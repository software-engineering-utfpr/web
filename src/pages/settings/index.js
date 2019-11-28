import React, { useState } from 'react';
import { Card, Tabs, Icon } from 'antd';
import MainLayout from '../../components/layout';

import Categories from './tabs/categories';

import './style.css';

const Settings = props => {
  const [loadingPage, setLoadingPage] = useState(true);
  const [tab, setTab] = useState('0');

  const tabs = [{
    title: 'Categorias',
    icon: 'container',
    render: () => <Categories setLoadingPage = {setLoadingPage} />
  }];
  
  return (
    <MainLayout page = "Configurações" loading = {loadingPage} title = "Configurações" breadcrumb = {['Configurações']}>
      <Card
        bordered = {false} className = "alert-card" style = {{ borderRadius: 5 }}
        title = {
          <>
            <Icon type = {tabs[tab].icon} style = {{ marginRight: 6, color: '#00AD45' }} /> { tabs[tab].title }
          </>
        }
        extra = {
          <Tabs className = "tabs-card" activeKey = {tab} onChange = { key => setTab(key)} type = "card">
            { tabs.map((tab, index) => (
              <Tabs.TabPane tab = {tab.title} key = {index} />
            ))}
          </Tabs>
        }
      >
        { tabs[tab].render() }
      </Card>
    </MainLayout>
  );
};

export default Settings;