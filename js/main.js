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
    //Set the config for the i18n
    // i18n module
    // locale: 'uk-ua'
});

// load initial set of libraries
require(['app/events', 'app/Screen', 'routers/mobileRouter'], function(bindEvents, initUI, MobileRouter) {
	
    // We currently use jQuery Mobile for our application UI
    // so need to wait untill "mobileinit" will be fired
    $(document).bind("mobileinit", function() {
        // TODO: hide splash screen if it will be available
		bindEvents(initUI); // TODO: kinda ugly convention (?)
    });

	require(['jquery-mobile'], function () {

		// Instantiate Mobile Router
        this.router = new MobileRouter();

	});

});