define([
    'app/models/Spendings',
    'collection/Members',
    'collection/Payments',
    'app/views/MembersView',
    'app/views/PaymentsView',
    'text!tpl/main.html',
    'text!tpl/payment.html'
], function(
    Spendings,
    MembersCollection,
    PaymentsCollection,
    MembersView,
    PaymentsView,
    tplMain,
    tplPayment
){
"use strict";

return Backbone.View.extend({
	events: {
		'change #select-all': 'selectallChangeHandler',
        'click #payment-details-save': 'saveClickHandler',
        'click #payment-details-cancel': 'cancelClickHandler'
	},

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
    PaymentsView: null,

	initialize: function() {
        var self = this;

        this.MembersCollection = new MembersCollection();
        this.PaymentsCollection = new PaymentsCollection();

        this.MembersView = new MembersView({
            'collection': this.MembersCollection
        });

        this.PaymentsView = new PaymentsView({
            'collection': this.PaymentsCollection
        });


        // setup collection events
        this.MembersCollection.on('add remove update', function() {
            this.save();
            self.renderMembersList();
        });

        this.PaymentsCollection.on('add remove update', function(){
            self.recalculateBudgets();
        });

        // setup coordination between views
        this.PaymentsView.on('newItem', function(name) {
            console.log(name);
            self.showDetails();
        });

        this.loadData();
	},

	render: function() {
		this.$el.html(this.template()).trigger("create");

        this.MembersView
            .setElement(this.$('#members'));

        this.PaymentsView
            .setElement(this.$('#payments'));

        // render payment details view
        $('#payment-details').html( this.templatePayment());

        this.recalculateBudgets();
	},

    loadData: function () {
        // force data load
        this.MembersCollection.load();
        this.PaymentsCollection.load();
    },

    saveData: function() {
        // force data save
        this.MembersCollection.save();
        this.PaymentsCollection.save();
    },

    renderMembersList: function() {
        // render the members list
        this.MembersView.render();

        // display payments form only if 2 and more members are available
        if (this.MembersCollection.length >= 2) {
            this.PaymentsView.render();
        } else {
            this.PaymentsView.hidePayments();
        }
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

            var value = parseFloat($(this).val());
            if (isNaN(value)) {
                value = 0;
            }

            var id = parseFloat($(this).data('id'));

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
            'total': total,  // TODO: this can be dynamically calculated inside model
                             // including validation
            'shares': spendingObj,
        };

        this.PaymentsCollection.add(logItem);

        // recalculate member budget and re-render members list
        this.recalculateBudgets();

        $('#payment').val('')
        this.PaymentsView.render();

        this.trigger('navigate', '');
    },


    recalculateBudgets: function() {
    	var self = this;
        var log = [];

        this.PaymentsCollection.forEach(function(item) {
            log.push(item.get('shares'));
        });

        var sp = new Spendings();
        var data = sp.run(log);

        // update member spendings array
        this.MembersCollection.forEach(function(member) {
            var memberName = member.get('name');
            var memberMoney = data[memberName] ? data[memberName] : 0;

            // update silently for performance reasons
            member.set('money', memberMoney, {silent:true});
        });

        // this.MembersCollection.trigger('change');
        this.renderMembersList();
        this.saveData();
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
