

export default class Setter {

  _master = null

  constructor(master) {
    this._master = master
  }

  addScopeService(service, name) {
    name = (name || service.service).toLowerCase()
    if (this._master._services[name])
      throw new Error(`Service "${name}" is already registered`)
    this._master._services[name] = service
  }

  addService(service, name) {
    service.isSingleton = true
    this.addScopeService(service, name)
  }

}