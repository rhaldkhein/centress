import core from '../../../build'
import { configureServices, configure } from './startup'

const app = core()

app
  .build(
    configureServices,
    configure
  )
  .start()