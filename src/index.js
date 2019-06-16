import Builder from 'jservice'
import Config from './services/config'

class Centress extends Builder {

  build(registry) {
    this.collection.addSingleton(Config)
    return super.build(registry)
  }

}

export default Centress
export { Centress }