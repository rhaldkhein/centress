import { page, get, api, post } from '../../../../build/common'

@page('user') // 5
@api('user') // 4
class User {

  @post('world') // 1
  world(req, res) {
    res.jsonSuccess({ world: 'post' })
  }

  @get('foo') // 3
  @get('hello') // 2
  hello(req, res) {
    res.jsonSuccess({ hello: 'get' })
  }

}

export default User