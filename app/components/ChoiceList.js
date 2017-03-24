// @flow
import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './ChoiceList.css'

export default class ChoiceList extends Component {
  static propTypes = {
    items:   React.PropTypes.arrayOf(
      React.PropTypes.shape({
        id:  React.PropTypes.number,
        text: React.PropTypes.string
      })
    ),
    onClick: React.PropTypes.func
  }

  static defaultProps = {
    items:   [],
    onClick: () => {}
  }

  render() {
    return (
      <div className={styles.choice}>
        {this.props.items.map(item => (
          <a className={styles.item}
             key={item.id}
             onClick={ (e) => { this.props.onClick(item, e) } }
          >{item.text}</a>
        ))}
      </div>
    )
  }
}
