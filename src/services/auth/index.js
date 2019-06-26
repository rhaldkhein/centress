import passport from 'passport'
import debug from 'debug'
import './express'

const debugAuth = debug('excore:auth')

export default class Authentication {
  static service = '@authentication'

  constructor(provider, opt) {
    // opt.default
    // opt.strategy
    // opt.strategies
    if (opt) {
      this.default = opt.default
      if (!Array.isArray(opt.strategies))
        opt.strategies = []
      if (opt.strategy)
        opt.strategies.push(opt.strategy)
      opt.strategies.forEach(s => passport.use(s))
      debugAuth('loaded %d strategies', opt.strategies.length)
    } else {
      debugAuth('loaded without any strategy')
    }
  }

  initialize() {
    return passport.initialize()
  }

  session() {
    return passport.session()
  }

  authenticate(strategy) {
    return passport.authenticate(strategy)
  }

}