// setup autoloading
requirejs.config({
	// default placement of js libraries
	baseUrl: 'js/libs',

	// application specific paths
	paths: {
		'jquery': 'jquery-1.8.3',
		'app': '../app'
	}
});

// load initial set of libraries
require(['app/models/Spendings'], function(Spendings) {

	test("Group 1", function(){
	    var t = new Spendings();
	    // Group 1
	    t.add({'Ann': 40});
	    t.add({'John': 700});
	    t.add({'Mark': 50, 'Ann': 50});
	    t.add({'Alex': 450});
	    deepEqual(t.totals().solution, {'Ann': -232.5, 'John': 377.5, 'Mark': -272.5, 'Alex': 127.5});
	});

	test('Group 2', function() {
	    var t = new Spendings();
	    t.add({'Mark': 20, 'John': 50, 'Ann': 0});
	    deepEqual(t.totals().solution, {Mark: -3.333333333333332, John: 26.666666666666668, Ann: -23.333333333333332});
	});

	test('Group 3', function(){
	    var t = new Spendings();
	    t.add({'John': 30, 'Any':0, 'Mark': 0});
	    deepEqual(t.totals().solution, {John: 20, Any: -10, Mark: -10});
	});


	test('Group 1 direct call', function(){

	    var log = [];
	    log.push({'Ann': 40});
	    log.push({'John': 700});
	    log.push({'Mark': 50, 'Ann': 50});
	    log.push({'Alex': 450});

	    var t = new Spendings();
	    var r = t.calculateSpendings(log);

	    equal(r.count, 4);
	    equal(r.total, 1290);
	    deepEqual(r.members, ['Ann', 'John', 'Mark', 'Alex']);
	    deepEqual(r.solution, {'Ann': -232.5, 'John': 377.5, 'Mark': -272.5, 'Alex': 127.5});
	});

	test('Group 2 direct call', function(){

	    var log = [];
	    log.push({'Mark': 20, 'John': 50, 'Ann': 0});

	    var t = new Spendings();
	    var r = t.calculateSpendings(log);

	    equal(r.count, 3);
	    equal(r.total, 70);
	    deepEqual(r.members, ['Mark', 'John', 'Ann']);
	    deepEqual(r.solution, {Mark: -3.333333333333332, John: 26.666666666666668, Ann: -23.333333333333332});
	});

	test('Group 3 direct call', function(){

	    var log = [];
	    log.push({'John': 30, 'Ann':0, 'Mark': 0});

	    var t = new Spendings();
	    var r = t.calculateSpendings(log);

	    equal(r.count, 3);
	    equal(r.total, 30);
	    deepEqual(r.members, ['John', 'Ann', 'Mark']);
	    deepEqual(r.solution, {John: 20, Ann: -10, Mark: -10});
	});

	test('Zero-values recognision test', function() {

	    var t = new Spendings();

	    t.add({'Ann': 40, 'John':0, 'Mark':0, 'Alex':0});
	    t.add({'John': 700, 'Ann': 0, 'Mark':0, 'Alex':0});
	    t.add({'Mark': 50, 'Ann': 50, 'John': 0, 'Alex':0});
	    t.add({'Mark': 0, 'Ann': 0, 'John': 0, 'Alex':450});

	    var r = t.totals();

	    equal(r.count, 4);
	    equal(r.total, 1290);
	    deepEqual(r.members, [ "Ann", "John", "Mark", "Alex"]);
	    deepEqual(r.solution, { "Alex": 127.5, "Ann": -232.5, "John": 377.5, "Mark": -272.5});
	});

	test('Test filterring', function() {

	    var log = [];

	    // Group 1
	    log.push({'Ann': 40, 'John':0, 'Mark':0, 'Alex':0});
	    log.push({'John': 700, 'Ann': 0, 'Mark':0, 'Alex':0});
	    log.push({'Mark': 50, 'Ann': 50, 'John': 0, 'Alex':0});
	    log.push({'Mark': 0, 'Ann': 0, 'John': 0, 'Alex':450});

	    // Group 2
	    log.push({'Mark': 20, 'John': 50, 'Ann': 0});

	    // Group 3
	    log.push({'John': 30, 'Ann':0, 'Mark': 0});

	    // recognize groups
	    var t = new Spendings();
	    var groupedLogs = t.filterLogs(log);

	    // just check if number of groups is coprrect
	    equal(groupedLogs.length, 2);
	});

	test('Test totals calculation', function() {

	    var log = [];

	    // Group 1
	    log.push({'Ann': 40, 'John':0, 'Mark':0, 'Alex':0});
	    log.push({'John': 700, 'Ann': 0, 'Mark':0, 'Alex':0});
	    log.push({'Mark': 50, 'Ann': 50, 'John': 0, 'Alex':0});
	    log.push({'Mark': 0, 'Ann': 0, 'John': 0, 'Alex':450});

	    // Group 2
	    log.push({'Mark': 20, 'John': 50, 'Ann': 0});

	    // Group 3
	    log.push({'John': 30, 'Ann':0, 'Mark': 0});

	    // recognize groups
	    var t = new Spendings();
	    var data = t.run(log);

	    deepEqual(data, {Ann: -265.8333333333333, John: 424.1666666666667, Mark: -285.8333333333333, Alex: 127.5});
	});

});
