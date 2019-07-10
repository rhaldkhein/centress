
export default class Yoo {
  static service = 'yoo'

  greet = 'Hi! This is Yoo.'

  api(apiRouter) {
    apiRouter.get('/test', (req, res, next) => {
      next()
    })
  }

}
