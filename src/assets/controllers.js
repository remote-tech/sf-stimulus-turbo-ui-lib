const controllers = {};

// Dynamically import all controllers in the `controllers` folder
const context = require.context('./controllers', true, /\.js$/);

context.keys().forEach((key) => {
    if (key.endsWith('_controller.js')) {
        const controllerName = key
            .replace('./', '') // Remove './' from the start
            .replace('_controller.js', '') // Remove '_controller.js'
            .replace(/_/g, '-') // Convert snake_case to kebab-case for Stimulus
            .replace(/\//g, '--'); // Handle nested directories for Stimulus naming

        controllers[controllerName] = context(key).default;
    }
});

export default controllers;



