<!DOCTYPE html>
<html>
<head>
    <title>Friend Battle</title>
    <meta charset="utf-8">
    <link rel="stylesheet" href="css/style.css"/>
</head>
<body>
<input type="hidden" id="fb_locale" value="en_US" />
<input type="hidden" id="fb_app_id" value="540154819351099" />
<input type="hidden" id="fb_appNamespace" value="liipfriendbattle" />
<div id="fb-root"></div>
<div id="welcome-msg">You are not logged in</div>
<div id="navigation" class="hidden">
    <ul>
        <li class="first"><a href="#" onclick="FBHelper.loadActivityStream();">Activity stream</a></li>
        <li><a href="#" onclick="FBHelper.inviteFriends();">Invite friends</a></li>
    </ul>
</div>
<div id="content"></div>

<script async src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<script src="js/fb.helper.js"></script>
<script src="js/fb.helper.activitystream.js"></script>
<script src="js/fb.helper.invite.js"></script>
<script src="js/fb.init.js"></script>
<script src="js/fb.sdk.js"></script>
</body>
</html>