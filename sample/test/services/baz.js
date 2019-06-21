
exports = module.exports = Baz

function Baz(p, c) {

  console.log('baz', c)

  this.api = apiRouter => {
    apiRouter.get('/test', (req, res, next) => {
      next()
    })
  }

}

exports.service = 'baz'