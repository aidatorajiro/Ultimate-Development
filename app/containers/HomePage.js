// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import Home from '../components/Home';
import * as modulesActions from '../actions/modules';
import * as textareaActions from '../actions/textarea';

function mapStateToProps(state) {
  return {
    textarea: state.textarea,
    modules: state.modules
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, modulesActions, textareaActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
