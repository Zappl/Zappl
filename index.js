var express = require('express');
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');

require('events').EventEmitter.prototype._maxListeners = 0;

var index = require('./server/index');
var app = express();
var port = 3000;
var bodyParser = require("body-parser");

app.set('views',path.join(__dirname,'server/views'));
app.set('view engine','ejs');
app.set('view options', { layout:'layout.ejs' });
app.engine('html',require('ejs').renderFile);
app.use(express.static('client'));
app.use(express.static('node_modules'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({secret: '1qazZAQ!2wsxXSW@'}));

app.use('/',index);
app.get('/',index);
app.get('/Home',index);

app.post('/api/getToken',index);
app.get('/api/validateUser/:userName',index);
app.post('/api/generateToken',index);
app.post('/api/getAccessToken',index);
app.get('/api/getUserInfo/:loginUser/:userName',index);
app.get('/api/getUserProfileImage/:userName',index);
app.get('/api/getUserPostData/:loginUser/:userName/:startLimit/:endLimit',index);
app.get('/api/getLogin',index);
app.post('/api/logout',index);
app.get('/api/getWalletDetails/:username',index);
app.get('/api/getUserFollowingCount/:userName',index);
app.get('/api/getFollowingList/:userName/:startLimit/:endLimit',index);
app.get('/api/getCompareFollowingList/:userName/:currentUser',index);
app.get('/api/getCompareFollowerList/:userName/:currentUser',index);
app.get('/api/getFollowingListFourParms/:userName/:currentUser/:startLimit/:endLimit',index);
app.get('/api/getFollowerList/:userName/:startLimit/:endLimit',index);
app.get('/api/getUserFeed/:loginUser/:userName/:startLimit/:endLimit',index);
app.get('/api/getFeedInfo/:loginUser/:type/:startLimit/:endLimit',index);
app.get('/api/getFeedTagInfo/:loginUser/:type/:tag/:startLimit/:endLimit',index);
app.get('/api/getComments/:loginUser/:userName/:startLimit/:endLimit',index);
app.get('/api/getReplies/:loginUser/:userName/:startLimit/:endLimit',index);
app.get('/api/getUserCommentsOnPost/:loginUser/:tag/:username/:permlink',index);
app.get('/api/getUserPostContent/:tag/:username/:permlink',index);
app.get('/api/getTagTopicList', index);
app.get('/api/getTagTopicLists', index);      //new api
app.get('/api/getVotes/:author/:permlink/:username', index);
app.get('/api/getVotingWeight/:userName',index);
app.get('/api/setVotingWeight/:userName/:votingWeight',index);
app.get('/api/setNsfwSettings/:userName/:nsfw',index);
app.get('/api/getNsfwSettings/:userName',index);
app.get('/api/getCustomSettings/:userName',index);
app.get('/api/setCustomSettings/:vote/:comment/:follow/:mention/:reblog/:votingWeight/:userName',index);

// specially for app side
app.get('/api/getUserImgVote/:author/:permlink/:username',index);
app.get('/api/getVoteInfo/:loginUser/:userName/:startLimit/:endLimit',index);
app.get('/api/getImageInfo/:loginUser/:userName/:startLimit/:endLimit',index);
app.get('/api/getImageInfo_userfeed/:loginUser/:userName/:startLimit/:endLimit',index);
app.get('/api/getVoteInfo_userfeed/:loginUser/:userName/:startLimit/:endLimit',index);
app.get('/api/getImageInfo_feedinfo/:loginUser/:type/:startLimit/:endLimit',index);
app.get('/api/getVoteInfo_feedinfo/:loginUser/:userName/:type/:startLimit/:endLimit',index);
app.get('/api/getImageInfo_feedtaginfo/:loginUser/:type/:tag/:startLimit/:endLimit',index);
app.get('/api/getVoteInfo_feedtaginfo/:loginUser/:userName/:type/:tag/:startLimit/:endLimit',index);
app.get('/api/getImage_following/:userName/:startLimit/:endLimit',index);
app.get('/api/getImage_follower/:userName/:startLimit/:endLimit',index);
app.get('/api/getImage_comments/:loginUser/:userName/:startLimit/:endLimit',index);
app.get('/api/getVote_comments/:loginUser/:userName/:startLimit/:endLimit',index);
app.get('/api/getUserCommentsOnPosts/:loginUser/:tag/:username/:permlink/:startLimit/:endLimit',index);
// specially for app side

app.post('/api/setChat',index);
app.get('/api/getChat/:room',index);
app.post('/api/setRoomHistory',index);
app.post('/api/setRoomList',index);
app.get('/api/getChatList/:username',index);
app.get('/api/getTestUserCommentsOnPost/:loginUser/:parent/:parentPermlink', index);
app.get('/api/getCommentList/:loginUser/:tag/:username/:permlink', index);
app.get('/api/getPassword',index);
app.get('/api/getPublicKeys/:username',index);
app.get('/api/getRezapList/:username',index);
app.post('/api/postPushNotification',index);
app.get('/api/getDraftPost/:userName',index);
app.post('/api/draftPost', index);
app.post('/api/deleteDraftOnPost', index);
app.post('/api/postVote', index);
app.post('/api/postComment', index);
app.post('/api/postDeleteComment', index);
app.post('/api/postBlog', index);
app.post('/api/postDeleteBlog', index);
app.post('/api/postFollow', index);
app.post('/api/postUnfollow', index);
app.post('/api/postRezappl', index);
app.post('/api/postPublicProfile', index);
app.post('/api/updatePassword', index);
app.post('/api/postTransfer', index);
app.post('/api/postTransferToSaving', index);
app.post('/api/postPowerUp', index);
app.post('/api/postPowerDown', index);
app.post('/api/postWithdrawSteem', index);
app.post('/api/postCancelTransferFromSavings', index);
app.post('/api/getPostDataVoteImg', index);

//reportAbuse
app.post('/api/reportAbuse', index);


app.all("/*", function(req, res, next) {
   res.render('layout.html');
});

app.listen(port,function(){
  console.log('server listen on '+port);
});
