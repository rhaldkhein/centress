
export default class {
  static service = '@util'

  isEmpty = obj => [Object, Array]
    .includes((obj || {}).constructor) &&
    !Object.entries((obj || {})).length;

}