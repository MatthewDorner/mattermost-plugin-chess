import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {setGameModalVisibility} from '../../actions';

import GamePost from './GamePost.jsx';

const mapDispatchToProps = (dispatch) => bindActionCreators({
  setGameModalVisibility,
}, dispatch);

export default connect(null, mapDispatchToProps)(GamePost);
