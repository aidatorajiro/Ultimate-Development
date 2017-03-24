// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import Home from '../components/Home';
import * as modulesActions from '../actions/modules';

function mapStateToProps(state) {
  return {
    modules: state.modules
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(modulesActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
