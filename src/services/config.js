import _get from 'lodash.get'
import debug from 'debug'

const debugConfig = debug('excore:config')

export default class Config {

  static service = '$config'

  _config = null

  _set(config) {
    this._config = config
    debugConfig('new config loaded')
  }

  get(path, defaultValue) {
    return _get(this._config, path, defaultValue)
  }

}