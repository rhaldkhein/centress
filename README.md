# Centress

A modular monolithic Express framework for faster and maintainable web application.

#### Objectives

- :white_check_mark: &nbsp; Enforce modular design
- :white_check_mark: &nbsp; Dependecy injection
- :white_check_mark: &nbsp; Plug and play modules
- :white_check_mark: &nbsp; Area or feature as a module
- :white_check_mark: &nbsp; Zero configuration
- :black_square_button: &nbsp; Easily migrate to microservices

#### Installation

`npm install centress`

## Usage

Create main file `index.js` next to `package.json` and append the following code.

```javascript
const centress = require('centress')
// Start centress server
centress.boot(__dirname);
```

Run with `node index.js` and the server should be up and running. When you visit `localhost:3000`, you'll be greeted with an error `Cannot GET /` :rage: &nbsp;... but don't panic! That means it's working and `home` page is not handled yet.

#### Using Ready-Made Modules

One objective of Centress is to allow external ready-made module of features or areas in your application to be installed by `npm`. I've published a simple centress module called `centress-hello` on npm that handles `/` homepage automatically. Install it then restart server.

`npm install centress-hello`

Restart the server and you'll be greeted now with `Hello World` on `home` page.

You can always use different Centress modules from npm for each different areas/features in your application, or just create your own custom Centress module with your domain logic.

## Centress Module

A Centress module is just a normal node module but is automatically detected and use its functions and features after installing. Should be at least no setup or configuration to use it.

#### Creating A Centress Module

In order for Centress to detect that your module is a Centress module, write `centress.module(exports, options)` like in the following code.

```javascript
// Import centress module
const centress = require('centress');
// Making this module a Centress module
centress.module(exports, {});
// Other export props and methods
exports.otherProps = 'value';
// ...
```

Though the above code tells that it's a Centress module, it doesn't really do anything yet. 

**.module(exports, options)**

Give meaning to your module by defining options. Let's say the name of the following module is `test` in `package.json` file.

```javascript
centress.module(exports, {

  // Initialize your module with dependecy injection
  init: main => {
    // Custom configuration provided user
    main.config.foo ? 'Bar' : 'Baz';
    // Express root APP
    main.app.use(bodyparser());
    // Global default PAGE router (Express router) for all modules
    main.router.use(...);
    // Global API router (Express router) for all modules
    main.api.use(...);
    // Native node http object
    main.server
  },

  // Register PAGE routes (Express router).
  // The `pageRouter` is ony for this module,
  // and is different from above router in init method
  routes: pageRouter => {
    // http://localhost:3000/test/hello
    pageRouter.get('/hello', (req, res) => {
      res.send('Hello World');
    });
    // more routes ...
  },

  // Register API endpoint (Express router).
  // The `endpointRouter` is also only for this module
  api: endpointRouter => {
    // http://localhost:3000/api/test/hello
    endpointRouter.get('/hello', (req, res) => {
      res.json({ hello: 'world' });
    });
    // more endpoints ...
  }
});
```
**Options:**

| Name      | Type      | Description
| :-        | :-        | :-
| init      | function  | Use to initialize the module.
| routes    | function  | Use to add page routes for the module.
| api       | function  | Use to add API endpoints for the module.
| index     | number    | Index order for the module. Indexes are used by Centress to sort the order of modules. The lower the number, the higher the priority.

## Centress Object

**.boot([rootPath])**

Start the server and initialize all installed Centress module.

**.set(path, value)**

Set a configuration. See list below. Eg. `centress.set('server.port', 8080)`.

**.lib(name)**

Require built-in Cenrtress libraries. Eg. `centress.lib('logger/file')`.

**.get(moduleName)**

Require other Centress modules.

```javascript
const userModule = centress.get('user-module');
const foo = userModule.getById('ABC123');
```

**.module(exports, options)**

Use to create a Centress module. See above for how to create a Centress module.

## Configuration

Configuration must be set before calling `centress.boot()` method.

```javascript
// Writing config
const centress = require('centress');
centress.set('server.port', 8080);
// more sets ...
centress.boot();

// Accessing config
const { config } = require('centress');
const isProd = config.production ? 'YES' : 'NO';
```

**Writable**

| Path                | Type      | Default           | Description
| :-                  | :-        | :-                | :-
| apiBaseUrl          | string    | `/api`            | Base URL for API routes in modules
| logLevel            | string    | `all`             | Log4js log level
| server.host         | string    | `localhost`       | Host for Express server
| server.port         | number    | `3000`            | Port for Express server
| paths.root          | string    | boot caller file  | 
| paths.modules       | string    | `/modules`        | Own local custom modules without using `package.json`
| express.settings    | object    | `{}`              | Key/value pair for Express settings. http://expressjs.com/en/4x/api.html#app.set
| log4js.appenders    | object    | `{console, file}` | Log4js appenders config. Do not replace the whole object.
| log4js.categories   | object    | `{default, file}` | Log4js categories config. Do not replace the whole object.
| log4js.pm2          | boolean   | `true`            | Log4js use PM2

**Read Only**

| Path            | Type      | Description
| :-              | :-        | :-
| production      | boolean   | `true` if `NODE_ENV === 'production'` otherwise `false`. Aliased with `prod`.
| development     | boolean   | Negation for production. Aliased with `dev`.

## Custom Local Modules

You can also create your own custom module without using or registering it to `package.json`. By default, Centress will use all modules inside `modules` directory which can also be changed by setting `paths.modules` configuration.

**File Structure**

```
project
│   main.js
│   package.json    
│
└── modules
│   └── security
│   │   └── controllers
│   │   │   crypto.js (private)
│   │   │   auth.js (private)
│   │   │   index.js (public centress module, expose methods here)
│   │  
│   └── user
│   │   └── models
│   │   └── controllers
│   │   │   index.js
│   │  
│   └── otherModule  
│   └── ...
└── otherFolder
└── ...
```

## License

MIT