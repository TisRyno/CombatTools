"use strict";

import React from 'react';
import CombatStoreState from '../stores/CombatStoreState';
import CombatStore from '../stores/CombatStore';

class CombatTool extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            initiative: 0,
        };

        this.onAddPlayer = this.onAddPlayer.bind(this);
    }

    onAddPlayer(e) {
        CombatStore.addPlayer(this.state.name, this.state.initiative);

        this.setState({
            name: '',
            initiative: 0
        });
    };

    render() {
        if (this.props.combatStarted) {
            // todo combat page
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
                                return <li key={i} className="list-group-item">{player.name} ({player.initiative})</li>;
                            })
                        }
                    </ul>
                </div>
            </div>
            <div className="col-12 col-sm-8">
                <div className="card">
                    <div className="card-body">

                        <h3>Add players</h3>

                        <div className="form-group">
                            <label htmlFor="player-name">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="player-name"
                                placeholder="Enter name"
                                value={this.state.name}
                                onChange={(e) => this.setState({name: e.target.value})}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="player-initiative">Initiative</label>
                            <input
                                type="number"
                                className="form-control"
                                id="player-initiative"
                                placeholder="Enter initiative"
                                value={this.state.initiative}
                                onChange={(e) => this.setState({initiative: e.target.value})}
                            />
                        </div>

                        <button type="submit" onClick={this.onAddPlayer} className="btn btn-primary">Add player</button>

                    </div>
                </div>
            </div>
        </div>;
    }
}

module.exports = CombatStoreState(CombatTool);