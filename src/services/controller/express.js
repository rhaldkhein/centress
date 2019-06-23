import { application as app } from 'express'
import path from 'path'

app.useControllers = function (config) {
  config = config || { paths: ['./controllers'] }
  if (typeof config === 'string') config = { paths: [config] }
  const paths = config.paths
  const core = this.$provider.getService('$core')
  const controller = this.$provider.getService('@controller')
  controller.mountPaths(paths.map(p => path.resolve(core.path, p)))
}