import { ServiceProvider as Provider } from 'jservice'

export default class ServiceProvider extends Provider {

  _configService = null
  _isSingleton = false

  constructor(collection, configService) {
    super(collection)
    this._configService = configService
  }

  _setConfigService(configService) {
    this._configService = configService
  }

  createService(index) {
    // Make sure singleton does not require scoped service
    const Service = this._collection.services[index]
    if (this._isSingleton && !Service.isSingleton) {
      throw new Error(
        'Not allowed to access scoped or transient service from singleton'
      )
    }
    return super.createService(
      index,
      this._configService &&
      this._configService.get(Service.service)
    )
  }

}