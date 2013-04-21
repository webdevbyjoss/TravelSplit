define(['backbone'], function(Backbone){
	return Backbone.Model.extend({
		defaults: {
			'name': '',
			'money': 0.0
		}
	});
});