import controllers from './controllers.js';

import utilities from './utilities.js';
import { initializeGlobalEventListeners } from './global-events.js';


// import './styles/style.css';


// Export as a unified library
export const sf_ui_lib = {
    controllers,
    utilities,
    initializeGlobalEventListeners,
};