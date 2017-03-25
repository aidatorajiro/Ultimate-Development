// @flow
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import modules from './modules';
import textarea from './textarea';

const rootReducer = combineReducers({
  modules,
  textarea,
  routing
});

export default rootReducer;
