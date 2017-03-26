// @flow
import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './PresetList.css';

export default class PresetList extends Component {
  props : {
    functions: Array<{
      id: number,
      name: string,
      func: () => void
    }>,
    style : { [key: string]: string }
  }

  render() {
    return (
      <div id={ styles.list } style={ this.props.style }>
        {this.props.functions.map(f => (
          <a key={ f.id } className={ styles.func } onClick={ f.func }>{ f.name }</a>
        ))}
      </div>
    );
  }
}
