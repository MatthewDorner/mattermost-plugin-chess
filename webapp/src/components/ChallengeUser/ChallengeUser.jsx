import React from 'react';
import PropTypes from 'prop-types';
import {id as pluginId} from '../../manifest';

export default class ChallengeUser extends React.PureComponent {

    static propTypes = {
        user: PropTypes.object.isRequired
    }

    // this needs access to store, I need to get dispatch somehow
    challengeUserToChess = () => {

        // this.props.user.first_name
        // this.props.user.last_name
        // this.props.user.id
        // NEED TO MAKE THESE AVAILABLE TO THE CHALLENGE DIALOG, SO SOMETHING LIKE
        // this.props.showChallengeModal(id, first_name, last_name) ??

        // also how to close the stupid popover. IS THE POPOVER PASSED IN HERE AS PROPS?
        // DOES BROWSER_CHANGE_FOCUS do it? no? something with overlaytrigger?

        // looking in react devtools, the popover is in one of these overlays, they're all
        // separate from the main component hierarchy and have attributes show and rootclose
        // does rootclose tell me how to close this thing?

        // https://react-bootstrap.github.io/components/overlays/

        // rootclose: Specify whether the overlay should trigger onHide
        // when the user clicks outside the overlay

        // should I "fake" a click outside or what? what do the other popover menu items
        // use to close it?

        this.props.hide();
        this.props.setChallengeModalVisibility(true, this.props.user);
    };

    render() {

        console.log('in challengeUser, the user was: ');
        console.log(this.props.user);



        return (
            // <div>
            //     <button
            //         id={pluginId + '_challengeUserToChess'}
            //         className='btn btn-sm cursor--pointer style--none'
            //         onClick={this.challengeUserToChess}
            //     >
            //         Challenge User to Chess
            //     </button>
            // </div>

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
                    {/* <ToggleModalButtonRedux
                        accessibilityLabel={addToChannelMessage}
                        ref='addUserToChannelModalButton'
                        modalId={ModalIdentifiers.ADD_USER_TO_CHANNEL}
                        role='menuitem'
                        dialogType={AddUserToChannelModal}
                        dialogProps={{user: this.props.user}}
                        onClick={this.props.hide}
                    > */}
                        <i
                            className='fa fa-gamepad'
                            // title={formatMessage({id: 'user_profile.add_user_to_channel.icon', defaultMessage: 'Challenge User to Chess6'})}
                            title='Challenge User to Chess'
                        />
                        Challenge User to Chess
                    {/* </ToggleModalButtonRedux> */}
                </a>
            </div>
        );
    }
}
