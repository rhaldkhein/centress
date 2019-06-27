import passport from 'passport'
import debug from 'debug'
import './express'

const debugAuth = debug('excore:authentication')

if (passport.default)
  throw new Error('Can\'t add default to passport')

export default class Authentication {
  static service = '@authentication'

  default = null

  constructor(provider, configure) {
    if (configure) configure(passport)
    this.default = passport.default
    debugAuth('created')
  }

  initialize() {
    return passport.initialize()
  }

  session() {
    return passport.session()
  }

  // Override passport
  authenticate(strategy, options) {
    if (typeof strategy === 'object') {
      options = strategy
      strategy = null
    }
    return passport.authenticate(strategy || this.default, options)
  }

}