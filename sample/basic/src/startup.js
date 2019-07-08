import Foo from './services/foo'
import Bar from './services/bar'
import Yoo from './services/yoo'
import Baz from './services/baz'

import { Strategy as LocalStrategy } from 'passport-local'
import { HttpError } from '../../../build/common'

export function configureServices(services) {

  services.singleton(Foo)
  services.singleton(Bar)

  services.transient(Yoo)
  services.scoped(Baz)

  services.configure('@authentication', () => {
    return auth => {
      auth.addAuthorize('local', 'local', { session: false })
      auth.use(new LocalStrategy(
        function (username, password, done) {
          let err = new HttpError()
          err.unauthorized()
          return done(err)
          // done(null, {
          //   id: 1,
          //   name: 'Foo'
          // })
        }
      ))
      const serializer = (user, done) => done(null, user)
      auth.serializeUser(serializer)
      auth.deserializeUser(serializer)
    }
  })

}

export function configure(app) {

  app.useAuthentication()
  app.useControllers()

}