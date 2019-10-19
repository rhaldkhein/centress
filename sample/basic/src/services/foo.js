
export default class Foo {
  static service = 'foo'

  static api(apiRouter) {
    apiRouter.get('/test', (req, res, next) => {
      next()
    })
  }

}
