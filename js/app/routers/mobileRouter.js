define(['jquery', 'backbone', 'utils', 'views/PaymentView', 'views/MainView', 'cordova']
, function($, Backbone, utils, PaymentView, MainView) {

	return Backbone.Router.extend({

		initialize: function () {
			var self = this;
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

		routes: {
			'': 'home',
			'payment/:id': 'payment'
		},

		initApp: function() {
			if (!utils.isCordova()) {
				// early return on non-cordova devices
				this.runApp();
				return;
			}
	        // This will be called only on Cordova device
	        // Application init on Cordova should be done on "deviceready"
	        var self = this;
	        document.addEventListener("deviceready", function() {
	            // Initialize Cordova specific application events
	            document.addEventListener("pause", self.pauseHandler, false); // Application minimised/paused
	            document.addEventListener("resume", self.mobileHandler, false); // Application resumed
	            document.addEventListener("online", self.mobileHandler, false); // Device went online
	            document.addEventListener("offline", self.mobileHandler, false); // Device went offline
	            document.addEventListener("backbutton", self.mobileHandler, false); // Device back button pressed
	            document.addEventListener("menubutton", self.mobileHandler, false); // Device menu button pressed

	            self.runApp();

	        }, false);
		},

		pauseHandler: function(e) {
			this.MainView.saveData();
		},

		resumeHandler: function(e) {
			this.MainView.loadData();
		},

		mobileHandler: function(e) {
			console.log(e);
			/*
	        if (confirm("Do you want to exit the application?")) {
	            navigator.app.exitApp();
	        }
	        */
		},

		runApp: function() {
			var self = this;

			this.MainView = new MainView({
				el: 'body'
			}).on('navigate', function(url) {
				self.navigate(url, {'trigger': true});
			}).render();;

			this.paymentView = new PaymentView({
				el: '#payment-details',
			});

			Backbone.history.start();
		},

		home: function () {

			if ($.mobile.activePage) {
				// Programatically changes to the jQuery mobile page only when everything is initialized
				$.mobile.changePage( $("#main"), { changeHash: false } );
			}
			
		},

		payment: function (id) {
			// Programatically changes to the jQuery mobile page
			$.mobile.changePage( $("#payment-details"), { changeHash: false } );
		}

	});
});