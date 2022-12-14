import { Middleware } from 'webpack-dev-server';
import { join, isAbsolute, normalize, extname, resolve } from 'path'
import { Compiler, NormalModule } from 'webpack'
import { readFileSync } from 'fs'

const pluginName = 'InterceptorPlugin'

export class Interceptor {
    private readonly options
    constructor({ input = 'src/index', mockDir = './src/mock' } = {}) {
        this.options = { input, mockDir, }
    }
    apply(compiler: Compiler) {
        if (process.env.NODE_ENV === 'production') {
            return
        }
        compiler.hooks.compilation.tap(pluginName, compilation => {
            if (NormalModule?.getCompilationHooks) {
                NormalModule.getCompilationHooks(compilation).beforeLoaders.tap(pluginName, (_, normalModule) => {
                    this._injectHandle(normalModule)
                })
            } else {
                compilation.hooks.normalModuleLoader.tap(pluginName, (_, normalModule) => {
                    this._injectHandle(normalModule)
                })
            }
        })
    }
    private _injectHandle(normalModule: NormalModule) {
        let id = normalize(normalModule.userRequest)
        let input = this.options.input
        input = normalize(input)
        input = isAbsolute(input) ? input : join(process.cwd(), input)

        if (! extname(input)) {
            const exts = ['.tsx', '.ts', '.jsx', '.mjs', '.js']
            for(let ext of exts) {
                if (input + ext === id) {
                    normalModule.loaders.unshift({
                        loader: require.resolve('./scripts/loader.js'),
                        options: {
                            mockDir: this.options.mockDir,
                            input: id,
                        }
                    } as any)
                }
            }
        } else if (input === id) {
            normalModule.loaders.unshift({
                loader: require.resolve('./scripts/loader.js'),
                options: {
                    mockDir: this.options.mockDir,
                    input: id,
                }
            } as any)
        }
    }
}

export const middleware: Middleware = {
    name: 'dev-server-middleware-interceptor',
    middleware: (req: any, res: any, next: any) => {
        if (req.url === '/sw000.js') {
            const scriptText = readFileSync(resolve(__dirname, './scripts/sw000.js'))
            res.set({
                    'Content-Type': 'application/javascript'
                })
                .status(200)
                .send(scriptText)
        } else {
            next()
        }
    }
}