import React from 'react';
import PropTypes from 'prop-types';
import {id as pluginId} from '../../manifest';

export default class ChallengeUser extends React.PureComponent {

    static propTypes = {
        user: PropTypes.object.isRequired
    }

    challengeUserToChess = () => {
        this.props.hide();
        this.props.setChallengeModalVisibility(true, this.props.user);
    };

    render() {
        return (
            <div
            data-toggle='tooltip'
            className='popover__row first'
            key='user-popover-add-to-channel'
            >
                <a
                    href='#'
                    className='text-nowrap'
                    onClick={this.challengeUserToChess}
                >
                    <i
                        className='fa fa-gamepad'
                        title='Challenge User to Chess'
                    />
                    Challenge User to Chess
                </a>
            </div>
        );
    }
}
