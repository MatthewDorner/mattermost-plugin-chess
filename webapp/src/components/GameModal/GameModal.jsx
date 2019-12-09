import React from 'react';
import PropTypes from 'prop-types';
import {Modal} from 'react-bootstrap';
import chessBoard from 'chessboardjs';
import Chess from 'chess.js';

import getSiteURLFromWindowObject from '../../utils/GetSiteUrlFromWindowObject';
import GameHistory from '../GameHistory.jsx';
import {id as pluginId} from '../../manifest';
import GameStatuses from '../../utils/GameStatuses';

import '../../../node_modules/chessboardjs/www/css/chessboard.css';
import './chessboardFix.css';

import '../../../node_modules/chessboardjs/www/img/chesspieces/wikipedia/bB.png';
import '../../../node_modules/chessboardjs/www/img/chesspieces/wikipedia/bK.png';
import '../../../node_modules/chessboardjs/www/img/chesspieces/wikipedia/bN.png';
import '../../../node_modules/chessboardjs/www/img/chesspieces/wikipedia/bP.png';
import '../../../node_modules/chessboardjs/www/img/chesspieces/wikipedia/bQ.png';
import '../../../node_modules/chessboardjs/www/img/chesspieces/wikipedia/bR.png';
import '../../../node_modules/chessboardjs/www/img/chesspieces/wikipedia/wB.png';
import '../../../node_modules/chessboardjs/www/img/chesspieces/wikipedia/wK.png';
import '../../../node_modules/chessboardjs/www/img/chesspieces/wikipedia/wN.png';
import '../../../node_modules/chessboardjs/www/img/chesspieces/wikipedia/wP.png';
import '../../../node_modules/chessboardjs/www/img/chesspieces/wikipedia/wQ.png';
import '../../../node_modules/chessboardjs/www/img/chesspieces/wikipedia/wR.png';

export default class GameModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    window.ChessBoard = chessBoard;
  }

  static propTypes = {
    visibility: PropTypes.bool.isRequired, // is undefined
    postsInCurrentChannel: PropTypes.array.isRequired, // is undefined but is required
    setGameModalVisibility: PropTypes.func.isRequired,
    createPost: PropTypes.func.isRequired,
    currentUserId: PropTypes.string.isRequired,
    currentChannelId: PropTypes.string.isRequired,
  }

  handleCancel = () => {
    this.props.setGameModalVisibility(false);
  }

  onDragStart = (source, piece) => {
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
    if ((this.props.currentUserId === this.state.gameState.playerBlack.id && this.game.turn() === 'w') ||
      (this.props.currentUserId === this.state.gameState.playerWhite.id && this.game.turn() === 'b')) {
      return false;
    }

    // only pick up if you're not browsing game history
    if (this.game.fen().indexOf(this.board.fen()) === -1) {
      return false;
    }

    return true;
  }

  onDrop = async (source, target) => {
    // see if the move is legal
    var move = this.game.move({
      from: source,
      to: target,
      promotion: 'q', // NOTE: always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) {
      return 'snapback';
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

      // parent_id: undefined,
      metadata: {},
      props: {},
      type: 'custom_chess-game-post',
    };

    await this.props.createPost(post);

    return true;
  }

  // update the board position after the piece snap
  // for castling, en passant, pawn promotion
  onSnapEnd = () => {
    this.board.position(this.game.fen());
  }

  setHistoryState = (fen) => {
    this.board.position(fen);
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
        const pieceTheme = `${siteUrl}/static/plugins/${pluginId}/{piece}.png`;

        var config = {
          draggable: true,
          pieceTheme,
          onDragStart: this.onDragStart,
          onDrop: this.onDrop,
          onSnapEnd: this.onSnapEnd,
          position: this.state.gameState.gameStatus === GameStatuses.NEW_GAME ? 'start' : this.game.fen(),
        };

        this.board = chessBoard('chessboard', config);
        if (this.props.currentUserId === this.state.gameState.playerBlack.id) {
          this.board.orientation('black');
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

    // PREPARE HISTORY FOR HISTORY BROWSER
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
