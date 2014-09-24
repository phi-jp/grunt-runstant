
module.exports = function(grunt) {
    var pkg = grunt.file.readJSON('package.json');
    var developerKey = "AI39si6PlPuayk46fW-yQYHBJ0oeAGCHm6O9kEc2Ze585T6VhhR_RPRYuTFVbeYwGUA8GDe0Z0V-aNj88b9WvsVHuMlYEN-ZJg";

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
