import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {id as pluginId} from '../../manifest';
// import {respondToChallenge} from '../../actions';
import {createPost} from 'mattermost-redux/actions/posts';
import {setGameModalVisibility} from '../../actions';

import GamePost from './GamePost.jsx';

const mapStateToProps = (state) => {
    return {
        // visibility: state['plugins-' + pluginId].challengeModalVisibility,
        // currentChannelId: state.entities.channels.currentChannelId,
        // currentUserId: state.entities.users.currentUserId
    };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
    setGameModalVisibility
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(GamePost);
