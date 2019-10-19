import { get, page, authorize } from '../../../../controller'

// @authorize()
@page('index')
class Home {

  @authorize(false)
  @get('open')
  open(req, res) {
    req.service('yoo')
    res.jsonSuccess('open route')
  }

  @get('index')
  closed(req, res) {
    res.send('closed route')
  }

}

export default Home
