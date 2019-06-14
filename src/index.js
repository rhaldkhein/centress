import Setter from './setter'
import Getter from './getter'
import Config from './modules/config'
import Server from './modules/server'

export class Centress {

  setter = null
  getter = null
  _options = null
  _services = {}
  _instances = {}
  _configService = null

  constructor(config = {}, options = {}) {
    this._options = options
    this.setter = new Setter(this)
    this.getter = new Getter(this)
    this.setter.addService(Config)
    this._configService = this.getter.getRequiredService('@config', config)
  }

  start(registry) {
    // Add server service
    this.setter.addService(Server)
    // Collect other services
    if (typeof registry === 'function')
      registry(this.setter)
    // Start server
    const server = this.getter.getRequiredService('@server', this)
    return Promise.all(this._invoke('start'))
      .then(results => server.start(results))
  }

  _invoke(event) {
    let results = []
    for (const key in this._services) {
      if (!this._services.hasOwnProperty(key)) continue
      const service = this._services[key]
      const method = service[event]
      if (method) {
        let res = method.call(
          this.getter.getRequiredService(key),
          this.getter,
          this._configService.get(key)
        )
        results.push(res)
      }
    }
    return results
  }

}