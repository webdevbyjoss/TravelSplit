define(['backbone'], function(Backbone){
	return Backbone.Model.extend({
		defaults: {
			'description': '',
			'total': 0.0,
			// shares object
			// {'John': 100, 'Alex': 20, 'Ann':0, 'Mark': 0}
			// lists who and how much participated in particular payment
			'shares': {
			}
		}
	});
});