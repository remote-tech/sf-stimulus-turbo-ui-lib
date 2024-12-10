# sf-stimulus-turbo-ui-lib
A library that provides some ui helpers and stimulus generic controllers and turbo frames SPA-like functionality

##Prerequisites

* symfony framework >=6.4
* install stimulus and turbo-frames in project
* bootstrap 5
* bootstrap-icons


## Installation & Config

Add to composer.json (use a Github token, because is a private repo)
```json
{
  "repositories": [
    {
      "type": "git",
      "url": "https://<user>:<token>@github.com/remote-tech/sf-stimulus-turbo-ui-lib.git"
    }
  ]
}
```

Run 
```bash 
php composer.phar require remote-tech/sf-stimulus-turbo-ui-lib:dev-main //or any other version
```

To install node modules in the library add to composer.json scripts the following
```json
{
  "scripts": {
    "sf-stimulus-turbo-ui-lib-npm-install": [
      "cd vendor/remote-tech/sf-stimulus-turbo-ui-lib && npm install"
    ],
    "post-install-cmd": [
      "@sf-stimulus-turbo-ui-lib-npm-install"
    ],
    "post-update-cmd": [
      "@sf-stimulus-turbo-ui-lib-npm-install"
    ]
  }
}
```

#### Load stimulus controllers from the lib and make them available seamlessly in the project

In project install, using npm 
```bash
npm install stimulus-controller-resolver
```

In project dir /assets/bootstrap.js add
```js
import StimulusControllerResolver from 'stimulus-controller-resolver'
StimulusControllerResolver.install(app, async controllerName => (
    (await import(`../vendor/remote-tech/sf-stimulus-turbo-ui-lib/src/assets/controllers/${controllerName}_controller.js`)).default
))

import '../vendor/remote-tech/sf-stimulus-turbo-ui-lib/src/assets/bootstrap.js'
```

#### Load css from the lib in project /assets directory

```css
@import url('../../vendor/remote-tech/sf-stimulus-turbo-ui-lib/src/assets/styles/style.css');
```

#### Expose lib custom functionality (like toasts functions) to be available in project /assets javascript

Using Webpack Encore
* install expose-loader using npm

```js
    const path = require('path');
    Encore.addLoader({
      test: path.resolve(__dirname, './vendor/remote-tech/sf-stimulus-turbo-ui-lib/src/assets/custom-js/toast.js'),
      loader: 'expose-loader',
      options: {
        exposes: 'toasts' // The name of the global variable
      }
    });
```

#### Import lib .twig files to project 
```yaml
twig:
    paths:
        '%kernel.project_dir%/vendor/remote-tech/sf-stimulus-turbo-ui-lib/src/templates': 'rt_sf_ui_lib'
```

#### Extend layout from lib 
This provides default sections of the website that are fully extensible by overriding twig blocks

Example:

in templates/layout.html.twig

```php
{% extends '@rt_sf_ui_lib/layout.html.twig' %}

{% block javascripts %}
  {{ encore_entry_script_tags('app') }}
  <script src="{{ app.request.server.get('AXE_API_HOST') }}/app_widget/app_launcher_widget.js"></script>
{% endblock %}

{% block stylesheets %}
    {{ encore_entry_link_tags('appcss') }}
{% endblock %}
```

override javascript and stylesheets blocks to add custom assets and load the project assets using your assets manager (usually AssetsMapper or WebpackEncore) 