// @flow
import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './TextArea.css';

export default class TextArea extends Component {
  props : {
    changeTextAreaValue : () => void,
    style : { [key: string]: string },
    value : string
  }

  render() {
    return (
      <textarea placeholder="ここに何か文章を書く..." className={ styles.textarea } style={ this.props.style } value={ this.props.value } onChange={ (e) => { this.props.changeTextAreaValue(e.target.value); } }/>
    );
  }
}
