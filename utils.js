class Utils {
  constructor() { }

  isNum(str) {
    if (typeof str != "string") return false
    return !isNaN(str) && !isNaN(parseFloat(str))
  }

}

module.exports = Utils