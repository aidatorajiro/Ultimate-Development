// @flow
import React, { Component } from 'react';
import { Link } from 'react-router';
import ChoiceList from './ChoiceList';
import type { moduleType } from '../reducers/modules';
import styles from './WordChoiceModule.css';

let LSTMBaseWorker = require("worker-loader!../worker_scripts/lstm_base_worker");

export default class WordChoiceModule extends Component {
  props : {
    module:       moduleType,
    addWord:      () => void,
    modifyModule: () => void,
    removeModule: () => void,
    addTextAreaValue: () => void
  }

  state_props = () => ({ input_model:           this.props.module.model,
                         input_weights:         this.props.module.weights,
                         input_metadata:        this.props.module.metadata,
                         input_corpus:          this.props.module.corpus,
                         input_switch_interval: this.props.module.switch_interval,
                         input_diversity:       this.props.module.diversity });

  constructor(props) {
    super(props);
    this.state = Object.assign({ config: false, worker: undefined }, this.state_props());
  }

  set() {
    this.props.modifyModule(this.props.module.id,
                            this.state.input_model,
                            this.state.input_weights,
                            this.state.input_metadata,
                            this.state.input_corpus,
                            this.props.module.maxlen,
                            parseFloat(this.state.input_switch_interval),
                            parseFloat(this.state.input_diversity));
  }

  cancel () {
    this.setState(this.state_props());
  }

  config_render() {
    return (
      <div className={ styles.configwrapper }>
        <div className={ styles.config }>
          Path to model file
          <input className={ styles.input } type="text" value={this.state.input_model}    onChange={(e) => {this.setState({input_model: e.target.value});}} /><br /><br />
          Path to weight file
          <input className={ styles.input } type="text" value={this.state.input_weights}  onChange={(e) => {this.setState({input_weights: e.target.value});}} /><br /><br />
          Path to metadata file
          <input className={ styles.input } type="text" value={this.state.input_metadata} onChange={(e) => {this.setState({input_metadata: e.target.value});}} /><br /><br />
          Path to corpus file
          <input className={ styles.input } type="text" value={this.state.input_corpus}   onChange={(e) => {this.setState({input_corpus: e.target.value});}} /><br /><br />
          Switch interval
          <input className={ styles.input } type="number" value={this.state.input_switch_interval} onChange={(e) => {this.setState({input_switch_interval: e.target.value});}} /><br /><br />
          Diversity
          <input className={ styles.input } type="number" value={this.state.input_diversity}       onChange={(e) => {this.setState({input_diversity: e.target.value});}} /><br /><br />
          <button className={`${styles.configsetbtn} ${styles.btn}`}    onClick={ () => { this.setState({config: false}); this.set();    } }>Set</button>
          <button className={`${styles.configcancelbtn} ${styles.btn}`} onClick={ () => { this.setState({config: false}); this.cancel(); } }>Cancel</button>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className={ styles.wcmodule }>
        <div className={ styles.btnwrapper }>
          <button className={`${styles.removebtn} ${styles.btn}`} onClick={ () => { this.props.removeModule(this.props.module.id); } } >Remove</button>
          <button className={`${styles.configbtn} ${styles.btn}`} onClick={ () => { this.setState({config: true}); } }>Config</button>
        </div>
        <div className={ styles.choicelistwrapper }>
          <ChoiceList items={ this.props.module.words } onClick={ (item) => { this.props.addTextAreaValue(item.text); } }/>
        </div>
        {(() => {if (this.state.config == true) { return this.config_render(); }})()}
      </div>
    );
  }

  componentDidMount() {
    this.start_worker();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.module.model           != nextProps.module.model           ||
        this.props.module.weights         != nextProps.module.weights         ||
        this.props.module.metadata        != nextProps.module.metadata        ||
        this.props.module.corpus          != nextProps.module.corpus          ||
        this.props.module.maxlen          != nextProps.module.maxlen          ||
        this.props.module.switch_interval != nextProps.module.switch_interval ||
        this.props.module.diversity       != nextProps.module.diversity) {
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

      if (prevState.worker != undefined) {
          prevState.worker.terminate();
          delete prevState.worker;
      }

      nextState.worker = new LSTMBaseWorker();

      nextState.worker.postMessage(
      { type: 'start',
        data: { model:           require(`file-loader!../model_data/${props.module.model}`),
                weights:         require(`file-loader!../model_data/${props.module.weights}`),
                metadata:        require(`file-loader!../model_data/${props.module.metadata}`),
                corpus:          require(`file-loader!../model_data/${props.module.corpus}`),
                maxlen:          props.module.maxlen,
                switch_interval: props.module.switch_interval,
                diversity:       props.module.diversity } } );

      nextState.worker.addEventListener('message', (message) => {
        if (message.data.type == 'debug') {
        }
        if (message.data.type == 'word') {
          props.addWord(props.module.id, message.data.data);
        }
      });

      return nextState;
    });
  }
}
