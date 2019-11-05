import React from 'react';
import PropTypes from 'prop-types';
import {Modal} from 'react-bootstrap';
import {General} from 'mattermost-redux/constants';

const uuidv4 = require('uuid/v4');

export default class ChallengeModal extends React.PureComponent {
  static propTypes = {
    visibility: PropTypes.bool.isRequired, // is undefined
    setChallengeModalVisibility: PropTypes.func.isRequired,
    createPost: PropTypes.func.isRequired,
    getMe: PropTypes.func.isRequired,
    currentTeamId: PropTypes.string.isRequired,
    currentUserId: PropTypes.string.isRequired,
    createChannel: PropTypes.func.isRequired,
    userToChallenge: PropTypes.object.isRequired, // is undefined
    addChannelMember: PropTypes.func.isRequired,
  }

  handleConfirm = async () => {
    // CREATE THE NEW CHANNEL // see new_channel_flow.jsx
    const newChannelUuid = uuidv4();
    const strippedUuid = newChannelUuid.replace(/-/g, '');
    const newChannelName = `mattermostchess${strippedUuid}`;

    const me = await this.props.getMe();
    const currentUserName = me.data.first_name;
    const channel = {
      team_id: this.props.currentTeamId, // should be ok
      name: newChannelName, // whats diff between name & display_name
      display_name: `Chess: ${currentUserName} VS ${this.props.userToChallenge.first_name}`,
      purpose: 'to play chess',
      header: '',
      type: General.PRIVATE_CHANNEL,
    };
    const res = await this.props.createChannel(channel);
    const newChannelId = res.data.id;

    // ADD THE CHALLENGED USER TO NEW CHANNEL
    await this.props.addChannelMember(newChannelId, this.props.userToChallenge.id);

    const mePlayer = {
      id: me.data.id,
      name: me.data.first_name,
    };

    const challengePlayer = {
      id: this.props.userToChallenge.id,
      name: this.props.userToChallenge.first_name,
    };

    // CREATE THE INITIAL GamePost
    const mePlaysWhite = (Math.random() < 0.5);
    const newGameState = {
      playerWhite: mePlaysWhite ? mePlayer : challengePlayer,
      playerBlack: mePlaysWhite ? challengePlayer : mePlayer,
      gameStatus: 'New Game',
      blackToMove: false,
      pgn: '',
    };

    const gamePostMessage = JSON.stringify(newGameState);
    const post = {
      message: gamePostMessage,
    };
    post.channel_id = newChannelId;
    const time = Date.now();
    const userId = this.props.currentUserId;
    post.pending_post_id = `${userId}:${time}`;
    post.user_id = userId;
    post.create_at = time;

    // post.parent_id = this.state.parentId;
    // post.parent_id = undefined; // what is this?
    post.metadata = {};
    post.props = {};
    post.type = 'custom_chess-game-post';
    await this.props.createPost(post);

    // await this.props.selectChannel(newChannelId); no, because for whatever reason it fails...
    this.props.setChallengeModalVisibility(false);
  }

  handleCancel = () => {
    this.props.setChallengeModalVisibility(false);
  }

  render() {
    const cancelButton = (
      <button
        type='button'
        className='btn btn-link btn-cancel'
        onClick={this.handleCancel}
      >
        {'Cancel'}
      </button>
    );

    const first = this.props.userToChallenge ? this.props.userToChallenge.first_name : '';
    const last = this.props.userToChallenge ? this.props.userToChallenge.last_name : '';

    return (
      <Modal
        className={'modal-confirm'}
        show={this.props.visibility}
        id='mattermost-chess_challengeModal'
        role='dialog'
        aria-labelledby='mattermost-chess_challengeModalLabel'
      >
        <Modal.Header closeButton={false}>
          <Modal.Title
            componentClass='h1'
            id='mattermost-chess_challengeModalLabel'
          >
            {`Challenge ${first} ${last} to Chess`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            {'A new, private channel will be created and both players will be invited.'}
          </div>
        </Modal.Body>
        <Modal.Footer>
          {cancelButton}
          <button
            autoFocus={true}
            type='button'
            className='btn btn-primary'
            onClick={this.handleConfirm}
            id='mattermost-chess_challengeModalButton'
          >
            {'Confirm'}
          </button>
        </Modal.Footer>
      </Modal>
    );
  }
}
