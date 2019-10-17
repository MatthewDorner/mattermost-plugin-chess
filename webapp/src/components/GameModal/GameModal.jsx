import React from 'react';
import PropTypes from 'prop-types';
import {Modal} from 'react-bootstrap';
import chessBoard from 'chessboardjs';
import Chess from 'chess.js';

import getSiteURLFromWindowObject from '../../utils/GetSiteUrlFromWindowObject';
import GameHistory from '../GameHistory.jsx';
import {id as pluginId} from '../../manifest';
import './chessboard.css';
import './fixes.css';

export default class GameModal extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
        window.ChessBoard = chessBoard;
    }

    static propTypes = {
        visibility: PropTypes.bool.isRequired,
        setGameModalVisibility: PropTypes.func.isRequired,
        createPost: PropTypes.func.isRequired,
        currentUserId: PropTypes.string.isRequired,
        currentChannelId: PropTypes.string.isRequired,
        postsInCurrentChannel: PropTypes.object.isRequired,
    }

    /*
        FEN string describes a board position. chess.js and chessboard.js both take a FEN string to initialize.
        since I want history to be retained, I need to maintain the entire list of moves in the gameState object,
        but need to be able to convert the list of moves to and from FEN

        the notation to save the list of moves will be PGN, so... should be easy

        chess.load_pgn
        chess.fen()

        https://stackoverflow.com/questions/32685324/converting-a-pgn-to-a-list-of-fen-strings-in-nodejs-chess-notations

        ONLY ALLOW LEGAL MOVES, ADAPT THIS CODE
        https://chessboardjs.com/examples#5000

    */

    handleCancel = () => {
        this.props.setGameModalVisibility(false);
    }

    onDragStart = (source, piece) => {
        // do not pick up pieces if the game is over
        if (this.game.game_over()) {
            return false;
        } // will this count draws?

        // only pick up pieces for the side to move
        if ((this.game.turn() === 'w' && piece.search(/^b/) !== -1) ||
            (this.game.turn() === 'b' && piece.search(/^w/) !== -1)) {
            return false;
        }

        // to implement:
        // only pick up piece if YOU are the side to move
        // only pick up if you're not browsing game history and are on
        // the current move instead.

        // what do the return values in this function mean? return undefined
        // if the drag is OK?
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

        /*
            this.game.turn() === 'b' means it's black's turn
            this.game.in_checkmate()
            this.game.in_draw()
            this.game.in_check()
        */

        let gameStatus = 'In Play';
        if (this.game.in_checkmate()) {
            gameStatus = 'Checkmate';
        } else if (this.game.in_draw()) {
            gameStatus = 'Draw';
        }

        const newGameState = {
            playerWhite: this.state.gameState.playerWhite,
            playerBlack: this.state.gameState.playerBlack,
            blackToMove: this.game.turn() === 'b',
            pgn: this.game.pgn(),
            gameStatus,
        };

        const time = Date.now();
        const userId = this.props.currentUserId;

        const post = {
            message: JSON.stringify(newGameState),
            channel_id: this.props.currentChannelId,
            pending_post_id: `${userId}:${time}`,
            user_id: userId,
            create_at: time,

            // parent_id: undefined,
            metadata: {},
            props: {},
            type: 'custom_chess-game-post',
        };

        await this.props.createPost(post);
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
                    position: this.state.gameState.gameStatus === 'New Game' ? 'start' : this.game.fen(),
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

        const boardStyle = {
            width: '50%',
            float: 'right',
        };

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

        // to fix: players aren't always same order as it appears in the channel title
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
                        style={boardStyle}
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
