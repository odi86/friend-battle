var global = this;

var FBActivities = function() {
    if (this === global) { return new FBActivities(); }
    var me = this;

    me.loadActivityStream = function(contentDiv) {
        var container = contentDiv.html('<ul></ul>').children('ul');
        container.append('<li>Fetching data...</li>');

        $.getJSON('/api/activitystream', function(response) {
            container.html('');
            var i, content, message;
            for(i=0; i<response.data.length; i++) {
                content = response.data[i];
                message = content.message || (content.story + '<br/>' + content.link);
                container.append('<li><b>' + content.from.name + ':</b><br/>' + message + '</li>')
            }
        });
    }

    me.getRandomActivity = function(callback) {
        var oneWeekAgo  = FBApi.convertToUnixTimeStamp(new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000));
        var query = "select post_id, message " +
            "from stream where message and " +
            " filter_key in (SELECT filter_key FROM stream_filter WHERE uid=me() AND type='newsfeed') " +
            " and is_hidden = 0 " +
            //" and created_time < "  + oneWeekAgo +
            " order by rand()" +
            " limit 1";
        console.log(query);
        FBApi.runFqlQuery(query, function(queryResult) {
            if(!queryResult || queryResult.length === 0 || queryResult.error_msg) {
                console.error("Something went wrong with the query", queryResult);
                return;
            }
            for (var i = 0; i < queryResult.length; i++) {
                FBApi.getById(queryResult[i].post_id, callback);
            }
        });
    }

    me.getLastWeeksActivities = function(contentDiv) {
        var friendList = contentDiv.html('<ul></ul>').children('ul');
        FBFriends.getRandomFriends(5,function(friend) {
            friendList.append("<li>" + friend.name);
            var activityList = friendList.append("<ul id='activities-" + friend.id + "'></ul>").find("#activities-" + friend.id);
            friendList.append("</li>");
            printFriendActivities(friend.id);
        });
    }

    me.getLeaderboard = function() {
        var container = $('#content').html('<ul></ul>').children('ul');
        container.append('<li>Fetching data...</li>');
        $.getJSON('/api/leaderboard', function(response){
            container.html('');
            var i, content;
            for(i=0; i<response.length; i++) {
                content = response[i];
                container.append('<li><b>' + content.name + ':</b> has <b>' + content.coins + '</b> coins</li>')
            }
        });
    }

    var printFriendActivities = function(friendId) {
        var activityList = $("#activities-" + friendId);
        me.getLastWeeksActivitiesOfFriend(friendId, function(activity) {
            printActivity(activity, activityList);
        });
    }

    me.printActivity = function(activity, container) {
        var message, list, friends = [];
        message = activity.message || (activity.story + '<br/>' + activity.link);
        container.append('<li></li>');
        list = container.children('li');
        list.append(message);
        if (activity.picture) {
            list.append("<br/><img src='" + activity.picture + "' />");
        }

        // propose user
        friends.push({name: activity.from.name, id: activity.from.id});
        friends.push({name: 'Jake', id: 0});
        friends.push({name: 'Herbert', id: 0});
        friends.push({name: 'Phil', id: 0});
        friends.sort(function() { return 0.5 - Math.random();});

        list.append("<br/><br/>The activity belongs to:<br/>");
        for (var i=0;i<friends.length;i++) {
            if (friends[i].name === activity.from.name) {
                list.append("<a href=\"#\" onclick=\"FBActivities.validateAnswer(1);\">" + friends[i].name + "</a><br/>");
            } else {
                list.append("<a href=\"#\" onclick=\"FBActivities.validateAnswer(0);\">" + friends[i].name + "</a><br/>");
            }
        }

        console.log("printed activity", activity);
    }

    me.validateAnswer = function(isCorrect) {
        if (isCorrect) {
            alert('you got it!');
            $.getJSON('/api/correctAnswer', function(response) {
                if (response && response.status === 'success') {
                    alert('You got 1 Credit, go check the leaderboard!');
                }
            });
        } else {
            alert('wrong answer!');
        }
        FBFriendBattle.showBattle($('#content'));
    }

    me.getLastWeeksActivitiesOfFriend = function(friendId, callback) {
        var oneWeekAgo  = FBApi.convertToUnixTimeStamp(new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000));
        var twoWeeksAgo = FBApi.convertToUnixTimeStamp(new Date(new Date().getTime() - 14 * 24 * 60 * 60 * 1000));
        var query = "select post_id, actor_id, target_id, message " +
                    "from stream " +
                    "where message and source_id = " + friendId +
                    " and created_time < "  + oneWeekAgo +
                    " and created_time > "  + twoWeeksAgo +
                    "LIMIT 10";
        FBApi.runFqlQuery(query, function(queryResult) {
            if(queryResult.error_msg) {
                console.error(queryResult.error_msg);
                return;
            }
            for (var i = 0; i < queryResult.length; i++) {
                FBApi.getById(queryResult[i].post_id, callback);
            }
        });
    }
}