// @flow
import { ADD_WORD, ADD_MODULE } from '../actions/modules';

type wordType = {
  id:   number,
  text: string
};

type wordsType = Array<wordType>;

type moduleType = {
  id:    number,
  words: wordsType
};

type modulesType = Array<moduleType>;

export type actionType = {
  type:       string,
  module_id?: number,
  word?:      wordType
};

export type modulesStateType = {
  modules: modulesType
};

export function module(state?: moduleType, action: actionType) {
  switch (action.type) {
    case ADD_MODULE:
      return {
        id:    action.module_id,
        words: []
      };
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
    case ADD_WORD:
      return state.map(m =>
        module(m, action)
      );
    default:
      return state;
  }
}
