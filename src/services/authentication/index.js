import passport from 'passport'
import debug from 'debug'
import './express'

const debugAuth = debug('excore:authentication')

export default class Authentication {
  static service = '@authentication'

  authorizeList = {}
  defaultAuthorize = null
  isInit = false

  _util = null

  constructor(provider, configure) {
    if (configure) configure(this)
    this._util = provider.get('@util')
    debugAuth('created')
  }

  addAuthorize(name, strategy, options, callback) {
    this.authorizeList[name] = [strategy, options, callback]
    if (!this.defaultAuthorize) this.defaultAuthorize = name
  }

  authorize(strategy, options, callback) {
    // Do not use authorize, return a noop middleware
    if (!this.isInit) return (q, s, n) => n()
    // Resolving arguments
    if (typeof strategy === 'object') {
      callback = options
      options = strategy
      strategy = null
    }
    let auth = null
    // Check from authorize list
    if (!this._util.isEmpty(this.authorizeList))
      auth = this.authorizeList[strategy || this.defaultAuthorize]
    // Auth from list or fallback to passport
    if (auth)
      return passport.authenticate(
        auth[0], auth[1], auth[2])
    else
      return passport.authenticate(
        strategy || this.defaultAuthorize, options, callback)
  }

  /**
   * Passport proxies and overrides
   * 
   * n = name, s = strategy, w = framework, o = options
   * c = callback, f = function, r = request, d = done
   */

  // Override
  initialize = (o) => {
    this.isInit = true
    return passport.initialize(o)
  }

  // Proxy
  session = (o) => passport.session(o)
  use = (n, s) => passport.use(n, s)
  unuse = (n) => passport.unuse(n)
  framework = (w) => passport.framework(w)
  serializeUser = (f, r, d) => passport.serializeUser(f, r, d)
  deserializeUser = (f, r, d) => passport.deserializeUser(f, r, d)
  transformAuthInfo = (f, r, d) => passport.transformAuthInfo(f, r, d)

  // Might not need to proxy these
  // authorize = (s, o, c) => passport.authorize(s, o, c)
  // authenticate = (s, o, c) => passport.authenticate(s, o, c)

}