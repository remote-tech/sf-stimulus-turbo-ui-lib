// Import custom JS utilities and plugins
import { showToast } from './custom-js/toast.js';
import { initTooltips, initBootstrapSelect, initDropdown } from './custom-js/plugins_init.js';


// Define and export your utilities
const utilities = {
    showToast,
    initTooltips,
    initBootstrapSelect,
    initDropdown,
};

export default utilities;