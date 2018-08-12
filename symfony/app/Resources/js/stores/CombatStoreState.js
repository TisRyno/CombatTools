"use strict";

import React from 'react';
import CombatStore from './CombatStore';

let CombatStoreState = ComposedComponent => class extends React.Component {
    constructor() {
        super();
        this.state = {
            combat: CombatStore.getState()
        };
        this.onCombatChange = this.onCombatChange.bind(this);
    }
    componentDidMount() {
        CombatStore.listen(this.onCombatChange);
    }
    componentWillUnmount() {
        CombatStore.unlisten(this.onCombatChange);
    }
    onCombatChange(state) {
        this.setState({
            combat: state
        });
    }
    render() {
        return <ComposedComponent {...this.props} {...this.state.combat} />;
    }
};

export default CombatStoreState;
