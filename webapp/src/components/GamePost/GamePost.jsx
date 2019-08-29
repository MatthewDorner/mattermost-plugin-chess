import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';

export default class GamePost extends React.PureComponent {

    static propTypes = {
        // visibility: PropTypes.bool.isRequired,
        // setChallengeModalVisibility: PropTypes.func.isRequired,
        // createPost: PropTypes.func.isRequired
    }

    handleReply = () => {
        console.log('in handleReply');
        console.log('setting gameState: ');
        console.log(JSON.parse(this.props.post.message));
        this.props.setGameModalVisibility(true, JSON.parse(this.props.post.message));
    }

    render() {

        let gameState = JSON.parse(this.props.post.message);
        let previousPlayer = gameState.blackToMove ? gameState.playerBlack.name : gameState.playerWhite.name;
        let playerToMove = gameState.blackToMove ? gameState.playerWhite.name : gameState.playerBlack.name;

        let mostRecentMove;
        if (gameState.pgn == '') {
            mostRecentMove = 'New Game';
        } else {
            mostRecentMove = previousPlayer + ' played: ' + gameState.pgn.split(' ').slice(-1)[0];
        }

        return (
            <div>
                <div>
                    <span>
                        {mostRecentMove}
                    </span>
                </div>
                <div>
                    <span>
                        Black To Move: {gameState.blackToMove ? 'true' : 'false'}
                    </span>
                </div>
                <div>
                    <span>
                        Player To Move: {playerToMove}
                    </span>
                </div>
                <div>
                    <span>
                        History: {gameState.pgn}
                    </span>
                </div>
                <div>
                    <a onClick={this.handleReply}>Reply</a>
                </div>
            </div>
        );
    }
}
