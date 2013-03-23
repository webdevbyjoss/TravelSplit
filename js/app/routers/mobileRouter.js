define(['jquery', 'backbone', 'utils', 'views/Main', 'views/PaymentView', 'cordova']
, function($, Backbone, utils, initUI, PaymentView) {

	return Backbone.Router.extend({

		initialize: function () {
			var self = this;
		    // We currently use jQuery Mobile for our application UI
		    // so need to wait untill "mobileinit" will be fired
		    $(document).bind("mobileinit", function() {
	    		self.initApp();
		    });
			require(['jquery-mobile']);
		},

		routes: {
			'': 'home',
			'payment?:id': 'payment'
		},

		initApp: function() {
			if (!utils.isCordova()) {
				// early return on non-cordova devices
				Backbone.history.start();
				return;
			}
	        // This will be called only on Cordova device
	        // Application init on Cordova should be done on "deviceready"
	        var self = this;
	        document.addEventListener("deviceready", function() {
	            // Initialize Cordova specific application events
	            document.addEventListener("pause", self.mobileHandler, false); // Application minimised/paused
	            document.addEventListener("resume", self.mobileHandler, false); // Application resumed
	            document.addEventListener("online", self.mobileHandler, false); // Device went online
	            document.addEventListener("offline", self.mobileHandler, false); // Device went offline
	            document.addEventListener("backbutton", self.mobileHandler, false); // Device back button pressed
	            document.addEventListener("menubutton", self.mobileHandler, false); // Device menu button pressed

	            Backbone.history.start();

	        }, false);
		},

		mobileHandler: function(e) {
			console.log(e);
			/*
	        if (confirm("Do you want to exit the application?")) {
	            navigator.app.exitApp();
	        }
	        */
		},

		home: function () {

			initUI();

			this.paymentView = new PaymentView({
				el: '#payment-details',
			});

		},

		payment: function (id) {

		}

	});
});