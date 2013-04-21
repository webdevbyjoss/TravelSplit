define(['text!tpl/payment.html', 'backbone'], function(tplPayment) {
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