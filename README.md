# Excore

A dependency injection framework for Express using [JService](https://github.com/rhaldkhein/jservice) which is Inspired by .Net Core.

JService is a DI container that provides dependency scoping, like Singleton, Scoped and Transcient. That means you can have DI based application without bloating it with global or singleton services that stays forever. Scoped services are short-lived and will be cleared when request is finished. Transient services will always create new instance everytime you need the service.

### Install

```sh
npm install excore
```

### Usage

Create entry point `index.js` to build and start the application.

```javascript
import Builder from 'excore'
import registry from './registry'

// Create a container context
const builder = new Builder()

// Build services and start
builder.build(registry).start()
```

Create a registry file `registry.js` to add your all services.

```javascript
// Import your services
import Routing from './services/routing'
import Database from './services/database'
import Server from './services/server'
import User from './services/user'
import MyScopedService from './services/scoped'
import MyTransientService from './services/transient'

// Export a function 
module.exports = function(services) {
  
  // Add your singleton services
  services.addSingleton(Routing)
  services.addSingleton(Database)
  services.addSingleton(Server)
  services.addSingleton(User)

  // Add your spoced service
  services.addScoped(MyScopedService)
  services.addTransient(MyTransientService)
}
```

#### Creating your services

Server service `./services/server.js`.

```javascript
const express = require('express')
const http = require('http')

export default class Server {
  // Required static property
  static service = 'server'
  // Create express server
  constructor(provider) {
    // Inject the routing server
    this.routingService = provider.getService('routing')
    // Create server
    this.app = express()
    this.router = express.Router()
    this.server = http.Server(this.app)
  }
  // Start server and listen on port
  listen() {
    const setupRouting = () => {
      this.routingService.buildRoutes()
    }
    const listenServer = () => {
      return new Promise((resolve, reject) => {
        const port = 3000
        // Start the server
        this.server.listen(port, err => {
          if (err) return reject(err)
          resolve()
          console.log(`Server is listening on port ${port}`);
        })
      })
    }
    return Promise.resolve()
      .then(setupRouting)
      .then(listenServer)
  }
  // This is an optional syntax sugar to hook on builder's start event.
  // You can start server in `builder.build(registry).start()` instead.
  static start(provider) {
    // Since this is static, we don't have access to `this` but we can
    // use the provider to get the server service.
    const serverService = provider.getService('server')
    serverService.listen()
  }
}
```

Routing service `./services/routing.js`. You will notice that we will not import `Express` here or create any routing object. The only job of this service is to map business logic to endpoints.

```javascript
export default class Routing {
  static service = 'routing'
  constructor(provider) {
    // Getting a required service, and will throw error if not registered
    this.serverService = provider.getRequiredService('server')
    // Getting non-required service, will not throw error and returns `null`
    this.userService = provider.getService('user')
  }
  buildRoutes() {
    const { router } = this.serverService
    router.post('/register', (req, res) => {
      // Since user service is not required, it might be `null`, so we need to check
      if (this.userService)
        this.userService.registerUser(req.body)
    })
    router.post('/delete', (req, res) => {
      if (this.userService)
        this.userService.deleteUser(req.body.id)
    })
  }
}
```

#### License
MIT