define([
    'i18n!app/nls/messages',
    'app/models/Spendings',
    'collection/Members',
    'app/views/MembersView',
    'text!tpl/main.html',
    'text!tpl/payment.html'
], function(
    i18n,
    Spendings,
    MembersCollection,
    MembersView,
    tplMain,
    tplPayment
){
"use strict";

return Backbone.View.extend({
	events: {
		'change #payment': 'paymentChangeHandler',
		'change #select-all': 'selectallChangeHandler',
        'click #payment-details-save': 'saveClickHandler',
        'click #payment-details-cancel': 'cancelClickHandler'
	},

	/**
	 * Transactions that were made by the members
	 * fields:
	 * - description
	 * - total
	 * - spending object {'John': 100, 'Alex': 20, 'Ann':0, 'Mark': 0}
	 * 
	 * @type {Array}
	 */
	SpendingsUI: [],

	/**
	 * Main page template
	 * 
	 * @type {String}
	 */
	template: _.template(tplMain),
    templatePayment: _.template(tplPayment),

    /**
     * Sub-views
     */
    MembersView: null,

	initialize: function() {
        var self = this;

        this.MembersCollection = new MembersCollection();

        this.MembersView = new MembersView({
            'collection': this.MembersCollection
        });

        this.MembersCollection.on('add remove reset', function() {
            this.save();
            self.recalculateBudgets();
            self.renderMembersList();
        });

        this.MembersCollection.on('update', function(){
            this.save();
            self.renderMembersList();
        });
	},

	render: function() {
		this.$el.html( this.template({'t':i18n}) ).trigger("create");

        this.MembersView
            .setElement(this.$('#members'));
        this.loadData();

        // render payment details view
        $('#payment-details').html( this.templatePayment({'t':i18n}));

        this.recalculateBudgets();
	},

    loadData: function () {
        // force data load
        this.MembersCollection.load();
    },

    saveData: function() {
        // force data save
        this.MembersCollection.save();
    },

    renderMembersList: function() {
        // render the members list
        this.MembersView.render();

        // display mayments form only if 2 and more members are available
        if (this.MembersCollection.length >= 2) {
            this.renderPayments();
        } else {
            this.hidePayments();
        }
    },

	renderPayments: function() {
        // render payments log data
        var template = "";
        var self = this;

        if (this.SpendingsUI.length === 0) {
            // render message about empty list
            template = '<div class="list-none">you can add payments now</div>';
            $('#spendings-list').html(template);
            $('#payments').show();
            return;
        }

        this.SpendingsUI.forEach(function(item, index){
            
            var members = [];
            $.each(item.spendings, function(key, value) {
                if (value === 0) {
                    return;
                }
                members.push(key + ' $' + value);
            });

            template += '<div class="list-item"><div class="money-none">$' + item.total + '</div>'
                      + '<div class="list-user" data-id="' + index + '">' + item.description 
                      + ' <span class="description">' + members.join(', ') + '</span></div></div>';
        });

        $('#spendings-list').html(template).trigger("create");

        // addign events to newly generated DOM elemets
        $('#spendings-list div.list-item').click(function(){
            var el = $('.list-user', this);
            var title = $(el).text();
            var id = $(el).data('id');
            
            if (confirm('Are you sure to remove "' + title + '"?')) {
                /*
                var index = self.Members.indexOf(member);
                if (index !== -1) {
                    self.Members.splice(self.Members.indexOf(member), 1);
                    self.renderMembersList();
                }
                */
               self.SpendingsUI.splice(id, 1);
               self.recalculateBudgets();
               console.log('Remove ' + id + ': ' + title);
            }
        });

        $('#payments').show();
    },



    hidePayments: function() {
        $('#payments').hide();
    },



    showDetails: function() {

        var template = "";
        this.MembersCollection.forEach(function(member, index) {
            template += '<tr><td><input checked="checked" id="member-' + index + '" type="checkbox" value=' + index + '>'
                      + '<label for="member-' + index + '">' + member.get('name') + '</label></td>'
                      + '<td class="money-value"><input tabindex="' + (index + 1) +'" data-id="' + index 
                      + '" name="member-money[' + index + ']" type="number" min="0" max="5000" step="0.01" placeholder="0" />'
                      + '</td></tr>';
        });
        $('table.group-settings').html(template).trigger("create");

        // add events to all newly generated DOM elements
        $('table.group-settings input[type=checkbox]').change(function(){
            // update appropriate text field disabled status
            var id = $(this).val();
            var state = $(this).prop('checked');

            $('table.group-settings td.money-value input[data-id=' + id + ']').prop('disabled', !state);

            // update "all" checkbox status
            var isAll = true;
            $('table.group-settings input[type=checkbox]').each(function(){
                if (!$(this).prop('checked')) {
                    isAll = false;
                }
            });

            $('#select-all').prop('checked', isAll).checkboxradio('refresh');
        });

        // prepare and open payment details page
        this.trigger('navigate', 'payment/111');
    },



    hideDetails: function() {
    	
    	var self = this;

        // get money values and add to the transactions log as separate records
        var spendingObj = {};
        var total = 0;

        $('td.money-value input').each(function(){

            if ($(this).prop('disabled')) {
                // early return if member have not participated in the current deal
                return true;
            }

            var value = parseInt($(this).val(), 10);
            if (isNaN(value)) {
                value = 0;
            }

            var id = parseInt($(this).data('id'), 10);

            // create records in spending object
            // TODO: migrate this to ID instead of index
            spendingObj[ self.MembersCollection.at(id).get('name') ] = value;
            total += value;
        });

        // validate form
        if (total <= 0) {
            alert('Who paid for ' + $('#payment').val() + '?');
            return;
        }

        // save data into log
        var logItem = {
            'description': $('#payment').val(),
            'total': total,
            'spendings': spendingObj,
        };

        this.SpendingsUI.push(logItem);

        // recalculate member budget and re-render members list
        this.recalculateBudgets();

        $('#payment').val('')
        this.renderPayments();

        this.trigger('navigate', '');
    },


    recalculateBudgets: function() {
    	var self = this;
        var log = [];

        this.SpendingsUI.forEach(function(item) {
            log.push(item.spendings);
        });

        var t = new Spendings();
        var data = t.run(log);

        // update member spendings array
        this.MembersCollection.forEach(function(member) {
            var memberName = member.get('name');
            var memberMoney = data[memberName] ? data[memberName] : 0;

            // update silently for performance reasons
            member.set('money', memberMoney, {silent:true});
        });

        this.MembersCollection.trigger('change');
    },


	paymentChangeHandler: function(e) {
		var elem = e.target;

	    var payment = $(elem).val();
        if (payment === "") {
            return;
        }
        this.showDetails();
	},


	selectallChangeHandler: function(e) {
		var elem = e.target;

		var state = $(elem).prop('checked');

        // apply the same state to all items
        $('table.group-settings input[type=checkbox]').each(function(){
            $(this).prop("checked", state).change().checkboxradio('refresh');
        });
	},

    saveClickHandler: function(e) {
        this.hideDetails();
    },

    cancelClickHandler: function(e) {
        $('#payment').val('').focus();
        this.trigger('navigate', '');
    },

    backButtonHandler: function(e) {
        if (confirm("Exit the app? Data will be saved automatically.")) {
            navigator.app.exitApp();
        }
    }

});
});