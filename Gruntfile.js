module.exports = grunt => {

  grunt.initConfig({
    pkg.grunt.file.readJSON('package.json');

    concat : {
      options: {
        separator: ';\n',
      },
      dist: {
        src: ['client/**/*.js'],
        dest: ['client/dist/<%= pkg.name %>.js']
      }
    },

    nodemon : {
      dev: {
        script: '/server/server.js'
      }
    },

    uglify: {
      dist:{
        files: {
          'client/dist/<%= pkg.name %>.js' : ['<%= concat.dist.dest %>']
        }
      }
    },

    eslint: {
      target: [
        'Gruntfile.js',
        'client/**/*.js',
        'server/**/*.js',
        'workers/**/*.js'
      ]
    },

    watch: {
      scripts: {
        files: [ 'client/**/*.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', target => {
    grunt.task.run(['nodemon', 'watch']);
  });

  ////////////////////////////////////////
  ///////// Main Grunt Tasks
  ////////////////////////////////////////

  grunt.registerTask('build', [
    'eslint',
    'concat',
    'uglify'
  ]);

  grunt.registerTask('upload', n => {
    grunt.task.run([ 'server-dev'])
  });

  grunt.registerTask('deploy', [
    'build',
    'upload'
  ]);

};
