const prod = process.env.NODE_ENV === 'production'

export class AppError extends Error {

  constructor(
    payload,
    meta,
    message = 'Internal',
    status = 500,
    code = 'INTERNAL') {
    super(message)
    this.code = code
    this.status = status
    this.payload = payload
    this.meta = meta
  }

  send(res) {
    res.status(this.status).json({
      error: {
        code: this.code,
        message: prod ? null : this.message
      },
      meta: this.meta,
      payload: this.payload
    })
  }

}

// 400

export function badRequest(msg = 'Bad request', payload, meta) {
  return new AppError(payload, meta, msg, 400, 'BAD_REQUEST')
}

export function unauthorized(msg = 'Not authorized', payload, meta) {
  return new AppError(payload, meta, msg, 401, 'UNAUTHORIZED')
}

export function forbidden(msg = 'Not allowed', payload, meta) {
  return new AppError(payload, meta, msg, 403, 'FORBIDDEN')
}

export function notFound(msg = 'Not found', payload, meta) {
  return new AppError(payload, meta, msg, 404, 'NOT_FOUND')
}

export function conflict(msg = 'Conflict', payload, meta) {
  return new AppError(payload, meta, msg, 409, 'CONFLICT')
}

export function alreadyExists(msg = 'Already exists', payload, meta) {
  return conflict(payload, meta, msg)
}

export function validation(msg = 'Validation', payload, meta) {
  return new AppError(payload, meta, msg, 400, 'VALIDATION')
}

// 500

export function internal(msg = 'Internal', payload, meta) {
  return new AppError(payload, meta, msg, 500, 'INTERNAL')
}

export function notImplemented(msg = 'Not implemented', payload, meta) {
  return new AppError(payload, meta, msg, 501, 'NOT_IMPLEMENTED')
}

export function unavailable(msg = 'Unavailable', payload, meta) {
  return new AppError(payload, meta, msg, 503, 'UNAVAILABLE')
}

export function invalidArguments(msg = 'Invalid arguments', payload, meta) {
  return new AppError(payload, meta, msg, 500, 'INVALID_ARGUMENTS')
}
