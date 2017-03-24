// @flow
import { actionType } from '../reducers/modules';

export const ADD_WORD   : string = 'ADD_WORD';
export const ADD_MODULE : string = 'ADD_MODULE';

let nextModuleId : number = 0;
let nextWordId   : number = 0;

export function addWord(module_id : number, word_text : string) : actionType {
  return {
    type:      ADD_WORD,
    module_id: module_id,
    word: {
      id:   nextWordId++,
      text: word_text
    }
  };
}

export function addModule() : actionType {
  return {
    type:      ADD_MODULE,
    module_id: nextModuleId++
  };
}
