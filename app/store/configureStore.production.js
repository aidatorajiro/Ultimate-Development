// @flow
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { hashHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import rootReducer from '../reducers';
import type { modulesStateType } from '../reducers/modules';
import type { textareaStateType } from '../reducers/textarea';


const router = routerMiddleware(hashHistory);

const enhancer = applyMiddleware(thunk, router);

export default function configureStore(initialState?: modulesStateType | textareaStateType) {
  return createStore(rootReducer, initialState, enhancer); // eslint-disable-line
}
