import React from 'react';
import PropTypes from 'prop-types';
// import { Modal } from 'react-bootstrap';
// import ChessboardJs from 'react-chessboardjs-wrapper';
// import Chessboard from 'chessboardjs';
// import Chess from 'chess.js';
// import './chessboard.css';
// import './fixes.css';
// import getSiteURLFromWindowObject from '../../utils/GetSiteUrlFromWindowObject';

export default class GameHistory extends React.PureComponent {

    constructor(props) {

        super(props);

        // maybe historyState should be in redux, but for now.
        this.state = {
            historyState: this.historyStates.CURRENT_MOVE,
            historyIndex: props.history.length - 1
        }
    }

    static propTypes = {
        visibility: PropTypes.bool.isRequired,
        setGameModalVisibility: PropTypes.func.isRequired,
        createPost: PropTypes.func.isRequired
    }

    // move this to separate module
    historyStates = {
        CURRENT_MOVE: 'CURRENT',
        HISTORICAL_MOVE: 'HISTORICAL_MOVE'
    }

    handleTransport = (direction) => {
      let currentIndex = this.state.historyIndex;

      switch(direction) {
        case 'previous':
          currentIndex -= 1;
          break;
        case 'next':
          currentIndex += 1;
          break;
        case 'start':
          currentIndex = 0;
          break;
        case 'current':
          currentIndex = this.props.history.length - 1;
          break;
        default:
          break;
      }

      if (currentIndex < 0) { currentIndex = 0}
      if (currentIndex > this.props.history.length - 1) {
        currentIndex = this.props.history.length - 1;
      }

      this.setState({
        historyIndex: currentIndex
      }, () => {
        this.props.setHistoryState(this.props.history[currentIndex].fen);
      });
    
    }


    /*
      props:
      setHistoryState(fen, historyState)
      history: {movePgn, fen}

    */

    render() {

      let historyContainer = {
          "width": "50%",
          "float": "left",
          "height": "100%"
      };

      let historySelect = {
          "width": "95%"
      }

      let historyControls = {};

      /*
        will keep historyState in this component's state... but need to
        use the setHistoryState action to send it up so the board can get set

        what does this component need to do?
          - need to keep track of which historyItem is selected
          - need to update when you select a different one

      */
      
    

      const historyItems = this.props.history.map((historyItem, index) => {
        if (index == this.state.historyIndex) {
          return (<option value={historyItem.movePgn} selected>{historyItem.movePgn}</option>);
        } else {
          return (<option value={historyItem.movePgn}>{historyItem.movePgn}</option>);
        }
      });

      console.log('in gameHistory::render, history was: ');
      console.log(this.props.history);
            
      return (
        <div>
          <div style={historyContainer}>
            <select size='12' style={historySelect}>
              {historyItems}
            </select>
            <div style={historyControls}>
              <button
                  type='button'
                  className='btn btn-primary'
                  onClick={() => this.handleTransport('previous')}
              >
                  Previous
              </button>          
              <button
                  type='button'
                  className='btn btn-primary'
                  onClick={() => this.handleTransport('next')}
              >
                  Next
              </button>
              <button
                  type='button'
                  className='btn btn-primary'
                  onClick={() => this.handleTransport('start')}
              >
                  Start
              </button>
              <button
                  type='button'
                  className='btn btn-primary'
                  onClick={() => this.handleTransport('current')}
              >
                  Current
              </button>
            </div>
          </div>
        </div>
      );
    }
}
