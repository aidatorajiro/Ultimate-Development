// @flow
import type { actionType } from '../reducers/textarea';

export const ADD_TEXT_AREA_VALUE: string = 'ADD_TEXT_AREA_VALUE';
export const CHANGE_TEXT_AREA_VALUE: string = 'CHANGE_TEXT_AREA_VALUE';

export function addTextAreaValue(value : string) : actionType {
  return {
    type: ADD_TEXT_AREA_VALUE,
    value
  }
}

export function changeTextAreaValue(value : string) : actionType {
  return {
    type: CHANGE_TEXT_AREA_VALUE,
    value
  }
}
