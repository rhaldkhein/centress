const prod = process.env.NODE_ENV === 'production'

export class AppError extends Error {

  constructor(
    payload,
    meta,
    message = 'Something went wrong',
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

export function badRequest(payload, meta, msg = 'Bad request') {
  return new AppError(payload, meta, msg, 400, 'BAD_REQUEST')
}

export function unauthorized(payload, meta, msg = 'Not authorized') {
  return new AppError(payload, meta, msg, 401, 'UNAUTHORIZED')
}

export function forbidden(payload, meta, msg = 'Not allowed') {
  return new AppError(payload, meta, msg, 403, 'FORBIDDEN')
}

export function notFound(payload, meta, msg = 'Not found') {
  return new AppError(payload, meta, msg, 404, 'NOT_FOUND')
}

export function conflict(payload, meta, msg = 'Conflict') {
  return new AppError(payload, meta, msg, 409, 'CONFLICT')
}

export function alreadyExists(payload, meta, msg = 'Already exists') {
  return conflict(payload, meta, msg)
}

export function validation(payload, meta, msg = 'Validation') {
  return new AppError(payload, meta, msg, 400, 'VALIDATION')
}

// 500

export function internal(payload, meta, msg = 'Internal') {
  return new AppError(payload, meta, msg, 500, 'INTERNAL')
}

export function notImplemented(payload, meta, msg = 'Not implemented') {
  return new AppError(payload, meta, msg, 501, 'NOT_IMPLEMENTED')
}

export function unavailable(payload, meta, msg = 'Unavailable') {
  return new AppError(payload, meta, msg, 503, 'UNAVAILABLE')
}

export function invalidArguments(payload, meta, msg = 'Invalid arguments') {
  return new AppError(payload, meta, msg, 500, 'INVALID_ARGUMENTS')
}
