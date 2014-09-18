/*
 *
 */

module.exports = function(grunt) {

    var BASE_PATH = "http://phi-jp.github.io/runstant/release/alpha/";

    var fs = require("fs");
    var jszip = require("jszip");

    var _encode = function(data) {
        data = JSON.stringify(data);
        data = zip(data);
        data = encodeURI(data);

        return data;
    };

    var _decode = function(data) {

        data = decodeURI(data);
        data = unzip(data);
        data = JSON.parse(data);

        return data;
    };


    var zip = function(data) {
        var zip = new jszip();
        zip.file('data', data);

        return zip.generate({type:"base64"});
    };


    var unzip = function(data) {
        var zip = new jszip();
        var files = zip.load(data, {
            base64: true
        });

        return files.file('data').asText();
    };

    grunt.registerMultiTask('runstant', 'Compile', function() {

        this.files.forEach(function(file) {
            var runstantConfig = grunt.file.readJSON(file.src);
            var data = _encode(runstantConfig);

            grunt.file.write(file.dest, JSON.stringify({
                data: data,
                link: BASE_PATH + "#" + data,
            }, '', '    '));
        });

    });
};

