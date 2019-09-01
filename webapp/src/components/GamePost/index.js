import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {setGameModalVisibility} from '../../actions';

import GamePost from './GamePost.jsx';

const mapStateToProps = (state) => {
    return {
    };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
    setGameModalVisibility
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(GamePost);
