
module.exports = function(grunt) {
    var pkg = grunt.file.readJSON('package.json');

    grunt.initConfig({
        runstant: {
            hoge: {
                src: "examples/hoge/runstant.json",
                dest: "examples/hoge/result.json",
            },
        }
    });

    for (var key in pkg.devDependencies) {
        //    if (/grunt-contrib/.test(key)) {
        if (/grunt-/.test(key)) {
            grunt.loadNpmTasks(key);
        }
    }
    grunt.task.loadTasks("tasks");

    grunt.registerTask('test', ['runstant:hoge']);
};
