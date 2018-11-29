# Centress

A modular monolith framework for Express.

#### Objectives

- Enforce modular design
- Enable plug and play modules
- Enable micro-site or micro-api as a modules
- Zero configuration
- Faster web application development

#### Installation

`npm install centress`

## Usage

Create main file `index.js` next to `package.json` and append the following code.

```javascript
const centress = require('centress')
// Start centress server
centress.boot(__dirname);
```

Run with `node index.js` and the server should be up and running. When you visit `localhost:3000`, you will be greeted with an error `Cannot GET /` :rage:. Don't panic! This means that `home` page is not handled yet.

#### Using Ready-made Modules

One of the main features is to enable microsite injection. This microsite is bundled as a module and should be installable by `npm`. I've published a microsite module called `centress-hello` on npm that handles `/` page. Install it and restart server.

`npm install --save centress-hello`

Restart the server and you'll now be greeted with `Hello World` on `home` page.

## Centress Module

A centress module 