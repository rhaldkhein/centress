import Foo from './services/foo'
import Bar from './services/bar'
import Yoo from './services/yoo'
import Baz from './services/baz'

import { Strategy as LocalStrategy } from 'passport-local'


export function configureServices(services) {

  services.addSingleton(Foo)
  services.addSingleton(Bar)

  services.addTransient(Yoo)
  services.addScoped(Baz)

  services.configure('@authentication', () => {
    return {
      default: 'local',
      strategy: new LocalStrategy(
        function (username, password, done) {
          return done(null, {
            id: 1,
            name: 'Foo'
          })
        }
      )
    }
  })

}

export function configure(app) {

  app.useAuthentication()

  /* 
  Inside will be: {
    app.use(passport.initialize());
    app.use(passport.session());
  }
  */

  // app.useServiceRoutes()
  app.useControllers()

}