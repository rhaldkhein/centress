
export default class Foo {
  static service = 'foo'

  api(apiRouter) {
    apiRouter.get('/test', (req, res, next) => {
      next()
    })
  }

}
