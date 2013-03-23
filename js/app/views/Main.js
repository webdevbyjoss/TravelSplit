// The purpose of this module is to load all libraries 
// required to initialized main screen
define([
    'app/models/Spendings',
    'text!tpl/main.html',
    'i18n!app/nls/messages'
], function(
    Spendings,
    html,
    i18n
){
    "use strict";
    
    // members array of strings that will hold the list of team members
    var Members = [];

    // members hash that will hold the money owned/earned by each member    	
    var MembersSpendings = {};

    // transactions that were made by the members
	   // fields:
	   // - description
	   // - total
	   // - spending object {'John': 100, 'Alex': 20, 'Ann':0, 'Mark': 0}
	var SpendingsUI = [];

    function renderMembersList() {

        var template = "";

        if (Members.length === 0) {
            // render message if no members are added
            template = '<div class="list-none">' + i18n['you can add payments now'] + '</div>';
            $('#members-list').html(template).find('.list-none').click(function() {
                $('#member').focus();
            });

            hidePayments();

            return;
        }

        // or render the list othervise
        Members.forEach(function(member, index){
            var budget = MembersSpendings[member];
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
        $('div.list-item').click(function(){
            var member = $('.list-user', this).text();
            if (confirm('Are you sure to remove "' + member + '"?')) {
                var index = Members.indexOf(member);
                if (index !== -1) {
                    Members.splice(Members.indexOf(member), 1);
                    renderMembersList();
                }
            }
        });

        renderPayments();
    }

    /* Payments functionality */


    function renderPayments() {
        // render payments log data
        var template = "";

        if (SpendingsUI.length === 0) {
            // render message about empty list
            template = '<div class="list-none">you can add payments now</div>';
            $('#spendings-list').html(template);
            $('#payments').show();
            return;
        }

        SpendingsUI.forEach(function(item){
            
            var members = [];
            $.each(item.spendings, function(key, value) {
                if (value === 0) {
                    return;
                }
                members.push(key + ' $' + value);
            });

            template += '<div class="list-item"><div class="money-none">$' + item.total + '</div>'
                      + '<div class="list-user">' + item.description 
                      + ' <span class="description">' + members.join(', ') + '</span></div></div>';
        });

        $('#spendings-list').html(template).trigger("create");

        $('#payments').show();
    }

    function hidePayments() {
        $('#payments').hide();
    }


    function showDetails() {

        var template = "";
        Members.forEach(function(member, index){
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
        location.hash = 'payment-details';
    }



    function hideDetails() {

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
            spendingObj[ Members[id] ] = value;
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

        SpendingsUI.push(logItem);

        // recalculate member budget and re-render members list
        recalculateBudgets();

        $('#payment').val('')
        renderPayments();

        location.hash = '';
    }

    function recalculateBudgets() {

        var log = [];

        SpendingsUI.forEach(function(item) {
            log.push(item.spendings);
        });

        var t = new Spendings();
        var data = t.run(log);

        // update member spendings array
        Members.forEach(function(member){
            if (data[member]) {
                MembersSpendings[member] = data[member];
            }
        });
        
        // render new data
        renderMembersList();
    }





    // TODO: kinda ugly design descision, lets redesign this later
    return function () {

        var tmpl = _.template(html);
        var page = tmpl({'t':i18n});

        // load template
        $('body').html(page);

        // update default settings
        $.mobile.defaultPageTransition = 'none';

        // Disable native jQuery Mobile events bindings in order to allow Backbone.JS integration
        // see: http://view.jquerymobile.com/1.3.0/docs/examples/backbone-require/index.php
        $.mobile.linkBindingEnabled = false;
        $.mobile.hashListeningEnabled = false;

        $('#member').change(function() {
            var member = $(this).val();
            if (member === "") {
                // silently quit on empty values
                return;
            }
            // clear field and focus
            $(this).val('');
            // if particular member already exists, do nothing
            if (Members.indexOf(member) !== -1) {
                return;
            }
            // Add new member to the list
            // TODO: update UI
            Members.push(member);
            renderMembersList();
            
            $(this).focus().click();

        }).focus();

        $('#payment').change(function(){
            var payment = $(this).val();
            if (payment === "") {
                return;
            }
            showDetails();
        });

        $('#select-all').change(function(){
            var state = $(this).prop('checked');

            // apply the same state to all items
            $('table.group-settings input[type=checkbox]').each(function(){
                $(this).prop("checked", state).change().checkboxradio('refresh');
            });
        });


        $('#payment-details-save').click(function(){
            hideDetails();
        });

        $('#payment-details-cancel').click(function(){
            $('#payment').val('').focus();
            location.hash = '';
        });

        renderMembersList();
        hidePayments();
    }



});