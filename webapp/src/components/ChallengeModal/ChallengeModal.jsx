import React from 'react';
import PropTypes from 'prop-types';
import {Modal} from 'react-bootstrap';

import {General} from '../../../packages/mattermost-redux/constants/';

import GameStatuses from '../../utils/GameStatuses';

const uuidv4 = require('uuid/v4');

export default class ChallengeModal extends React.PureComponent {
  static propTypes = {
    visibility: PropTypes.bool,
    userToChallenge: PropTypes.object,
    setChallengeModalVisibility: PropTypes.func.isRequired,
    createPost: PropTypes.func.isRequired,
    getMe: PropTypes.func.isRequired,
    currentTeamId: PropTypes.string.isRequired,
    currentUserId: PropTypes.string.isRequired,
    createChannel: PropTypes.func.isRequired,
    addChannelMember: PropTypes.func.isRequired,
  }

  handleConfirm = async () => {
    // GET THE PLAYER INFO
    const me = await this.props.getMe();
    const mePlayer = {
      id: me.data.id,
      name: `@${me.data.username}`,
    };
    const challengePlayer = {
      id: this.props.userToChallenge.id,
      name: `@${this.props.userToChallenge.username}`,
    };

    const mePlaysWhite = (Math.random() < (1 / 2));
    const newGameState = {
      playerWhite: mePlaysWhite ? mePlayer : challengePlayer,
      playerBlack: mePlaysWhite ? challengePlayer : mePlayer,
      gameStatus: GameStatuses.NEW_GAME,
      blackToMove: false,
      pgn: '',
    };

    // CREATE THE NEW CHANNEL // see new_channel_flow.jsx
    const newChannelName = `chess-${uuidv4()}`;
    const channel = {
      team_id: this.props.currentTeamId,
      name: newChannelName,
      display_name: `Chess: ${newGameState.playerWhite.name} VS ${newGameState.playerBlack.name}`,
      purpose: 'chess game',
      header: '',
      type: General.PRIVATE_CHANNEL,
    };
    const res = await this.props.createChannel(channel);
    const newChannelId = res.data.id;

    // ADD THE CHALLENGED USER TO NEW CHANNEL
    await this.props.addChannelMember(newChannelId, this.props.userToChallenge.id);

    // CREATE THE INITIAL GAME POST FOR THE GAME CHANNEL
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
    post.metadata = {};
    post.props = {};
    post.type = 'custom_chess-game-post';
    await this.props.createPost(post);

    this.props.setChallengeModalVisibility(false);
  }

  handleCancel = () => {
    this.props.setChallengeModalVisibility(false);
  }

  render() {
    if (!this.props.visibility || !this.props.userToChallenge) {
      return false;
    }

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
            {`Challenge @${this.props.userToChallenge.username} to Chess`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            {'A new, private channel will be created and both players will be invited.'}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            type='button'
            className='btn btn-link btn-cancel'
            onClick={this.handleCancel}
          >
            {'Cancel'}
          </button>
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
