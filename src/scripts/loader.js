const path = require('path')
const fs = require('fs')

module.exports = function handle(source) {
    const options = this.getOptions ? this.getOptions() : this.query
    const mockDir = path.normalize(path.resolve(options.mockDir))
    const destDir = path.relative(path.dirname(options.input), mockDir).replace(/\\/g, '/')
    if (! fs.existsSync(mockDir)) {
        console.log('[warn]: mockDir not exist', mockDir)
        return source
    }
    const scriptText = fs.readFileSync(path.resolve(__dirname, './inject.js')).toString()
    return `

// #region webpack-plugin-interceptor generate
// @ts-nocheck
const __require_context__ = require.context('./${destDir}', true, /\.(t|j)s$/)
const __moduleMap__ = {}
__require_context__.keys().forEach((key) => {
    __moduleMap__[key] = __require_context__(key)
})
${scriptText}
// @ts-check
// #endregion

${source}
`.trim()
}


