// @flow
import React, { Component } from 'react';
import { Link } from 'react-router';
import ChoiceList from './ChoiceList';
import { modulesType } from '../reducers/modules';

let LSTMBaseWorker = require("worker-loader!../worker_scripts/lstm_base_worker");

export default class WordChoiceModule extends Component {
  prop : {
    module:          modulesType,
    addWord:         React.PropTypes.func.isRequired,
    model:           React.PropTypes.string.isRequired,
    weights:         React.PropTypes.string.isRequired,
    metadata:        React.PropTypes.string.isRequired,
    corpus:          React.PropTypes.string.isRequired,
    switch_interval: React.PropTypes.number.isRequired,
    diversity:       React.PropTypes.number.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {worker: undefined};
  }

  render() {
    return (
      <ChoiceList items={this.props.module.words} />
    );
  }

  componentDidMount() {
    this.start_worker();
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props) !== JSON.stringify(nextProps)) {
      this.start_worker(nextProps);
    }
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
          this.props.addWord(this.props.module.id, message.data.data);
        }
      });

      return nextState;
    });
  }
}
