const prod = process.env.NODE_ENV === 'production'
const defaultCode = 'INTERNAL_ERROR'
const defaultMessage = 'Something went wrong'
const defaultStatus = 500

export default class HttpError extends Error {

  code = defaultCode
  status = defaultStatus

  constructor(res) {
    super(defaultMessage)
    this.res = res
  }

  send(opt) {
    if (typeof opt === 'string') opt = { message: opt }
    else opt = opt || {}
    if (opt.message) this.message = opt.message
    if (opt.status) this.status = opt.status
    if (opt.code) this.code = opt.code
    if (opt.payload) this.payload = opt.payload
    if (opt.meta) this.meta = opt.meta
    this.res.status(this.status)
      .json({
        error: {
          code: this.code,
          message: prod ? null : this.message
        },
        meta: this.meta,
        payload: this.payload
      })
  }

  // 400
  badRequest(o) {
    this.status = 400
    this.code = 'BAD_REQUEST'
    this.message = 'Something is wrong with the request'
    this.send(o)
  }

  unauthorized(o) {
    this.status = 401
    this.code = 'UNAUTHORIZED'
    this.message = 'A valid authentication is required'
    this.send(o)
  }

  forbidden(o) {
    this.status = 403
    this.code = 'FORBIDDEN'
    this.message = 'Client is not allowed to request'
    this.send(o)
  }

  notFound(o) {
    this.status = 404
    this.code = 'NOT_FOUND'
    this.message = 'Did not find anything matching the request'
    this.send(o)
  }

  conflict(o) {
    this.status = 409
    this.code = 'CONFLICT'
    this.message = 'Could not be completed due to a conflict'
    this.send(o)
  }

  validation(o) {
    this.status = 400
    this.code = 'VALIDATION'
    this.message = 'The form contains invalid fields'
    this.send(o)
  }

  // 500
  internal(o) {
    this.status = defaultStatus
    this.code = defaultCode
    this.message = defaultMessage
    this.send(o)
  }

  unavailable(o) {
    this.status = 503
    this.code = 'UNAVAILABLE'
    this.message = 'Request is currently unavailable'
    this.send(o)
  }

  notImplemented(o) {
    this.status = 501
    this.code = 'NOT_IMPLEMENTED'
    this.message = 'Functionality not supported yet'
    this.send(o)
  }

}
