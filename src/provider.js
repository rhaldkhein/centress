import { ServiceProvider as Provider } from 'jservice'

export default class ServiceProvider extends Provider {

  _configService = null

  _setConfigService(configService) {
    this._configService = configService
  }

  createService(Service) {
    return super.createService(
      Service,
      this._configService && this._configService.get(Service.service)
    )
  }

}