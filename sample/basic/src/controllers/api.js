import { get, api } from '../../../../controller'
import { notImplemented } from '../../../../error'

// @authorize()
@api('test')
class Home {

  @get('index')
  closed(req, res) {
    // res.send('closed route')
    res.jsonError(notImplemented())
  }

}

export default Home
