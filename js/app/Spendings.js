define(['simplesets'], function(simplesets) {

    var Spendings = function() {

        // Run through the spendings data
        // filter into separate logs and produce the spendings tables
        this.run = function(log) {
            var groupedLogs = this.filterLogs(log);

            // run through each log and calculate the total spendings for each member
            var result = [];
            var self = this;
            groupedLogs.forEach(function(log, i) {
                result[i] = self.calculateSpendings(log);
            });

            // calculate total for each meber by adding results from each log
            var totalsByMember = {}; // use hash to map members to spendings
            result.forEach(function(r) {
                for (member in r.solution) {
                    // get the number of money spend by each team member
                    if (typeof totalsByMember[member] === 'undefined') {
                        totalsByMember[member] = r.solution[member];
                    } else {
                        totalsByMember[member] += r.solution[member];
                    }
                }
            });
            return totalsByMember;
        }

        var log = [];

        // Adds new spending option into spendings log
        // 
        // arguments description:
        // spendings : object - money spend by each member, for example {'Mark': 40.00, 'John': 700.00}
        //                      note that all team members participating in this spending should be mentioned
        //                      for example if 'Ann' have not spend money but participated 
        //                      it should be mentioned like: {'Mark': 40.00, 'John': 700.00, 'Ann':0}
        this.add = function (spendings) {
            // add spending to appropriate log
            log.push(spendings);
        }

        // Supports only participation of all team members
        // no support fpr partial participation possible for now
        this.totals = function () {
            return this.calculateSpendings(log);
        }

        // Calculate the number of money each team member should give/get in result of transactions for whole team
        // Transaction log should have the following structure
        // Log: Array - [ {}, {}, {}, {} ] array of spending objects
        // spending object should look like: {'Ann': 40: 'John': 700}
        // Input 'spendingsLog' array should contain at least one spending object with at least one member spending
        this.calculateSpendings = function (spendingsLog) {
            // members that participate in current spendings
            // the number of members will be automatically calculated
            var members = new StringSet();
            var totalByMember = {}; // use hash to map members to spendings
            var totalForTeam = 0; // total amount of money spend by whole team

            // run throug the transaction and extract the required totals for team
            spendingsLog.forEach(function(spendings) {
                for (var member in spendings) {
                    // get the set of unique team members
                    if (!members.has(member)) {
                        members.add(member);
                    }
                    // get the number of money spend by each team member
                    if (typeof totalByMember[member] === 'undefined') {
                        totalByMember[member] = spendings[member];
                    } else {
                        totalByMember[member] += spendings[member];
                    }
                    // we need the total number of money that was spend by whole team
                    totalForTeam += spendings[member];
                }
            });

            // calculate team member's share
            var restForMember = {};
            var share = totalForTeam / members.size();

            for (var member in totalByMember) {
                restForMember[member] = totalByMember[member] - share;
            }

            // resulting object will contain the money each team member should put/get from the table
            // in order to complete the deal. For example {John: 20, Anny: -10, Mark: -10} means that
            // Anny and Makr should put $10 on the table and John should take $20
            return {
                'count': members.size(),
                'total': totalForTeam,
                'members': members.array(),
                'solution': restForMember,
            };
        }

        this.filterLogs = function (log) {
            // the Array of Array where each hold logs filterred by groups
            var logs = [];
            // the Array of sets where each set identified by id and 
            // set of members that correspond appropriate log record from logs array
            var logsMembers = [];

            // run through all log entires and splitting them into couple log channels
            log.forEach(function(spending) {
                // get set of members for patricular spending
                var members = getUniqueMembers(spending);

                // retrieve or generate new logId for current set of members
                var logId = (function (members) {
                    // check if same set of members already exists in log and extract its ID
                    for (var id in logsMembers) {
                        if (members.equals(logsMembers[id])) {
                            return id;
                        }
                    }
                    // if we are here, that means we wasn't able to find such set in the array
                    // lets just generate new ID
                    logsMembers.push(members);
                    var logId = logsMembers.indexOf(members); // ugly fix to catch the newly generated index
                    // initialize new log for this group of members
                    logs[logId] = [];
                    return logId;
                }(members));

                // add spending to appropriate array
                logs[logId].push(spending);
            });
            return logs;
        }

        // Extract members from spending object
        function getUniqueMembers(spendings) {
            var members = new StringSet();
            for (var member in spendings) {
                // get unique members
                if (!members.has(member)) {
                    members.add(member);
                }
            }
            return members;
        }

        function addSet() {

        }

    };

    return Spendings;

});