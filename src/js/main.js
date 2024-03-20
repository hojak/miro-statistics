/* global miro */

const MiroMainRegistrator = require('./MiroMainRegistrator')

window.onload = function () {
  // without "new", this line fails in the browser...
  // eslint-disable-next-line no-new
  new MiroMainRegistrator(miro)
}
