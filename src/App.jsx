import React, { Component } from 'react';
import DatePicker from 'react-date-picker';
import CSVDownload from 'react-json-to-csv';

import './App.css';
import { db } from './Firebase';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      endDate: new Date(),
      rowData: [],
    }
  }

  startDateHandler = (startDate) => {
    console.log(startDate);
    this.setState({
      startDate: startDate
    });
  }

  endDateHandler = (endDate) => {
    console.log(endDate);
    this.setState({
      endDate: endDate
    });
  }

  formatDate = (date) => {
    let d = new Date(date),
      mon = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (mon.length < 2)
      mon = '0' + mon;
    if (day.length < 2)
      day = '0' + day;
    return year + mon + day;
  }

  getReports = () => {
    console.log( this.formatDate(this.state.startDate));
    var rootRef = db.ref()
      .orderByKey()
      .startAt( this.formatDate(this.state.startDate))
      .endAt( this.formatDate(this.state.endDate));
    let resultData = [];

    rootRef.on('child_added', function (snapshot) {
      // Store all the labels in array
      snapshot.forEach(function (childSnapshot) {
        resultData.push(childSnapshot.val());
      })
    });
    this.setState({
      rowData: resultData,
    });
    console.log(resultData)
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Note: this site is for the test data
        </a>

          <div>
            <DatePicker
              onChange={this.startDateHandler}
              value={this.state.startDate}
            />
          </div>

          <div>
            <DatePicker
              onChange={this.endDateHandler}
              value={this.state.endDate}
            />
          </div>
          <button className="export" onClick={this.getReports}>Read Data From Firebase</button>
          <CSVDownload data = {this.state.rowData} />
        </header>
      </div>
    );
  }
}

export default App;
