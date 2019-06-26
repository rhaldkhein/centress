import { application as app } from 'express'

app.useAuthentication = function (config) {
  const auth = this.$provider.getService('@authentication')
  this.use(auth.initialize())
  if (config && config.session) this.use(auth.session())
}