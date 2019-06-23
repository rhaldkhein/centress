import core from '../../../build'
import { configureServices, configure } from './startup'

// import './controllers/home'

const app = core()

app
  .build(
    configureServices,
    configure
  )
  .start()