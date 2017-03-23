// @flow
import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './WordChoiceModule.css';

let LSTMBaseWorker = require("worker-loader!../worker_scripts/lstm_base_worker");

export default class WordChoiceModule extends Component {
  constructor(props) {
    super(props);
    this.state = {items: [], worker: undefined};
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
    this.start_worker();
  }

  componentWillReceiveProps(nextProps) {
    this.start_worker(nextProps);
  }

  componentWillUnmount() {
    this.state.worker.terminate();
    delete this.state.worker;
  }

  start_worker(props = this.props) {
    this.setState((prevState) => {
      let nextState = {}
      nextState.items = [];

      if (prevState.worker != undefined) {
          prevState.worker.terminate();
          delete prevState.worker;
      }

      nextState.worker = new LSTMBaseWorker();

      nextState.worker.postMessage(
      { type: 'start',
        data: { model:           props.model,
                weights:         props.weights,
                metadata:        props.metadata,
                corpus:          props.corpus,
                maxlen:          40,
                switch_interval: props.switch_interval,
                diversity:       props.diversity } } );

      nextState.worker.addEventListener('message', (message) => {
        if (message.data.type == 'debug') {
        }
        if (message.data.type == 'word') {
          this.setState((prevState) => ({
            items: prevState.items.concat({word: message.data.data, key: Date.now()}),
            worker: prevState.worker
          }));
        }
      });

      return nextState;
    });
  }
}

WordChoiceModule.propTypes = {
  model:           React.PropTypes.string.isRequired,
  weights:         React.PropTypes.string.isRequired,
  metadata:        React.PropTypes.string.isRequired,
  corpus:          React.PropTypes.string.isRequired,
  switch_interval: React.PropTypes.number,
  diversity:       React.PropTypes.number
}

WordChoiceModule.defaultProps = {
  switch_interval: 100,
  diversity:       1
}
