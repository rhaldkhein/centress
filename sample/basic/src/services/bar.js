
export default class Bar {
  static service = 'bar'

  api(apiRouter) {

    apiRouter.get('/test', (req, res, next) => {
      req.service('foo') // singleton
      req.service('yoo') // transient
      // res.jsonError().badRequest()
      next()
    })

    apiRouter.get('/test', (req, res) => {
      req.service('foo') // singleton
      req.service('yoo') // transient
      res.jsonError().badRequest()
    })

  }

  page(pageRouter) {
    pageRouter.get('/page', (req, res) => {
      res.send('page')
    })
  }

}
