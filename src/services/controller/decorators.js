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
    if (!des) methods[target.key] = des = { value: target.descriptor.value }
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
    if (target.kind !== 'class') return
    decor(null, 'auth', args)
  }
}


// METHODS

authorize.off = function (...args) {
  return function (target) {
    if (target.kind !== 'method') return
    decor(target).authOff = args
  }
}

export function get(...args) {
  return function (target) {
    if (target.kind !== 'method') return
    decor(target).httpGet = args
  }
}

export function put(...args) {
  return function (target) {
    if (target.kind !== 'method') return
    decor(target).httpPut = args
  }
}

export function post(...args) {
  return function (target) {
    if (target.kind !== 'method') return
    decor(target).httpPost = args
  }
}

export function del(...args) {
  return function (target) {
    if (target.kind !== 'method') return
    decor(target).httpDelete = args
  }
}

export function patch(...args) {
  return function (target) {
    if (target.kind !== 'method') return
    decor(target).httpPatch = args
  }
}