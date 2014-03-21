var component = require('../'),
    fs        = require('fs'),
    File      = require('vinyl'),
    should    = require('should')

describe('gulp-component', function () {

    describe('component()', function () {

        it('should output the built script', function (done) {
            testStream(component(), [
                function (file) {
                    file.path.should.equal('test/fixture/build.js')
                    shouldBeJS(file)
                },
                function (file) {
                    file.path.should.equal('test/fixture/build.css')
                    shouldBeCSS(file)
                }
            ], done)
        })

        it('option: name', function (done) {
            testStream(component({
                name: 'custom'
            }), [
                function (file) {
                    file.path.should.equal('test/fixture/custom.js')
                },
                function (file) {
                    file.path.should.equal('test/fixture/custom.css')
                }
            ], done)
        })

        it('option: only', function (done) {
            testStream(component({
                only: 'scripts'
            }), [
                function (file) {
                    file.path.should.equal('test/fixture/build.js')
                    shouldBeJS(file)
                }
            ], next)
            function next () {
                testStream(component({
                    only: ['styles']
                }), [
                    function (file) {
                        file.path.should.equal('test/fixture/build.css')
                        shouldBeCSS(file)
                    }
                ], done)
            }
        })

        it('option: standalone', function (done) {
            testStream(component.scripts({
                standalone: 'Test'
            }), [
                function (file) {
                    var contents = file.contents.toString(),
                        window = {}
                    eval(contents)
                    module.exports.a.should.equal('A')
                    module.exports.b.should.equal('B')
                    module.exports.c.should.equal('DEP')
                    // test umd exposing on `this`
                    exports = undefined
                    eval(contents)
                    should.exist(window.Test)
                    window.Test.a.should.equal('A')
                    window.Test.b.should.equal('B')
                    window.Test.c.should.equal('DEP')
                }
            ], done)
        })

    })

})

function testStream (stream, assertions, done) {
    var fileCount = 0
    stream.on('data', function (file) {
        should.exist(file)
        should.exist(file.path)
        should.exist(file.relative)
        should.exist(file.contents)
        assertions[fileCount].call(null, file)
        fileCount++
    })
    stream.once('end', function () {
        fileCount.should.equal(assertions.length)
        done()
    })
    stream.write(new File({
        path: './test/fixture/component.json',
        cwd: './test/',
        base: './test/fixture/',
        contents: fs.readFileSync('./test/fixture/component.json')
    }))
    stream.end()
}

function shouldBeJS (file, dep) {
    var contents = file.contents.toString()
    contents.should.match(/\/\* a\.js \*\//)
    contents.should.match(/\/\* b\.js \*\//)
    contents.should.match(/\/\* dep\/index\.js \*\//)
}

function shouldBeCSS (file, dep) {
    var contents = file.contents.toString()
    contents.should.match(/\/\* a\.css \*\//)
    contents.should.match(/\/\* b\.css \*\//)
    contents.should.match(/\/\* dep\/style\.css \*\//)
}