import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {createPost} from 'mattermost-redux/actions/posts';
import {createChannel, selectChannel, addChannelMember} from 'mattermost-redux/actions/channels';
import {getCurrentTeamId} from 'mattermost-redux/selectors/entities/teams';
import {getMe} from 'mattermost-redux/actions/users';

import {setChallengeModalVisibility} from '../../actions';
import {id as pluginId} from '../../manifest';

import ChallengeModal from './ChallengeModal.jsx';

const mapStateToProps = (state) => {
  return {
    visibility: state[`plugins-${pluginId}`].challengeModalVisibility.visibility,
    userToChallenge: state[`plugins-${pluginId}`].challengeModalVisibility.userToChallenge,
    currentUserId: state.entities.users.currentUserId,
    currentTeamId: getCurrentTeamId(state),
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  setChallengeModalVisibility,
  createPost,
  createChannel,
  selectChannel,
  addChannelMember,
  getMe,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ChallengeModal);
