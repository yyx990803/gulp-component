var es         = require('event-stream'),
    path       = require('path'),
    Builder    = require('component-builder'),
    template   = require('fs').readFileSync(__dirname + '/template.js', 'utf-8'),
    templateRE = /{{(.+?)}}/g

function useOptions (builder, opt) {
    if (opt.dev) {
        builder.development()
    }
    // use plugins
    if (opt.use) {
        opt.use.forEach(function (plugin) {
            builder.use(plugin)
        })
    }
    // add lookup paths
    if (opt.paths) {
        opt.paths.forEach(function (p) {
            builder.addLookup(p)
        })
    }
    // add ignores
    if (opt.ignore) {
        opt.ignore.forEach(function (dep) {
            builder.ignore(dep)
        })
    }
}

function ignoreType (builder, type) {
    delete builder.config[type]
    if (builder.config.dependencies) {
        builder.config.dependencies.forEach(function (dep) {
            builder.ignore(dep, type)
        })
    }
}

exports.scripts = function (opt) {

    opt = opt || {}

    return es.map(function (file, cb) {

        var builder = new Builder(file.base),
            filename = opt.name || 'build'

        ignoreType(builder, 'styles')
        useOptions(builder, opt)

        builder.build(function (err, obj) {

            if (err) return cb(err)
            file.path = file.base + filename + '.js'

            var output
            if (opt.standalone) {
                obj.configName = builder.config.name
                obj.standaloneName = typeof opt.standalone === 'string'
                    ? opt.standalone
                    : builder.config.name
                output = template.replace(templateRE, function (m, p1) {
                    return obj[p1]
                })
            } else {
                output = opt.noRequire
                    ? obj.js
                    : obj.require + obj.js
            }
            file.contents = new Buffer(output)
            cb(null, file)
        })
    })
}

exports.styles = function (opt) {

    opt = opt || {}

    return es.map(function (file, cb) {

        var builder = new Builder(file.base),
            filename = opt.name || 'build'

        ignoreType(builder, 'scripts')
        useOptions(builder, opt)

        builder.build(function (err, obj) {
            if (err) return cb(err)
            file.path = file.base + filename + '.css'
            file.contents = new Buffer(obj.css)
            cb(null, file)
        })
    })
}