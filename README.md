# gulp-component

> Component builder plugin for gulp

## Usage

Script and styles are split into different tasks.

``` js
var gulp = require('gulp'),
    component = require('gulp-component')

gulp.task('scripts', function () {
    gulp.src('./component.json')
        .pipe(component.scripts({
            standalone: 'Vue'
        }))
        .pipe(gulp.dest('./build'))
})

gulp.task('styles', function () {
    gulp.src('./component.json')
        .pipe(component.styles())
        .pipe(gulp.dest('./build'))
})

gulp.task('default', function () {
    gulp.run('scripts', 'styles')
})

gulp.task('watch', function () {
    gulp.watch('./src/**/*.js', function () {
        gulp.run('scripts')
    })
    gulp.watch('./css/**/*.css', function () {
        gulp.run('styles')
    })
})
```

## API

### `component.scripts(options)` or `component.styles(options)`

#### options.dev

#### options.paths

#### options.use

#### options.ignore

#### options.standalone

#### options.noRequire