import { get, post, page, api, authorize } from '../../../../build/common'

@authorize()
@api('home')
class Home {

  @authorize(false)
  @get('open')
  @post('open')
  open(req, res) {
    res.jsonSuccess('open route')
  }

  @get('closed')
  closed(req, res) {
    res.send('closed route')
  }

}

export default Home