define(['jquery', 'backbone', 'i18n!app/nls/messages', 'text!tpl/payment.html']
	, function($, Backbone, i18n, tplPayment) {
	return Backbone.View.extend({
		events: {

		},
		initialise: function() {

		},
		render: function() {
			
		},
	    backButtonHandler: function(e) {
	        if (confirm("Cancel this payment? Payment data will be lost.")) {
	        	$('#payment').val('').focus();
	            this.trigger('navigate', '');
	        }
	    }
	});
});