define(['jquery', 'backbone', 'utils', 'views/PaymentView', 'views/MainView', 'cordova']
, function($, Backbone, utils, PaymentView, MainView) {

	return Backbone.Router.extend({

		routes: {
			'': 'home',
			'payment/:id': 'payment'
		},

		home: function () {

			if ($.mobile.activePage) {
				// Programatically changes to the jQuery mobile page only when everything is initialized
				$.mobile.changePage( $("#main"), { changeHash: false } );
			}

			this.CurrentView = this.MainView;
		},

		payment: function (id) {
			// Programatically changes to the jQuery mobile page
			$.mobile.changePage( $("#payment-details"), { changeHash: false } );
			this.CurrentView = this.PaymentView;
		},

		initialize: function () {
			var self = this;

			this.MainView = new MainView({el:'body'});
			this.PaymentView = new PaymentView({el:'#payment-details'});

		    // We currently use jQuery Mobile for our application UI
		    // so need to wait untill "mobileinit" will be fired
		    $(document).bind("mobileinit", function() {
	    		self.initApp();

	    		// see http://knutkj.wordpress.com/2012/01/23/jquery-mobile-and-client-generated-pages/
		        // $.mobile.autoInitializePage = false;
		        
		        // update default settings
		        $.mobile.defaultPageTransition = 'none';

		        // Disable native jQuery Mobile events bindings in order to allow Backbone.JS integration
		        // see: http://view.jquerymobile.com/1.3.0/docs/examples/backbone-require/index.php
		        $.mobile.linkBindingEnabled = false;
		        $.mobile.hashListeningEnabled = false;


		    });
			require(['jquery-mobile']);
		},

		initApp: function() {

			if (!utils.isCordova()) {
				this.runApp();
				// early return on non-cordova devices
				return;
			}

	        // This will be called only on Cordova device
	        // Application init on Cordova should be done on "deviceready"
	        var self = this;
	        document.addEventListener("deviceready", function() {

				self.runApp();

	            // Initialize Cordova specific application events
	            document.addEventListener("pause", function(e) { // Application minimised/paused
	            	self.MainView.saveData();
	            }, false);
	            document.addEventListener("resume", function(e) { // Application resumed
					self.MainView.loadData();
	            }, false);
	            document.addEventListener("backbutton", function (e) { // Device back button pressed
	            	self.CurrentView.backButtonHandler();
	            }, false);

	            // document.addEventListener("online", self.mobileHandler, false); // Device went online
	            // document.addEventListener("offline", self.mobileHandler, false); // Device went offline
	            // document.addEventListener("menubutton", self.mobileHandler, false); // Device menu button pressed

	        }, false);
		},

		runApp: function() {
			var self = this;

			// this will hold the link to view that is currently displayed on screen
			this.MainView.on('navigate', function(url) {
				self.navidateHandler(url);
			}).render();

			this.PaymentView.on('navigate', function(url) {
				self.navidateHandler(url);
			});

			this.CurrentView = this.MainView;

			Backbone.history.start();
		},

		navidateHandler: function(url) {
			this.navigate(url, {'trigger': true});
		},

	});
});