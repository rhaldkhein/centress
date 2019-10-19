
export default class Baz {
  static service = 'baz'

  static api(apiRouter) {
    apiRouter.get('/test', (req, res, next) => {
      next()
    })
  }

}
