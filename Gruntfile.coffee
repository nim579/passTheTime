module.exports = (grunt)->
    
    grunt.loadNpmTasks 'grunt-bower-concat'
    grunt.loadNpmTasks 'grunt-contrib-coffee'
    grunt.loadNpmTasks 'grunt-contrib-watch'

    grunt.initConfig
        bower_concat:
            app:
                dest: './static/libs.js'
                cssDest: './static/libs.css'

        coffee:
            app:
                options:
                    bare: true

                files:
                    './static/app.js': ['./src/**/*.coffee']

        watch:
            coffee:
                files: ['./src/**/*.coffee']
                tasks: ['coffee:app']


    grunt.registerTask 'build', 'Compile project', ['bower_concat', 'coffee']