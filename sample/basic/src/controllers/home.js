import { api, get } from '../../../../build/common'

@api()
class Home {

  @get('/hello')
  hello(req, res) {
    res.jsonSuccess('hello world')
  }

  @get('/world')
  world(req, res) {

  }

}

export default Home