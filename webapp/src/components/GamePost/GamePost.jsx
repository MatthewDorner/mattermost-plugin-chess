import React from 'react';
import PropTypes from 'prop-types';
import Piece from 'react-chess-pieces';

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
    const contentParagraphs = [];

    if (gameState.gameStatus === GameStatuses.NEW_GAME) {
      contentParagraphs.push(
        <p style={styles.message}>
          {`Chess: New Game. ${gameState.playerWhite.name} Plays First`}
          <a
            style={{fontSize: '10px', marginLeft: '6px', fontWeight: 'bold'}}
            onClick={this.handleReply}
          >
            {'Open Game'}
          </a>
        </p>,
      );
    } else {
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

      if (!gameState.blackToMove) {
        recentPiece = recentPiece.toLowerCase();
      }

      contentParagraphs.push(
        <p>
          <span className='chessPieceIconContainer'>
            <Piece piece={`${recentPiece}`}/>
          </span>
          {gameState.pgn.split(' ').slice(-1)[0]}
          <a
            style={{fontSize: '10px', marginLeft: '6px', fontWeight: 'bold'}}
            onClick={this.handleReply}
          >
            {'Open Game'}
          </a>
        </p>,
      );

      if (gameState.gameStatus === GameStatuses.CHECKMATE) {
        const previousPlayer = gameState.blackToMove ? gameState.playerWhite.name : gameState.playerBlack.name;
        contentParagraphs.push(
          <p style={styles.message}>
            {`Checkmate. ${previousPlayer} Won!`}
          </p>,
        );
      } else if (gameState.gameStatus === GameStatuses.DRAW) {
        contentParagraphs.push(
          <p style={styles.message}>
            {'Draw. Game Over.'}
          </p>,
        );
      }
    }

    return (contentParagraphs);
  }
}

const styles = {
  message: {
    fontWeight: 'bold',
  },
};
