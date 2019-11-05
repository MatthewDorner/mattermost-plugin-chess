import {combineReducers} from 'redux';

import ActionTypes from '../action_types';

function gameModalVisibility(state = false, action) {
  switch (action.type) {
  case ActionTypes.SET_GAMEMODAL_VISIBILITY:
    return {
      visibility: action.data.visibility,
      gameState: action.data.gameState,
    };
  default:
    return state;
  }
}

function challengeModalVisibility(state = false, action) {
  switch (action.type) {
  case ActionTypes.SET_CHALLENGEMODAL_VISIBILITY:
    return {
      visibility: action.data,
      userToChallenge: action.userToChallenge,
    };
  default:
    return state;
  }
}

export default combineReducers({
  gameModalVisibility,
  challengeModalVisibility,
});
