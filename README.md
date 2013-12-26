# gulp-component

> Component builder plugin for gulp

## Usage

``` js
var gulp = require('gulp'),
    component = require('gulp-component')

gulp.task('component', function () {
    gulp.src('./component.json')
        .pipe(component({
            standalone: true   
        }))
        .pipe(gulp.dest('./build'))
})
```

## API

### component([options])

#### options.name
Type: `String`
Default: `build`

The filename for built files.

#### options.only
Type: `String` or `Array`
Default: `undefined`

Build only certain types of assets. Available asset types are: `scripts`, `styles`, `images`, `fonts`, `files`.

#### options.configure(builder)
Type: `Function`
Default: `undefined`

A function to add custom configurations to the builder.

#### options.standalone
Type: `Boolean` or `String`
Default: `false`

Wrap the built js code with a UMD wrapper. If it's a string, it will be used to expose the component on the `this` context.

#### options.out
Type: `String`
Default: `build`

The directory to link/copy assets (`images`, `fonts` and `files`) to.

#### options.copy
Type: `Boolean`
Default: `false`

Copy assets instead of linking.

#### options.use
Type: `Array`
Default: `undefined`

An array of plugins/functions to be used by the builder.

#### options.ignore
Type: `Array`
Default: `undefined`

An array of component dependencies to ignore.

#### options.dev
Type: `Boolean`
Default: `false`

Include dev dependencies and add source urls.

#### options.prefix
Type: `String`
Default: `undefined`

Prefix css asset urls.

#### options.noRequire
Type: `Boolean`
Default: `false`

Exclude require from build. Ignored when `options.standalone` is truthy.

### component.scripts([options])

Alias for `component({ only: 'scripts' })

### component.styles([options])

Alias for `component({ only: 'styles' })