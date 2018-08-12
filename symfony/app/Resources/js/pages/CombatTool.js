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
            <div className="col">
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

export default CombatStoreState(CombatTool);