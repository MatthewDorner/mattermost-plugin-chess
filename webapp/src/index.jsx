import {id as pluginId} from './manifest';
import React from 'react';
import ChallengeUser from './components/ChallengeUser';
import ChallengeModal from './components/ChallengeModal';
import GameModal from './components/GameModal';
import GamePost from './components/GamePost';
import Reducer from './reducers';
import { setChallengeModalVisibility, setGameModalVisibility } from './actions';



// something about this: https://developers.mattermost.com/extend/plugins/server/reference/#API.CreatePost
// THEME STUFF IS HERE: https://developers.mattermost.com/extend/plugins/webapp/reference/#registerRootComponent

// you should only be able to respond to GamePost's if you are the player whose turn it is
// although there could be an option to create "open game" that anybody can respond to, actually a good idea

// could even create a separate bot that you can play against? or make them play against each other???

// there could be an option to automatically delete old moves when a new move is made. this could
// allow games to take place in channels without blocking out all other content. on the other hand,
// it kind of messes with the expected experience of it being a chat app

// people only get notified by mentions if they're part of the channel.
/*

actions to create:    
    setChallengeModalVisibility
    setGameModalVisibility
    sendGamePost

state to create:
    gameModalVisibility
    challengeModalVisiblity

*/


export default class MattermostChessPlugin {
    initialize(registry, store) {

        registry.registerReducer(Reducer);

        registry.registerPopoverUserActionsComponent(ChallengeUser);
        registry.registerRootComponent(ChallengeModal);
        registry.registerRootComponent(GameModal);
        registry.registerPostTypeComponent('custom_chess-game-post', GamePost);

        setChallengeModalVisibility(false);
        setGameModalVisibility(false);
    }
}

window.registerPlugin(pluginId, new MattermostChessPlugin());
