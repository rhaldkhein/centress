import { application as app } from 'express'
import path from 'path'

if (app.useControllers)
  throw new Error('Not compatible with express')

app.useControllers = function (config) {
  config = config || { paths: ['./controllers'] }
  if (typeof config === 'string') config = { paths: [config] }
  const paths = config.paths
  const core = this.$provider.service('__core__')
  const controller = this.$provider.service('@controller')
  controller.mountPaths(paths.map(p => path.resolve(core.path, p)))
}
