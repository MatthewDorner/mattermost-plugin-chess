import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {setChallengeModalVisibility} from '../../actions';

import ChallengeUser from './ChallengeUser.jsx';

const mapDispatchToProps = (dispatch) => bindActionCreators({
  setChallengeModalVisibility, // passing the action as a prop
}, dispatch);

export default connect(null, mapDispatchToProps)(ChallengeUser);