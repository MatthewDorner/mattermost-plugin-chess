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

    static getDerivedStateFromProps = (nextProps, prevState) => {
        if (!prevState.history || nextProps.history.length > prevState.history.length) {
            return {
                historyIndex: nextProps.history.length - 1,
                history: nextProps.history,
            };
        }
        return null;
    }

    // transport buttons cause crash when there's no moves in the game yet
    handleTransport = (direction) => {
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
        const historyContainer = {
            width: '50%',
            float: 'left',
            height: '100%',
        };

        const historySelect = {
            width: '95%',
            height: '285px',
        };

        const historyControlsStyle = {};

        const historyButtonStyle = {
            width: '23.7%',
            marginTop: '8px',
        };

        const historyItems = this.state.history.map((historyItem, index) => {
            const formattedMovePgn = index % 2 ? `... ${this.state.history[index].movePgn}` : `${(index / 2) + 1}. ${this.state.history[index].movePgn}`;
            return (
                <option
                    value={index}
                    key={index}
                >
                    {formattedMovePgn}
                </option>
            );
        });

        return (
            <div>
                <div style={historyContainer}>
                    <select
                        size='2'
                        className='form-control'
                        style={historySelect}
                        onChange={this.onChange}
                        value={this.state.historyIndex}
                    >
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
