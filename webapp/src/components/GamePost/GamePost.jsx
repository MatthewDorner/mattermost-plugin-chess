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
        let previousPlayer = gameState.blackToMove ? gameState.playerBlack.name : gameState.playerWhite.name;

        let siteUrl = getSiteURLFromWindowObject(window);

        let pieceIconStyle = {
            'display': 'inline',
            'width': '25px'
        };

        let content;

        if (gameState.pgn == '') {
            content = (
                <span>
                    New Game
                </span>
            );
        } else {
            let recentColor = gameState.blackToMove ? 'b' : 'w';
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
            console.log('got the pieceUrl, it was: ' + pieceUrl);
    
            content = (
                <span>
                    <img src={pieceUrl} style={pieceIconStyle}></img>
                    {gameState.pgn.split(' ').slice(-1)[0]}
                </span>
            );
        }

        return (
            <div>
                <div>
                    <span style={{'margin': '5px'}}>
                        {content}
                    </span>
                    <a onClick={this.handleReply}>Open Game</a>
                </div>
            </div>
        );
    }
}
