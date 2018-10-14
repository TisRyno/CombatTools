"use strict";

import React from "react";
import CombatStore from "../stores/CombatStore";

class ModalHealth extends React.Component {
    constructor(props) {
        super(props);
        let modalPlayer = props.players.filter((player, i) => {
            return player.name === props.playerName;
        });
        if (modalPlayer.length > 0) {
            modalPlayer = modalPlayer[0];
        }
        else {
            modalPlayer = false
        }

        this.state = {
            player: modalPlayer,
            maxHealthPoints: modalPlayer.maxHealthPoints,
            healthPoints: modalPlayer.healthPoints,
        }
    }
    onNextPlayer = (playerName) => {
        CombatStore.movePlayerToNextRound(playerName);
    };

    onSaveChanges = () => {
        const {
            player,
            healthPoints,
            maxHealthPoints,
        }= this.state;

        CombatStore.adjustPlayerHealth(player.name, healthPoints, maxHealthPoints);
        this.props.onClose();

        if (healthPoints <= 0){
            CombatStore.killPlayer(player.name);
        }
        else {CombatStore.resurrectPlayer(player.name)}
    }


    render() {
        return (
            <div>
                <div className="modal fade show" style={{display: 'block'}}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{this.state.player.name}</h5>
                                <button onClick={(e) => this.props.onClose()} type="button" className="close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <div className="row">
                                        <div className="col-6">
                                            <label htmlFor="player-name">Current Health</label>
                                        </div>
                                        <div className="col-6">
                                            <label htmlFor="player-name">Max Health</label>
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <input type="number" className="form-control"
                                               value={this.state.healthPoints}
                                               min={0}
                                               onChange={(e) => this.setState({healthPoints: e.target.value})}
                                        />
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">/</span>
                                        </div>
                                        <input type="number" className="form-control"
                                               value={this.state.maxHealthPoints}
                                               min={0}
                                               onChange={(e) => this.setState({maxHealthPoints: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button onClick={(e) => this.props.onClose()} type="button"
                                        className="btn btn-secondary">Close
                                </button>
                                <button onClick={(e) => this.onSaveChanges()}
                                    type="button" className="btn btn-primary">Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-backdrop fade show"/>
            </div>)
    }
}

module.exports = ModalHealth;