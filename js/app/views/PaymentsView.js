define(['text!tpl/payments.html', 'backbone'], function(tplPayments){
	return Backbone.View.extend({
		events: {
			'change #payment': 'paymentChangeHandler',
			'click #spendings-list div.list-item': 'removeHandler'
		},
		template: _.template(tplPayments),
		initialise: function() {

		},
		render: function() {
			this.$el.html(this.template({
	        	'items': this.collection
	        })).trigger("create"); // jQuery Mobile "create" event required to initialize UI elements
		},
		hidePayments: function() {
			this.$el.empty();
		},
		removeHandler: function(e) {
            var el = e.currentTarget;
            var title = $('.list-user', el).text();
            var id = $(el).data('id');

            if (confirm('Are you sure to remove "' + title + '"?')) {
                var model = this.collection.at(id);
                this.collection.remove(model);
            }
		},
		paymentChangeHandler: function(e) {
			var elem = e.currentTarget;

		    var payment = $(elem).val();
	        if (payment === "") {
	            return;
	        }
	        this.trigger('newItem', payment);
	        return false;
		}
	});
});