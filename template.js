;(function(){
'use strict';
{{require}}{{js}}
if (typeof exports == 'object') {
  module.exports = require('{{configName}}');
} else if (typeof define == 'function' && define.amd) {
  define(function(){ return require('{{configName}}'); });
} else {
  window['{{standaloneName}}'] = require('{{configName}}');
}})();