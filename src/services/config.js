import _get from 'lodash.get'

export default class Config {
  static service = '@config'
  _config = null
  constructor(provider) {

  }
  get(path, defaultValue) {
    return _get(this._config, path, defaultValue)
  }
}