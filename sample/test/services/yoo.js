
exports = module.exports = Yoo

function Yoo(p, c) {

  console.log('yoo', c)
  p.getService('baz')

  this.api = apiRouter => {
    apiRouter.get('/test', (req, res, next) => {
      next()
    })
  }

}

exports.service = 'yoo'