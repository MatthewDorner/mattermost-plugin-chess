import React from 'react';
import PropTypes from 'prop-types';

export default class GamePost extends React.PureComponent {

    static propTypes = {
        setGameModalVisibility: PropTypes.func.isRequired,
        post: PropTypes.object.isRequired
    }

    handleReply = () => {
        this.props.setGameModalVisibility(true, JSON.parse(this.props.post.message));
    }

    render() {

        let gameState = JSON.parse(this.props.post.message);
        let previousPlayer = gameState.blackToMove ? gameState.playerBlack.name : gameState.playerWhite.name;

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
                    <a onClick={this.handleReply}>Open Game</a>
                </div>
            </div>
        );
    }
}
