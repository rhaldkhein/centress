import Foo from './services/foo'
import Bar from './services/bar'
import Yoo from './services/yoo'
import Baz from './services/baz'
// import Server from '../../../build/services/server'

export function configureServices(services) {

  services.addSingleton(Foo)
  services.addSingleton(Bar)

  services.addTransient(Yoo)
  services.addScoped(Baz)

}

export function configure(app) {

  app.useServiceRoutes()

}