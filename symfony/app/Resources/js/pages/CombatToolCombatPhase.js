"use strict";

// todo fix combat starting with 1 player
// todo make button for test page for characters
// todo work out how to set up new page for myself
// todo add in forms for character details



import React from 'react';
import CombatStoreState from '../stores/CombatStoreState';
import CombatStore from '../stores/CombatStore';
import ModalHealth from './ModalHealth';
import CombatToolNoPlayers from './CombatToolNoPlayers';

class CombatToolCombatPhase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showHealthModal: false,
            modalPlayer: null,
        }
    }

    onNextPlayer = (playerName) => {
        CombatStore.movePlayerToNextRound(playerName);
    };

    onPlayerDeath = (playerName) => {
        CombatStore.killPlayer(playerName);

    };

    onPlayerLife = (playerName) => {
        CombatStore.resurrectPlayer(playerName);

    };

    onSuccessThrow = (playerName) => {
        CombatStore.incrementPlayerSuccessThrow(playerName);

    };

    onFailedThrow = (playerName) => {
        CombatStore.incrementPlayerFailedThrow(playerName);
    };

    onAdjustPlayerHealth = (playerName) => {
        this.setState({
            showHealthModal: true,
            modalPlayer: playerName
        });
    };
    onCloseHealthModal = () => {
        this.setState({
            showHealthModal: false,
            modalPlayer: null
        });
    };

    render() {
        let currentPlayer = this.props.combat.sort((a, b) => {
            if (a.round === b.round) {
                return parseInt(a.initiative) < parseInt(b.initiative);
            }
            return parseInt(a.round) > parseInt(b.round)
        })[0];

        let healthClass = 'text-success',
            healthPercentage = (currentPlayer.healthPoints / currentPlayer.maxHealthPoints) * 100;

        if (healthPercentage <= 25) {
            healthClass = 'text-danger';
        } else if (healthPercentage > 25 && healthPercentage < 75) {
            healthClass = 'text-warning';
        }

        let savedThrowsIndicators = [],
            failedThrowsIndicators = [];

        for (let i = 0; i < 3; i++) {
            if (i < currentPlayer.successThrows) {
                savedThrowsIndicators.push(<i key={i} className="fa fa-circle ml-2"/>);
            } else {
                savedThrowsIndicators.push(<i key={i} className="fa fa-circle-o ml-2"/>);
            }
        }

        for (let i = 0; i < 3; i++) {
            if (i < currentPlayer.failedThrows) {
                failedThrowsIndicators.push(<i key={i} className="fa fa-circle ml-2"/>);
            } else {
                failedThrowsIndicators.push(<i key={i} className="fa fa-circle-o ml-2"/>);
            }
        }



        return (
            <div>
                <div className="row">
                    <div className="col-12 col-sm-4">
                        <div className="card">
                            <ul className="list-group list-group-flush">
                                {this.props.combat.sort((a, b) => {
                                    return parseInt(a.initiative) < parseInt(b.initiative);
                                }).map((player, i) => {
                                    let statusClass = "";
                                    if (player.isDead) {
                                        statusClass = "list-group-item-danger";
                                    }
                                    if (player === currentPlayer) {
                                        statusClass = "list-group-item-info";
                                    }
                                    return <li key={i} className={`list-group-item ${statusClass}`}>
                                        {player.name}
                                        <button onClick={(e) => this.onAdjustPlayerHealth(player.name)}
                                                className="btn btn-outline-success btn-sm pull-right ml-1">
                                            {player.healthPoints}
                                        </button>
                                    </li>;
                                })
                                }
                            </ul>
                        </div>
                    </div>
                    <div className="col-12 col-sm-4">
                        <div className="card mb-5">
                            <div className="card-body">
                                <h2 className="text-center">{currentPlayer.name}</h2>
                                <h1 className={`display-3 text-center ${healthClass}`}>
                                    {currentPlayer.healthPoints}/{currentPlayer.maxHealthPoints}
                                </h1>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-4">
                        {currentPlayer.isDead &&
                        <div className="card">
                            <div className="card-body text-center p-2">
                                Saving Throws.
                            </div>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">
                                    Success
                                    <span className="float-right text-success">
                                    {savedThrowsIndicators}
                                </span>
                                </li>
                                <li className="list-group-item">
                                    Failures
                                    <span className="float-right text-danger">
                                    {failedThrowsIndicators}
                                </span>
                                </li>
                            </ul>
                            <div className="card-body p-2">
                                <div className="row">
                                    <div className="col-6">
                                        <button onClick={(e) => this.onSuccessThrow(currentPlayer.name)}
                                                className="btn btn-success btn-block">
                                            Success
                                        </button>
                                    </div>
                                    <div className="col-6">
                                        <button onClick={(e) => this.onFailedThrow(currentPlayer.name)}

                                                className="btn btn-danger btn-block">Fail
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        }
                    </div>
                    <div className="col-12 offset-sm-3 col-sm-6">
                        <div className="d-flex justify-content-center">
                            <button onClick={(e) => this.onNextPlayer(currentPlayer.name)}
                                    className="btn btn-danger btn-lg">Next Player
                            </button>
                        </div>
                    </div>
                </div>
                {this.state.showHealthModal &&
                    <ModalHealth
                        onClose = {this.onCloseHealthModal}
                        players = {this.props.combat}
                        playerName = {this.state.modalPlayer}
                    />}
            </div>
        );


    }
}

module.exports = CombatStoreState(CombatToolCombatPhase);