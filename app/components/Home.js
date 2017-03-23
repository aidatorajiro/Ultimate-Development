// @flow
import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './Home.css';
import WordChoiceModule from './WordChoiceModule';


export default class Home extends Component {
  render() {
    return (
      <div id={styles.wrapper}>
        <div id={styles.textarea}>
        </div>
        <WordChoiceModule />
      </div>
    );
  }
}
