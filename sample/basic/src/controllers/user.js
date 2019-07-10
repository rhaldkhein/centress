import { page, get, api, post, authorize } from '../../../../build/controller'

@authorize()
@page('user') // 5
// @api('user') // 4
class User {

  @post('world') // 1
  world(req, res) {
    res.jsonSuccess({ world: 'post' })
  }

  @authorize(false)
  @get('hello') // 2
  hello(req, res) {
    res.jsonSuccess({ hello: 'get' })
  }

}

export default User