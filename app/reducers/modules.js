// @flow
import { ADD_WORD, ADD_MODULE, REMOVE_MODULE, MODIFY_MODULE } from '../actions/modules';

export type wordType = {
  id:   number,
  text: string
};

export type wordsType = Array<wordType>;

export type moduleType = {
  id:              number,
  words:           wordsType,
  model:           string,
  weights:         string,
  metadata:        string,
  corpus:          string,
  maxlen:          number,
  switch_interval: number,
  diversity:       number
};

export type modulesType = Array<moduleType>;

export type actionType = {
  type:             string,
  module_id?:       number,
  word?:            wordType,
  model?:           string,
  weights?:         string,
  metadata?:        string,
  corpus?:          string,
  maxlen?:          number,
  switch_interval?: number,
  diversity?:       number
};

export type modulesStateType = {
  modules: modulesType
};

export function module(state?: moduleType, action: actionType) {
  switch (action.type) {
    case ADD_MODULE:
      return {
        id:    action.module_id,
        words: [],
        model:           action.model,
        weights:         action.weights,
        metadata:        action.metadata,
        corpus:          action.corpus,
        maxlen:          action.maxlen,
        switch_interval: action.switch_interval,
        diversity:       action.diversity
      };
    case MODIFY_MODULE:
      if (state.id !== action.module_id) {
        return state
      }

      return Object.assign({}, state, {
        model:           action.model,
        weights:         action.weights,
        metadata:        action.metadata,
        corpus:          action.corpus,
        maxlen:          action.maxlen,
        switch_interval: action.switch_interval,
        diversity:       action.diversity,
      });
    case ADD_WORD:
      if (state.id !== action.module_id) {
        return state
      }

      return Object.assign({}, state, {
        words: state.words.concat(action.word)
      });
    default:
      return state;
  }
}

export default function modules(state: modulesType = [], action: actionType) {
  switch (action.type) {
    case ADD_MODULE:
      return state.concat(module(undefined, action));
    case MODIFY_MODULE:
      return state.map(m =>
        module(m, action)
      );
    case REMOVE_MODULE:
      return state.filter((m)=>(action.module_id !== m.id));
    case ADD_WORD:
      return state.map(m =>
        module(m, action)
      );
    default:
      return state;
  }
}
