define(['model/Payment'], function(Payment){
	// Transactions that were made by the members
	return Backbone.Collection.extend({
		model: Payment,
		key: "PaymentsCollection:Payments", // localStorage key with collection namespace
		save: function() {
			localStorage[this.key] = JSON.stringify(this.toJSON());
		},
		load: function() {
			var data = localStorage[this.key] ? JSON.parse(localStorage[this.key]) : [];
			this.reset(data);
		}
	});
})