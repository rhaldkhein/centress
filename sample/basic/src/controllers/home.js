import { get, page } from '../../../../controller'

// @authorize()
@page('index')
class Home {

  @get('index')
  closed(req, res) {
    res.send('closed route')
  }

}

export default Home
