import { ServiceProvider as Provider } from 'jservice'

export default class ServiceProvider extends Provider {

  _configService = null

  _setConfigService(configService) {
    this._configService = configService
  }

  createService(index) {
    return super.createService(
      index,
      this._configService && this._configService.get(
        this._collection.services[index].service
      )
    )
  }

}