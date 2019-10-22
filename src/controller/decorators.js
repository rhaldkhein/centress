export function _flush() {
  // return compiled methods
  // clean for next controller
  const _methods = methods
  const _klass = klass
  clean()
  return {
    methods: _methods,
    klass: _klass
  }
}
function clean() {
  methods = {}
  klass = {}
}
clean()

let klass
let methods

function decor(target, key, args) {
  if (!target) {
    // For class, loop through methods and add key and args
    for (const prop in methods) {
      if (methods.hasOwnProperty(prop))
        methods[prop][key] = args
    }
    return
  } else {
    // For methods
    let des = methods[target.key]
    if (!des) methods[target.key] = des = {
      value: target.descriptor.value,
      name: target.key
    }
    return des
  }
}

/**
 * Register new annotations below
 */

// CLASSES

export function api(...args) {
  return function (target) {
    if (target.kind !== 'class') return
    decor(null, 'api', args)
  }
}

export function page(...args) {
  return function (target) {
    if (target.kind !== 'class') return
    decor(null, 'page', args)
  }
}

export function authorize(...args) {
  return function (target) {
    if (target.kind === 'class')
      decor(null, 'auth', args)
    else if (target.kind === 'method')
      decor(target).authMethod = args
  }
}

// METHODS

function forMethod(fn) {
  return function (target) {
    if (target.kind !== 'method') return
    fn(decor(target))
  }
}

export function before(...args) {
  return forMethod(decor => decor.middleware = args)
}

export function get(...args) {
  return forMethod(decor => decor.httpGet = args)
}

export function put(...args) {
  return forMethod(decor => decor.httpPut = args)
}

export function post(...args) {
  return forMethod(decor => decor.httpPost = args)
}

export function del(...args) {
  return forMethod(decor => decor.httpDelete = args)
}

export function patch(...args) {
  return forMethod(decor => decor.httpPatch = args)
}
