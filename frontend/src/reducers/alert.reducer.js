import {alertConstants} from '../constants';
const intialState = {};
export function alert(state = intialState, action) {
  switch (action.type) {
    case alertConstants.SUCCESS:
      return {
        type: 'success',
        header: action.header,
        content: action.content
      };
    case alertConstants.ERROR:
      return {
        type: 'error',
        header: action.header,
        content: action.content
      };
    case alertConstants.CLEAR:
      return {...intialState};
    default:
      return state
  }
}
