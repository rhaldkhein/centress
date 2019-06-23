
export function get(value) {
  return function (target) {
    // descriptor.enumerable = value
    console.log('A', value, target)
  }
}

export function api(value) {
  return function (target) {
    // descriptor.enumerable = value
    console.log('B', value, target)
  }
}