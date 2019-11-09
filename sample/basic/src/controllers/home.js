import { get, page } from '../../../../controller'
import { forbidden } from '../../../../error'

// @authorize()
@page('index')
class Home {

  @get('index')
  closed(req, res) {
    // res.send('closed route')
    res.jsonError(forbidden())
  }

}

export default Home
