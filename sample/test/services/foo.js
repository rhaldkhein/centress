
exports = module.exports = Foo

function Foo(p, c) {

  console.log('foo', c)

  this.api = apiRouter => {
    apiRouter.get('/test', (req, res, next) => {
      next()
    })
  }

}

exports.service = 'foo'