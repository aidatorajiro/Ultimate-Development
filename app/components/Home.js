// @flow
import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './Home.css';
import TextArea from './TextArea';
import WordChoiceModule from './WordChoiceModule';
import PresetList from './PresetList';
import type { modulesType } from '../reducers/modules';

export default class Home extends Component {
  props : {
    modules:   modulesType,
    textarea:  string,
    addWord:   () => void,
    addModule: () => void,
    modifyModule: () => void,
    removeModule: () => void,
    addManowaJyukugoChoiceModule: () => void,
    addTextAreaValue: () => void,
    changeTextAreaValue: () => void
  }

  render() {
    return (
      <div id={styles.wrapper}>
        <TextArea value={this.props.textarea} changeTextAreaValue={this.props.changeTextAreaValue} />
        <PresetList style={ { width: `calc(100% - ${this.props.modules.length * 150}px)` } }
          functions={ [
            { name : 'Manowa LV.33',
              func: () => { this.props.addManowaJyukugoChoiceModule(33) },
              id: 0 },
            { name : 'Manowa LV.33 With diversity 5',
              func: () => { this.props.addManowaJyukugoChoiceModule(33, undefined, 5) },
              id: 1 },
            { name : 'Manowa LV.30',
              func: () => { this.props.addManowaJyukugoChoiceModule(30) },
              id: 2 },
            { name : 'Manowa LV.20',
              func: () => { this.props.addManowaJyukugoChoiceModule(20) },
              id: 3 },
            { name : 'Manowa LV.10',
              func: () => { this.props.addManowaJyukugoChoiceModule(10) },
              id: 4 },
            { name : 'Manowa LV.0',
              func: () => { this.props.addManowaJyukugoChoiceModule(0) },
              id: 5 }
          ] }/>
        {this.props.modules.map(module => (
          <WordChoiceModule
            module={ module }
            addWord={ this.props.addWord }
            modifyModule={ this.props.modifyModule }
            removeModule={ this.props.removeModule }
            key={ module.id } />
        ))}
      </div>
    );
  }
}
