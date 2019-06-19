import _get from 'lodash.get'

export default class Config {
  static service = '@config'

  _config = null

  constructor(provider, config, master, options) {
    this._config = options
  }

  get(path, defaultValue) {
    return _get(this._config, path, defaultValue)
  }

}