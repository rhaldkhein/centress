import { get } from '../../../../build/test'

export default class Home {

  @get('/hello')
  hello(req, res) {

  }

  @get('/world')
  world(req, res) {

  }

}