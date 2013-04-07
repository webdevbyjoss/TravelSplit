define([
    'app/models/Spendings',
    'text!tpl/main.html',
    'text!tpl/payment.html',
    'i18n!app/nls/messages'
], function(
    Spendings,
    tplMain,
    tplPayment,
    i18n
){
"use strict";

return Backbone.View.extend({
	events: {
		'change #member': 'memberChangeHandler',
		'change #payment': 'paymentChangeHandler',
		'change #select-all': 'selectallChangeHandler',
        'click #payment-details-save': 'saveClickHandler',
        'click #payment-details-cancel': 'cancelClickHandler'
	},
	/**
	 * Members array of strings that will hold the list of team members
	 * 
	 * @type {Array}
	 */
	Members: [],

	/**
	 * Members hash that will hold the money owned/earned by each member
	 * 
	 * @type {Object}
	 */
	MembersSpendings:{},

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

	initialize: function() {
        this.loadData();
	},

	render: function() {
		this.$el.html( this.template({'t':i18n}) ).trigger("create");
        // render payment details view
        $('#payment-details').html( this.templatePayment({'t':i18n}));

		$('#member').focus();

        this.recalculateBudgets();
	},

    loadData: function () {
        console.log('load data');
        this.SpendingsUI = localStorage["SpendingsUI"] ? JSON.parse(localStorage["SpendingsUI"]) : [];
        this.Members = localStorage["Members"] ? JSON.parse(localStorage["Members"]) : [];
        console.log(this.SpendingsUI);
        console.log(this.Members);
    },

    saveData: function() {
        console.log('save data');
        localStorage["SpendingsUI"] = JSON.stringify(this.SpendingsUI);
        localStorage["Members"] = JSON.stringify(this.Members);
    },

    renderMembersList: function() {
    	var self = this;
        var template = "";

        if (this.Members.length === 0) {
            // render message if no members are added
            template = '<div class="list-none">' + i18n['please add people'] + '</div>';
            $('#members-list').html(template).find('.list-none').click(function() {
                $('#member').focus();
            });

            this.hidePayments();

            return;
        }

        // or render the list othervise
        this.Members.forEach(function(member, index){
            var budget = self.MembersSpendings[member];
            if (isNaN(budget)) {
                budget = 0;
            }

            var moneyClass = 'none';
            if (budget < 0) {
                moneyClass = 'minus';
            } else if (budget > 0) {
                moneyClass = 'plus';
            }

            template += '<div class="list-item"><div class="money-' + moneyClass 
                + '">$' + Math.abs(budget).toFixed(2) + '</div>'
                + '<div class="list-user" data-icon="minus">' + member + '</div></div>';
        });

        $('#members-list').html(template).trigger("create"); // jQuery Mobile "create" event required to initialize UI elements

        // addign events to newly generated DOM elemets
        $('#members-list div.list-item').click(function(){
            var member = $('.list-user', this).text();
            if (confirm('Are you sure to remove "' + member + '"?')) {
                var index = self.Members.indexOf(member);
                if (index !== -1) {
                    self.Members.splice(self.Members.indexOf(member), 1);
                    self.recalculateBudgets();
                }
            }
        });

        // display mayments form only if 2 and more members are available
        if (this.Members.length > 1) {
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
        this.Members.forEach(function(member, index){
            template += '<tr><td><input checked="checked" id="member-' + index + '" type="checkbox" value=' + index + '>'
                      + '<label for="member-' + index + '">' + member + '</label></td>'
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

            var id = $(this).data('id');

            // create records in spending object
            spendingObj[ self.Members[id] ] = value;
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
        this.Members.forEach(function(member){
            self.MembersSpendings[member] = data[member] ? data[member] : 0;
        });
        
        // render new data
        this.renderMembersList();

        // save data on each budget recalculation
        this.saveData();
    },




	memberChangeHandler: function(e) {
		var elem = e.target;

        var member = $(elem).val();
        if (member === "") {
            // silently quit on empty values
            return;
        }
        // clear field and focus
        $(elem).val('');
        // if particular member already exists, do nothing
        if (this.Members.indexOf(member) !== -1) {
            return;
        }
        // Add new member to the list
        // TODO: update UI
        this.Members.push(member);
        this.renderMembersList();

        // save data after new member is added
        this.saveData();
        
        $(elem).focus().click();
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
    }

});
});