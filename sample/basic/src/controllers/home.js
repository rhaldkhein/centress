import { get, post, page, authorize } from '../../../../build/common'

@authorize()
@page('home')
class Home {

  @authorize.disable()
  @get('open')
  open(req, res) {
    res.send('open route for ' + req.user.name)
  }

  @get('closed')
  closed(req, res) {
    res.send('closed route for ' + req.user.name)
  }

}

export default Home