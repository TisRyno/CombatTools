"use strict";

import React from 'react';
import CombatStoreState from '../stores/CombatStoreState';
import CombatStore from '../stores/CombatStore';

class CombatTool extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            initiative: '',
        };
    }

    onStartCombat = (e) => {
        CombatStore.startCombat();
        // todo ensure combat cannot start with 1 player
    };

    onNextPlayer = (playerName) => {
        CombatStore.movePlayerToNextRound(playerName);
    };

    onBackToPlayers = (e) => {
        CombatStore.endCombat();
    };

    onRemovePlayer = (playerName) => {
        CombatStore.removePlayer(playerName);
    };

    onAddPlayer = (e) => {
        e.preventDefault();

        if (this.state.name.length > 0) {
            this._playerName.classList.remove('is-invalid');
        } else {
            this._playerName.classList.add('is-invalid');
            this._playerName.focus();
            return;
        }

        let parsedInitiative = parseInt(this.state.initiative);

        if (parsedInitiative === parsedInitiative && this.state.initiative >= 0) {
            this._playerInitiative.classList.remove('is-invalid');
        } else {
            this._playerInitiative.classList.add('is-invalid');
            this._playerInitiative.focus();
            return;
        }


        CombatStore.addPlayer(this.state.name, this.state.initiative);
        this._playerName.focus();

        this.setState({
            name: '',
            initiative: '',
        });
    };

    render() {
        if (this.props.combatStarted) {
            if (this.props.combat.length === 0) {
                return (
                    <div className="row">
                        <div className="col-12 offset-sm-3 col-sm-6">
                            <div className="card mb-5">
                                <div className="card-body">
                                    <h1 className="display-5 text-center text-danger">Add Some Players</h1>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 offset-sm-3 col-sm-6">
                            <div className="d-flex justify-content-center">
                                <button onClick={this.onBackToPlayers} className="btn btn-danger btn-lg">Back to edit
                                </button>
                            </div>
                        </div>
                    </div>
                );
            }

            let currentPlayer = this.props.combat.sort((a, b) => {
                if (a.round === b.round) {
                    return parseInt(a.initiative) < parseInt(b.initiative);
                }
                return parseInt(a.round) > parseInt(b.round)
            })[0];

            let initiativeClass = 'text-success';

            if (currentPlayer.initiative < 7) {
                initiativeClass = 'text-danger';
            } else if (currentPlayer.initiative >= 7 && currentPlayer.initiative < 14) {
                initiativeClass = 'text-warning';
            }

            return (
                <div className="row">
                    <div className="col-12 col-sm-3">
                        <div className="card">
                            <ul className="list-group list-group-flush">
                                {this.props.combat.sort((a, b) => {
                                    return parseInt(a.initiative) < parseInt(b.initiative);
                                }).map((player, i) => {
                                    let statusClass = "";
                                    if (player === currentPlayer) {
                                        statusClass = "active";
                                    }
                                    return <li key={i} className={`list-group-item ${statusClass}`}>
                                        {player.name} ({player.initiative})
                                        <button onClick={(e) => this.onRemovePlayer(player.name)}
                                                className="btn btn-xs btn-outline-danger pull-right">
                                            <i className="fa fa-trash-o"/>
                                        </button>
                                    </li>;
                                })
                                }
                            </ul>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6">
                        <div className="card mb-5">
                            <div className="card-body">
                                <h2 className="text-center">{currentPlayer.name}</h2>
                                <h1 className={`display-3 text-center ${initiativeClass}`}>{currentPlayer.initiative}</h1>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 offset-sm-3 col-sm-6">
                        <div className="d-flex justify-content-center">
                            <button onClick={(e) => this.onNextPlayer(currentPlayer.name)}
                                    className="btn btn-danger btn-lg">Next Player
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return <div className="row">
            <div className="col-12 col-sm-4">
                <div className="card">
                    <ul className="list-group list-group-flush">
                        {this.props.combat.length === 0 &&
                        <li className="list-group-item">No players added</li>
                        }
                        {this.props.combat.length > 0 &&
                        this.props.combat.sort((a, b) => {
                            return parseInt(a.initiative) < parseInt(b.initiative);
                        }).map((player, i) => {
                            return <li key={i} className="list-group-item">
                                {player.name} ({player.initiative})
                                <button onClick={(e) => this.onRemovePlayer(player.name)}
                                        className="btn btn-xs btn-outline-danger pull-right">
                                    <i className="fa fa-trash-o"/>
                                </button>
                            </li>;
                        })
                        }
                    </ul>
                </div>
            </div>
            <div className="col-12 col-sm-8">
                <div className="card">
                    <div className="card-body">

                        <h3>Add players</h3>
                        <form onSubmit={this.onAddPlayer}>
                            <div className="form-group">
                                <label htmlFor="player-name">Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="player-name"
                                    placeholder="Enter name"
                                    // required={true}
                                    value={this.state.name}
                                    onChange={(e) => this.setState({name: e.target.value})}
                                    ref={(c) => this._playerName = c}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="player-initiative">Initiative</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="player-initiative"
                                    placeholder="Enter initiative"
                                    // required={true}
                                    // min={0}
                                    value={this.state.initiative}
                                    onChange={(e) => this.setState({initiative: e.target.value})}
                                    ref={(c) => this._playerInitiative = c}

                                />
                            </div>

                            <button type="submit" className="btn btn-primary">
                                Add player
                            </button>

                            <button onClick={this.onStartCombat}
                                    className="pull-right btn btn-warning">
                                Start combat
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>;
    }
}

module.exports = CombatStoreState(CombatTool);