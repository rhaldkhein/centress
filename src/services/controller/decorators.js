// console.log('C', target.elements[0].descriptor.value === m1.descriptor.value)
// console.log('C', target.elements[1].descriptor.value === m1.descriptor.value)

export const _httpMethods = ['get', 'put', 'post', 'delete']
export const _httpClasses = ['api', 'page']

export function _flush() {
  // return compiled methods
  // clear for next controller
  const _methods = methods
  const _classes = classes
  clean()
  return {
    methods: _methods,
    classes: _classes
  }
}
function clean() {
  methods = []
  classes = []
}
clean()

let classes
let methods

function push(holder, target, args) {
  target.args = args
  holder.push(target)
}

/**
 * Register new annotations below
 */

// CLASSES

export function api(...args) {
  return function (target) {
    if (target.kind !== 'class') return
    target.api = true
    push(classes, target, args)
  }
}

export function page(...args) {
  return function (target) {
    if (target.kind !== 'class') return
    target.page = true
    push(classes, target, args)
  }
}

export function authorize(...args) {
  return function (target) {
    if (target.kind !== 'class') return
    target.authorize = true
    push(classes, target, args)
  }
}


// METHODS

authorize.disable = function (...args) {
  return function (target) {
    if (target.kind !== 'method') return
    target.disableAuthorize = true
    push(methods, target, args)
  }
}

export function get(...args) {
  return function (target) {
    if (target.kind !== 'method') return
    target.method = 'get'
    push(methods, target, args)
  }
}

export function put(...args) {
  return function (target) {
    if (target.kind !== 'method') return
    target.method = 'put'
    push(methods, target, args)
  }
}

export function post(...args) {
  return function (target) {
    if (target.kind !== 'method') return
    target.method = 'post'
    push(methods, target, args)
  }
}

export function del(...args) {
  return function (target) {
    if (target.kind !== 'method') return
    target.method = 'delete'
    push(methods, target, args)
  }
}