import _get from 'lodash.get'

export default class Config {

  static service = '$config'

  _config = null

  _set(config) {
    this._config = config
  }

  get(path, defaultValue) {
    return _get(this._config, path, defaultValue)
  }

}