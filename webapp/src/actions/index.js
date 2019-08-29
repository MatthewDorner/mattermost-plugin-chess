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

/*
    should this run createGamePost(gameState) with input currentGameState?

    Technically this shouldn't be related to Redux, since it isn't going to
    write anything to Redux state.

    it will 

    more like... there should be a Utility function that takes currentGameState
    and returns newGameState, and that can be fed into the createPost() action
    from mattermost-redux.
    
    the code shouldn't be inside the <GamePost> function since this code is actually
    required to generate the post object before saving it. <GamePost> would instead
    have the code for turning the post object (message) into the post showing the
    board and etc.. and then provide that info to the GameModal.
*/


// export function getConnected(reminder = false) {
//     return async (dispatch) => {
//         let data;
//         try {
//             data = await Client.getConnected(reminder);
//         } catch (error) {
//             return {error};
//         }

//         dispatch({
//             type: ActionTypes.RECEIVED_CONNECTED,
//             data,
//         });

//         return {data};
//     };
// }

// function checkAndHandleNotConnected(data) {
//     return async (dispatch) => {
//         if (data && data.id === 'not_connected') {
//             dispatch({
//                 type: ActionTypes.RECEIVED_CONNECTED,
//                 data: {
//                     connected: false,
//                     github_username: '',
//                     github_client_id: '',
//                     settings: {},
//                 },
//             });
//             return false;
//         }
//         return true;
//     };
// }

// export function getReviews() {
//     return async (dispatch, getState) => {
//         let data;
//         try {
//             data = await Client.getReviews();
//         } catch (error) {
//             return {error};
//         }

//         const connected = await checkAndHandleNotConnected(data)(dispatch, getState);
//         if (!connected) {
//             return {error: data};
//         }

//         dispatch({
//             type: ActionTypes.RECEIVED_REVIEWS,
//             data,
//         });

//         return {data};
//     };
// }

// export function getYourPrs() {
//     return async (dispatch, getState) => {
//         let data;
//         try {
//             data = await Client.getYourPrs();
//         } catch (error) {
//             return {error};
//         }

//         const connected = await checkAndHandleNotConnected(data)(dispatch, getState);
//         if (!connected) {
//             return {error: data};
//         }

//         dispatch({
//             type: ActionTypes.RECEIVED_YOUR_PRS,
//             data,
//         });

//         return {data};
//     };
// }

// export function getYourAssignments() {
//     return async (dispatch, getState) => {
//         let data;
//         try {
//             data = await Client.getYourAssignments();
//         } catch (error) {
//             return {error};
//         }

//         const connected = await checkAndHandleNotConnected(data)(dispatch, getState);
//         if (!connected) {
//             return {error: data};
//         }

//         dispatch({
//             type: ActionTypes.RECEIVED_YOUR_ASSIGNMENTS,
//             data,
//         });

//         return {data};
//     };
// }

// export function getMentions() {
//     return async (dispatch, getState) => {
//         let data;
//         try {
//             data = await Client.getMentions();
//         } catch (error) {
//             return {error};
//         }

//         const connected = await checkAndHandleNotConnected(data)(dispatch, getState);
//         if (!connected) {
//             return {error: data};
//         }

//         dispatch({
//             type: ActionTypes.RECEIVED_MENTIONS,
//             data,
//         });

//         return {data};
//     };
// }

// export function getUnreads() {
//     return async (dispatch, getState) => {
//         let data;
//         try {
//             data = await Client.getUnreads();
//         } catch (error) {
//             return {error};
//         }

//         const connected = await checkAndHandleNotConnected(data)(dispatch, getState);
//         if (!connected) {
//             return {error: data};
//         }

//         dispatch({
//             type: ActionTypes.RECEIVED_UNREADS,
//             data,
//         });

//         return {data};
//     };
// }

// const GITHUB_USER_GET_TIMEOUT_MILLISECONDS = 1000 * 60 * 60; // 1 hour

// export function getGitHubUser(userID) {
//     return async (dispatch, getState) => {
//         if (!userID) {
//             return {};
//         }

//         const user = getState()['plugins-github'].githubUsers[userID];
//         if (user && user.last_try && Date.now() - user.last_try < GITHUB_USER_GET_TIMEOUT_MILLISECONDS) {
//             return {};
//         }

//         if (user && user.username) {
//             return {data: user};
//         }

//         let data;
//         try {
//             data = await Client.getGitHubUser(userID);
//         } catch (error) {
//             if (error.status === 404) {
//                 dispatch({
//                     type: ActionTypes.RECEIVED_GITHUB_USER,
//                     userID,
//                     data: {last_try: Date.now()},
//                 });
//             }
//             return {error};
//         }

//         dispatch({
//             type: ActionTypes.RECEIVED_GITHUB_USER,
//             userID,
//             data,
//         });

//         return {data};
//     };
// }

// /**
//  * Stores`showRHSPlugin` action returned by
//  * registerRightHandSidebarComponent in plugin initialization.
//  */
// export function setShowRHSAction(showRHSPluginAction) {
//     return {
//         type: ActionTypes.RECEIVED_SHOW_RHS_ACTION,
//         showRHSPluginAction,
//     };
// }

// export function updateRhsState(rhsState) {
//     return {
//         type: ActionTypes.UPDATE_RHS_STATE,
//         state: rhsState,
//     };
// }
