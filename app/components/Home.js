// @flow
import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './Home.css';
import WordChoiceModule from './WordChoiceModule';


export default class Home extends Component {
  render() {
    let model_url    = require("file-loader!../model_data/manowa_jyukugo_lstm/model_33.json");
    let weights_url  = require("file-loader!../model_data/manowa_jyukugo_lstm/model_33_weights.buf");
    let metadata_url = require("file-loader!../model_data/manowa_jyukugo_lstm/model_33_metadata.json");
    let corpus_url   = require("file-loader!../model_data/manowa_jyukugo_lstm/jyukugo.txt");

    return (
      <div id={styles.wrapper}>
        <WordChoiceModule model={model_url} weights={weights_url} metadata={metadata_url} corpus={corpus_url}/>
      </div>
    );
  }
}
