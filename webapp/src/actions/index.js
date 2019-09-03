import ActionTypes from '../action_types';

// separate into show and hide?? and can keep the single action type
export function setChallengeModalVisibility(visibility, userToChallenge) {
    return {
        type: ActionTypes.SET_CHALLENGEMODAL_VISIBILITY,
        data: visibility,
        userToChallenge: userToChallenge
    };
}

export function setGameModalVisibility(visibility, gameState) {
    return {
        type: ActionTypes.SET_GAMEMODAL_VISIBILITY,
        data: {
            visibility,
            gameState
        }
    };
}
