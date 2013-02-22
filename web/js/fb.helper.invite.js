window.FBHelper.prototype.inviteFriends = function() {
    FB.ui({method: 'apprequests',
        title: 'Invite friends',
        message: 'Wanna play?'
        // direct request
        //to: friendId
        // suggest friends
        //filters: [{name: 'Suggested', user_ids: ["685145706", "605665581", "596824621"]}]
        // set a target score for the others player
        //data: {"challenge_score" : score };
        //redirect_uri: 'http://friend-battle.lo/response'
    }, function(response){
        if (response) {
            // if the response was truthy the user sent an invitation
            // but we don't care so far...
        }
    });
};

window.FBHelper.prototype.processInvites = function() {
    var startedGame = false;
    var urlParams = {};
    (function () {
        var match,
            pl     = /\+/g,  // Regex for replacing addition symbol with a space
            search = /([^&=]+)=?([^&]*)/g,
            decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
            query  = window.location.search.substring(1);

        while (match = search.exec(query))
            urlParams[decode(match[1])] = decode(match[2]);
    })();

    var requestType = urlParams["app_request_type"];
    if (requestType == "user_to_user") {
        var requestID = urlParams["request_ids"];
        FB.api(requestID, FBHelper.acceptInvite);
    }
    return startedGame;
};

window.FBHelper.prototype.acceptInvite = function(response) {
    var inviteID = response.from.id,
        inviteName = response.from.name.split(" ")[0];

    $('#welcome-msg').text('Invitation from ' + inviteName + ' accepted!');
};