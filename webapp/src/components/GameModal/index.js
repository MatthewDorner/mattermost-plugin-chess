import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {createPost} from '../../../packages/mattermost-redux/actions/posts';
import {getMe} from '../../../packages/mattermost-redux/actions/users';
import {getPostsInCurrentChannel} from '../../../packages/mattermost-redux/selectors/entities/posts';
import {setGameModalVisibility} from '../../actions';

import {id as pluginId} from '../../manifest';

import GameModal from './GameModal.jsx';

const mapStateToProps = (state) => {
  return {
    visibility: state[`plugins-${pluginId}`].gameModalVisibility.visibility,
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
