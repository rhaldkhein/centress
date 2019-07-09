import Foo from './services/foo'
import Bar from './services/bar'
import Yoo from './services/yoo'
import Baz from './services/baz'

import { Strategy as LocalStrategy } from 'passport-local'
import { HttpError, Authentication, Server } from '../../../build'

export function configureServices(services) {

  services.singleton(Foo)
  services.singleton(Bar)

  services.transient(Yoo)
  services.scoped(Baz)

  services.configure(Authentication, () => {
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

export function configureApplication(app) {

  app.useAuthentication()
  app.useControllers()

  app.usePageRouter(router => {

    router.use((req, res) => {
      // throw new Error('XXX')
      res.send('404')
    })

    router.use((err, req, res, next) => {
      res.send('500')
    })

  })

}