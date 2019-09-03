import React from 'react';
import PropTypes from 'prop-types';
import getSiteURLFromWindowObject from '../../utils/GetSiteUrlFromWindowObject';

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
        let siteUrl = getSiteURLFromWindowObject(window);

        let pieceIconStyle = {
            'display': 'inline',
            'width': '20px',
            'marginRight': '2px',
            'paddingBottom': '2px'
        };

        let gameStatusStyle = {
            'font-weight': 'bold'
        }

        let content;
        if (gameState.gameStatus == 'New Game') {
            content = (
                <span style={gameStatusStyle}>
                    Chess: New Game. {gameState.playerWhite.name} Plays First
                </span>
            );
        } else {
            let recentColor = gameState.blackToMove ? 'w' : 'b';
            let recentPiece = gameState.pgn.split(' ').slice(-1)[0].charAt(0);

            // also need to handle castle
            switch (recentPiece) {
                case 'a':
                case 'b':
                case 'c':
                case 'd':
                case 'e':
                case 'f':
                case 'g':
                case 'h':
                    recentPiece = 'P';
                    break;
                default:
                    break;
            }

            let pieceUrl = siteUrl + '/static/plugins/com.example.mattermost-chess/' + recentColor + recentPiece + '.png';
    
            content = (
                <span>
                    <img src={pieceUrl} style={pieceIconStyle}></img>
                    {gameState.pgn.split(' ').slice(-1)[0]}
                </span>
            );

            var status = '';
            if (gameState.gameStatus == 'Checkmate') {
                let previousPlayer = gameState.blackToMove ? gameState.playerWhite.name : gameState.playerBlack.name;
                status = 'Checkmate. ' + previousPlayer + ' Won!';
            } else if (gameState.gameStatus == 'Draw') {
                status = 'Draw. Game Over.';
            }
        }

        return (
            <div>
                <div>
                    <span style={{'margin-right': '5px'}}>
                        {content}
                    </span>
                    <a style={{'font-size': '10px'}} onClick={this.handleReply}>Open Game</a>
                </div>
                <div>
                    <span style={{'font-weight': 'bold'}}>
                        {status}
                    </span>
                </div>
            </div>
        );
    }
}
