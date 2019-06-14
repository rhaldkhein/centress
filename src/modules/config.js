import _defaultsDeep from 'lodash/defaultsDeep'
import _get from 'lodash/get'
import callsite from 'callsite'
import path from 'path'

const configDefault = {}

export default class Config {
  static service = '@config'

  _config = null

  constructor(provider, options = {}) {
    this._config = _defaultsDeep(options, configDefault)
    // Make sure root path is set
    // let rootPath = this._configService('paths.root')
    // if (!rootPath) {
    //   rootPath = path.dirname(callsite()[1].getFileName())
    //   _set(this._config, 'paths.root', rootPath)
    // }
  }

  get(path, defaultValue) {
    return _get(this._config, path, defaultValue)
  }

}