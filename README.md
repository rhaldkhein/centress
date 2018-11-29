# Centress

A modular monolithic Express framework for faster web application development.

#### Objectives

- :white_check_mark: &nbsp; Enforce modular design
- :white_check_mark: &nbsp; Plug and play modules
- :white_check_mark: &nbsp; Section / feature as a module
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

Run with `node index.js` and the server should be up and running. When you visit `localhost:3000`, you'll be greeted with an error `Cannot GET /` :rage: &nbsp;... but don't panic! This means that `home` page is not handled yet.

#### Using Ready-Made Modules

One of the main features of Centress . This microsite is bundled as a module and should be installable by `npm`. I've published a microsite module called `centress-hello` on npm that handles `/` page. Install it and restart server.

`npm install centress-hello`

Restart the server and you'll be greeted now with `Hello World` on `home` page.

## Centress Module

A centress module 