var fs         = require('fs'),
    path       = require('path'),
    map        = require('map-stream'),
    File       = require('vinyl'),
    Builder    = require('component-builder'),
    template   = fs.readFileSync(__dirname + '/lib/wrapper.js', 'utf-8'),
    requirejs  = fs.readFileSync(__dirname + '/lib/require.js', 'utf-8'),
    templateRE = /{{(.+?)}}/g,
    assetTypes = ['scripts', 'styles', 'images', 'fonts', 'files', 'templates', 'json']

function configure (builder, opt) {
    builder.copyAssetsTo(opt.out || 'build')
    if (opt.copy) {
        builder.copyFiles()
    }
    if (opt.dev) {
        builder.prefixUrls('./')
        builder.development()
        builder.addSourceURLs()
    }
    if (opt.prefix) {
        builder.prefixUrls(opt.prefix)
    }
    if (opt.use) {
        opt.use.forEach(function(plugin){
            builder.use(plugin)
        })
    }
    // custom configure function
    if (opt.configure) {
        opt.configure(builder)
    }
    if (opt.ignore) {
        opt.ignore.forEach(function (dep) {
            builder.ignore(dep)
        })
    }
    // ignore file types
    builder.config._ignore = {}
    if (opt.only) {
        var only = Array.isArray(opt.only)
            ? opt.only
            : [opt.only]
        assetTypes.forEach(function (type) {
            if (only.indexOf(type) === -1) {
                ignoreType(builder, opt, type)
            }
        })
    }
}

function ignoreType (builder, opt, type) {
    delete builder.config[type]
    builder.config._ignore[type] = true
    var deps = builder.config.dependencies,
        devDeps = builder.config.development
    if (deps) {
        for (var key in deps) {
            builder.ignore(key, type)
        }
    }
    if (opt.dev && devDeps) {
        for (var key in devDeps) {
            builder.ignore(key, type)
        }
    }
}

function component (opt) {

    opt = opt || {}

    var stream = map(function (file, cb) {

        var builder = new Builder(file.base),
            filename = opt.name || 'build'

        configure(builder, opt)

        builder.build(function (err, obj) {

            if (err) return cb(err)

            var js = obj.js.trim(),
                css = obj.css.trim(),
                jsFile, cssFile,
                ignored = builder.config._ignore

            if ((!ignored.scripts ||
                !ignored.templates ||
                !ignored.json) && js) {
                if (opt.standalone) {
                    obj.configName = builder.config.name
                    obj.standaloneName = typeof opt.standalone === 'string'
                        ? opt.standalone
                        : builder.config.name
                    js = template.replace(templateRE, function (m, p1) {
                        return p1 === 'require'
                            ? requirejs
                            : obj[p1] 
                    })
                } else {
                    js = opt.noRequire
                        ? js
                        : requirejs + js
                }
                if (js) {
                    jsFile = new File({
                        cwd: file.cwd,
                        base: file.base,
                        path: path.join(file.base, filename) + '.js',
                        relative: filename + '.js',
                        contents: new Buffer(js)
                    })
                }
            }

            if (!ignored.styles && css) {
                cssFile = new File({
                    cwd: file.cwd,
                    base: file.base,
                    path: path.join(file.base, filename) + '.css',
                    relative: filename + '.css',
                    contents: new Buffer(css)
                })
            }

            if (jsFile && cssFile) {
                // manually emit because we need to pipe out two files
                stream.emit('data', jsFile)
                cb(null, cssFile)
            } else {
                cb(null, jsFile || cssFile)
            }
        })
    })

    return stream
}

assetTypes.forEach(function (type) {
    component[type] = function (opt) {
        opt.only = type
        return component(opt)
    }
})

module.exports = component
