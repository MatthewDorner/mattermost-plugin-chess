import {id as pluginId} from './manifest';

import ChallengeUser from './components/ChallengeUser';
import ChallengeModal from './components/ChallengeModal';
import GameModal from './components/GameModal';
import GamePost from './components/GamePost';
import Reducer from './reducers';
import {setChallengeModalVisibility, setGameModalVisibility} from './actions';

export default class MattermostChessPlugin {
  initialize(registry) {
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
