/*
 *
 */

module.exports = function(grunt) {

    var BASE_PATH = "http://phi-jp.github.io/runstant/release/alpha/";

    var fs = require("fs");
    var path = require("path");
    var jszip = require("jszip");
    var request = require('request');
    var Task = require("uupaa.task.js");


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

    var shortenURL = function(url, callback) {
        request.post({
            url: "https://www.googleapis.com/urlshortener/v1/url",
            headers: {
                'Content-Type': 'application/json'
            },
            json: true,
            body: JSON.stringify({
                longUrl: url
            }),
        }, function(error, response, body) {
            callback(body);
        });
    };

    grunt.registerMultiTask('runstant', 'Compile', function() {
        var done = this.async();

        var rootTask = new Task(this.files.length, function() {
            console.log("finish!");
            done();
        });

        this.files.forEach(function(file) {
            var output = {};
            var targets = grunt.file.expand(file.files);
            var count = targets.length;

            var task = new Task(targets.length, function() {
                grunt.file.write(file.dest, JSON.stringify(output, '', '    '));
                rootTask.pass();
            });

            targets.forEach(function(filepath) {
                var runstantConfig = grunt.file.readJSON(filepath);
                var dir = (function() {
                    var arr = filepath.split('/');
                    arr.pop();
                    return arr.join('/');
                })();

                // ファイル展開
                Object.keys(runstantConfig.code).forEach(function(type) {
                    var d = this[type];
                    if (d.path) {
                        var filepath = path.join(dir, d.path);
                        var v = grunt.file.read(filepath);
                        d.value = v;
                    }
                }, runstantConfig.code);

                var data = _encode(runstantConfig);
                var url = BASE_PATH + "#" + data;
                var d = {
                    data: data,
                    url: url,
                };
                output[dir] = d;

                shortenURL(url, function(e) {
                    d.shortUrl = e.id;
                    console.log(e.id);
                    task.pass();
                });
            });
        });
    });
};


