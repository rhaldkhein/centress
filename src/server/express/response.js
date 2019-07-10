import { response } from 'express'
import HttpError from '../error'

if (response.jsonError)
  throw new Error('Can\'t bind jsonError to response')

response.jsonError = function () {
  return new HttpError(this)
}

if (response.jsonSuccess)
  throw new Error('Can\'t bind jsonSuccess to response')

response.jsonSuccess = function (payload, opt) {
  this.status(200)
    .json({
      success: {
        code: (opt && opt.code) || 'OK'
      },
      meta: opt && opt.meta,
      payload
    })
}