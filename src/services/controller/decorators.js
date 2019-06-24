import debug from 'debug'

const debugCtrl = debug('excore:controller')

let server, apiRouter, pageRouter

export function init(_server, _apiRouter, _pageRouter) {
  server = _server
  apiRouter = _apiRouter
  pageRouter = _pageRouter
}

export function api(value) {
  return function (target) {
    console.log(target.kind)
    if (target.kind !== 'class') return
    debugCtrl('api', value)
  }
}

export function get(value) {
  return function (target) {
    if (target.kind !== 'method') return
    console.log(target.kind)
    apiRouter.get(value, target.descriptor.value)
    debugCtrl('get', value)
  }
}
