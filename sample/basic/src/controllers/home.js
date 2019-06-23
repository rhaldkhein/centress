import { get } from '../../../../build/common'

export default class Home {

  @get('/hello')
  hello(req, res) {
    console.log('X')
    res.send('hello world')
  }

  @get('/world')
  world(req, res) {

  }

}