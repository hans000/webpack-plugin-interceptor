const path = require('path')
const fs = require('fs')

module.exports = function handle(source) {
    const options = this.getOptions()
    const mockDir = path.normalize(path.resolve(options.mockDir))
    const destDir = path.relative(path.dirname(options.input), mockDir).replace(/\\/g, '/')
    if (! fs.existsSync(mockDir)) {
        return source
    }
    const scriptText = fs.readFileSync(path.resolve(__dirname, './inject.js')).toString()
    return `

// #region webpack-plugin-interceptor generate
// @ts-nocheck
const context = require.context('./${destDir}', true, /\.(t|j)s$/)
const __moduleMap__ = {}
context.keys().forEach((key) => {
    __moduleMap__[key] = context(key)
})
${scriptText}
// @ts-check
// #endregion

${source}
`.trim()
}


