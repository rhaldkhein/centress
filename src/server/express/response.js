import { response } from 'express'
import { AppError } from '../error'
const prod = process.env.NODE_ENV === 'production'

if (
  'jsonError' in response ||
  'jsonSuccess' in response
) throw new Error('Not compatible with express')

response.jsonError = function (error) {
  if (!error) error = new AppError()
  if (!(error instanceof AppError)) {
    error = new AppError(
      error.payload || error.details || (prod ? undefined : error.stack),
      error.meta,
      error.message,
      error.status,
      error.code
    )
  }
  error.send(this)
}

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