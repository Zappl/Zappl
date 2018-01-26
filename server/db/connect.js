var mongojs = require('mongojs');
var connectionURL ='yoursite.com/zappl' ;
var dbs = [
  'accessTokens',
  'votingWeight',
  'draftPost',
  'customSettings',
  'nsfwSettings',
  'chatData',
  'deviceTokenDetails',
  'chatRoomHistory',
  'roomList'
  ];

var db;

if(!db) {
  console.log(connectionURL);
  db = mongojs(connectionURL, dbs);
}

exports = module.exports = db;
