"use strict";

import React from 'react';
import CombatStoreState from '../stores/CombatStoreState';
import CombatToolNoPlayers from './CombatToolNoPlayers';
import CombatToolCombatPhase from './CombatToolCombatPhase';
import CombatToolAddPlayers from './CombatToolAddPlayers';

class CombatTool extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.combatStarted) {
            if (this.props.combat.length === 0) {
                return <CombatToolNoPlayers/>;
            }
            return <CombatToolCombatPhase/>;
        }
        return <CombatToolAddPlayers/>;
    }
}

module.exports = CombatStoreState(CombatTool);