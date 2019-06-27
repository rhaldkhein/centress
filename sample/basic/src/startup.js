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
    return auth => {
      auth.default = 'local'
      auth.use(new LocalStrategy(
        function (username, password, done) {
          done(null, {
            id: 1,
            name: 'Foo'
          })
        }
      ))
      const serializer = (user, done) => done(null, user)
      auth.serializeUser(serializer)
      auth.deserializeUser(serializer)
    }
  })

}

export function configure(app) {

  app.useBodyParser()
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