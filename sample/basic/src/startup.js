import Foo from './services/foo'
import Bar from './services/bar'
import Yoo from './services/yoo'
import Baz from './services/baz'

import { Strategy as LocalStrategy } from 'passport-local'
import { HttpError, Authentication } from '../../../index'

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

  app.useApi(api => {
    api.useAuthentication()
  })

  app.useControllers()

  // app.useApiRouter(api => {
  //   api.use((err, req, res, next) => {
  //     res.jsonError().internal()
  //   })
  // })

  app.use((err, req, res, next) => {
    res.jsonError().badRequest(err)
  })

}
