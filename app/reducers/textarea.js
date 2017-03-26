// @flow
import { ADD_TEXT_AREA_VALUE, CHANGE_TEXT_AREA_VALUE } from '../actions/textarea';

export type actionType = {
  type: string,
  value?: string
}

export type textareaStateType = {
  textarea: string
}

export default function textarea(state: string = "", action: actionType) {
  switch (action.type) {
    case ADD_TEXT_AREA_VALUE:
      return state + action.value;
    case CHANGE_TEXT_AREA_VALUE:
      return action.value;
    default:
      return state;
  }
}
