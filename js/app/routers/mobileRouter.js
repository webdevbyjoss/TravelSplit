define(['jquery', 'backbone', 'views/PaymentView'], function($, Backbone, PaymentView){
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

		home: function () {

		},

		payment: function (id) {

		}

	});
});