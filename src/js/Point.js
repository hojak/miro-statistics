class Point {
  constructor (x, y) {
    if (isNaN(x) || isNaN(y) || x == null || y == null) {
      throw new TypeError('not a number')
    }

    this.x = x
    this.y = y
  }

  get X () { return this.x }
  get Y () { return this.y }
}

module.exports = Point
