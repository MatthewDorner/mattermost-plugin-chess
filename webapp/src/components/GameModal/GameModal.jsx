import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import Chessboard from 'chessboardjs';
import Chess from 'chess.js';
import './chessboard.css';
import './fixes.css';
import getSiteURLFromWindowObject from '../../utils/GetSiteUrlFromWindowObject';
import GameHistory from '../GameHistory.jsx';

export default class GameModal extends React.PureComponent {

    constructor(props) {

        super(props);

        console.log('got props in GameModal constructor:');
        console.log(props);

        window.ChessBoard = Chessboard;
        this.state = {
            historyState: this.historyStates.CURRENT_MOVE
        };
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

        // to implement:
        // only pick up piece if YOU are the side to move
        // only pick up if you're not browsing game history and are on
        // the current move instead.
    }
      
    onDrop = async (source, target) => {
        // see if the move is legal
        var move = this._game.move({
            from: source,
            to: target,
            promotion: 'q' // NOTE: always promote to a queen for example simplicity
        });

        // illegal move
        if (move === null) return 'snapback'
      
        /*
            this._game.turn() === 'b' means it's black's turn
            this._game.in_checkmate()
            this._game.in_draw()
            this._game.in_check()
        */

       let newGameState = {
            playerWhite: this.state.gameState.playerWhite,
            playerBlack: this.state.gameState.playerBlack,
            blackToMove: this._game.turn() === 'b' ? true : false,
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
      
    // update the board position after the piece snap
    // for castling, en passant, pawn promotion
    onSnapEnd = () => {
        this._board.position(this._game.fen())
    }
      
    setHistoryState = (fen, historyState) => {
        console.log('in setHistoryState, this was');
        console.log(this);
        // this.setState({
        //     historyState
        // });

        this._board.position(fen);
    }

   static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.postsInCurrentChannel) {
        for (var i = 0; i < nextProps.postsInCurrentChannel.length; i++) {
            let post = nextProps.postsInCurrentChannel[i];
            if (post.type == 'custom_chess-game-post') {
                let gameState = JSON.parse(post.message);
                console.log('in getDerivedStateFromProps, got game state: ');
                console.log(gameState);
                return { gameState };
            }
        }
    }

    return null;
  }

    componentDidUpdate() {
        // this runs after render, important since the chessboard can only be set up
        // once the element with id 'chessboard' is already in the DOM
        if (this.props.visibility) {
            window.requestAnimationFrame(() => {

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
    
                if (this.state.gameState.pgn == '') {
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

        // var gameState = this.getMostRecentGameState();
        if (this.state.gameState) {
            this._game.load_pgn(this.state.gameState.pgn);
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