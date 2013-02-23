// setup autoloading
requirejs.config({
	// default placement of js libraries
	baseUrl: 'js/libs',
	// app specific modules
	paths: {
		'cordova': 'cordova-2.5.0rc1',
		'jquery': 'jquery-1.8.3',
		'jquery-mobile': 'jquery.mobile-1.3.0/jquery.mobile-1.3.0',
		'backbone': 'backbone-min',
		// application specific paths
		'app': '../app'
		// templates directory
		// 'text': '../app/templates'
	},
	shim: {
		'jquery-mobile': {
			deps: ['app/events']
		},
		'app/events': {
			deps: ['jquery']
		}
	}
});

// load initial set of libraries
require(['app/events', 'app/Screen'], function(bindEvents, initUI) {
	bindEvents(initUI); // TODO: kinda ugly convention (?)
	require(['jquery-mobile']);
});