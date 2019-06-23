import debug from 'debug'

const debugDecor = debug('excore:decorator')

let server, apiRouter, pageRouter

debugDecor('context')

export function init(_server, _apiRouter, _pageRouter) {
  server = _server
  apiRouter = _apiRouter
  pageRouter = _pageRouter
  debugDecor('init')
}

export function get(value) {
  debugDecor('get')
  return function (target) {
    debugDecor('attach get', value)
    // descriptor.enumerable = value
    // console.log('A', value, target)
    // console.log(apiRouter);
    apiRouter.get(value, target.descriptor.value)
  }
}

export function api(value) {
  return function (target) {
    // descriptor.enumerable = value
    // console.log('B', value, target)
  }
}