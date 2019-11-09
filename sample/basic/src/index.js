import core from '../../../index'
import { configureServices, configureApplication } from './startup'

const app = core()

app.configure(
  configureServices,
  configureApplication
).on('start', prov => {
  prov.get('@server').listen()
}).start()