// exFAT compatibility patch: converts EISDIR to EINVAL for fs.readlink
// exFAT drives return EISDIR on readlink of regular files instead of EINVAL
// webpack/Next.js handle EINVAL (not a symlink) gracefully but crash on EISDIR
const fs = require('fs')

function patchReadlink(original) {
  return function readlink(path, options, callback) {
    if (typeof options === 'function') { callback = options; options = {} }
    original.call(this, path, options, (err, link) => {
      if (err && err.code === 'EISDIR') {
        const fixed = Object.assign(
          new Error(`EINVAL: invalid argument, readlink '${path}'`),
          { code: 'EINVAL', syscall: 'readlink', path }
        )
        return callback(fixed)
      }
      callback(err, link)
    })
  }
}

function patchReadlinkSync(original) {
  return function readlinkSync(path, options) {
    try {
      return original.call(this, path, options)
    } catch (err) {
      if (err && err.code === 'EISDIR') {
        const fixed = Object.assign(
          new Error(`EINVAL: invalid argument, readlink '${path}'`),
          { code: 'EINVAL', syscall: 'readlink', path }
        )
        throw fixed
      }
      throw err
    }
  }
}

fs.readlink = patchReadlink(fs.readlink)
fs.readlinkSync = patchReadlinkSync(fs.readlinkSync)
