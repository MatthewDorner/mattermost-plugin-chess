import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {setChallengeModalVisibility} from '../../actions';

import ChallengeUser from './ChallengeUser.jsx';

const mapStateToProps = (state) => {
    // const currentUserId = state.entities.users.currentUserId;

    // return {
    //     user: state.entities.users.profiles[currentUserId],
    // };
    return {};
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
    setChallengeModalVisibility, // passing the action as a prop
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ChallengeUser);