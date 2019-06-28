import { get, post, page, api, authorize } from '../../../../build/common'

@authorize()
@api('home')
@page('home')
class Home {

  @authorize.off()
  @get('open')
  open(req, res) {
    res.send('open route')
  }

  @get('closed')
  closed(req, res) {
    res.send('closed route')
  }

}

export default Home