
exports = module.exports = Foo

function Foo(p, c) {

  const core = p.get('$core')

  console.log('A', core.path)

  this.api = apiRouter => {
    apiRouter.get('/bar', (req, res) => {
      res.send('Bazz')
    })
  }

}

exports.service = 'foo'