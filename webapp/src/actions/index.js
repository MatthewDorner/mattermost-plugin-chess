import ActionTypes from '../action_types';

export function setChallengeModalVisibility(visibility, userToChallenge) {
  return {
    type: ActionTypes.SET_CHALLENGEMODAL_VISIBILITY,
    data: visibility,
    userToChallenge,
  };
}

export function setGameModalVisibility(visibility) {
  return {
    type: ActionTypes.SET_GAMEMODAL_VISIBILITY,
    data: {
      visibility,
    },
  };
}
