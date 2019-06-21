import path from 'path'
import express from 'express'
import callsite from 'callsite'
import { Builder as BaseBuilder } from 'jservice'
import Config from './services/config'
import Server from './services/server'
import Provider from './provider'

class Builder extends BaseBuilder {

  path = null
  provider = null
  configService = null

  build(registry, configure) {
    this.path = path.dirname(callsite()[1].getFileName())
    super.build(registry)
    this.collection.addSingleton(Config)
    this.collection.addSingleton(Server)
    this.provider = this.createProvider(true)
    this.configService = this.provider.getService('$config')
    const serverService = this.provider.getService('$server')
    serverService.init()
    if (typeof configure === 'function') {
      configure(serverService.app)
    }
    return this
  }

  createProvider(isSingleton) {
    return new Provider(this.collection, this.configService, isSingleton)
  }

}

function core() {
  return new Builder()
}

export default core
export {
  core,
  express
}