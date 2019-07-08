
export default class Baz {
  static service = 'baz'

  api(apiRouter) {
    apiRouter.get('/test', (req, res, next) => {
      next()
    })
  }

}
