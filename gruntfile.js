
module.exports = function(grunt) {
    var pkg = grunt.file.readJSON('package.json');
    
    grunt.initConfig({
        runstant: {
            hoge: {
                files: "examples/**/runstant.json",
                dest: "examples/result.json",
            },
        }
    });

    for (var key in pkg.devDependencies) {
        if (/grunt-/.test(key)) {
            grunt.loadNpmTasks(key);
        }
    }
    grunt.task.loadTasks("tasks");

    grunt.registerTask('test', ['runstant:hoge']);
};
