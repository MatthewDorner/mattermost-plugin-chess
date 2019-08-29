import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {id as pluginId} from '../../manifest';
import {setGameModalVisibility} from '../../actions';
import {createPost, getPosts} from 'mattermost-redux/actions/posts';
import {createChannel, selectChannel, addChannelMember} from 'mattermost-redux/actions/channels';
import {getMe} from 'mattermost-redux/actions/users';
import {getPostsInCurrentChannel} from 'mattermost-redux/selectors/entities/posts';

// import {patchUser} from 'mattermost-redux/actions'; // importing the action

import GameModal from './GameModal.jsx';

const mapStateToProps = (state) => {
    return {
        visibility: state['plugins-' + pluginId].gameModalVisibility.visibility,
        gameState: state['plugins-' + pluginId].gameModalVisibility.gameState,
        currentChannelId: state.entities.channels.currentChannelId,
        currentUserId: state.entities.users.currentUserId,
        postsInCurrentChannel: getPostsInCurrentChannel(state),
    };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
	setGameModalVisibility,
    createPost,
    // createChannel,
    // selectChannel,
    // addChannelMember,
    getMe
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(GameModal);
