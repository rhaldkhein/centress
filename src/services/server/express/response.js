import { response } from 'express'

const prod = process.env.NODE_ENV === 'production'
const defaultCode = 'UNKNOWN_ERROR'
const defaultMsg = 'Unknown error has occured'

response.success = function (payload, opt) {
  this.status(200)
    .json({
      success: { code: opt && opt.code },
      meta: opt && opt.meta,
      payload
    })
}

response.error = function (payload, opt) {
  const code = (opt && opt.code) || payload.code || defaultCode
  const message = (opt && opt.message) || payload.message || defaultMsg
  this.status(opt.status || payload.status || 400)
    .json({
      error: { code, message: prod ? null : message },
      meta: opt && opt.meta,
      payload
    })
}

response.data = function (name, value) {
  if (!this.locals.__data) this.locals.__data = {}
  if (name) this.locals.__data[name] = value
}

response.read = function (name) {
  if (!this.locals.__data) return
  return this.locals.__data[name]
}