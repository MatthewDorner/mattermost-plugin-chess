import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {createPost} from '../../../packages/mattermost-redux/actions/posts';
import {createChannel, addChannelMember} from '../../../packages/mattermost-redux/actions/channels';
import {getCurrentTeamId} from '../../../packages/mattermost-redux/selectors/entities/teams';
import {getMe} from '../../../packages/mattermost-redux/actions/users';

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
  addChannelMember,
  getMe,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ChallengeModal);
