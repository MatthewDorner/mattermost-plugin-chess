import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import Chessboard from 'chessboardjs';
import Chess from 'chess.js';
import './chessboard.css';
import './fixes.css';
import getSiteURLFromWindowObject from '../../utils/GetSiteUrlFromWindowObject';
import GameHistory from '../GameHistory.jsx';

import imagefilepath from './chesspieces/wikipedia/bB.png';
import './chesspieces/wikipedia/bK.png';
import './chesspieces/wikipedia/bN.png';
import './chesspieces/wikipedia/bP.png';
import './chesspieces/wikipedia/bQ.png';
import './chesspieces/wikipedia/bR.png';
import './chesspieces/wikipedia/wB.png';
import './chesspieces/wikipedia/wK.png';
import './chesspieces/wikipedia/wN.png';
import './chesspieces/wikipedia/wP.png';
import './chesspieces/wikipedia/wQ.png';
import './chesspieces/wikipedia/wR.png';


export default class GameModal extends React.PureComponent {

    constructor(props) {

        super(props);

        console.log('got props in GameModal constructor:');
        console.log(props);

        window.ChessBoard = Chessboard;
        this.state = {
            historyState: this.historyStates.CURRENT_MOVE
        }
    }

    static propTypes = {
        visibility: PropTypes.bool.isRequired,
        setGameModalVisibility: PropTypes.func.isRequired,
        createPost: PropTypes.func.isRequired
    }

    historyStates = {
        CURRENT_MOVE: 'CURRENT',
        HISTORICAL_MOVE: 'HISTORICAL_MOVE'
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



    onDragStart = (source, piece, position, orientation) => {
        console.log('onDragStart, this was: ');
        console.log(this);

        // do not pick up pieces if the game is over
        if (this._game.game_over()) return false // will this count draws?
      
        // only pick up pieces for the side to move
        if ((this._game.turn() === 'w' && piece.search(/^b/) !== -1) ||
            (this._game.turn() === 'b' && piece.search(/^w/) !== -1)) {
            return false
        }

        // only pick up piece if YOU are the side to move

        // only pick up if you're not browsing game history and are on
        // the current move instead.

    }
      
    onDrop = (source, target) => {
        // see if the move is legal
        var move = this._game.move({
            from: source,
            to: target,
            promotion: 'q' // NOTE: always promote to a queen for example simplicity
        });

        // illegal move
        if (move === null) return 'snapback'
      
        this.updateStatus()
    }
      
    // update the board position after the piece snap
    // for castling, en passant, pawn promotion
    onSnapEnd = () => {
        this._board.position(this._game.fen())
    }
      
    updateStatus = async () => {
        var status = ''
      
        var blackToMove = false;
        if (this._game.turn() === 'b') {
            blackToMove = true;
        }
      
        // checkmate?
        if (this._game.in_checkmate()) {
            status = 'Game over, ' + blackToMove + ' is in checkmate.'
        }
      
        // draw?
        else if (this._game.in_draw()) {
            status = 'Game over, drawn position'
        }
      
        // game still on
        else {
            status = blackToMove + ' to move'
      
            // check?
            if (this._game.in_check()) {
                status += ', ' + blackToMove + ' is in check'
            }
        }

        let newGameState = {
            playerWhite: this.getMostRecentGameState().playerWhite,
            playerBlack: this.getMostRecentGameState().playerBlack,
            blackToMove,
            pgn: this._game.pgn()
        }
        let gamePostMessage = JSON.stringify(newGameState);
        let post = {
            message: gamePostMessage
        };
        post.channel_id = this.props.currentChannelId;
        const time = Date.now();
        const userId = this.props.currentUserId;
        post.pending_post_id = `${userId}:${time}`;
        post.user_id = userId;
        post.create_at = time;
        // post.parent_id = this.state.parentId;
        post.parent_id = undefined; // what is this?
        post.metadata = {};
        post.props = {};
        post.type = 'custom_chess-game-post';
        await this.props.createPost(post);
        
    }

    setHistoryState = (fen, historyState) => {
        console.log('in setHistoryState, this was');
        console.log(this);
        // this.setState({
        //     historyState
        // });

        this._board.position(fen);
    }

    /*
        mostRecentGameState needs to be in Redux state, since it's gotten everywhere

        historyState could be... kept in here?

        how are you supposed to implement something that's derived from a prop? specifically
        when the prop is redux state.

        oh it's getDerivedStateFromProps

        "If you’re using derived state to memoize some computation based only on the current
        props, you don’t need derived state. See What about memoization? below." from some
        redux site.

    */

    getMostRecentGameState() {

        if (this.props.postsInCurrentChannel) {
            for (var i = 0; i < this.props.postsInCurrentChannel.length; i++) {
                let post = this.props.postsInCurrentChannel[i];
                if (post.type == 'custom_chess-game-post') {
                    let mostRecentGameState = JSON.parse(post.message);
                    console.log('got most recent game state: ');
                    console.log(mostRecentGameState);
                    return mostRecentGameState;
                }
            }
        }
    }

    componentDidUpdate() {
        // this runs after render
        if (this.props.visibility) {
            window.requestAnimationFrame(() => {

                // this._game = new Chess();
                // this._game.load_pgn(this.getMostRecentGameState().pgn);

                console.log('in componentDidUpdate, this was:');
                console.log(this);

                let siteUrl = getSiteURLFromWindowObject(window);
                let pieceTheme = siteUrl + '/static/plugins/com.example.mattermost-chess/{piece}.png';
    
                var config = {
                    draggable: true,
                    pieceTheme,
                    onDragStart: this.onDragStart,
                    onDrop: this.onDrop,
                    onSnapEnd: this.onSnapEnd
                }
    
                if (this.getMostRecentGameState().pgn == '') {
                    config.position = 'start';
                } else {
                    config.position = this._game.fen();
                }

                this._board = Chessboard('chessboard', config);
            });
        }
    }

    render() {
        let cancelButton;
        if (!this.props.hideCancel) {
            cancelButton = (
                <button
                    type='button'
                    className='btn btn-link btn-cancel'
                    onClick={this.handleCancel}
                >
                    Cancel
                </button>
            );
        }

        let boardStyle = {
            "width": "50%",
            "float": "right"
        };



        // PREPARE HISTORY FOR HISTORY BROWSER
        let history = [];
        console.log('checking this._game');
        console.log(this._game);
        console.log('what is this');
        console.log(this);

        // bad... why is it undefined sometimes?
        this._game = new Chess();

        var gameState = this.getMostRecentGameState();
        if (gameState) {
            this._game.load_pgn(this.getMostRecentGameState().pgn);
        }

        if (this._game) {
            console.log('THIS._game was true');
            var moves = this._game.history();
            var newGame = new Chess();
            moves.forEach((move) => {
                newGame.move(move);
                // fens.push(newGame.fen());
    
                // actually, I need newMove in pgn form, not ... so,,,
                let movePgn = newGame.pgn().split(' ').slice(-1)[0];
    
                let historyItem = {
                    movePgn: movePgn,
                    fen: newGame.fen()                
                }
                history.push(historyItem);
            });
        }
            
        return (
            <Modal
                className={'modal-confirm ' + this.props.modalClass}
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
                        {/* Chess: {gameState.playerWhite} VS {gameState.playerBlack} */}
                        Chess
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <GameHistory setHistoryState={this.setHistoryState} history={history}/>
                    <div id='chessboard' style={boardStyle}></div>
                </Modal.Body>
                <Modal.Footer>
                    {cancelButton}
                </Modal.Footer>
            </Modal>
        );
    }
}
