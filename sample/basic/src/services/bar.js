
export default class Bar {
  static service = 'bar'


  static api(apiRouter) {

    apiRouter.get('/test', (req, res, next) => {
      req.service('foo') // singleton
      req.service('yoo') // transient
      // res.jsonError().badRequest()
      next()
    })

    apiRouter.get('/test', (req, res) => {
      // req.service('foo') // singleton
      // const yoo = req.service('yoo') // transient
      // res.jsonError().badRequest()
      res.json({ a: 1 })
    })

  }

  static page(pageRouter) {
    pageRouter.get('/page', (req, res) => {
      res.send('page')
    })
  }

}
