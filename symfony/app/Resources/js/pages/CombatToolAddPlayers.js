"use strict";

import React from 'react';
import CombatStoreState from '../stores/CombatStoreState';
import CombatStore from '../stores/CombatStore';
import CombatToolNoPlayers from './CombatToolNoPlayers';
import CombatToolCombatPhase from './CombatToolCombatPhase';

class CombatToolAddPlayers extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            initiative: '',
            healthPoints: "",
        };
    }

    onStartCombat = (e) => {
        CombatStore.startCombat();
        // todo ensure combat cannot start with 1 player
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

        let parsedHealthPoints = parseInt(this.state.healthPoints);

        if (parsedHealthPoints === parsedHealthPoints && this.state.healthPoints >= 0) {
            this._playerHealthPoints.classList.remove('is-invalid');
        } else {
            this._playerHealthPoints.classList.add('is-invalid');
            this._playerHealthPoints.focus();
            return;
        }

        CombatStore.addPlayer(this.state.name, this.state.initiative, this.state.healthPoints);
        this._playerName.focus();

        this.setState({
            name: '',
            initiative: '',
            healthPoints: "",
        });
    };

    render() {
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
                                {player.name}
                                <button onClick={(e) => this.onRemovePlayer(player.name)}
                                        className="btn btn-xs btn-outline-danger pull-right ml-1">
                                    <i className="fa fa-trash-o"/>
                                </button>
                                <span className="btn btn-outline-dark btn-xs pull-right ml-1">
                                   {player.initiative}
                               </span>
                                <span className="btn btn-outline-success btn-xs pull-right ml-1">
                                   {player.healthPoints}
                               </span>

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
                            <div className="row">
                                <div className="col-12 col-sm-6">
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
                                </div>
                                <div className="col-12 col-sm-6">

                                    <div className="form-group">
                                        <label htmlFor="player-healthpoints">Health Points</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="player-healthpoints"
                                            placeholder="Enter Health Points"
                                            // required={true}
                                            // min={0}
                                            value={this.state.healthPoints}
                                            onChange={(e) => this.setState({healthPoints: e.target.value})}
                                            ref={(c) => this._playerHealthPoints = c}

                                        />
                                    </div>
                                </div>
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

module.exports = CombatStoreState(CombatToolAddPlayers);