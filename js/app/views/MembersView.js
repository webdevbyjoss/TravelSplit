define(['text!tpl/members.html', 'backbone'], function(tplMembers){
	return Backbone.View.extend({
		events: {
			'change #member': 'memberChangeHandler',
			'click div.list-item': 'removeHandler'
		},

		template: _.template(tplMembers),

		initialise: function() {

			// TODO: re-render only list of members but not the whole view

		},

		render: function() {
	        this.$el.html(this.template({
	        	'items': this.collection
	        }));

	        this.$el.trigger("create"); // jQuery Mobile "create" event required to initialize UI elements
		},

		memberChangeHandler: function(e) {
			var elem = e.target;

			var memberName = $(elem).val();
			// clear field, focus and triger keyboard
			$(elem).val('').focus().click();


	        if (memberName === "") {
	            // silently quit on empty values
	            return;
	        }

	        // if particular member already exists, do nothing
	        if (this.collection.findWhere({'name': memberName})) {
	            return;
	        }

	        // Add new member to the list
	        this.collection.add({
	        	'name': memberName
	        });

	        this.$('#member').focus();
		},

		removeHandler: function(e) {
			var elem = e.currentTarget;
			var memberName = $(elem).find('.list-user').text();

            if (!confirm('Are you sure to remove "' + memberName + '"?')) {
            	return;
            }

            var memberModel = this.collection.findWhere({'name': memberName});

            if (!memberModel) {
            	return;
            }

            this.collection.remove(memberModel);
		}

	});
});