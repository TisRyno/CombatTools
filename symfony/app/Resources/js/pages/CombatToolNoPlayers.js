"use strict";

import React from 'react';
import CombatStore from '../stores/CombatStore';

class CombatToolNoPlayers extends React.Component {
    constructor(props) {
        super(props);
    }

    onBackToPlayers = (e) => {
        CombatStore.endCombat();
    };


    render() {
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

}

module.exports = CombatToolNoPlayers;