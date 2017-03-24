// @flow
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import modules from './modules';

const rootReducer = combineReducers({
  modules,
  routing
});

export default rootReducer;
