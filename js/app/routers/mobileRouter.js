define(['jquery', 'backbone', 'utils', 'views/PaymentView', 'cordova']
, function($, Backbone, utils, PaymentView) {

	return Backbone.Router.extend({

		initialize: function () {

			this.paymentView = new PaymentView({
				el: '#payment-details',
			});

			Backbone.history.start();
		}, 

		routes: {
			'': 'home',
			'payment?:id': 'payment'
		}, 

		initApp: function () {

		},

		home: function () {

		},

		payment: function (id) {

		}

	});
});