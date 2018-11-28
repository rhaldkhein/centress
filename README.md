# Centress

A modular monolith framework for Express.

#### Objectives

- Enforce modular design
- Enable plug and play modules
- Zero configuration
- Faster web application development

#### Installation

`npm install centress`

### Usage

Create main file `index.js` next to `package.json` and append the following code.

```javascript
const centress = require('centress')
// Start centress server
centress.boot(__dirname);
```

Run with `node index.js` and server should be up and running. When you visit the `localhost:3000` you will be greeted with error :grinning:. Don't panic! This means that `home` page is not handled yet.

### Using Ready-made Modules

