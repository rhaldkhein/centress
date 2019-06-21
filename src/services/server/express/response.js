import { response } from 'express'
import HttpError from '../error'

response.jsonError = function () {
  return new HttpError(this)
}

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