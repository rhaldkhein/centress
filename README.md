# Excore

A minimalist Express framework with dependency injection for using [JService](https://github.com/rhaldkhein/jservice). Inspired by .Net Core.

JService is a small and powerful pure javascript DI container that favors code over configuration, less oppinionated, no automatic dependency resolution, and with dependency scoping such as Singleton, Scoped and Transient.

## Install

```sh
npm install excore
```

## Sample Usage

Entry file `server.js`

```javascript
import core from 'excore'
import { configureServices, configureApplication } from './startup'

// Create app
const app = core()

// Configure services and application
app.configure(
  configureServices,
  configureApplication
).start()
```

Startup file for adding and configuring services. `startup.js`

```javascript
import { Authentication } from 'excore'
import { Strategy as LocalStrategy } from 'passport-local'
// more imports

// Import services
import Database from './services/database'
import User from './services/user'
// more services

// This is where we add all our services to the container
export function configureServices(services) {

  services.singleton(Database)
  services.transient(User)

  // Add more services
  // services.scoped(Foo)

  // Can also configure built-in/added services
  services.configure(Authentication, () => {
    return auth => {
      auth.use(new LocalStrategy())
    }
  })

}

// This is where we configure our Express
export function configureApplication(app) {

  // Same old middleware utility
  app.use(helmet())
  app.use(bodyParser.json())

  /**
   * Some of built-in Excore middlewares
   */
  app.useAuthentication()
  app.useControllers()

}
```

Controller

```javascript
import { get, api, post, authorize } from 'excore/controller'

@authorize()
@api('user') 
class User {

  @post('world') 
  world(req, res) {
    res.jsonSuccess({ world: 'post' })
  }

  @get('foo') 
  @get('hello')
  hello(req, res) {
    res.jsonSuccess({ hello: 'get' })
  }

}

export default User
```