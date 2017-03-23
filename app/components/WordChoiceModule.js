// @flow
import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './WordChoiceModule.css';

let LSTMBaseWorker = require("worker-loader!../worker_scripts/lstm_base_worker");

export default class WordChoiceModule extends Component {
  constructor(props) {
      super(props);
      this.state = {items: []};
  }

  render() {
    return (
      <div className={styles.choice}>
        {this.state.items.map(item => (
          <a className={styles.word} key={item.key}>{item.word}</a>
        ))}
      </div>
    );
  }

  componentDidMount() {
    this.worker = new LSTMBaseWorker();

    this.worker.postMessage(
    { type: 'start',
      data: { model: require("file-loader!../model_data/manowa_jyukugo_lstm/model_33.json"),
              weights: require("file-loader!../model_data/manowa_jyukugo_lstm/model_33_weights.buf"),
              metadata: require("file-loader!../model_data/manowa_jyukugo_lstm/model_33_metadata.json"),
              corpus: require("file-loader!../model_data/manowa_jyukugo_lstm/jyukugo.txt"),
              maxlen: 40,
              switch_interval: 100,
              diversity: 1 } } );

    this.worker.addEventListener('message', (message) => {
      if (message.data.type == 'debug') {
      }
      if (message.data.type == 'word') {
        this.setState((prevState) => ({
            items: prevState.items.concat({word: message.data.data, key: Date.now()})
        }));
      }
    });
  }
}
