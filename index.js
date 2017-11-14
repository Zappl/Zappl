var express = require('express');
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');

require('events').EventEmitter.prototype._maxListeners = 0;

var index = require('./server/index');
var app = express();
var port = 3000;
var bodyParser = require("body-parser");


// ************
//use
// http.listen(port,function(){
//   console.log('server listen on '+port);
// });
// in place of
// app.listen(port,function(){
//   console.log('server listen on '+port);
// });
// in chat at bottom of this page
// **************


//  MAIN CODE FOR CHAT *************

// var http = require('http').Server(app);
// var io = require('socket.io')(http);
//
//
// var usernames = {};
// var rooms = [];
//
// io.sockets.on('connection', function (socket) {
//     socket.on('adduser', function (data) {
//           var username = data.username;
//           var room = data.room;
//           var receiver = data.receiver;
//           if (rooms.indexOf(room) != -1){
//             socket.username = username;
//             socket.room = room;
//             socket.receiver = receiver;
//             usernames[username] = username;
//             socket.join(room);
//             }
//             else {
//             socket.emit('updatechat', 'SERVER', 'Please enter valid code.');
//             }
//           });
//
//     socket.on('createroom', function (data) {
//         var new_room = data.room;
//         rooms.push(new_room);
//         data.room = new_room;
//         socket.emit('roomcreated', data);
//     });
//
//     socket.on('sendchat', function (data) {
//       io.sockets.in(socket.room).emit('updatechat', socket.username,socket.room, data);
//     });
//
//     socket.on('test321', function (data) {
//       io.sockets.in(socket.room).emit('test123', data);
//     });
//
//     socket.on('sendchat123', function (data) {
//       io.sockets.in(socket.room).emit('updatechat123', socket.username,socket.room, data);
//     });
//
//    socket.on('disconnect', function () {
//         delete usernames[socket.username];
//         io.sockets.emit('updateusers', usernames,socket.room);
//         if (socket.username !== undefined) {
//             //socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
//             socket.leave(socket.room);
//         }
//     });
//
//
// socket.on("typing", function(data) {
//   if (socket.username !== "undefined")
//     io.sockets.in(socket.room).emit("isTyping", {isTyping: data, person: socket.username});
//   });
//
//   socket.on('setscrollheight', function (data) {
//       io.sockets.in(socket.room).emit('getscrollheight', data);
//   });
//
// // -----------GROUP CHAT--------------
//
// socket.on('creategroup', function (data) {
//     var new_room = data.room;
//     rooms.push(new_room);
//     data.room = new_room;
//     socket.emit('groupcreated', data);
// });
//
// socket.on('addgroup', function (data) {
//       var username = data.username;
//       var room = data.room;
//       var displayName = data.displayName;
//       var members = data.members;
//       if (rooms.indexOf(room) != -1){
//         socket.username = username;
//         socket.room = room;
//         socket.displayName = displayName;
//         socket.members = members;
//         usernames[username] = username;
//         socket.join(room);
//         }
//         else {
//         socket.emit('updatechat', 'SERVER', 'Please enter valid code.');
//         }
//       });
//
// socket.on('sendgroupchat', function (data) {
//   io.sockets.in(socket.room).emit('updategroupchat', socket.username,socket.room,socket.displayName,socket.members, data);
// });
//
// socket.on('deletechat', function (data) {
//   io.sockets.in(socket.room).emit('deletechatz', data);
// });
//
// socket.on('sendeditmessage', function (data) {
//   io.sockets.in(socket.room).emit('updatechat1234', socket.username,socket.room,socket.displayName,socket.members, data);
// });
//
// });

// -------------------------------------------------------------END CHAT-----------------------------------------------

//  MAIN CODE FOR CHAT END *************

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

// app.get('/api/newCreate/:type',index);

app.post('/api/getToken',index);
app.get('/api/validateUser/:userName',index);
app.post('/api/generateToken',index);
app.post('/api/getAccessToken',index);
app.get('/api/getUserInfo/:userName',index);
app.get('/api/getUserProfileImage/:userName',index);
app.get('/api/getUserPostData/:userName/:startLimit/:endLimit',index);
app.get('/api/getLogin',index);
app.post('/api/logout',index);
app.get('/api/getWalletDetails/:username',index);
app.get('/api/getUserFollowingCount/:userName',index);
app.get('/api/getFollowingList/:userName/:startLimit/:endLimit',index);
app.get('/api/getCompareFollowingList/:userName/:currentUser',index);
app.get('/api/getCompareFollowerList/:userName/:currentUser',index);
app.get('/api/getFollowingListFourParms/:userName/:currentUser/:startLimit/:endLimit',index);
app.get('/api/getFollowerList/:userName/:startLimit/:endLimit',index);
app.get('/api/getUserFeed/:userName/:startLimit/:endLimit',index);
app.get('/api/getFeedInfo/:type/:startLimit/:endLimit',index);
app.get('/api/getFeedTagInfo/:type/:tag/:startLimit/:endLimit',index);
app.get('/api/getComments/:userName/:startLimit/:endLimit',index);
app.get('/api/getReplies/:userName/:startLimit/:endLimit',index);
app.get('/api/getUserCommentsOnPost/:tag/:username/:permlink',index);
app.get('/api/getUserPostContent/:tag/:username/:permlink',index);
app.get('/api/getTagTopicList', index);
app.get('/api/getVotes/:author/:permlink/:username', index);
app.get('/api/getVotingWeight/:userName',index);
app.get('/api/setVotingWeight/:userName/:votingWeight',index);
app.get('/api/setNsfwSettings/:userName/:nsfw',index);
app.get('/api/getNsfwSettings/:userName',index);
app.get('/api/getCustomSettings/:userName',index);
app.get('/api/setCustomSettings/:vote/:comment/:follow/:mention/:reblog/:votingWeight/:userName',index);

// specially for app side
app.get('/api/getUserImgVote/:author/:permlink/:username',index);
app.get('/api/getVoteInfo/:userName/:startLimit/:endLimit',index);
app.get('/api/getImageInfo/:userName/:startLimit/:endLimit',index);
app.get('/api/getImageInfo_userfeed/:userName/:startLimit/:endLimit',index);
app.get('/api/getVoteInfo_userfeed/:userName/:startLimit/:endLimit',index);
app.get('/api/getImageInfo_feedinfo/:type/:startLimit/:endLimit',index);
app.get('/api/getVoteInfo_feedinfo/:userName/:type/:startLimit/:endLimit',index);
app.get('/api/getImageInfo_feedtaginfo/:type/:tag/:startLimit/:endLimit',index);
app.get('/api/getVoteInfo_feedtaginfo/:userName/:type/:tag/:startLimit/:endLimit',index);
app.get('/api/getImage_following/:userName/:startLimit/:endLimit',index);
app.get('/api/getImage_follower/:userName/:startLimit/:endLimit',index);
app.get('/api/getImage_comments/:userName/:startLimit/:endLimit',index);
app.get('/api/getVote_comments/:userName/:startLimit/:endLimit',index);
app.get('/api/getUserCommentsOnPosts/:tag/:username/:permlink/:startLimit/:endLimit',index);
// specially for app side

app.post('/api/setChat',index);
app.get('/api/getChat/:room',index);
app.post('/api/setRoomHistory',index);
app.post('/api/setRoomList',index);

app.get('/api/getChatList/:username',index);

app.get('/api/getTestUserCommentsOnPost/:parent/:parentPermlink', index);
app.get('/api/getCommentList/:tag/:username/:permlink', index);
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


// app.post('/api/getPostDataVote', index);
// app.post('/api/getPostDataImage', index);

app.post('/api/getPostDataVoteImg', index);





app.get('/api/postPSGSQLite/:SegmentID/:PathID/:Count/:MinLevel/:MaxLevel/:MinLon/:MinLat/:MaxLon/:Buffer', index);
app.get('/api/postSQLite/:Name/:Seq', index);
//app.post('/api/postSQLite', index);
app.get('/api/getSQInfo', index);
app.get('/api/getPSGInfo', index);


app.listen(port,function(){
  console.log('server listen on '+port);
});
