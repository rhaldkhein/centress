
export default class Yoo {
  static service = 'yoo'

  greet = 'Hi! This is Yoo.'

  static api(apiRouter) {
    apiRouter.get('/test', (req, res) => {
      res.sendJson({ foo: 1 })
      // next()
    })
  }

}
