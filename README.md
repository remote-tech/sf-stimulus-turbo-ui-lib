# sf-stimulus-turbo-ui-lib
A library that provides some ui helpers and stimulus generic controllers and turbo frames SPA-like functionality

##Prerequisites

* symfony framework >=6.4
* install stimulus and turbo-frames in project


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
in order to run the recipe when installing add to composer.json

```json
{
  "extra": {
    "symfony": {
      "allow-contrib": false,
      "require": "6.4.*",
      "endpoint": [
        "https://api.github.com/repos/remote-tech/sf-stimulus-turbo-ui-lib/contents/index.json"
      ]
    }
  }
}
```

Run 
```bash 
php composer.phar require remote-tech/sf-stimulus-turbo-ui-lib:dev-main //or any other version
```


#### Load stimulus controllers from the lib and make them available seamlessly in the project

Assets are installed in ``` public/bundles/remotetechsfstimulusturboui/ ``` 
If project uses assetMapper for assets manager use build from the ``` dist-asm ``` folder
If project uses WebpackEncore for assets manager use build from the ``` dist-wpk ``` folder

There are 2 entrypoints in the builds director: ```main.js ``` and ```styles.css```


To use the Library in project dir /assets/bootstrap.js add
```js
// styles can also be included directy in html <head> section
import  '../public/bundles/rt-stimulus-ui-lib/dist/styles.css'

import {rt_controllers, rt_initializeGlobalEventListeners, rt_jquery, rt_axios} from '../public/bundles/remotetechsfstimulusturboui/dist-wpk/main.js'
import {rt_utilities, rt_bootstrap, rt_select2, rt_BootstrapDateRangePicker} from "../public/bundles/remotetechsfstimulusturboui/dist-wpk/main.js";

// register rt UI lib controllers
Object.entries(rt_controllers).forEach(([name, controller]) => {
    app.register(name, controller);
});
```

The library exports stimulus controllers, bootstrap modules, axios, jquery, select2, BootstrapDateRangePicker, initializeGlobalEventListeners and utilities.

To add custom logic to the global events handlers ```rt_initializeGlobalEventListeners``` you can call it like:
```js
// init global plugins like jquery select2 or bootstrap tooltips
rt_initializeGlobalEventListeners(
    {
        domLoaded: (event) => {
            // add custom logic here
        },
        frameMissing: (event) => {
            // add custom logic here
        },
        frameRendered: (event) => {
            // add custom logic here
        }
    }
);
```
The ```utilities``` provides the following functions that can be used individually:
- initBootstrapSelect(element)
- initDropdown(element)
- initTooltips(element)
- showToast(type, message, title = 'Result', icon= null)


#### (OPTIONAL) Import lib .twig files to project (in order to have autocomplete for blocks, otherwise don't since it is provided by default by the recipe)
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