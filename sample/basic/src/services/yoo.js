
export default class Yoo {
  static service = 'yoo'

  api(apiRouter) {
    apiRouter.get('/test', (req, res, next) => {
      next()
    })
  }

}
