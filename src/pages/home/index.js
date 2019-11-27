import React, { useState, useEffect } from 'react';
import { Icon, Row, Popover, Button } from 'antd';
import { error, success } from '../../services/messages';

import MainLayout from '../../components/layout';
import GoogleMapReact from 'google-map-react';

import axios from 'axios';

import './style.css';

axios.defaults.baseURL = 'https://rio-campo-limpo.herokuapp.com/';

const GOOGLE_MAPS_APIKEY = "AIzaSyAwDqlhR0aPR6lYhzkE2nWdUz6ufbzStLk";
const pinIcon = require('../../images/icons/pin-maps.png')

const Home = props => {
  const [center, setCenter] = useState({
    lat: -24.046,
    lng:-52.3838
  });

  const [marker, setMarker] = useState({
    lat: -24.045647279694855,
    lng:-52.3901293427229
  });

  const [occurrences, setOccurrences] = useState([]);
  const [loadingPage, setLoadingPage] = useState(false);

  useEffect(() => {
    setLoadingPage(true);
    axios.get('/api/occurrences/').then(res => {
      setOccurrences(res.data);
      setLoadingPage(false);
    }).catch((err) => {
      setLoadingPage(false);
      error(err);
    });
  }, []);

  useEffect(() => {
    console.log(occurrences)
  }, [occurrences]);

  return (
    <MainLayout page = "home" loading = { loadingPage } >
      <Row style={{ height: '80vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: GOOGLE_MAPS_APIKEY }}
          defaultCenter={center}
          defaultZoom={15}
          onClick = {({x, y, lat, lng, event}) =>  console.log(lat,lng)}
        >
          {occurrences.map(oc => {
            return(
              <Popover 
                content = {"dsadsa"} 
                title = { oc.location.referencePoint }
                lat = { oc.location.latitude } 
                lng = { oc.location.longitude } 
              >
                <img src = { pinIcon } className = "img-icon"/>
              </Popover>
          )
          })}

        </GoogleMapReact>
      </Row>
    </MainLayout>
  );
};

export default Home;