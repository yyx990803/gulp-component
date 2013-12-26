/* a.js */
var b = require('./b'),
    dep = require('dep')
module.exports = {
    a: 'A',
    b: b,
    c: dep
}