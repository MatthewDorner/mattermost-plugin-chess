import React from 'react';
import PropTypes from 'prop-types';

import getSiteURLFromWindowObject from '../../utils/GetSiteUrlFromWindowObject';
import {id as pluginId} from '../../manifest';
import GameStatuses from '../../utils/GameStatuses';

export default class GamePost extends React.PureComponent {
    static propTypes = {
      setGameModalVisibility: PropTypes.func.isRequired,
      post: PropTypes.object.isRequired,
    }

    handleReply = () => {
      this.props.setGameModalVisibility(true);
    }

    render() {
      const gameState = JSON.parse(this.props.post.message);
      const siteUrl = getSiteURLFromWindowObject(window);
      let content;
      let status = '';

      // this will be shown when the game is first created
      // (and no move will be included since nobody has moved yet)
      if (gameState.gameStatus === GameStatuses.NEW_GAME) {
        content = (
          <span style={styles.status}>
            {`Chess: New Game. ${gameState.playerWhite.name} Plays First`}
          </span>
        );
      } else {
        const recentColor = gameState.blackToMove ? 'w' : 'b';
        let recentPiece = gameState.pgn.split(' ').slice(-1)[0].charAt(0);

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
        case 'O':
          recentPiece = 'R';
          break;
        default:
          break;
        }

        const pieceUrl = `${siteUrl}/static/plugins/${pluginId}/${recentColor}${recentPiece}.png`;
        content = (
          <span>
            <img
              src={pieceUrl}
              style={styles.pieceIcon}
            />
            {gameState.pgn.split(' ').slice(-1)[0]}
          </span>
        );

        // these statuses will be appended if it's the game-finishing move
        if (gameState.gameStatus === GameStatuses.CHECKMATE) {
          const previousPlayer = gameState.blackToMove ? gameState.playerWhite.name : gameState.playerBlack.name;
          status = `Checkmate. ${previousPlayer} Won!`;
        } else if (gameState.gameStatus === GameStatuses.DRAW) {
          status = 'Draw. Game Over.';
        }
      }

      return (
        <div>
          <div>
            <span style={{marginRight: '5px'}}>
              {content}
            </span>
            <a
              style={{fontSize: '10px'}}
              onClick={this.handleReply}
            >
              {'Open Game'}
            </a>
          </div>
          <div>
            <span style={{fontWeight: 'bold'}}>
              {status}
            </span>
          </div>
        </div>
      );
    }
}

const styles = {
  pieceIcon: {
    display: 'inline',
    width: '20px',
    marginRight: '2px',
    paddingBottom: '2px',
  },
  status: {
    fontWeight: 'bold',
  },
};
