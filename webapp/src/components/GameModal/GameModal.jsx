import React from 'react';
import PropTypes from 'prop-types';
import {Modal} from 'react-bootstrap';
import Chess from 'chess.js';

import GameHistory from '../GameHistory.jsx';
import GameStatuses from '../../utils/GameStatuses';

import getSiteURLFromWindowObject from '../../utils/GetSiteUrlFromWindowObject';
import {id as pluginId} from '../../manifest';

import {
  Chessboard,
  COLOR,
  INPUT_EVENT_TYPE,
  BORDER_TYPE,
} from '../../../node_modules/cm-chessboard/src/cm-chessboard/Chessboard.js';

import '../../../node_modules/cm-chessboard/assets/images/chessboard-sprite-staunty.svg';
import '../../../node_modules/cm-chessboard/assets/styles/cm-chessboard.css';
import './chessboardFix.css';

export default class GameModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static propTypes = {
    visibility: PropTypes.bool,
    postsInCurrentChannel: PropTypes.array,
    setGameModalVisibility: PropTypes.func.isRequired,
    createPost: PropTypes.func.isRequired,
    currentUserId: PropTypes.string.isRequired,
    currentChannelId: PropTypes.string.isRequired,
  }

  handleCancel = () => {
    this.props.setGameModalVisibility(false);
  }

  handleMoveStart = (event) => {
    const squareIndex = this.board.state.squareToIndex(event.square);
    const piece = event.chessboard.state.squares[squareIndex];

    // do not pick up pieces if the game is over
    if (this.game.game_over()) {
      return false;
    }

    // only pick up pieces for the side to move
    if ((this.game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (this.game.turn() === 'b' && piece.search(/^w/) !== -1)) {
      return false;
    }

    // COMMENT OUT THIS PART FOR EASIER TESTING WITH ONLY ONE USER LOGGED IN
    // only pick up if it's your turn to move
    // if ((this.props.currentUserId === this.state.gameState.playerBlack.id && this.game.turn() === 'w') ||
    //   (this.props.currentUserId === this.state.gameState.playerWhite.id && this.game.turn() === 'b')) {
    //   return false;
    // }

    if (this.game.fen().indexOf(this.board.getPosition()) === -1) {
      return false;
    }

    return true;
  }

  handleMoveDone = (event) => {
    var move = this.game.move({
      from: event.squareFrom,
      to: event.squareTo,
      promotion: 'q',
    });

    if (move === null) {
      return false;
    }

    let gameStatus = GameStatuses.IN_PLAY;
    if (this.game.in_checkmate()) {
      gameStatus = GameStatuses.CHECKMATE;
    } else if (this.game.in_draw()) {
      gameStatus = GameStatuses.DRAW;
    }

    const newGameState = {
      playerWhite: this.state.gameState.playerWhite,
      playerBlack: this.state.gameState.playerBlack,
      blackToMove: this.game.turn() === 'b',
      pgn: this.game.pgn(),
      gameStatus,
    };

    const time = Date.now();
    const post = {
      message: JSON.stringify(newGameState),
      channel_id: this.props.currentChannelId,
      pending_post_id: `${this.props.currentUserId}:${time}`,
      user_id: this.props.currentUserId,
      create_at: time,
      metadata: {},
      props: {},
      type: 'custom_chess-game-post',
    };

    this.props.createPost(post);

    // necessary due to castling and en passant to update the squares other than
    // the target. This wasn't necessary with chessboard.js but I didn't see another
    // way to deal with it in cm-chessboard
    setTimeout(() => {
      this.board.setPosition(this.game.fen());
    }, 250);

    return true;
  }

  setHistoryState = (fen) => {
    this.board.setPosition(fen, true);
  }

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.postsInCurrentChannel) {
      for (var i = 0; i < nextProps.postsInCurrentChannel.length; i++) {
        const post = nextProps.postsInCurrentChannel[i];
        if (post.type === 'custom_chess-game-post') {
          return {gameState: JSON.parse(post.message)};
        }
      }
    }
    return null;
  }

  componentDidUpdate() {
    if (this.props.visibility) {
      window.requestAnimationFrame(() => {
        const siteUrl = getSiteURLFromWindowObject(window);

        if (document.getElementsByClassName('cm-chessboard').length === 0) {
          this.board = new Chessboard(
            document.getElementById('chessboard'),
            {
              position: this.state.gameState.gameStatus === GameStatuses.NEW_GAME ? 'start' : this.game.fen(),
              orientation: (this.props.currentUserId === this.state.gameState.playerBlack.id) ? COLOR.black : COLOR.white,
              style: {
                cssClass: 'default',
                showCoordinates: true, // show ranks and files
                borderType: BORDER_TYPE.thin, // thin: thin border, frame: wide border with coordinates in it, none: no border
                aspectRatio: 1, // height/width. Set to `undefined`, if you want to define it only in the css.
                moveFromMarker: null, // the marker used to mark the start square
                moveToMarker: null, // the marker used to mark the square where the figure is moving to
              },
              responsive: true, // resizes the board based on element size
              animationDuration: 300, // pieces animation duration in milliseconds
              sprite: {
                url: `${siteUrl}/static/plugins/${pluginId}/chessboard-sprite-staunty.svg`, // pieces and markers are stored as svg sprite
                size: 40, // the sprite size, defaults to 40x40px
                cache: true, // cache the sprite inline, in the HTML
              },
            },
          );

          this.board.enableMoveInput((event) => {
            switch (event.type) {
            case INPUT_EVENT_TYPE.moveStart:
              return this.handleMoveStart(event);
            case INPUT_EVENT_TYPE.moveDone:
              return this.handleMoveDone(event);
            case INPUT_EVENT_TYPE.moveCanceled:
              return true;
            default:
              return true;
            }
          });
        }
      });
    }
  }

  render() {
    // if the modal is closed and not on a channel that contains chess posts,
    // there will be no gameState, so don't render
    if (!this.state.gameState) {
      return false;
    }

    this.game = new Chess();
    this.game.load_pgn(this.state.gameState.pgn);

    const history = [];
    var moves = this.game.history();
    var newGame = new Chess();
    moves.forEach((move) => {
      newGame.move(move);
      const movePgn = newGame.pgn().split(' ').slice(-1)[0];
      const historyItem = {
        movePgn,
        fen: newGame.fen(),
      };
      history.push(historyItem);
    });

    const titleString = `Chess: ${this.state.gameState.playerWhite.name} VS ${this.state.gameState.playerBlack.name}`;

    return (
      <Modal
        className={'modal-confirm '}
        show={this.props.visibility}
        id='mattermost-chess_GameModal'
        role='dialog'
        aria-labelledby='mattermost-chess_GameModalLabel'
      >
        <Modal.Header closeButton={false}>
          <Modal.Title
            componentClass='h1'
            id='mattermost-chess_GameModalLabel'
          >
            {titleString}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <GameHistory
            setHistoryState={this.setHistoryState}
            history={history}
          />
          <div
            id='boardcontainer'
            style={styles.board}
          >
            <div id='chessboard'/>
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
        </Modal.Footer>
      </Modal>
    );
  }
}

const styles = {
  board: {
    width: '50%',
    float: 'right',
  },
};
