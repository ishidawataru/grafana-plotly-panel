module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  var pkgJson = require('./package.json');

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-typescript');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-string-replace');

  grunt.initConfig({
    clean: ['dist', 'src/lib'],

    copy: {
      hack_grafana_sdk: { // See: https://github.com/grafana/grafana-sdk-mocks/issues/1
        expand: true,
        flatten: true,
        cwd: 'hack',
        src: ['*.ts'],
        dest: 'node_modules/grafana-sdk-mocks/app/headers'
      },

      libs: {
        cwd: 'node_modules/plotly.js/dist',
        expand: true,
        src: ['plotly.min.js'],
        dest: 'src/lib'
      },
      libs2: {
        cwd: 'hack',
        expand: true,
        src: ['plotly.min.d.ts'],
        dest: 'src/lib'
      },


      dist_js: {
        expand: true,
        cwd: 'src',
        src: ['**/*.ts', '**/*.d.ts', 'lib/*'],
        dest: 'dist'
      },
      dist_html: {
        expand: true,
        flatten: true,
        cwd: 'src/partials',
        src: ['*.html'],
        dest: 'dist/partials/'
      },
      dist_css: {
        expand: true,
        flatten: true,
        cwd: 'src/css',
        src: ['*.css'],
        dest: 'dist/css/'
      },
      dist_img: {
        expand: true,
        flatten: true,
        cwd: 'src/img',
        src: ['*.*'],
        dest: 'dist/img/'
      },
      dist_statics: {
        expand: true,
        flatten: true,
        src: ['src/plugin.json', 'LICENSE', 'README.md'],
        dest: 'dist/'
      }
    },

    typescript: {
      build: {
        src: ['dist/**/*.ts', '!**/*.d.ts'],
        dest: 'dist',
        options: {
          module: 'system',
          target: 'es5',
          rootDir: 'dist/',
          declaration: true,
          emitDecoratorMetadata: true,
          experimentalDecorators: true,
          sourceMap: true,
          noImplicitAny: false,
          generateTsConfig: true,
          
      "paths": {
        "plotly.js": [
          "node_modules/plotly.js/dist/plotly.js"
        ]
      },
      "types": [
        "plotly.js"
      ],
        }
      }
    },

    'string-replace': {
      dist: {
        files: [{
          cwd: 'src',
          expand: true,
          src: ["**/plugin.json"],
          dest: 'dist'
        }],
        options: {
          replacements: [{
            pattern: '%VERSION%',
            replacement: pkgJson.version
          },{
            pattern: '%TODAY%',
            replacement: '<%= grunt.template.today("yyyy-mm-dd") %>'
          }]
        }
      }
    },

    watch: {
      files: ['src/**/*.ts', 'src/**/*.html', 'src/**/*.css', 'src/img/*.*', 'src/plugin.json', 'README.md'],
      tasks: ['default'],
      options: {
        debounceDelay: 250,
      },
    }
  });

  grunt.registerTask('default', [
    'clean',
    'copy:hack_grafana_sdk',
    'copy:libs', 'copy:libs2',
    'copy:dist_js',
    'typescript:build',
    'copy:dist_html',
    'copy:dist_css',
    'copy:dist_img',
    'copy:dist_statics',
    'string-replace'
  ]);
};
