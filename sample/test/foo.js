
exports = module.exports = Foo

function Foo(p, c) {

  console.log(c)

  this.api = apiRouter => {
    apiRouter.get('/bar', (req, res) => {
      res.send('Bazz')
    })
  }

}

exports.service = 'foo'