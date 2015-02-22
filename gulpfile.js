var gulp = require('gulp');
var path = require('path');
var del = require('del');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var es = require('event-stream');
var spawn = require('child_process').spawn;
var $ = require('gulp-load-plugins')({
	pattern: ['gulp-*', 'gulp.*'],
	replaceString: /\bgulp[\-.]/
});

var environment = $.util.env.type || 'development';
var isProduction = environment === 'production';

var port = 1337;
var base = __dirname;
var src = './src/';
var dist = './dist/';
var bower = './bower_components/' ;

var pkg = require('./package.json');
var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @author <%= pkg.author %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');

// https://github.com/ai/autoprefixer
var autoprefixerBrowsers = [                 
	'ie >= 9',
	'ie_mob >= 10',
	'ff >= 30',
	'chrome >= 34',
	'safari >= 6',
	'opera >= 23',
	'ios >= 6',
	'android >= 4.4',
	'bb >= 10'
];


// Remove bundels
gulp.task('clean', function(cb) {
	del([dist], cb);
});

// Copy images
gulp.task('images', function(cb) {
	return gulp.src(src + 'images/**/*.{png,jpg,jpeg,gif,svg}')
		.pipe(gulp.dest(dist + 'images/'))
		.pipe(isProduction ? $.util.noop() : $.size({ title: 'images' }))
		.pipe(isProduction ? $.util.noop() : $.duration('images'));
});

// Copy icons
gulp.task('icons', function() {
	return gulp.src(bower + 'fontawesome/fonts/**.*')
		.pipe(gulp.dest(dist + 'fonts/'))
		.pipe($.size({ title: 'icons' }))
});



// Copy html from src to dist + minify
gulp.task('html', function() {
	return gulp.src('./index.html')
		.pipe($.size({ title : 'html' }))
		.pipe(isProduction ? $.util.noop() : $.duration('html'))
		.pipe(reload({stream: true}))
});

// Hint, uglify and concat scripts
gulp.task('scripts', function() {
	var jsFiles = gulp.src(src + 'js/**/*.js')
		.pipe($.jshint());
		
	return es.concat(gulp.src([
		//
	]), jsFiles)
		.pipe($.concat('bundle.js'))
		.pipe(isProduction ? $.uglifyjs() : $.util.noop())
		.pipe(isProduction ? $.header(banner, { pkg: pkg }) : $.util.noop())
		.pipe(gulp.dest(dist + 'js/'))
		.pipe($.size({ title: 'scripts' }))
		.pipe(isProduction ? $.util.noop() : $.duration('scripts'))
		.pipe(reload({stream: true}))
});


// Copy heavy SASS script compiler
gulp.task('sassScripts', function() {
	return es.concat(gulp.src([
		bower + 'sass.js/dist/sass.worker.js',
		bower + 'sass.js/dist/worker.min.js'
	]))
		.pipe($.concat('sass.js'))
		.pipe(gulp.dest(dist + 'js/'))
		.pipe($.size({ title: 'sass.js' }))
});


gulp.task('headScripts', function() {
	return es.concat(gulp.src([
		bower + 'modernizr/modernizr.js',
		bower + 'ace-builds/src/ace.js',
		bower + 'ace-builds/src/mode-html.js',
		bower + 'ace-builds/src/mode-javascript.js',
		bower + 'ace-builds/src/mode-scss.js',
		bower + 'ace-builds/src/ext-emmet.js',
		bower + 'emmet/index.js'
	]))
		.pipe($.concat('head-bundle.js'))
		.pipe(isProduction ? $.uglifyjs() : $.util.noop())
		.pipe(isProduction ? $.header(banner, { pkg: pkg }) : $.util.noop())
		.pipe(gulp.dest(dist + 'js/'))
		.pipe($.size({ title : 'scripts' }))
		.pipe(isProduction ? $.util.noop() : $.duration('scripts'))
});


// Compile SASS and concat styles
gulp.task('styles', function() {
	var sassFiles = $.rubySass(src + 'scss/main.scss', {
			style: 'compressed',
			sourcemap: false, 
			precision: 2
		})
		.on('error', function(err) {
			new $.util.PluginError('style', err, { showStack: true });
		});

	return es.concat(gulp.src([
		bower + 'fontawesome/css/font-awesome.css',
		bower + 'animate-css/animate.css',
	]), sassFiles)
		.pipe($.concat('main.min.css'))
		.pipe($.autoprefixer({browsers: autoprefixerBrowsers}))
		.pipe(isProduction ? $.combineMediaQueries({
			log: true
		}) : $.util.noop())
		.pipe(isProduction ? $.cssmin() : $.util.noop())
		.pipe(isProduction ? $.header(banner, { pkg: pkg }) : $.util.noop())
		.pipe(gulp.dest(dist + 'css'))
		.pipe($.size({ title: 'styles' }))
		.pipe(isProduction ? $.util.noop() : $.duration('styles'))
		.pipe(reload({stream: true}))
});




// browser-sync task for starting the server.
gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: base
		},
		browser: 'google chrome canary'
	});
});



// Watch sass, html and js file changes
gulp.task('watch', ['browser-sync'], function() {
	gulp.watch('./index.html', ['html']);
	gulp.watch(src + 'scss/**/**/*.scss', ['styles']);
	gulp.watch(src + 'js/**/*.js', ['scripts']);
});

// by default build project and then watch files in order to trigger livereload
gulp.task('default', [
	'build', 
	'watch'
]);

// Waits until clean is finished then builds the project
gulp.task('build', ['clean'], function() {
	gulp.start([
		'icons',
		'images',
		'html',
		'styles',
		'sassScripts',
		'headScripts',
		'scripts'
	]);
});
