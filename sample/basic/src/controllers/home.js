import { api, get, page, authorize } from '../../../../build/common'

@authorize()
@page('home')
class Home {

  @get('hello')
  hello(req, res) {
    res.send('hello world')
  }

  @get('world')
  world(req, res) {

  }

}

export default Home