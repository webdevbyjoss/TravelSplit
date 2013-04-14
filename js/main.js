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
		'app': '../app',
		'views': '../app/views',
		'model': '../app/models',
		'collection': '../app/collections',
		// templates directory
		'tpl': '../app/templates'
	},
	shim: {
		'app/events': {
			deps: ['jquery']
		},
		'backbone': {
			deps: ['underscore'],
			exports: 'Backbone'
		}
	},
    //Set the config for the i18n module
    // locale: 'uk-ua'
});

// load initial set of libraries
require(['app/routers/mobileRouter'], function(MobileRouter) {

	// Instantiate Mobile Router
    this.router = new MobileRouter();

});