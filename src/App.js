import React, { useState, Fragment } from 'react';
// import logo from './logo.svg';
import { Button, Row, Col, Form, Spinner } from 'react-bootstrap';
import './App.css';
import axios from 'axios'
import Chart from "react-google-charts";
import moment from 'moment';

function App() {
  const [location, setLocation] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isdataFetched, setIsdataFetched] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [chartTitle, setChartTitle] = useState();
  // console.log('location', location);
  const baseUrl = 'https://docs.openaq.org/v2/latest/';
  const formData = (results) => {
    const { measurements, location } = results[0];
    // console.log('------------', results[0]);
    const getData = [['Date', 'Value']];
    measurements.map((data) => {
      const date = moment(data.lastUpdated).format('DD/MM/YYYY HH:MM');
      // console.log('data.value', date, typeof date, typeof data.value);
      getData.push([date, data.value]);
      return null;
    })
    setChartTitle(location);
    setChartData(getData);
  }
  const fetchAPIHandler = () => {
    setIsdataFetched(false);
    const url = `${baseUrl}${location}?limit=100&page=1&offset=0&sort=desc&radius=1000&order_by=lastUpdated&dumpRaw=false`
    if (location !== 0) {
      setIsLoading(true);
      axios.get(url).then((response) => {
        const { results } = response.data;
        formData(results);
        setIsLoading(false);
        setIsdataFetched(true);
      });
    }
  }

  return (
    <div className="App">
      <Row>
        <Col>
          <Form.Control as="select" value={location} onChange={(e) => { console.log(e.target.value); setLocation(e.target.value); }}>
            <option value="0">Select Location</option>
            <option value="5628">GVM Corporation, Visakhapatnam - APPCB</option>
            <option value="8244">Collector Office, Yadgir - KSPCB</option>
            <option value="233414">Omex Eternity, Vrindavan - UPPCB</option>
            <option value="5353">APIIC Kancharapalem-APPCB</option>
            <option value="220367">Brahmagiri, Udupi - KSPCB</option>
          </Form.Control>
        </Col>
        <Col>
          <Button type="button" onClick={() => fetchAPIHandler()}>
            Fetch Pollution Report
            {
              isLoading ? <Spinner animation="border" variant="light" /> : <Fragment />
            }
          </Button>
        </Col>
      </Row>
      {
        isdataFetched ? (
          <Row>
            <Col>
              <Chart
                width={'100%'}
                height={'400px'}
                chartType="ScatterChart"
                loader={<div>Loading Chart</div>}
                data={chartData}
                options={{
                  title: chartTitle,
                  hAxis: { title: 'Date', minValue: 0, maxValue: 15 },
                  vAxis: { title: 'Value', minValue: 0, maxValue: 15 },
                  legend: 'none',
                }}
                rootProps={{ 'data-testid': '1' }}
              />
            </Col>
          </Row>
        ) : <Fragment />
      }      
    </div>
  );
}

export default App;
