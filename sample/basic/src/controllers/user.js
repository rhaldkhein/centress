import { page, get, api, post, authorize } from '../../../../controller'

@authorize()
@page('user') // 5
// @api('user') // 4
class User {

  @authorize(false)
  @get('index')
  closed(req, res) {
    req.service('bar')
    res.send('user index')
  }

  @post('world') // 1
  world(req, res) {
    res.jsonSuccess({ world: 'post' })
  }

  // @authorize(false)
  @get('hello') // 2
  hello(req, res) {
    res.jsonSuccess({ hello: 'get' })
  }

}

export default User
