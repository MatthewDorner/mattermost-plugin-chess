import {connect} from 'react-redux';
import {createPost} from 'mattermost-redux/actions/posts';
import {getMe} from 'mattermost-redux/actions/users';
import {getPostsInCurrentChannel} from 'mattermost-redux/selectors/entities/posts';
import {bindActionCreators} from 'redux';

import {setGameModalVisibility} from '../../actions';

import {id as pluginId} from '../../manifest';

import GameModal from './GameModal.jsx';

const mapStateToProps = (state) => {
  return {
    visibility: state[`plugins-${pluginId}`].gameModalVisibility.visibility,
    gameState: state[`plugins-${pluginId}`].gameModalVisibility.gameState,
    currentChannelId: state.entities.channels.currentChannelId,
    currentUserId: state.entities.users.currentUserId,
    postsInCurrentChannel: getPostsInCurrentChannel(state),
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  setGameModalVisibility,
  createPost,
  getMe,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(GameModal);
