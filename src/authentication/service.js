import passport from 'passport'
import debug from 'debug'
import './express'

const debugAuth = debug('excore:authentication')

const isEmpty = obj => [Object, Array]
  .includes((obj || {}).constructor) &&
  !Object.entries((obj || {})).length

export default class Authentication {
  static service = '@authentication'

  authorizeList = {}
  defaultAuthorize = null
  isInit = false

  constructor(provider, configure) {
    if (configure) configure(this)
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
    let auth = null
    // Check from authorize list
    if (!isEmpty(this.authorizeList))
      auth = this.authorizeList[strategy || this.defaultAuthorize]
    // Auth from list or fallback to passport
    if (auth) {
      if (typeof auth[0] === 'function') return auth[0](passport)
      return passport.authenticate(auth[0], auth[1], auth[2])
    } else {
      return passport.authenticate(
        strategy || this.defaultAuthorize,
        options,
        callback
      )
    }
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