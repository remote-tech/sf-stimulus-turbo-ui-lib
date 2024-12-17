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
    "sf-stimulus-turbo-ui-lib-assets-link": [
      "ln -s ../../vendor/remote-tech/sf-stimulus-turbo-ui-lib/public public/bundles/rt-stimulus-ui-lib"
    ],
    "post-install-cmd": [
      "@sf-stimulus-turbo-ui-lib-assets-link"
    ],
    "post-update-cmd": [
      "@sf-stimulus-turbo-ui-lib-assets-link"
    ]
  }
}
```

#### Load stimulus controllers from the lib and make them available seamlessly in the project

In project dir /assets/bootstrap.js add
```js
import  '../public/bundles/rt-stimulus-ui-lib/dist/styles.css'
import {sf_ui_lib} from '../public/bundles/rt-stimulus-ui-lib/dist/main.js'
// register rt UI lib controllers
Object.entries(sf_ui_lib.controllers).forEach(([name, controller]) => {
    app.register(name, controller);
});
// init global plugins like jquery select2 or bootstrap tooltips
sf_ui_lib.initializeGlobalEventListeners();
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
    {{ encore_entry_link_tags('app') }}
{% endblock %}
```

override javascript and stylesheets blocks to add custom assets and load the project assets using your assets manager (usually AssetsMapper or WebpackEncore) 