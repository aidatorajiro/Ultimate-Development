// @flow
import type { actionType } from '../reducers/modules';

export const ADD_WORD      : string = 'ADD_WORD';
export const ADD_MODULE    : string = 'ADD_MODULE';
export const MODIFY_MODULE : string = 'MODIFY_MODULE';
export const REMOVE_MODULE : string = 'REMOVE_MODULE';

let nextModuleId : number = 0;
let nextWordId   : number = 0;

export function addWord(module_id : number, word_text : string) : actionType {
  return {
    type:      ADD_WORD,
    module_id,
    word: {
      id:   nextWordId++,
      text: word_text
    }
  };
}

export function addModule(model : string, weights : string, metadata : string, corpus : string, maxlen : number, switch_interval : number, diversity : number) : actionType {
  return {
    type:      ADD_MODULE,
    module_id: nextModuleId++,
    model,
    weights,
    metadata,
    corpus,
    maxlen,
    switch_interval,
    diversity
  };
}

export function modifyModule(module_id : number, model : string, weights : string, metadata : string, corpus : string, maxlen : number, switch_interval : number, diversity : number) : actionType {
  return {
    type:      MODIFY_MODULE,
    module_id,
    model,
    weights,
    metadata,
    corpus,
    maxlen,
    switch_interval,
    diversity
  };
}

export function removeModule(module_id : number) : actionType {
  return {
    type:      REMOVE_MODULE,
    module_id
  };
}

export function addManowaJyukugoChoiceModule(level : number, switch_interval : number = 100, diversity : number = 1) : actionType {
  return {
    type:      ADD_MODULE,
    module_id: nextModuleId++,
    model:     `manowa_jyukugo_lstm/model_${level}.json`,
    weights:   `manowa_jyukugo_lstm/model_${level}_weights.buf`,
    metadata:  `manowa_jyukugo_lstm/model_${level}_metadata.json`,
    corpus:    `manowa_jyukugo_lstm/jyukugo.txt`,
    maxlen:    40,
    switch_interval,
    diversity
  };
}
