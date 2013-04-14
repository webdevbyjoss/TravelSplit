define(['model/Member'], function(Member){
	return Backbone.Collection.extend({
		model: Member,
		key: "MembersCollection:Members", // localStorage key with collection namespace
		save: function() {
			localStorage[this.key] = JSON.stringify(this.toJSON());
		},
		load: function() {
			var data = localStorage[this.key] ? JSON.parse(localStorage[this.key]) : [];
			this.reset(data);
		}
	});
})