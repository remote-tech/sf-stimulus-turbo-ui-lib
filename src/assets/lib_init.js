import controllers from './controllers.js';

import utilities from './utilities.js';
import { initializeGlobalEventListeners } from './global-events.js';

import * as bootstrap from 'bootstrap';
import BootstrapDateRangePicker from 'bootstrap-daterangepicker'
import axios from 'axios'
import $ from 'jquery'
import select2 from 'select2'

//exports
export const rt_controllers = controllers
export const rt_utilities = utilities

export const rt_initializeGlobalEventListeners = initializeGlobalEventListeners
export const rt_bootstrap = bootstrap
export const rt_BootstrapDateRangePicker = BootstrapDateRangePicker
export const rt_axios = axios
export const rt_jquery = $
export const rt_select2 = select2