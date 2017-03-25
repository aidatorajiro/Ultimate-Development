// @flow
import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './TextArea.css';

export default class TextArea extends Component {
  props : {
    changeTextAreaValue : () => void,
    value : string
  }

  render() {
    return (
      <textarea value={this.props.value} onChange={ (e) => {this.props.changeTextAreaValue(e.target.value);} }/>
    );
  }
}
