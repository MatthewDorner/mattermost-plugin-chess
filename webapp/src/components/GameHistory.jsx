import React from 'react';
import PropTypes from 'prop-types';

export default class GameHistory extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            historyIndex: props.history.length - 1
        }
    }

    static propTypes = {
        visibility: PropTypes.bool.isRequired,
        setGameModalVisibility: PropTypes.func.isRequired,
        createPost: PropTypes.func.isRequired
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

    render() {

      let historyContainer = {
          "width": "50%",
          "float": "left",
          "height": "100%"
      };

      let historySelect = {
          "width": "95%",
          "height": "285px"
      }

      let historyControlsStyle = {};

      let historyButtonStyle = {
        "width": "23%"
      };

      const historyItems = this.props.history.map((historyItem, index) => {
        let formattedMovePgn = index % 2 ? "... " + this.props.history[index].movePgn : (index / 2 + 1) + '. ' + this.props.history[index].movePgn;

        if (index == this.state.historyIndex) {
          return (<option value={historyItem.movePgn} selected>{formattedMovePgn}</option>);
        } else {
          return (<option value={historyItem.movePgn}>{formattedMovePgn}</option>);
        }
      });

      return (
        <div>
          <div style={historyContainer}>
            <select multiple className='form-control' style={historySelect}>
              {historyItems}
            </select>

            <div style={historyControlsStyle}>
            <button
                  style={historyButtonStyle}
                  type='button'
                  className='btn btn-primary'
                  onClick={() => this.handleTransport('start')}
              >
                  {'<<'}
              </button>
              <button
                  style={historyButtonStyle}
                  type='button'
                  className='btn btn-primary'
                  onClick={() => this.handleTransport('previous')}
              >
                  {'<'}
              </button>          
              <button
                  style={historyButtonStyle}
                  type='button'
                  className='btn btn-primary'
                  onClick={() => this.handleTransport('next')}
              >
                  {'>'}
              </button>
              <button
                  style={historyButtonStyle}
                  type='button'
                  className='btn btn-primary'
                  onClick={() => this.handleTransport('current')}
              >
                  {'>>'}
              </button>
            </div>
          </div>
        </div>
      );
    }
}
