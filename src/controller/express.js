import { application as app } from 'express'

if (app.useControllers)
  throw new Error('Not compatible with express')

app.useControllers = function (options) {
  const controller = this.$provider.service('@controller')
  controller.setOptions(options)
  controller.mountControllers()
}
