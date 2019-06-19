import path from 'path'
import express from 'express'
import callsite from 'callsite'
import { Builder as BaseBuilder } from 'jservice'
import Config from './services/config'
import Server from './services/server'
import Provider from './provider'

class Builder extends BaseBuilder {

  path = null

  build(registry, configure) {
    this.path = path.dirname(callsite()[1].getFileName())
    super.build(registry)
    this.collection.addSingleton(Config)
    this.collection.addSingleton(Server)
    this.provider = new Provider(this.collection)
    const serverService = this.provider.getService('$server')
    configure(serverService.app)
    return this
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