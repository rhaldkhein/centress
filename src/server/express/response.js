import { response } from 'express'
import { AppError } from '../error'

if (response.jsonError)
  throw new Error('Can\'t bind jsonError to response')

response.jsonError = function (error) {
  if (!error) error = new AppError()
  if (!(error instanceof AppError)) {
    error = new AppError(
      error.payload || error.details,
      error.meta,
      error.message,
      error.status,
      error.code
    )
  }
  error.send(this)
}

if (response.jsonSuccess)
  throw new Error('Can\'t bind jsonSuccess to response')

response.jsonSuccess = function (payload, options) {
  this.status(200)
    .json({
      success: {
        code: (options && options.code) || 'OK'
      },
      meta: options && options.meta,
      payload
    })
}