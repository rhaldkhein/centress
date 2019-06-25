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
  methods = {}
  classes = {}
}
clean()

let classes
let methods

function push(holder, name, target, args) {
  if (!holder[name]) holder[name] = []
  target.args = args
  holder[name].push(target)
}

/**
 * Register new annotations below
 */

// METHODS

export function get(...args) {
  return function (target) {
    if (target.kind !== 'method') return
    push(methods, 'get', target, args)
  }
}

export function put(...args) {
  return function (target) {
    if (target.kind !== 'method') return
    push(methods, 'put', target, args)
  }
}

export function post(...args) {
  return function (target) {
    if (target.kind !== 'method') return
    push(methods, 'post', target, args)
  }
}

export function del(...args) {
  return function (target) {
    if (target.kind !== 'method') return
    push(methods, 'delete', target, args)
  }
}

// CLASSES

export function api(...args) {
  return function (target) {
    if (target.kind !== 'class') return
    push(classes, 'api', target, args)
  }
}

export function page(...args) {
  return function (target) {
    if (target.kind !== 'class') return
    push(classes, 'page', target, args)
  }
}
