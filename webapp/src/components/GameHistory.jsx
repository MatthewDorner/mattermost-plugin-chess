import React from 'react';
import PropTypes from 'prop-types';

export default class GameHistory extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static propTypes = {
    history: PropTypes.array.isRequired,
    setHistoryState: PropTypes.func.isRequired,
  }

  // only want to update when a new move is added
  static getDerivedStateFromProps = (nextProps, prevState) => {
    if (!prevState.history || nextProps.history.length > prevState.history.length) {
      return {
        historyIndex: nextProps.history.length - 1,
        history: nextProps.history,
      };
    }
    return null;
  }

  handleTransport = (direction) => {
    if (this.state.history.length === 0) {
      return;
    }

    let currentIndex = this.state.historyIndex;

    switch (direction) {
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
      currentIndex = this.state.history.length - 1;
      break;
    default:
      break;
    }

    if (currentIndex < 0) {
      currentIndex = 0;
    }
    if (currentIndex > this.state.history.length - 1) {
      currentIndex = this.state.history.length - 1;
    }

    this.setState({
      historyIndex: currentIndex,
    }, () => {
      this.props.setHistoryState(this.state.history[currentIndex].fen);
    });
  }

  onChange = (event) => {
    this.setState({
      historyIndex: parseInt(event.target.value, 10),
    }, () => {
      this.props.setHistoryState(this.state.history[this.state.historyIndex].fen);
    });
  }

  render() {
    const historyItems = this.state.history.map((historyItem, index) => {
      const formattedMovePgn = index % 2 ? `... ${this.state.history[index].movePgn}` : `${(index / 2) + 1}. ${this.state.history[index].movePgn}`;
      return (
        <option
          value={index}
          key={formattedMovePgn}
        >
          {formattedMovePgn}
        </option>
      );
    });

    return (
      <div>
        <div style={styles.historyContainer}>
          <select
            size='2'
            className='form-control'
            style={styles.historySelect}
            onChange={this.onChange}
            value={this.state.historyIndex}
          >
            {historyItems}
          </select>

          <div>
            <button
              style={styles.historyButton}
              type='button'
              className='btn btn-primary'
              onClick={() => this.handleTransport('start')}
            >
              {'<<'}
            </button>
            <button
              style={styles.historyButton}
              type='button'
              className='btn btn-primary'
              onClick={() => this.handleTransport('previous')}
            >
              {'<'}
            </button>
            <button
              style={styles.historyButton}
              type='button'
              className='btn btn-primary'
              onClick={() => this.handleTransport('next')}
            >
              {'>'}
            </button>
            <button
              style={styles.historyButton}
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

const styles = {
  historyContainer: {
    width: '50%',
    float: 'left',
    height: '100%',
  },
  historySelect: {
    width: '95%',
    height: '285px',
  },
  historyButton: {
    width: '23.7%',
    marginTop: '8px',
  },
};
