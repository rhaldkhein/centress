
export default class Bar {
  static service = 'bar'

  api(apiRouter) {

    apiRouter.get('/test', (req, res, next) => {
      req.provider.getService('foo') // singleton
      req.provider.getService('yoo') // transient
      // res.jsonError().badRequest()
      next()
    })

    apiRouter.get('/test', (req, res) => {
      req.provider.getService('foo') // singleton
      req.provider.getService('yoo') // transient
      res.jsonError().badRequest()
    })

  }

  page(pageRouter) {
    pageRouter.get('/page', (req, res) => {
      res.send('page')
    })
  }

}
