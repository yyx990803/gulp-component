;(function(){
{{require}}{{js}}
if (typeof exports == "object") {
  module.exports = require("{{configName}}");
} else if (typeof define == "function" && define.amd) {
  define(function(){ return require("{{configName}}"); });
} else {
  this["{{standaloneName}}"] = require("{{configName}}");
}})();