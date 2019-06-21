
exports = module.exports = Bar

function Bar(p) {

  // p.getService('yoo')

  this.api = apiRouter => {
    apiRouter.get('/test', (req, res) => {
      req.provider.getService('foo')
      req.provider.getService('yoo')
      res.jsonError().badRequest()
    })
  }

  this.page = pageRouter => {
    pageRouter.get('/page', (req, res) => {
      res.send('page')
    })
  }

}

exports.service = 'bar'