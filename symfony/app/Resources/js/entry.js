"use strict";

import "babel/polyfill";

// Helpers
import React from 'react';
import ReactDOM from 'react-dom';

// Modules
import CombatTool from './pages/CombatTool';

// All of our symfony frontend styles (SCSS)
// These will get processed by a module loader

import 'normalize.css/normalize.css';
import 'font-awesome/css/font-awesome.min.css';
import '../scss/base.scss';

let combatToolContainer;
if (combatToolContainer = document.getElementById('combat-tool')) {
    renderCombatTool(CombatTool);

    if (module.hot) {
        module.hot.accept('./pages/CombatTool', () => {
            const NextCombatTool = require('./pages/CombatTool');
            ReactDOM.unmountComponentAtNode(combatToolContainer);
            renderCombatTool(NextCombatTool);
        });
    }
}

function renderCombatTool(component) {
    ReactDOM.render(
        React.createElement(component, {}),
        combatToolContainer
    );
}
