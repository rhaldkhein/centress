import { application as app } from 'express'

if (app.useAuthentication)
  throw new Error('Can\'t bind useAuthentication to express')

app.useAuthentication = function (config) {
  const auth = this.$provider.service('@authentication')
  this.use(auth.initialize(config && config.initializeOptions))
  if (config && config.session)
    this.use(auth.session(config.sessionOptions))
}