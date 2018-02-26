var http = require('https');
var steem = require('steem');
var jwt = require('jsonwebtoken');
var secretKey = '1qazZAQ!2wsxXSW@';
var moment = require('moment');
var key_utils = require('../updatePsw/key_utils');
var db = require('../db/connect');
var ObjectId = require('mongodb').ObjectId;
var Remarkable = require('remarkable');
var filterText = 'zappl/0.1';
var logger = require('./logger');
var gcm = require('node-gcm');
var apn = require('apn');
var hljs       = require('../updatePsw/highlight.min.js');
var md = new Remarkable('full', {
  html:         false,        // Enable HTML tags in source
  xhtmlOut:     false,        // Use '/' to close single tags (<br />)
  breaks:       false,        // Convert '\n' in paragraphs into <br>
  langPrefix:   'language-',  // CSS language prefix for fenced blocks
  linkify:      true,         // autoconvert URL-like texts to links
  linkTarget:   '',           // set target to open link in
  typographer:  false,
  quotes: '“”‘’',
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (__) {}
    }
    try {
      return hljs.highlightAuto(str).value;
    } catch (__) {}
    return ''; // use external default escaping
  }
});

exports.setRoomHistory = function(data,callback){
  db.chatRoomHistory.findOne({
        roomName : data.roomName
        }, function(err, Info) {
        if (err) {
          console.log(err);
        }
        else{
          if(Info !== undefined && Info !== null && Info !=='')
          {
            db.chatRoomHistory.update({
              roomName : data.roomName
            }, {
              '$set': {
                newRoomName : data.newRoomName,
                roomName : data.newRoomName,
                roomDisplayName : data.roomDisplayName,
                roomMembers : data.roomMembers,
                roomImg : data.roomImg,
                timestamp : data.timestamp
                }
            }, function(err) {
              if (err) {
                console.log(err);
                callback(err,null);
              }
              callback(null);
            });
          }
          else {
            db.chatRoomHistory.save({
              createdBy : data.createdBy,
              roomType : data.roomType,
              userName : data.userName,
              roomName : data.roomName,
              roomDisplayName : data.roomDisplayName,
              roomMembers : data.roomMembers,
              roomImg : data.roomImg,
              timestamp : data.timestamp
                }, function(err) {
                  if (err) {
                  console.log(err);
                  callback(err,null);
                }
                callback(null);
              });
          }
        }
      });
    }

exports.setRoomList = function(data,callback){
  db.roomList.findOne({
        username : data.username
        }, function(err, valueInfo) {
        if (err) {
          console.log(err);
        }
        else{
          if(valueInfo !== undefined && valueInfo !== null && valueInfo !=='')
          {
            db.roomList.update({
              username : data.username
            }, {
              '$addToSet': {
                room : data.room
                }
            }, function(err) {
              if (err) {
                console.log(err);
                callback(err,null);
              }
              callback(null);
            });
          }
          else {
            db.roomList.save({
              username : data.username,
              room : data.room
              }, function(err) {
                  if (err) {
                  console.log(err);
                  callback(err,null);
                }
                callback(null);
              });
          }
        }
      });
    }

exports.setChat = function(data,callback){
  db.chatData.findOne({
        displayName : data.displayName
        }, function(err, valueInfo) {
        if (err) {
          console.log(err);
        }
        else{
            if(valueInfo !== undefined && valueInfo !== null && valueInfo !=='')
          {
            db.chatData.update({
              displayName : data.displayName
            }, {
              '$set': {
                chat : data.chat,
                room : data.room,
                type : data.type,
                members : data.members,
                img : data.img
                }
            }, function(err) {
              if (err) {
                console.log(err);
                callback(err,null);
              }
              callback(null);
            });
          }
          else {
            db.chatData.save({
              room : data.room,
              chat : data.chat,
              displayName : data.displayName,
              type : data.type,
              members : data.members,
              img : data.img
                }, function(err) {
                  if (err) {
                  console.log(err);
                  callback(err,null);
                }
                callback(null);
              });
          }
        }
      });
    }

    exports.getChat = function(room,callback){
      db.chatData.findOne({
              room : room
            }, function(err, valueInfo) {
              if (err) {
                console.log(err);
              }
              if(valueInfo !== undefined && valueInfo !== null && valueInfo !=='')
              {
                var data = {
                  room : valueInfo.room,
                  chat : valueInfo.chat,
                  displayName : valueInfo.displayName,
                  members : valueInfo.members,
                  type : valueInfo.type,
                  img :  valueInfo.img
                }
                callback(null,data);
              }
              else {
                callback(null);
              }
            });
      };


      exports.getChatList = function(username,callback){
        var name = username;
        var finalList =[];
        var finalRoom = {};
        var length;
        var time;
        db.chatData.find({room : {$regex : name}}, { room: 1, chat : 1, type: 1, displayName: 1, members : 1, img : 1}, function(err, valueInfo){
          if (err) {console.log(err);}
          if(valueInfo !== undefined && valueInfo !== null && valueInfo !==''){
            for (var i =0; i<valueInfo.length ; i++){
              if(valueInfo[i].type == 'one'){
                var roomname = valueInfo[i].room;
                roomname = ((roomname.replace(username, " ")).replace("-", " ")).trim();
                if((roomname.indexOf(' ') !== -1) == false){
                  length = valueInfo[i].chat.length-1 ;
                  time = valueInfo[i].chat[length].date;
                  finalRoom = {
                    roomname : roomname,
                    type : valueInfo[i].type,
                    room : valueInfo[i].room,
                    members : valueInfo[i].members,
                    img : '',
                    time : time
                  }
                  finalList.push(finalRoom);
                }
              }
              else if(valueInfo[i].type == 'group'){
              if (valueInfo[i].members.indexOf(username) > -1) {
                length = valueInfo[i].chat.length-1 ;
                if(valueInfo[i].chat[length] != undefined){
                  time = valueInfo[i].chat[length].date;
                }

                finalRoom = {
                    roomname : valueInfo[i].displayName,
                    type : valueInfo[i].type,
                    room : valueInfo[i].room,
                    members : valueInfo[i].members,
                    img : valueInfo[i].img,
                    time :  time || '1507540583054'
                  }
                  finalList.push(finalRoom);
              }
              else {
                console.log("FALSE");
              }

              }
            }
            callback(null,finalList);
          }
          else {callback(null);}
          });
      };



exports.setRegToken = function(userName,regToken,deviceType){
  db.deviceTokenDetails.findOne({
        userName : userName
      }, function(err, valueInfo) {
        if (err) {
          console.log(err);
        }
        else{
          if(valueInfo !== undefined && valueInfo !== null && valueInfo !=='')
          {
            db.deviceTokenDetails.update({
              userName : userName,
            }, {
              '$set': {
                regToken    : regToken,
                deviceType  : deviceType
                }
            }, function(err) {
              if (err) {
                console.log(err);
              }
            });
          }
          else {
            db.deviceTokenDetails.save({
                  userName : userName,
                  regToken    : regToken,
                  deviceType : deviceType
                }, function(err) {
                  if (err) {
                    console.log(err);
                }
              });
          }
        }
      });
    }

  exports.getRegToken = function(userName,callback){
    db.deviceTokenDetails.findOne({
            userName : userName
          }, function(err, valueInfo) {
            if (err) {
              console.log(err);
            }
            if(valueInfo !== undefined && valueInfo !== null && valueInfo !=='')
            {
              var data = {
                regToken : valueInfo.regToken,
                deviceType : valueInfo.deviceType
              }
              callback(null,data);
            }
            else {
              callback(null);
            }
          });
    };



exports.generateToken = function(data,callback){
  var deviceId = data.deviceId;

  db.accessTokens.findOne({
        deviceId : deviceId
      }, function(err, tokenVal) {
        if (err) {
          console.log(err);
        }
        if(tokenVal !== undefined && tokenVal !== null && tokenVal !=='')
        {
          db.accessTokens.remove({
            deviceId : deviceId
          }), function(err) {
            if (err) {
              console.log(err);
              }
          };
        }
          jwt.sign(data, secretKey, function(err, token) {
            if(err){
              console.log(err);
                callback(err,null);
            }
            var decode = jwt.verify(token, secretKey);
            db.accessTokens.save({
              deviceId : data.deviceId,
              token : token
            });
            callback(null,token);
          });
      });
  };

  exports.logout = function(deviceId,callback){
      db.accessTokens.findOne({
            deviceId : deviceId
          }, function(err, tokenVal) {
            if (err) {
              console.log(err);
            }
            if(tokenVal !== undefined && tokenVal !== null && tokenVal !=='')
            {
              db.accessTokens.remove({
                deviceId : deviceId
              }), function(err) {
                if (err) {
                  console.log(err);
                  callback(err,null);
                }
                callback(null);
              };
            }
          });
    };


exports.getToken = function(deviceId,callback){
  db.accessTokens.findOne({
        deviceId : deviceId
      }, function(err, tokenVal) {
        if (err) {
          console.log(err);
        }
        if(tokenVal !== undefined && tokenVal !== null && tokenVal !== '')
        {
            var decode = jwt.verify(tokenVal.token, secretKey);
            var d = new Date(moment().format());
            var timeStamp = d.getTime()/1000;
            if(decode.expirationTimestamp - timeStamp > 0)
            {
                callback(null,tokenVal);
            }
            else {
              tokenVal = null;
              callback(null,tokenVal);
            }
        }
        else {
          callback(null,tokenVal);
        }
      });
};

exports.verifyToken = function(token,callback){
    jwt.verify(token, secretKey, function(err, decoded) {
      if(err){
        console.log(err);
        callback(err,null);
      }
    callback(null,decoded);
    });
  };

exports.getVotingWeight = function(userName,callback){
    db.votingWeight.findOne({
          userName : userName
        }, function(err, votingInfo) {
          if (err) {
            console.log(err);
            }

          if(votingInfo !== undefined && votingInfo !== null && votingInfo !=='')
          {
            callback(null,votingInfo.votingWeight);
          }
          else {
            callback(null,50);
          }
        });
  };

  exports.getNsfwSettings = function(userName,callback){
      db.nsfwSettings.findOne({
            userName : userName
          }, function(err, nsfwInfo) {
            if (err) {
              console.log(err);
            }

            if(nsfwInfo !== undefined && nsfwInfo !== null && nsfwInfo !=='')
            {
              callback(null,nsfwInfo.nsfw);
            }
            else {
              callback(null,'Always warn');
            }
          });
    };

  exports.getCustomSettings = function(userName,callback){
      db.customSettings.findOne({
            userName : userName
          }, function(err, valueInfo) {
            if (err) {
              console.log(err);
            }
            if(valueInfo !== undefined && valueInfo !== null && valueInfo !=='')
            {
              var data = {
                vote : valueInfo.vote,
                comment : valueInfo.comment,
                follow  : valueInfo.follow,
                mention : valueInfo.mention,
                reblog  : valueInfo.reblog,
                userName : valueInfo.userName
              }
              callback(null,data);
            }
            else {
              var data = {
                vote : false,
                comment : false,
                follow  : false,
                mention : false,
                reblog  : false,
                userName : userName
              }
              callback(null,data);
            }
          });
    };


  exports.setCustomSettings = function(vote,comment,follow,mention,reblog,userName,callback){
    db.customSettings.findOne({
          userName : userName
        }, function(err, valueInfo) {
          if (err) {
            console.log(err);
          }
          else{
            if(valueInfo !== undefined && valueInfo !== null && valueInfo !=='')
            {
              db.customSettings.update({
                userName : userName,
              }, {
                '$set': {
                  vote    : vote,
                  comment : comment,
                  follow  : follow,
                  mention : mention,
                  reblog  : reblog
                }
              }, function(err) {
                if (err) {
                  console.log(err);
                  callback(err,null);
                }
                callback(null);
              });
            }
            else {
              db.customSettings.save({
                    userName : userName,
                    vote    : vote,
                    comment : comment,
                    follow  : follow,
                    mention : mention,
                    reblog  : reblog
                  }, function(err) {
                    if (err) {
                      console.log(err);
                      callback(err,null);
                    }
                    callback(null);
                  });
            }
          }
        });
      }

  exports.setVotingWeight = function(userName,votingWeight,callback){
      db.votingWeight.findOne({
            userName : userName
          }, function(err, votingInfo) {
            if (err) {
              console.log(err);
            }

            if(votingInfo !== undefined && votingInfo !== null && votingInfo !=='')
            {

              db.votingWeight.update({
                userName: userName
              }, {
                '$set': {
                  votingWeight :votingWeight
                }
              }, function(err) {
                if (err) {
                  console.log(err);
                  callback(err,null);
                }
                callback(null);
              });
            }
            else {
              db.votingWeight.save({
                    userName : userName,
                    votingWeight :votingWeight
                  }, function(err) {
                    if (err) {
                      console.log(err);
                      callback(err,null);
                    }
                    callback(null);
                  });
            }
          });
    };

    exports.setNsfwSettings = function(userName,nsfw,callback){
        db.nsfwSettings.findOne({
              userName : userName
            }, function(err, nsfwInfo) {
              if (err) {
                console.log(err);
              }

              if(nsfwInfo !== undefined && nsfwInfo !== null && nsfwInfo !=='')
              {
                db.nsfwSettings.update({
                  userName: userName
                }, {
                  '$set': {
                    nsfw :nsfw
                  }
                }, function(err) {
                  if (err) {
                    console.log(err);
                    callback(err,null);
                  }
                  callback(null);
                });
              }
              else {
                db.nsfwSettings.save({
                      userName : userName,
                      nsfw :nsfw
                    }, function(err) {
                      if (err) {
                        console.log(err);
                        callback(err,null);
                      }
                      callback(null);
                    });
              }
            });
      };

    exports.getTagTopicList = function(callback){
      var path = '/tags';
      steem.api.getState(path, function(err, result) {
        if(err){
          console.log(err);
            callback(err,null);
          }
        else{
          tagTopicList = {
                list  : Object.keys(result.tags)
          }
          callback(null,tagTopicList);
        }
      });
    };

    exports.getTagTopicLists = function(callback){
      var afterTag = 'zappl';
      var limit = 30;
      var tagTopicList = [];
      steem.api.getTrendingTags(afterTag, limit, function(err, result) {
        if(err){
          console.log(err);
            callback(err,null);
          }
          else{
            for (var i=0; i<= 29 ; i++){
              tagTopicList.push(result[i].name)
            }
            callback(null,tagTopicList);
          }
        });
      };

exports.getUserInfo = function(userName,callback){
    var profile_image = '';
    var user_info={};
    var name = [userName];
    steem.api.getAccounts(name, function(err, result) {
      if(err){
        console.log("ERROR", err);
        logger.info('get API(getUserInfo) - https://api.steemjs.com/get_accounts, userName = ',userName);
        callback(err,null);
      }
      else{
        if(result[0].json_metadata.length > 0){
            var profileData = JSON.parse(result[0].json_metadata);
            if(profileData.profile !== undefined){
              if(profileData.profile.profile_image !== undefined  && profileData.profile.profile_image.length > 0){
                profile_image = profileData.profile.profile_image;
              }
              else{
                profile_image = 'https://worldarts2015.s3-us-west-2.amazonaws.com/images/default-profile-picture.jpg?cache=1473463677';
              }

              if(profileData.profile.cover_image !== undefined  && profileData.profile.cover_image.length > 0){
                cover_image = profileData.profile.cover_image;
              }
              else{
                cover_image = 'https://png.pngtree.com/thumb_back/fw800/back_pic/00/02/68/82561a11878da26.jpg';
              }
              if(profileData.profile.about !== undefined  && profileData.profile.about.length > 0){
                about = profileData.profile.about;
              }
              else{
                about = '';
              }
              if(profileData.profile.location !== undefined  && profileData.profile.location.length > 0){
                location = profileData.profile.location;
              }
              else{
                location = 'Location - NA';
              }
              if(profileData.profile.name !== undefined  && profileData.profile.name.length > 0){
                name = profileData.profile.name;
              }
              else{
                name =result[0].name;
              }
              if(profileData.profile.website !== undefined  && profileData.profile.website.length > 0){
                website = profileData.profile.website;
              }
              else{
                website =result[0].website;
              }
            }
            else {
                profile_image = 'https://worldarts2015.s3-us-west-2.amazonaws.com/images/default-profile-picture.jpg?cache=1473463677';
                cover_image = 'https://png.pngtree.com/thumb_back/fw800/back_pic/00/02/68/82561a11878da26.jpg';
                about = '';
                location = '';
                name = result[0].name;
                website = '';
            }
        }
        else {
            profile_image = 'https://worldarts2015.s3-us-west-2.amazonaws.com/images/default-profile-picture.jpg?cache=1473463677';
            cover_image = 'https://png.pngtree.com/thumb_back/fw800/back_pic/00/02/68/82561a11878da26.jpg';
            about = '';
            location = '';
            name = result[0].name;
            website = '';
        }
        var createdAcc = result[0].created;
        var month = createdAcc.substr(5, 2);
        var year = createdAcc.substr(0,4);
        var mnth;
          switch(month) {
            case "01":
               mnth =  "January"
                break;
            case "02":
               mnth =  "February"
                break;
            case "03":
               mnth =  "March"
                break;
            case "04":
               mnth =  "April"
                break;
            case "05":
               mnth =  "May"
                break;
            case "06":
               mnth =  "June"
                break;
            case "07":
               mnth =  "July"
                break;
            case "08":
               mnth =  "August"
                break;
            case "09":
               mnth =  "September"
                break;
            case "10":
               mnth =  "October"
                break;
            case "11":
               mnth =  "November"
                break;
            case "12":
               mnth =  "December"
                break;
           }
         user_info = {
              userName        : result[0].name,
              profile_image   : profile_image,
              cover_image     : cover_image,
              about           : about,
              location        : location,
              name            : name,
              website         : website,
              totalPost       : result[0].post_count,
              postingKey      : result[0].posting.key_auths[0][0],
              memo_key        : result[0].memo_key,
              publicActiveKey : result[0].active.key_auths[0][0],
              created         : mnth + " "+ year
        }
      callback(null,user_info);
      }
    });
    };

  exports.validateUser = function(userName,callback){
      var user_info={};
      var name = [userName];
      steem.api.getAccounts(name, function(err, res) {
      if(err){
          console.log(err);
          callback(err,null);
          }
      else{
          user_info = {
                        userName        : res[0].name,
                        postingKey      : res[0].posting.key_auths[0][0],
                        memo_key        : res[0].memo_key,
                        publicActiveKey : res[0].active.key_auths[0][0]
                      }
          callback(null,user_info);
          }
        });
    };

    exports.getUserProfileImage = function(userName,callback){
        var profile_image = '';
        var user_info={};
        var name = [userName];
        steem.api.getAccounts(name, function(err, result) {
          if(err){
            console.log("ERROR", err);
            callback(err,null);
          }
          else{
            if (typeof result[0] !== 'undefined') {
                  if(result[0].json_metadata.length > 0){
                      var profileData = JSON.parse(result[0].json_metadata);
                      if(profileData.profile !== undefined){
                        if(profileData.profile.profile_image !== undefined  && profileData.profile.profile_image.length > 0){
                          profile_image = profileData.profile.profile_image;
                        }
                        else {
                            profile_image = 'https://worldarts2015.s3-us-west-2.amazonaws.com/images/default-profile-picture.jpg?cache=1473463677';
                        }
                      }
                      else {
                          profile_image = 'https://worldarts2015.s3-us-west-2.amazonaws.com/images/default-profile-picture.jpg?cache=1473463677';
                      }
                    }
                  else {
                      profile_image = 'https://worldarts2015.s3-us-west-2.amazonaws.com/images/default-profile-picture.jpg?cache=1473463677';
                  }
              }
              else {
                  profile_image = 'https://worldarts2015.s3-us-west-2.amazonaws.com/images/default-profile-picture.jpg?cache=1473463677';
              }
              callback(null,profile_image);
          }
        });
      };

      exports.getUserProfileImage_Chat = function(userName,time,type,room,members,img,callback){
          var profile_image = '';
          var user_info={};
          var name = [userName];
          steem.api.getAccounts(name, function(err, result) {
            if(err){
              console.log("ERROR", err);
              callback(err,null);
            }
            else{
              if (typeof result[0] !== 'undefined') {
                  if(result[0].json_metadata.length > 0){
                      var profileData = JSON.parse(result[0].json_metadata);
                      if(profileData.profile !== undefined) {
                        if(profileData.profile.profile_image !== undefined  && profileData.profile.profile_image.length > 0){
                          profile_image = profileData.profile.profile_image;
                        }
                        else {
                            profile_image = 'https://worldarts2015.s3-us-west-2.amazonaws.com/images/default-profile-picture.jpg?cache=1473463677';
                        }
                      }
                      else {
                          profile_image = 'https://worldarts2015.s3-us-west-2.amazonaws.com/images/default-profile-picture.jpg?cache=1473463677';
                      }
                    }
                  else {
                      profile_image = 'https://worldarts2015.s3-us-west-2.amazonaws.com/images/default-profile-picture.jpg?cache=1473463677';
                  }
              }
              else {
                  profile_image = 'https://worldarts2015.s3-us-west-2.amazonaws.com/images/default-profile-picture.jpg?cache=1473463677';
              }
              if(type == 'one'){
                var result = {
                  username : userName,
                  time : time,
                  room : room,
                  type : type,
                  members : members,
                  profile_image : profile_image
                }
              }
              else if(type == 'group'){
                var result = {
                  username : userName,
                  time : time,
                  room : room,
                  type : type,
                  members : members,
                  profile_image : img
                }
              }
              callback(null,result);
            }
          });
        };

      exports.getUserProfileImage_ForApp = function(userName,permlink,value,callback){
          var profile_image = '';
          var user_info={};
          var name = [userName];
          steem.api.getAccounts(name, function(err, result) {
            if(err){
              console.log("ERROR", err);
              callback(err,null);
            }
            else{
              if (typeof result[0] !== 'undefined') {
                  if(result[0].json_metadata.length > 0){
                      var profileData = JSON.parse(result[0].json_metadata);
                      if(profileData.profile !== undefined){
                        if(profileData.profile.profile_image !== undefined  && profileData.profile.profile_image.length > 0){
                          profile_image = profileData.profile.profile_image;
                        }
                        else {
                            profile_image = 'https://worldarts2015.s3-us-west-2.amazonaws.com/images/default-profile-picture.jpg?cache=1473463677';
                        }
                      }
                      else {
                          profile_image = 'https://worldarts2015.s3-us-west-2.amazonaws.com/images/default-profile-picture.jpg?cache=1473463677';
                      }
                    }
                  else {
                      profile_image = 'https://worldarts2015.s3-us-west-2.amazonaws.com/images/default-profile-picture.jpg?cache=1473463677';
                  }
              }
              else {
                  profile_image = 'https://worldarts2015.s3-us-west-2.amazonaws.com/images/default-profile-picture.jpg?cache=1473463677';
              }
              var list = {
                profile_image : profile_image,
                author : userName,
                permlink : permlink,
                value : value,
              }
                callback(null,list);
            }
          })
        };

      exports.getUserProfileImage_ForApp123 = function(finalList,callback){
          var profile_image = '';
          var user_info={};
          var name = [finalList.author];
          steem.api.getAccounts(name, function(err, result) {
            if(err){
              console.log("ERROR", err);
              callback(err,null);
            }
            else{
              if (typeof result[0] !== 'undefined') {
                  if(result[0].json_metadata.length > 0){
                      var profileData = JSON.parse(result[0].json_metadata);
                      if(profileData.profile !== undefined){
                        if(profileData.profile.profile_image !== undefined  && profileData.profile.profile_image.length > 0){
                          profile_image = profileData.profile.profile_image;
                        }
                        else {
                            profile_image = 'https://worldarts2015.s3-us-west-2.amazonaws.com/images/default-profile-picture.jpg?cache=1473463677';
                        }
                      }
                      else{
                        profile_image = 'https://worldarts2015.s3-us-west-2.amazonaws.com/images/default-profile-picture.jpg?cache=1473463677';
                      }
                    }
                  else {
                      profile_image = 'https://worldarts2015.s3-us-west-2.amazonaws.com/images/default-profile-picture.jpg?cache=1473463677';
                  }
              }
              else {
                  profile_image = 'https://worldarts2015.s3-us-west-2.amazonaws.com/images/default-profile-picture.jpg?cache=1473463677';
              }
              if(finalList.status == false){
                finalList.weight = 0;
              }
              var list = {
                profile_image : profile_image,
                username : finalList.username,
                permlink : finalList.permlink,
                value : finalList.value,
                status : finalList.status,
                weight : finalList.weight,
                author : finalList.author
              }
              callback(null,list);
            }
          });
        };

exports.getUserFollowingFollowersNo = function(userName,callback){
    var userFollowingFollowersInfo={};
    steem.api.getFollowCount(userName, function(err, result) {
      if(err){
        console.log(err);
        logger.info('get API(getUserFollowingFollowersNo) - https://api.steemjs.com/get_follow_count');
        callback(err,null);
      }
      else{
        userFollowingFollowersInfo = {
              following_count  : result.following_count,
              follower_count   : result.follower_count,
        };
        callback(null,userFollowingFollowersInfo);
      }
    });
  };

exports.getUserPostData = function(loginUser,userName,startLimit,endLimit,callback){
  var el = 100;
  var query = {"tag":userName, "limit": "100"}
  steem.api.getDiscussionsByBlog(query, function(err, result) {
    if(err){
      console.log(err);
      callback(err,null);
    }
    else{
      var finalData = [];
      var obj={};
      for (var i = 0 ; i < el ; i++){
        if(result[i] !== undefined){
          var rslt = JSON.parse(result[i].json_metadata);
          if(rslt.app == filterText){
          finalData.push(result[i]);
          }
        }
        }
        obj.parsedBody = finalData;
        obj.startLimit = parseInt(startLimit);
        obj.endLimit = parseInt(endLimit);
        obj.loginUser = loginUser;

        var userPostInfo =  getUserPostInfo_Feed(obj,function(err,userPostInfo){
          if(err){
            console.log(err);
            callback(err,null);
          }
          //setTimeout(function(){ callback(null,userPostInfo); }, 3000);
          callback(null,userPostInfo);
        });
      }
  });
  };

exports.getUserTopicFeed = function(loginUser,types,tags,startLimit,endLimit,callback){
        var Api;
        var el = 100;
        var query = {"tag":tags, "limit": el};
        switch(types){
          case "New":
          steem.api.getDiscussionsByCreated(query, function(err, result) {
            if(err){
              callback(err,null);
            }
            else{
              var finalData = [];
              var obj={};
              for (var i = 0 ; i < el ; i++){
                if(result[i] !== undefined){
                  var rslt = JSON.parse(result[i].json_metadata);
                  if(rslt.app == filterText){
                  finalData.push(result[i]);
                  }
                }
                }
              obj.parsedBody = finalData;
              obj.startLimit = parseInt(startLimit);
              obj.endLimit = parseInt(endLimit);
              obj.loginUser = loginUser;
              var userPostInfo =  getUserPostInfo_Feed(obj,function(err,userPostInfo){
                if(err)
                {
                  console.log(err);
                  callback(err,null);
                }
                  callback(null,userPostInfo);
              });
            }
          });
           break;
          case "Hot":
          steem.api.getDiscussionsByHot(query, function(err, result) {
            if(err){
              callback(err,null);
            }
            else{
              var finalData = [];
              var obj={};
              for (var i = 0 ; i < el ; i++){
                if(result[i] !== undefined){
                  var rslt = JSON.parse(result[i].json_metadata);
                  if(rslt.app == filterText){
                  finalData.push(result[i]);
                  }
                }
                }
              obj.parsedBody = finalData;
              obj.startLimit = parseInt(startLimit);
              obj.endLimit = parseInt(endLimit);
              obj.loginUser = loginUser;
              var userPostInfo =  getUserPostInfo_Feed(obj,function(err,userPostInfo){
                if(err)
                {
                  console.log(err);
                  callback(err,null);
                }
                  callback(null,userPostInfo);
              });
            }
          });
           break;
          case "Trending":
          steem.api.getDiscussionsByTrending(query, function(err, result) {
            if(err){
              callback(err,null);
            }
            else{
              var finalData = [];
              var obj={};
              for (var i = 0 ; i < el ; i++){
                if(result[i] !== undefined){
                  var rslt = JSON.parse(result[i].json_metadata);
                  if(rslt.app == filterText){
                  finalData.push(result[i]);
                  }
                }
                }
              obj.parsedBody = finalData;
              obj.startLimit = parseInt(startLimit);
              obj.endLimit = parseInt(endLimit);
              obj.loginUser = loginUser;
              var userPostInfo =  getUserPostInfo_Feed(obj,function(err,userPostInfo){
                if(err)
                {
                  console.log(err);
                  callback(err,null);
                }
                  callback(null,userPostInfo);
              });
            }
          });
            break;
          case "Promoted":
          http.get("https://api.steemjs.com/get_discussions_by_promoted?query=%7B%22tag%22%3A%22"+tags+"%22%2C%20%22limit%22%3A%20%22"+el+"%22%7D", function(res) {
          var body = '';
          res.on('data', function(data){
              body += data;
          });
          res.on('end', function() {
            if(body!==undefined && body!==null && body!==''){
              var parsedBody = JSON.parse(body);
              var finalData = [];
              var obj={};
              for (var i = 0 ; i < el ; i++){
                if(parsedBody[i] !== undefined){
                  var result = JSON.parse(parsedBody[i].json_metadata);
                  if(result.app == filterText){
                  finalData.push(parsedBody[i]);
                  }
                }
                }
              obj.parsedBody = finalData;
              obj.startLimit = parseInt(startLimit);
              obj.endLimit = parseInt(endLimit);
              obj.loginUser = loginUser;
              var userPostInfo =  getUserPostInfo_Feed(obj,function(err,userPostInfo){
                if(err)
                {
                  console.log(err);
                  callback(err,null);
                }
                  callback(null,userPostInfo);
                });
            }
            });
          })
        break;
        }
      };

exports.getUserReply = function(loginUser,username,startLimit,endLimit,callback){
  var el = 100;
  steem.api.getRepliesByLastUpdate(username, '', 100, function(err, result) {
    if(err){
          console.log(err);
          callback(err,null);
      }
      else{
        var finalData = [];
        var obj={};
        for (var i = 0 ; i < el ; i++){
          if(result[i] !== undefined){
            try{
              var reslt = JSON.parse(result[i].json_metadata);
            }
            catch(e){
              var reslt = result[i].json_metadata;
            }
            if(reslt.app == filterText){
            finalData.push(result[i]);
            }
          }
          }
        obj.parsedBody = finalData;
        obj.startLimit = parseInt(startLimit);
        obj.endLimit = parseInt(endLimit);
        obj.loginUser = loginUser;
        var userPostInfo =  getUserPostInfo_Feed(obj,function(err,userPostInfo){
          if(err){
            console.log(err);
                callback(err,null);
            }
                callback(null,userPostInfo);
          });
      }
  });
};



             exports.getUserCommentsOnPost = function(loginUser,tag,username,permlink,callback){
                 var comments_on_post={};
                 var comments = [];
                 var path = "/"+tag+"/@"+username+"/"+permlink;
                 var pan = 0;
                 var arr = [];
                       db.contentReportDetails.find({
                          reportedBy : loginUser
                          }, function(err, valueInfo) {
                          if (err) {
                            console.log(err);
                          }
                          else{
                            if(valueInfo.length>0){
                              for (var j=0; j< valueInfo.length; j++){
                                  arr.push(valueInfo[j].contentDetail);
                                }
                            }


                              db.contentReportDetails.find({
                                 status : 'Accepted'
                               }, function(err1, valueInfo1) {
                                 if (err1) {
                                   console.log(err);
                                 }
                                 else{
                                   if(valueInfo1.length > 0){
                                     for (var j=0; j< valueInfo1.length; j++){
                                       pan = pan +1;
                                       arr.push(valueInfo1[j].contentDetail);
                                       }
                                   }
                                   else{
                                     pan == valueInfo1.length;
                                   }
                                   if(pan == valueInfo1.length){

                                     steem.api.getState(path, function(err, results) {
                                       if(err){
                                         console.log("ERROR", err);
                                         callback(err,null)
                                       }
                                       else{
                                         if (typeof results !== 'undefined'){
                                           var obj = results.content;
                                           var length = Object.keys(obj).length;
                                               for (var i = 0; i < length ; i++){
                                                 var content = obj[Object.keys(obj)[i]];
                                                 var text = JSON.parse(content.json_metadata);
                                                 var result;
                                                 var report = arr.find(a => a.toLowerCase() == content.permlink);
                                                 if(text.app == filterText && report == undefined){
                                                   if(content.permlink !== permlink){
                                                   if(content.json_metadata !== ''){
                                                       result = JSON.parse(content.json_metadata);
                                                       }
                                                   else{
                                                       result = {tag:content.catagory};
                                                       }
                                                   var image =[];
                                                   var postImage='';
                                                   image = result.image;
                                                   if(image !== undefined  && image.length > 0)
                                                       {
                                                         postImage = image[0];
                                                       }
                                                   else {
                                                         postImage = '';
                                                       }
                                                       var createdPost = content.created;
                                                       var month = createdPost.substr(5, 2);
                                                       var year = createdPost.substr(0,4);
                                                       var date = createdPost.substr(8,2);
                                                       var mnth;
                                                         switch(month) {
                                                           case "01":
                                                              mnth =  "January"
                                                               break;
                                                           case "02":
                                                              mnth =  "February"
                                                               break;
                                                           case "03":
                                                              mnth =  "March"
                                                               break;
                                                           case "04":
                                                              mnth =  "April"
                                                               break;
                                                           case "05":
                                                              mnth =  "May"
                                                               break;
                                                           case "06":
                                                              mnth =  "June"
                                                               break;
                                                           case "07":
                                                              mnth =  "July"
                                                               break;
                                                           case "08":
                                                              mnth =  "August"
                                                               break;
                                                           case "09":
                                                              mnth =  "September"
                                                               break;
                                                           case "10":
                                                              mnth =  "October"
                                                               break;
                                                           case "11":
                                                              mnth =  "November"
                                                               break;
                                                           case "12":
                                                              mnth =  "December"
                                                               break;
                                                          }

                                                       var dString = mnth +"-"+date+"-"+year;
                                                       var d1 = new Date( (new Date(createdPost))*1 - 1000*3600*5 );   //for new server

                                                       //var d1 = new Date(createdPost);      // working fine with all other servers
                                                       var d2 = new Date();
                                                       var timeDate;

                                                       if(DateDiff.inDays(d1, d2) <= 30){
                                                         var diff = DateDiff.inDays(d1, d2);
                                                         if(diff != 0){
                                                         timeDate = diff+ " "+"days"
                                                         }
                                                         else{
                                                           var minDiff = DateDiff.inMinutes(d1, d2);
                                                           if(minDiff <= 59){
                                                             timeDate = minDiff + " "+"minutes"
                                                           }
                                                           else{
                                                             timeDate = DateDiff.inHour(d1, d2) + " "+"hours"
                                                           }
                                                         }
                                                       }
                                                       else if(DateDiff.inMonths(d1, d2) <= 12 && DateDiff.inDays(d1, d2) >= 31){
                                                         timeDate =DateDiff.inMonths(d1, d2) +  " "+"months";
                                                       }
                                                       else if(DateDiff.inMonths(d1, d2) > 12 && DateDiff.inDays(d1, d2) >= 31){
                                                         timeDate =DateDiff.inYears(d1, d2) +  " "+"years";
                                                       }
                                                       var upvotes= content.pending_payout_value.replace(/SBD/g, "");
                                                       upvotes = Math.round(upvotes * 100) / 100
                                                       var commentPost = {
                                                       profile_image : "https://worldarts2015.s3-us-west-2.amazonaws.com/images/default-profile-picture.jpg?cache=1473463677",
                                                       author : content.author,
                                                       permlink : content.permlink,
                                                       parent_author : content.parent_author,
                                                       parent_permlink : content.parent_permlink,
                                                       created : content.created,
                                                       body   : content.body,
                                                       upvote :  upvotes,
                                                       vote : content.net_votes,
                                                       comments : content.children,
                                                       tags : content.category,
                                                       url : content.url,
                                                       id : content.id,
                                                       image : postImage,
                                                       active_votes: content.active_votes,
                                                       replies : content.replies,
                                                       post_time:timeDate
                                                     };
                                                     comments.push(commentPost);
                                                   }
                                                 }
                                                 }
                                           comments_on_post.comments = comments;
                                         }
                                         else{
                                         var  commentPost = {};
                                             comments.push(commentPost);
                                             comments_on_post.comments = comments;
                                         }
                                     callback(null,comments_on_post);
                                       }
                                     });
                                   }

                                 }
                               });



                          }
                        });


             };

// exports.getUserCommentsOnPost = function(loginUser,tag,username,permlink,callback){
//     var comments_on_post={};
//     var comments = [];
//     var path = "/"+tag+"/@"+username+"/"+permlink;
//
//     steem.api.getState(path, function(err, results) {
//       if(err){
//         console.log("ERROR", err);
//         callback(err,null)
//       }
//       else{
//         if (typeof results !== 'undefined'){
//           var obj = results.content;
//           var length = Object.keys(obj).length;
//               for (var i = 0; i < length ; i++){
//                 var content = obj[Object.keys(obj)[i]];
//                 var text = JSON.parse(content.json_metadata);
//                 var result;
//                 if(text.app == filterText){
//                   if(content.permlink !== permlink){
//                   if(content.json_metadata !== ''){
//                       result = JSON.parse(content.json_metadata);
//                       }
//                   else{
//                       result = {tag:content.catagory};
//                       }
//                   var image =[];
//                   var postImage='';
//                   image = result.image;
//                   if(image !== undefined  && image.length > 0)
//                       {
//                         postImage = image[0];
//                       }
//                   else {
//                         postImage = '';
//                       }
//                       var createdPost = content.created;
//                       var month = createdPost.substr(5, 2);
//                       var year = createdPost.substr(0,4);
//                       var date = createdPost.substr(8,2);
//                       var mnth;
//                         switch(month) {
//                           case "01":
//                              mnth =  "January"
//                               break;
//                           case "02":
//                              mnth =  "February"
//                               break;
//                           case "03":
//                              mnth =  "March"
//                               break;
//                           case "04":
//                              mnth =  "April"
//                               break;
//                           case "05":
//                              mnth =  "May"
//                               break;
//                           case "06":
//                              mnth =  "June"
//                               break;
//                           case "07":
//                              mnth =  "July"
//                               break;
//                           case "08":
//                              mnth =  "August"
//                               break;
//                           case "09":
//                              mnth =  "September"
//                               break;
//                           case "10":
//                              mnth =  "October"
//                               break;
//                           case "11":
//                              mnth =  "November"
//                               break;
//                           case "12":
//                              mnth =  "December"
//                               break;
//                          }
//
//                       var dString = mnth +"-"+date+"-"+year;
//                       var d1 = new Date( (new Date(createdPost))*1 - 1000*3600*5 );   //for new server
//
//                       //var d1 = new Date(createdPost);      // working fine with all other servers
//                       var d2 = new Date();
//                       var timeDate;
//
//                       if(DateDiff.inDays(d1, d2) <= 30){
//                         var diff = DateDiff.inDays(d1, d2);
//                         if(diff != 0){
//                         timeDate = diff+ " "+"days"
//                         }
//                         else{
//                           var minDiff = DateDiff.inMinutes(d1, d2);
//                           if(minDiff <= 59){
//                             timeDate = minDiff + " "+"minutes"
//                           }
//                           else{
//                             timeDate = DateDiff.inHour(d1, d2) + " "+"hours"
//                           }
//                         }
//                       }
//                       else if(DateDiff.inMonths(d1, d2) <= 12 && DateDiff.inDays(d1, d2) >= 31){
//                         timeDate =DateDiff.inMonths(d1, d2) +  " "+"months";
//                       }
//                       else if(DateDiff.inMonths(d1, d2) > 12 && DateDiff.inDays(d1, d2) >= 31){
//                         timeDate =DateDiff.inYears(d1, d2) +  " "+"years";
//                       }
//                       var upvotes= content.pending_payout_value.replace(/SBD/g, "");
//                       upvotes = Math.round(upvotes * 100) / 100
//                       var commentPost = {
//                       profile_image : "https://worldarts2015.s3-us-west-2.amazonaws.com/images/default-profile-picture.jpg?cache=1473463677",
//                       author : content.author,
//                       permlink : content.permlink,
//                       parent_author : content.parent_author,
//                       parent_permlink : content.parent_permlink,
//                       created : content.created,
//                       body   : content.body,
//                       upvote :  upvotes,
//                       vote : content.net_votes,
//                       comments : content.children,
//                       tags : content.category,
//                       url : content.url,
//                       id : content.id,
//                       image : postImage,
//                       active_votes: content.active_votes,
//                       replies : content.replies,
//                       post_time:timeDate
//                     };
//                     comments.push(commentPost);
//                   }
//                 }
//                 }
//           comments_on_post.comments = comments;
//         }
//         else{
//         var  commentPost = {};
//             comments.push(commentPost);
//             comments_on_post.comments = comments;
//         }
//     callback(null,comments_on_post);
//       }
//     });
// };

exports.getUserCommentsOnPost_App = function(loginUser,tag,username,permlink,startLimit,endLimit,callback){
    var comments_on_post={};
    var comments = [];
    var sub = endLimit-startLimit;
    var length;
    var path = "/"+tag+"/@"+username+"/"+permlink;
    var pan = 0;
    var arr = [];
          db.contentReportDetails.find({
             reportedBy : loginUser
             }, function(err, valueInfo) {
             if (err) {
               console.log(err);
             }
             else{
               if(valueInfo.length > 0){
                 for (var j=0; j< valueInfo.length; j++){
                      arr.push(valueInfo[j].contentDetail);
                  }
               }


                   db.contentReportDetails.find({
                      status : 'Accepted'
                    }, function(err1, valueInfo1) {
                      if (err1) {
                        console.log(err);
                      }
                      else{
                        if(valueInfo1.length > 0){
                          for (var j=0; j< valueInfo1.length; j++){
                            pan = pan +1;
                            arr.push(valueInfo1[j].contentDetail);
                            }
                        }
                        else{
                          pan == valueInfo1.length;
                        }

                        if(pan == valueInfo1.length){
                          steem.api.getState(path, function(err, results) {
                            if(err){
                              console.log("ERROR", err);
                              callback(err,null)
                            }
                            else{
                              if (typeof results !== 'undefined'){
                                var obj = results.content;
                                length = (Object.keys(obj).length)-1;
                                if(sub > 0){
                                  if(endLimit > length){
                                      endLimit = length;
                                  }
                                  for (var i = startLimit ; i <= endLimit ; i++){
                                    var content = obj[Object.keys(obj)[i]];
                                    var result;
                                    if(content.json_metadata !== ''){
                                        result = JSON.parse(content.json_metadata);
                                        }
                                    else{
                                        result = {tag:content.catagory};
                                        }
                                        var report = arr.find(a => a.toLowerCase() == content.permlink);
                                        if(result.app == filterText && report == undefined){
                                          if(content.permlink !== permlink){
                                          var image =[];
                                          var postImage='';
                                          image = result.image;
                                          if(image !== undefined  && image.length > 0)
                                              {
                                                postImage = image[0];
                                              }
                                          else {
                                                postImage = '';
                                              }
                                              var createdPost = content.created;
                                              var month = createdPost.substr(5, 2);
                                              var year = createdPost.substr(0,4);
                                              var date = createdPost.substr(8,2);
                                              var mnth;
                                                switch(month) {
                                                  case "01":
                                                     mnth =  "January"
                                                      break;
                                                  case "02":
                                                     mnth =  "February"
                                                      break;
                                                  case "03":
                                                     mnth =  "March"
                                                      break;
                                                  case "04":
                                                     mnth =  "April"
                                                      break;
                                                  case "05":
                                                     mnth =  "May"
                                                      break;
                                                  case "06":
                                                     mnth =  "June"
                                                      break;
                                                  case "07":
                                                     mnth =  "July"
                                                      break;
                                                  case "08":
                                                     mnth =  "August"
                                                      break;
                                                  case "09":
                                                     mnth =  "September"
                                                      break;
                                                  case "10":
                                                     mnth =  "October"
                                                      break;
                                                  case "11":
                                                     mnth =  "November"
                                                      break;
                                                  case "12":
                                                     mnth =  "December"
                                                      break;
                                                 }
                                              var dString = mnth +"-"+date+"-"+year;
                                              var d1 = new Date( (new Date(createdPost))*1 - 1000*3600*5 );   //for new server

                                              //var d1 = new Date(createdPost);      // working fine with all other servers
                                              var d2 = new Date();
                                              var timeDate;
                                              if(DateDiff.inDays(d1, d2) <= 30){
                                                var diff = DateDiff.inDays(d1, d2);
                                                if(diff != 0){
                                                timeDate = diff+ " "+"days"
                                                }
                                                else{
                                                  var minDiff = DateDiff.inMinutes(d1, d2);
                                                  if(minDiff <= 59){
                                                    timeDate = minDiff + " "+"minutes"
                                                  }
                                                  else{
                                                    timeDate = DateDiff.inHour(d1, d2) + " "+"hours"
                                                  }
                                                }
                                              }
                                              else if(DateDiff.inMonths(d1, d2) <= 12 && DateDiff.inDays(d1, d2) >= 31){
                                                timeDate =DateDiff.inMonths(d1, d2) +  " "+"months";
                                              }
                                              else if(DateDiff.inMonths(d1, d2) > 12 && DateDiff.inDays(d1, d2) >= 31){
                                                timeDate =DateDiff.inYears(d1, d2) +  " "+"years";
                                              }
                                              var upvotes= content.pending_payout_value.replace(/SBD/g, "");
                                              upvotes = Math.round(upvotes * 100) / 100
                                              var commentPost = {
                                              profile_image : "https://worldarts2015.s3-us-west-2.amazonaws.com/images/default-profile-picture.jpg?cache=1473463677",
                                              author : content.author,
                                              permlink : content.permlink,
                                              parent_author : content.parent_author,
                                              parent_permlink : content.parent_permlink,
                                              created : content.created,
                                              body   : content.body,
                                              upvote :  upvotes,
                                              vote : content.net_votes,
                                              comments : content.children,
                                              tags : content.category,
                                              url : content.url,
                                              id : content.id,
                                              image : postImage,
                                              active_votes: content.active_votes,
                                              replies : content.replies,
                                              post_time:timeDate
                                            };
                                            comments.push(commentPost);
                                          }
                                        }

                                    }
                                    comments_on_post.comments = comments;
                                    callback(null,comments_on_post);
                                }
                                else{
                                  console.log("TEST MSG");
                                }
                              }
                              else{
                              var  commentPost = {};
                                  comments.push(commentPost);
                                  comments_on_post.comments = comments;
                                  callback(null,comments_on_post);
                              }
                            }
                          })
                        }
                      }
                    });
             }
           });
  };

// exports.getUserCommentsOnPost_App = function(tag,username,permlink,startLimit,endLimit,callback){
//     var comments_on_post={};
//     var comments = [];
//     var sub = endLimit-startLimit;
//     var length;
//     var path = "/"+tag+"/@"+username+"/"+permlink;
//     steem.api.getState(path, function(err, results) {
//       if(err){
//         console.log("ERROR", err);
//         callback(err,null)
//       }
//       else{
//         if (typeof results !== 'undefined'){
//           var obj = results.content;
//           length = (Object.keys(obj).length)-1;
//           if(sub > 0){
//             if(endLimit > length){
//                 endLimit = length;
//             }
//             for (var i = startLimit ; i <= endLimit ; i++){
//               var content = obj[Object.keys(obj)[i]];
//               var result;
//               if(content.permlink !== permlink){
//               if(content.json_metadata !== ''){
//                   result = JSON.parse(content.json_metadata);
//                   }
//               else{
//                   result = {tag:content.catagory};
//                   }
//               var image =[];
//               var postImage='';
//               image = result.image;
//               if(image !== undefined  && image.length > 0)
//                   {
//                     postImage = image[0];
//                   }
//               else {
//                     postImage = '';
//                   }
//                   var createdPost = content.created;
//                   var month = createdPost.substr(5, 2);
//                   var year = createdPost.substr(0,4);
//                   var date = createdPost.substr(8,2);
//                   var mnth;
//                     switch(month) {
//                       case "01":
//                          mnth =  "January"
//                           break;
//                       case "02":
//                          mnth =  "February"
//                           break;
//                       case "03":
//                          mnth =  "March"
//                           break;
//                       case "04":
//                          mnth =  "April"
//                           break;
//                       case "05":
//                          mnth =  "May"
//                           break;
//                       case "06":
//                          mnth =  "June"
//                           break;
//                       case "07":
//                          mnth =  "July"
//                           break;
//                       case "08":
//                          mnth =  "August"
//                           break;
//                       case "09":
//                          mnth =  "September"
//                           break;
//                       case "10":
//                          mnth =  "October"
//                           break;
//                       case "11":
//                          mnth =  "November"
//                           break;
//                       case "12":
//                          mnth =  "December"
//                           break;
//                      }
//                   var dString = mnth +"-"+date+"-"+year;
//                   var d1 = new Date( (new Date(createdPost))*1 - 1000*3600*5 );   //for new server
//
//                   //var d1 = new Date(createdPost);      // working fine with all other servers
//                   var d2 = new Date();
//                   var timeDate;
//                   if(DateDiff.inDays(d1, d2) <= 30){
//                     var diff = DateDiff.inDays(d1, d2);
//                     if(diff != 0){
//                     timeDate = diff+ " "+"days"
//                     }
//                     else{
//                       var minDiff = DateDiff.inMinutes(d1, d2);
//                       if(minDiff <= 59){
//                         timeDate = minDiff + " "+"minutes"
//                       }
//                       else{
//                         timeDate = DateDiff.inHour(d1, d2) + " "+"hours"
//                       }
//                     }
//                   }
//                   else if(DateDiff.inMonths(d1, d2) <= 12 && DateDiff.inDays(d1, d2) >= 31){
//                     timeDate =DateDiff.inMonths(d1, d2) +  " "+"months";
//                   }
//                   else if(DateDiff.inMonths(d1, d2) > 12 && DateDiff.inDays(d1, d2) >= 31){
//                     timeDate =DateDiff.inYears(d1, d2) +  " "+"years";
//                   }
//                   var upvotes= content.pending_payout_value.replace(/SBD/g, "");
//                   upvotes = Math.round(upvotes * 100) / 100
//                   var commentPost = {
//                   profile_image : "https://worldarts2015.s3-us-west-2.amazonaws.com/images/default-profile-picture.jpg?cache=1473463677",
//                   author : content.author,
//                   permlink : content.permlink,
//                   parent_author : content.parent_author,
//                   parent_permlink : content.parent_permlink,
//                   created : content.created,
//                   body   : content.body,
//                   upvote :  upvotes,
//                   vote : content.net_votes,
//                   comments : content.children,
//                   tags : content.category,
//                   url : content.url,
//                   id : content.id,
//                   image : postImage,
//                   active_votes: content.active_votes,
//                   replies : content.replies,
//                   post_time:timeDate
//                 };
//                 comments.push(commentPost);
//               }
//               }
//               comments_on_post.comments = comments;
//               callback(null,comments_on_post);
//           }
//           else{
//             console.log("TEST MSG");
//           }
//         }
//         else{
//         var  commentPost = {};
//             comments.push(commentPost);
//             comments_on_post.comments = comments;
//             callback(null,comments_on_post);
//         }
//       }
//     })
//   };

exports.getCommentList = function(mainObj,subObj, callback){
  var finalList = {};
  var finalArray = {};
  var withComments = [];
  var withoutComments = [];
  for(var i = 0 ; i < mainObj.comments.length; i++){
    if(mainObj.comments[i].comments == 0){
      withoutComments.push(mainObj.comments[i]);
      finalArray.withoutComments = withoutComments;
    }
    else{
      withComments.push(mainObj.comments[i]);
      for(var j = 0 ; j < subObj.comments.length; j++){
        if(mainObj.comments[i].permlink == subObj.comments[j].parent_permlink){
            withComments.push(subObj.comments[j]);
          if(subObj.comments[j].comments != 0){
            for (var k = 0 ; k < subObj.comments.length; k++){
                if(subObj.comments[j].permlink == subObj.comments[k].parent_permlink){
                      withComments.push(subObj.comments[k]);
                      if(subObj.comments[k].comments != 0){
                        for (var l = 0 ; l < subObj.comments.length; l++){
                            if(subObj.comments[k].permlink == subObj.comments[l].parent_permlink){
                                  withComments.push(subObj.comments[l]);
                                  if(subObj.comments[l].comments != 0){
                                    for (var m = 0 ; m < subObj.comments.length; m++){
                                        if(subObj.comments[l].permlink == subObj.comments[m].parent_permlink){
                                              withComments.push(subObj.comments[m]);
                                              if(subObj.comments[m].comments != 0){
                                                for (var n = 0 ; n < subObj.comments.length; n++){
                                                    if(subObj.comments[m].permlink == subObj.comments[n].parent_permlink){
                                                          withComments.push(subObj.comments[n]);
                                                    }
                                                }
                                              }
                                        }
                                    }
                                  }
                            }
                        }
                      }
                }
            }
          }
        }
      }
      finalArray.withComments = withComments;
    }
  }
  callback(null,finalArray);
}

exports.getTestUserCommentsOnPost = function(loginUser,parent, parentPermlink,callback){
    var comments_on_post={};
    var comments = [];
    var pan = 0;
    var arr = [];
          db.contentReportDetails.find({
             reportedBy : loginUser
             }, function(err, valueInfo) {
             if (err) {
               console.log(err);
             }
             else{
               if(valueInfo.length>0){
               for (var j=0; j< valueInfo.length; j++){
                   arr.push(valueInfo[j].contentDetail);
                   }
                 }

                   db.contentReportDetails.find({
                      status : 'Accepted'
                    }, function(err1, valueInfo1) {
                      if (err1) {
                        console.log(err);
                      }
                      else{
                        if(valueInfo1.length > 0){
                          for (var j=0; j< valueInfo1.length; j++){
                            pan = pan +1;
                            arr.push(valueInfo1[j].contentDetail);
                            }
                        }
                        else{
                          pan == valueInfo1.length;
                        }

                        if(pan == valueInfo1.length){
                          steem.api.getContentReplies(parent, parentPermlink, function(err, res){
                            var length = Object.keys(res).length;
                                      for (i=0;i<length;i++){
                                        var content = res[Object.keys(res)[i]];
                                        var result;
                                        if(content.json_metadata !== ''){
                                            result = JSON.parse(content.json_metadata);
                                            }
                                        else{
                                            result = {tag:content.catagory};
                                            }
                                       var report = arr.find(a => a.toLowerCase() == content.permlink);
                                        if(result.app == filterText && report == undefined){
                                        var image =[];
                                        var postImage='';
                                        image = result.image;
                                        if(image !== undefined  && image.length > 0)
                                            {
                                              postImage = image[0];
                                            }
                                        else {
                                              postImage = '';
                                            }

                                            var createdPost = content.created;
                                            var month = createdPost.substr(5, 2);
                                            var year = createdPost.substr(0,4);
                                            var date = createdPost.substr(8,2);
                                            var mnth;
                                              switch(month) {
                                                case "01":
                                                   mnth =  "January"
                                                    break;
                                                case "02":
                                                   mnth =  "February"
                                                    break;
                                                case "03":
                                                   mnth =  "March"
                                                    break;
                                                case "04":
                                                   mnth =  "April"
                                                    break;
                                                case "05":
                                                   mnth =  "May"
                                                    break;
                                                case "06":
                                                   mnth =  "June"
                                                    break;
                                                case "07":
                                                   mnth =  "July"
                                                    break;
                                                case "08":
                                                   mnth =  "August"
                                                    break;
                                                case "09":
                                                   mnth =  "September"
                                                    break;
                                                case "10":
                                                   mnth =  "October"
                                                    break;
                                                case "11":
                                                   mnth =  "November"
                                                    break;
                                                case "12":
                                                   mnth =  "December"
                                                    break;
                                               }

                                            var dString = mnth +"-"+date+"-"+year;
                                            var d1 = new Date( (new Date(createdPost))*1 - 1000*3600*5 );   //for new server
                                            //var d1 = new Date(createdPost);      // working fine with all other servers
                                            var d2 = new Date();
                                            var timeDate;
                                            if(DateDiff.inDays(d1, d2) <= 30){
                                              var diff = DateDiff.inDays(d1, d2);
                                              if(diff != 0){
                                              timeDate = diff+ " "+"days"
                                              }
                                              else{
                                                var minDiff = DateDiff.inMinutes(d1, d2);
                                                if(minDiff <= 59){
                                                  timeDate = minDiff + " "+"minutes"
                                                }

                                                else{
                                                  timeDate = DateDiff.inHour(d1, d2) + " "+"hours"
                                                }
                                              }
                                            }
                                            else if(DateDiff.inMonths(d1, d2) <= 12 && DateDiff.inDays(d1, d2) >= 31){
                                              timeDate =DateDiff.inMonths(d1, d2) +  " "+"months";
                                            }
                                            else if(DateDiff.inMonths(d1, d2) > 12 && DateDiff.inDays(d1, d2) >= 31){
                                              timeDate =DateDiff.inYears(d1, d2) +  " "+"years";
                                            }

                                            var upvotes= content.pending_payout_value.replace(/SBD/g, "");
                                            upvotes = Math.round(upvotes * 100) / 100

                                        commentPost = {
                                          profile_image : "https://worldarts2015.s3-us-west-2.amazonaws.com/images/default-profile-picture.jpg?cache=1473463677",
                                          author : content.author,
                                          permlink : content.permlink,
                                          parent_author : content.parent_author,
                                          parent_permlink : content.parent_permlink,
                                          created : content.created,
                                          body   : content.body,
                                          upvote :  upvotes,
                                          vote : content.net_votes,
                                          comments : content.children,
                                          tags : content.category,
                                          url : content.url,
                                          id : content.id,
                                          image : postImage,
                                          active_votes: content.active_votes,
                                          replies : content.replies,
                                          post_time:timeDate
                                          }
                                          comments.push(commentPost);
                                        }
                                        }
                                  comments_on_post.comments = comments;
                                  callback(null,comments_on_post);
                                })
                        }
                      }
                    })
             }
           })
          }

// exports.getTestUserCommentsOnPost = function(parent, parentPermlink,callback){
//     var comments_on_post={};
//     var comments = [];
//     steem.api.getContentReplies(parent, parentPermlink, function(err, res){
//       var length = Object.keys(res).length;
//                 for (i=0;i<length;i++){
//                   var content = res[Object.keys(res)[i]];
//                   var result;
//                   if(content.json_metadata !== ''){
//                       result = JSON.parse(content.json_metadata);
//                       }
//                   else{
//                       result = {tag:content.catagory};
//                       }
//
//                   if(result.app == filterText){
//                   var image =[];
//                   var postImage='';
//                   image = result.image;
//                   if(image !== undefined  && image.length > 0)
//                       {
//                         postImage = image[0];
//                       }
//                   else {
//                         postImage = '';
//                       }
//
//                       var createdPost = content.created;
//                       var month = createdPost.substr(5, 2);
//                       var year = createdPost.substr(0,4);
//                       var date = createdPost.substr(8,2);
//                       var mnth;
//                         switch(month) {
//                           case "01":
//                              mnth =  "January"
//                               break;
//                           case "02":
//                              mnth =  "February"
//                               break;
//                           case "03":
//                              mnth =  "March"
//                               break;
//                           case "04":
//                              mnth =  "April"
//                               break;
//                           case "05":
//                              mnth =  "May"
//                               break;
//                           case "06":
//                              mnth =  "June"
//                               break;
//                           case "07":
//                              mnth =  "July"
//                               break;
//                           case "08":
//                              mnth =  "August"
//                               break;
//                           case "09":
//                              mnth =  "September"
//                               break;
//                           case "10":
//                              mnth =  "October"
//                               break;
//                           case "11":
//                              mnth =  "November"
//                               break;
//                           case "12":
//                              mnth =  "December"
//                               break;
//                          }
//
//                       var dString = mnth +"-"+date+"-"+year;
//                       var d1 = new Date( (new Date(createdPost))*1 - 1000*3600*5 );   //for new server
//                       //var d1 = new Date(createdPost);      // working fine with all other servers
//                       var d2 = new Date();
//                       var timeDate;
//                       if(DateDiff.inDays(d1, d2) <= 30){
//                         var diff = DateDiff.inDays(d1, d2);
//                         if(diff != 0){
//                         timeDate = diff+ " "+"days"
//                         }
//                         else{
//                           var minDiff = DateDiff.inMinutes(d1, d2);
//                           if(minDiff <= 59){
//                             timeDate = minDiff + " "+"minutes"
//                           }
//
//                           else{
//                             timeDate = DateDiff.inHour(d1, d2) + " "+"hours"
//                           }
//                         }
//                       }
//                       else if(DateDiff.inMonths(d1, d2) <= 12 && DateDiff.inDays(d1, d2) >= 31){
//                         timeDate =DateDiff.inMonths(d1, d2) +  " "+"months";
//                       }
//                       else if(DateDiff.inMonths(d1, d2) > 12 && DateDiff.inDays(d1, d2) >= 31){
//                         timeDate =DateDiff.inYears(d1, d2) +  " "+"years";
//                       }
//
//                       var upvotes= content.pending_payout_value.replace(/SBD/g, "");
//                       upvotes = Math.round(upvotes * 100) / 100
//
//                   commentPost = {
//                     profile_image : "https://worldarts2015.s3-us-west-2.amazonaws.com/images/default-profile-picture.jpg?cache=1473463677",
//                     author : content.author,
//                     permlink : content.permlink,
//                     parent_author : content.parent_author,
//                     parent_permlink : content.parent_permlink,
//                     created : content.created,
//                     body   : content.body,
//                     upvote :  upvotes,
//                     vote : content.net_votes,
//                     comments : content.children,
//                     tags : content.category,
//                     url : content.url,
//                     id : content.id,
//                     image : postImage,
//                     active_votes: content.active_votes,
//                     replies : content.replies,
//                     post_time:timeDate
//                     }
//                     comments.push(commentPost);
//                   }
//                   }
//             comments_on_post.comments = comments;
//             callback(null,comments_on_post);
//           })
//           }

exports.getUserPostContent = function(tag,username,permlink,callback){
    var comments_on_post={};
    var comments = [];
    var path = "/"+tag+"/@"+username+"/"+permlink;
    steem.api.getState(path, function(err, results) {
      if(err){
        console.log("ERROR", err);
        callback(err,null);
      }
      else{
          var obj = results.content;
          var length = Object.keys(obj).length;
              for (var i = 0; i < length ; i++){
                var content = obj[Object.keys(obj)[i]];
                var result;
                var text = JSON.parse(content.json_metadata);
            if(text.app == filterText){
                if(content.permlink === permlink){
                if(content.json_metadata !== ''){
                    result = JSON.parse(content.json_metadata);
                    }
                else{
                    result = {tag:content.catagory};
                    }
                var image =[];
                var postImage='';
                image = result.image;
                allTags = result.tags;
                if(image !== undefined  && image.length > 0)
                    {
                      postImage = image[0];
                    }
                else {
                      postImage = '';
                    }
                    var createdPost = content.created;
                    var month = createdPost.substr(5, 2);
                    var year = createdPost.substr(0,4);
                    var date = createdPost.substr(8,2);
                    var mnth;
                      switch(month) {
                        case "01":
                           mnth =  "January"
                            break;
                        case "02":
                           mnth =  "February"
                            break;
                        case "03":
                           mnth =  "March"
                            break;
                        case "04":
                           mnth =  "April"
                            break;
                        case "05":
                           mnth =  "May"
                            break;
                        case "06":
                           mnth =  "June"
                            break;
                        case "07":
                           mnth =  "July"
                            break;
                        case "08":
                           mnth =  "August"
                            break;
                        case "09":
                           mnth =  "September"
                            break;
                        case "10":
                           mnth =  "October"
                            break;
                        case "11":
                           mnth =  "November"
                            break;
                        case "12":
                           mnth =  "December"
                            break;
                       }

                    var dString = mnth +"-"+date+"-"+year;
                    var d1 = new Date( (new Date(createdPost))*1 - 1000*3600*5 );   //for new server

                    //var d1 = new Date(createdPost);      // working fine with all other servers
                    var d2 = new Date();
                    var timeDate;
                    if(DateDiff.inDays(d1, d2) <= 30){
                      var diff = DateDiff.inDays(d1, d2);
                      if(diff != 0){
                      timeDate = diff+ " "+"days"
                      }
                      else{
                        var minDiff = DateDiff.inMinutes(d1, d2);
                        if(minDiff <= 59){
                          timeDate = minDiff + " "+"minutes"
                        }

                        else{
                          timeDate = DateDiff.inHour(d1, d2) + " "+"hours"
                        }
                      }
                    }
                    else if(DateDiff.inMonths(d1, d2) <= 12 && DateDiff.inDays(d1, d2) >= 31){
                      timeDate =DateDiff.inMonths(d1, d2) +  " "+"months";
                    }
                    else if(DateDiff.inMonths(d1, d2) > 12 && DateDiff.inDays(d1, d2) >= 31){
                      timeDate =DateDiff.inYears(d1, d2) +  " "+"years";
                    }
                    var t1 = md.render( content.body);
                    var htmlBody = t1.replace(/\n/g, "<br />").replace(/&quot;/g,"'").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace('<a href= \"(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)\">(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)</a>', '<img src = "(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)">');
                    var upvotes1= content.total_payout_value.replace(/SBD/g, "");
                    var upvotes2= content.curator_payout_value.replace(/SBD/g, "");
                    var upvotes3= content.pending_payout_value.replace(/SBD/g, "");
                    var upvotes = (+(upvotes1)+(+(upvotes2))+(+(upvotes3)));
                    upvotes = Math.round(upvotes * 100) / 100;
                    var commentPost = {
                    profile_image : "https://worldarts2015.s3-us-west-2.amazonaws.com/images/default-profile-picture.jpg?cache=1473463677",
                    author : content.author,
                    permlink : content.permlink,
                    parent_author : content.parent_author,
                    parent_permlink : content.parent_permlink,
                    created : content.created,
                    body   : htmlBody,
                    upvote :  upvotes,
                    vote : content.net_votes,
                    comments : content.children,
                    tags : content.category,
                    url : content.url,
                    id : content.id,
                    allTags:allTags,
                    image : postImage,
                    active_votes: content.active_votes,
                    replies : content.replies,
                    post_time:timeDate,
                    title:content.title
                  };
                  comments.push(commentPost);
                }
                }
          comments_on_post.comments = comments;
        }
        callback(null,comments_on_post);
      }
    });
};

exports.getUserComments = function(loginUser,username,startLimit,endLimit,callback){
    var el = 100;
    var query = {"start_author":username,"limit":"100"};
    steem.api.getDiscussionsByComments(query, function(err, result) {
      if(err){
            console.log(err);
            callback(err,null);
        }
      else{
        var finalData = [];
        var obj={};
        for (var i = 0 ; i < el ; i++){
          if(result[i] !== undefined){
            var rslt = JSON.parse(result[i].json_metadata);
            if(rslt.app == filterText){
            finalData.push(result[i]);
            }
          }
          }
        obj.parsedBody = finalData;
        obj.startLimit = parseInt(startLimit);
        obj.endLimit = parseInt(endLimit);
        obj.loginUser = loginUser;
        var userPostInfo =  getUserPostInfo_Feed(obj,function(err,userPostInfo){
          if(err){
                console.log(err);
                callback(err,null);
            }
                callback(null,userPostInfo);
          });
      }
    });
  };

  var DateDiff = {
    inSeconds: function(d1, d2){
      var t2 = d2.getTime();
      var t1 = d1.getTime();
      return (parseInt((t2-t1)/(1000)));
    },
    inMinutes: function(d1, d2){
      var t2 = d2.getTime();
      var t1 = d1.getTime();
      var time = (parseInt((t2-t1)/(60000)));
      if (time > 0){
        return time;
      }
      else {
        return time = '1';
      }
    },
    inHour: function(d1, d2){
      var t2 = d2.getTime();
      var t1 = d1.getTime();
      return (parseInt((t2-t1)/(3600000)));
    },
      inDays: function(d1, d2) {
        var t2 = d2.getTime();
        var t1 = d1.getTime();
        return parseInt((t2-t1)/(24*3600*1000));
    },
    inWeeks: function(d1, d2) {
        var t2 = d2.getTime();
        var t1 = d1.getTime();
        return parseInt((t2-t1)/(24*3600*1000*7));
    },
    inMonths: function(d1, d2) {
        var d1Y = d1.getFullYear();
        var d2Y = d2.getFullYear();
        var d1M = d1.getMonth();
        var d2M = d2.getMonth();
        return (d2M+12*d2Y)-(d1M+12*d1Y);
    },
    inYears: function(d1, d2) {
        return d2.getFullYear()-d1.getFullYear();
    }
}

exports.getUserFeed = function(loginUser,username,startLimit,endLimit,callback){
    var el = 100;
    var query = {"tag":username, "limit": "100"};
    steem.api.getDiscussionsByFeed(query, function(err, result) {
          if(err){
            console.log(err);
            callback(err,null);
        }
      else{
        var finalData = [];
        var obj={};
        for (var i = 0 ; i < el ; i++){
          if(result[i] !== undefined){
            var rslt = JSON.parse(result[i].json_metadata);
            if(rslt.app == filterText){
            finalData.push(result[i]);
            }
          }
            }
        obj.parsedBody = finalData;
        obj.startLimit = parseInt(startLimit);
        obj.endLimit   = parseInt(endLimit);
        obj.loginUser = loginUser;
        var userPostInfo =  getUserPostInfo_Feed(obj,function(err,userPostInfo){
          if(err){
            console.log(err);
                callback(err,null);
            }
                callback(null,userPostInfo);
          });
      }
    });
  };

// db.contentReportDetails.find({
//       contentDetail : rep[i].permlink
//       }, function(err, valueInfo) {
//       if (err) {
//         console.log(err);
//       }
//       else{
//         if(valueInfo.length > 0){
//           if(valueInfo[0].status == 'Pending' && valueInfo[0].reportedBy == rep[i].author){
//             console.log("PANKHIL : ",valueInfo[0].reportedBy);
//               }
//           else if(valueInfo[0].status == 'Pending' && valueInfo[0].reportedBy != rep[i].author){
//
//           }
//           else if(valueInfo[0].status != 'Pending'){
//             console.log("PANKHIL : ",valueInfo[0].reportedBy);
//           }
//           }
//           else{
//
//           }
//       }
//     });

function getUserPostInfo_Feed(obj,callback){
  var rep= obj.parsedBody;
  var loginUser = obj.loginUser;
  var startLimit= obj.startLimit;
  var endLimit = obj.endLimit;
  if(endLimit > rep.length){
    endLimit = parseInt(rep.length);
  }
    var objUserPostInfo = {};
    var userPostInfo = [];
    var arr = [];
    var pan = 0;
          db.contentReportDetails.find({
             reportedBy : loginUser
             }, function(err, valueInfo) {
             if (err) {
               console.log(err);
             }
             else{
               if(valueInfo.length > 0){
               for (var j=0; j< valueInfo.length; j++){

                 arr.push(valueInfo[j].contentDetail);
                 }
               }

                 db.contentReportDetails.find({
                    status : 'Accepted'
                  }, function(err1, valueInfo1) {
                    if (err1) {
                      console.log(err);
                    }
                    else{
                      if(valueInfo1.length > 0){
                        for (var j=0; j< valueInfo1.length; j++){
                          pan = pan +1;
                          arr.push(valueInfo1[j].contentDetail);
                          }
                      }
                      else{
                        pan == valueInfo1.length;
                      }
                      if(pan == valueInfo1.length){
                        try{
                        if(startLimit < endLimit){
                                  for(var i = startLimit;i < endLimit;i++){
                                  var image =[];
                                  var postImage='';
                                  var result ;
                                  result = JSON.parse(rep[i].json_metadata);
                                  var report = arr.find(a => a.toLowerCase() == rep[i].permlink);
                                     if(result.app == filterText && report == undefined){
                                        result = JSON.parse(rep[i].json_metadata);
                                        image = result.image;
                                        if(typeof result.tags == 'object'){
                                          allTags = result.tags;
                                        }
                                        else{
                                          allTags = result.tags.split(',');
                                        }
                                        var nsfw = allTags.find(a => a.toLowerCase() == "nsfw");
                                        if(nsfw == undefined){
                                          nsfw = false;
                                        }
                                        else{
                                          nsfw = true;
                                        }
                                        if(image !== undefined  && image.length > 0)
                                        {
                                           postImage = image[0];
                                        }
                                        else {
                                          postImage = '';
                                        }

                                          var createdPost = rep[i].created;
                                          var month = createdPost.substr(5, 2);
                                          var year = createdPost.substr(0,4);
                                          var date = createdPost.substr(8,2);
                                          var mnth;
                                            switch(month) {
                                              case "01":
                                                 mnth =  "January"
                                                  break;
                                              case "02":
                                                 mnth =  "February"
                                                  break;
                                              case "03":
                                                 mnth =  "March"
                                                  break;
                                              case "04":
                                                 mnth =  "April"
                                                  break;
                                              case "05":
                                                 mnth =  "May"
                                                  break;
                                              case "06":
                                                 mnth =  "June"
                                                  break;
                                              case "07":
                                                 mnth =  "July"
                                                  break;
                                              case "08":
                                                 mnth =  "August"
                                                  break;
                                              case "09":
                                                 mnth =  "September"
                                                  break;
                                              case "10":
                                                 mnth =  "October"
                                                  break;
                                              case "11":
                                                 mnth =  "November"
                                                  break;
                                              case "12":
                                                 mnth =  "December"
                                                  break;
                                             }
                                          var dString = mnth +"-"+date+"-"+year;
                                          var d1 = new Date( (new Date(createdPost))*1 - 1000*3600*5 );   //for new server
                                          //var d1 = new Date(createdPost);      // working fine with all other servers
                                          var d2 = new Date();

                                          var timeDate;
                                          if(DateDiff.inDays(d1, d2) <= 30){
                                            var diff = DateDiff.inDays(d1, d2);
                                            if(diff != 0){
                                            timeDate = diff+ " "+"days";
                                            }
                                            else{
                                              var minDiff = DateDiff.inMinutes(d1, d2);
                                              if(minDiff <= 59){
                                                timeDate = minDiff + " "+"minutes";
                                              }
                                              else{
                                                timeDate = DateDiff.inHour(d1, d2) + " "+"hours";
                                              }
                                            }
                                          }
                                          else if(DateDiff.inMonths(d1, d2) <= 12 && DateDiff.inDays(d1, d2) >= 31){
                                            timeDate =DateDiff.inMonths(d1, d2) +  " "+"months";
                                          }
                                          else if(DateDiff.inMonths(d1, d2) > 12 && DateDiff.inDays(d1, d2) >= 31){
                                            timeDate =DateDiff.inYears(d1, d2) +  " "+"years";
                                          }
                                            var t1 = md.render( rep[i].body);
                                            var htmlBody = t1.replace(/\n/g, "<br />").replace(/&quot;/g,"'").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace('<a href= \"(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)\">(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)</a>', '<img src = "(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)" >');
                                            htmlBody = (htmlBody.slice(3)).slice(0, -10);
                                        var upvotes1= rep[i].total_payout_value.replace(/SBD/g, "");
                                        var upvotes2= rep[i].curator_payout_value.replace(/SBD/g, "");
                                        var upvotes3= rep[i].pending_payout_value.replace(/SBD/g, "");
                                        var upvotes = (+(upvotes1)+(+(upvotes2))+(+(upvotes3)));
                                        var vote = Math.round(upvotes * 100) / 100;
                                        vote = vote.toFixed(2);
                                        if(vote == 0){
                                          vote = "0.00";
                                        }
                                        var text = htmlBody;
                                        text = text.replace(/<[^>]*>/g, '');
                                        text = text.toString().substr(0,300);
                                        text = text.replace(/<a[^>]*>([^<]+)<\/a>/g," ").replace(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/g," ").replace(/^<br>|<br>$/g," ").replace(/<img[\s]+[^>]*?((alt*?[\s]?=[\s\"\']+(.*?)[\"\']+.*?)|(src*?[\s]?=[\s\"\']+(.*?)[\"\']+.*?))((src*?[\s]?=[\s\"\']+(.*?)[\"\']+.*?>)|(alt*?[\s]?=[\s\"\']+(.*?)[\"\']+.*?>)|>)/g," ");
                                      userPost = {
                                        author : rep[i].author,
                                        profile_image : 'https://worldarts2015.s3-us-west-2.amazonaws.com/images/default-profile-picture.jpg?cache=1473463677',
                                        title : rep[i].root_title,
                                        image : postImage,
                                        allTags : allTags,
                                         nsfw    : nsfw,
                                        titleZappl : text,
                                        body : htmlBody,
                                        net_votes : rep[i].net_votes,
                                        upvote:vote,
                                        permlink:rep[i].permlink,
                                        comments:rep[i].children,
                                        tags:rep[i].category,
                                        post_time:timeDate
                                      };
                                  userPostInfo.push(userPost);
                                }
                            }
                            }
                                objUserPostInfo.userPostInfo = userPostInfo;
                                callback(null,objUserPostInfo);
                              }
                              catch(e){
                                console.log(e.message);
                                callback(e.message,null);
                                }
                      }
                    }
                  })



               }
             });
      }



      // function getUserPostInfo_Feed(obj,callback){
      //   var rep= obj.parsedBody;
      //   var startLimit= obj.startLimit;
      //   var endLimit = obj.endLimit;
      //   if(endLimit > rep.length){
      //     endLimit = parseInt(rep.length);
      //   }
      //     var objUserPostInfo = {};
      //     var userPostInfo = [];
      //       try{
      //         if(startLimit < endLimit){
      //         for(var i = startLimit;i < endLimit;i++){
      //           var image =[];
      //           var postImage='';
      //           var result ;
      //           result = JSON.parse(rep[i].json_metadata);
      //            if(result.app == filterText){
      //                 result = JSON.parse(rep[i].json_metadata);
      //                 image = result.image;
      //                 if(typeof result.tags == 'object'){
      //                   allTags = result.tags;
      //                 }
      //                 else{
      //                   allTags = result.tags.split(',');
      //                 }
      //                 var nsfw = allTags.find(a => a.toLowerCase() == "nsfw");
      //                 if(nsfw == undefined){
      //                   nsfw = false;
      //                 }
      //                 else{
      //                   nsfw = true;
      //                 }
      //                 if(image !== undefined  && image.length > 0)
      //                 {
      //                    postImage = image[0];
      //                 }
      //                 else {
      //                   postImage = '';
      //                 }
      //
      //                   var createdPost = rep[i].created;
      //                   var month = createdPost.substr(5, 2);
      //                   var year = createdPost.substr(0,4);
      //                   var date = createdPost.substr(8,2);
      //                   var mnth;
      //                     switch(month) {
      //                       case "01":
      //                          mnth =  "January"
      //                           break;
      //                       case "02":
      //                          mnth =  "February"
      //                           break;
      //                       case "03":
      //                          mnth =  "March"
      //                           break;
      //                       case "04":
      //                          mnth =  "April"
      //                           break;
      //                       case "05":
      //                          mnth =  "May"
      //                           break;
      //                       case "06":
      //                          mnth =  "June"
      //                           break;
      //                       case "07":
      //                          mnth =  "July"
      //                           break;
      //                       case "08":
      //                          mnth =  "August"
      //                           break;
      //                       case "09":
      //                          mnth =  "September"
      //                           break;
      //                       case "10":
      //                          mnth =  "October"
      //                           break;
      //                       case "11":
      //                          mnth =  "November"
      //                           break;
      //                       case "12":
      //                          mnth =  "December"
      //                           break;
      //                      }
      //                   var dString = mnth +"-"+date+"-"+year;
      //                   var d1 = new Date( (new Date(createdPost))*1 - 1000*3600*5 );   //for new server
      //                   //var d1 = new Date(createdPost);      // working fine with all other servers
      //                   var d2 = new Date();
      //
      //                   var timeDate;
      //                   if(DateDiff.inDays(d1, d2) <= 30){
      //                     var diff = DateDiff.inDays(d1, d2);
      //                     if(diff != 0){
      //                     timeDate = diff+ " "+"days";
      //                     }
      //                     else{
      //                       var minDiff = DateDiff.inMinutes(d1, d2);
      //                       if(minDiff <= 59){
      //                         timeDate = minDiff + " "+"minutes";
      //                       }
      //                       else{
      //                         timeDate = DateDiff.inHour(d1, d2) + " "+"hours";
      //                       }
      //                     }
      //                   }
      //                   else if(DateDiff.inMonths(d1, d2) <= 12 && DateDiff.inDays(d1, d2) >= 31){
      //                     timeDate =DateDiff.inMonths(d1, d2) +  " "+"months";
      //                   }
      //                   else if(DateDiff.inMonths(d1, d2) > 12 && DateDiff.inDays(d1, d2) >= 31){
      //                     timeDate =DateDiff.inYears(d1, d2) +  " "+"years";
      //                   }
      //                     var t1 = md.render( rep[i].body);
      //                     var htmlBody = t1.replace(/\n/g, "<br />").replace(/&quot;/g,"'").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace('<a href= \"(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)\">(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)</a>', '<img src = "(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)" >');
      //                     htmlBody = (htmlBody.slice(3)).slice(0, -10);
      //                 var upvotes1= rep[i].total_payout_value.replace(/SBD/g, "");
      //                 var upvotes2= rep[i].curator_payout_value.replace(/SBD/g, "");
      //                 var upvotes3= rep[i].pending_payout_value.replace(/SBD/g, "");
      //                 var upvotes = (+(upvotes1)+(+(upvotes2))+(+(upvotes3)));
      //                 var vote = Math.round(upvotes * 100) / 100;
      //                 vote = vote.toFixed(2);
      //                 if(vote == 0){
      //                   vote = "0.00";
      //                 }
      //                 var text = htmlBody;
      //                 text = text.replace(/<[^>]*>/g, '');
      //                 text = text.toString().substr(0,300);
      //                 text = text.replace(/<a[^>]*>([^<]+)<\/a>/g," ").replace(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/g," ").replace(/^<br>|<br>$/g," ").replace(/<img[\s]+[^>]*?((alt*?[\s]?=[\s\"\']+(.*?)[\"\']+.*?)|(src*?[\s]?=[\s\"\']+(.*?)[\"\']+.*?))((src*?[\s]?=[\s\"\']+(.*?)[\"\']+.*?>)|(alt*?[\s]?=[\s\"\']+(.*?)[\"\']+.*?>)|>)/g," ");
      //               userPost = {
      //                 author : rep[i].author,
      //                 profile_image : 'https://worldarts2015.s3-us-west-2.amazonaws.com/images/default-profile-picture.jpg?cache=1473463677',
      //                 title : rep[i].root_title,
      //                 image : postImage,
      //                 allTags : allTags,
      //                  nsfw    : nsfw,
      //                 titleZappl : text,
      //                 body : htmlBody,
      //                 net_votes : rep[i].net_votes,
      //                 upvote:vote,
      //                 permlink:rep[i].permlink,
      //                 comments:rep[i].children,
      //                 tags:rep[i].category,
      //                 post_time:timeDate
      //               };
      //           userPostInfo.push(userPost);
      //         }
      //     }
      //     }
      //         objUserPostInfo.userPostInfo = userPostInfo;
      //         callback(null,objUserPostInfo);
      //       }
      //       catch(e){
      //         console.log(e.message);
      //         callback(e.message,null);
      //         }
      //       }


function getUserPostInfo(obj,callback){
  var rep= obj.parsedBody;
  var startLimit= obj.startLimit;
    var objUserPostInfo = {};
    var userPostInfo = [];
      try{
        if(startLimit < rep.length){
        for(var i = startLimit;i < rep.length;i++){
          var image =[];
          var postImage='';
          var result ;
          result = JSON.parse(rep[i].json_metadata);
          if(result.app == filterText){
              result = JSON.parse(rep[i].json_metadata);
              image = result.image;
              if(typeof result.tags == 'object'){
                allTags = result.tags;
              }
              else{
                allTags = result.tags.split(',');
              }
              var nsfw = allTags.find(a => a.toLowerCase() == "nsfw");
              if(nsfw == undefined){
                nsfw = false;
              }
              else{
                nsfw = true;
              }
              if(image !== undefined  && image.length > 0)
              {
                 postImage = image[0];
              }
              else {
                postImage = '';
              }

                var createdPost = rep[i].created;
                var month = createdPost.substr(5, 2);
                var year = createdPost.substr(0,4);
                var date = createdPost.substr(8,2);
                var mnth;
                  switch(month) {
                    case "01":
                       mnth =  "January"
                        break;
                    case "02":
                       mnth =  "February"
                        break;
                    case "03":
                       mnth =  "March"
                        break;
                    case "04":
                       mnth =  "April"
                        break;
                    case "05":
                       mnth =  "May"
                        break;
                    case "06":
                       mnth =  "June"
                        break;
                    case "07":
                       mnth =  "July"
                        break;
                    case "08":
                       mnth =  "August"
                        break;
                    case "09":
                       mnth =  "September"
                        break;
                    case "10":
                       mnth =  "October"
                        break;
                    case "11":
                       mnth =  "November"
                        break;
                    case "12":
                       mnth =  "December"
                        break;
                   }
                var dString = mnth +"-"+date+"-"+year;
                var d1 = new Date( (new Date(createdPost))*1 - 1000*3600*5 );   //for new server

                //var d1 = new Date(createdPost);      // working fine with all other servers
                var d2 = new Date();

                var timeDate;
                if(DateDiff.inDays(d1, d2) <= 30){
                  var diff = DateDiff.inDays(d1, d2);
                  if(diff != 0){
                  timeDate = diff+ " "+"days";
                  }
                  else{
                    var minDiff = DateDiff.inMinutes(d1, d2);
                    if(minDiff <= 59){
                      timeDate = minDiff + " "+"minutes";
                    }
                    else{
                      timeDate = DateDiff.inHour(d1, d2) + " "+"hours";
                    }
                  }
                }
                else if(DateDiff.inMonths(d1, d2) <= 12 && DateDiff.inDays(d1, d2) >= 31){
                  timeDate =DateDiff.inMonths(d1, d2) +  " "+"months";
                }
                else if(DateDiff.inMonths(d1, d2) > 12 && DateDiff.inDays(d1, d2) >= 31){
                  timeDate =DateDiff.inYears(d1, d2) +  " "+"years";
                }
                  var t1 = md.render( rep[i].body);
                  var htmlBody = t1.replace(/\n/g, "<br />").replace(/&quot;/g,"'").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace('<a href= \"(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)\">(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)</a>', '<img src = "(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)" >');
                  htmlBody = (htmlBody.slice(3)).slice(0, -10);
              var upvotes1= rep[i].total_payout_value.replace(/SBD/g, "");
              var upvotes2= rep[i].curator_payout_value.replace(/SBD/g, "");
              var upvotes3= rep[i].pending_payout_value.replace(/SBD/g, "");
              var upvotes = (+(upvotes1)+(+(upvotes2))+(+(upvotes3)));
              var vote = Math.round(upvotes * 100) / 100;
              vote = vote.toFixed(2);
              if(vote == 0){
                vote = "0.00";
              }
              var text = htmlBody;
              text = text.replace(/<[^>]*>/g, '');
              text = text.toString().substr(0,300);
              text = text.replace(/<a[^>]*>([^<]+)<\/a>/g," ").replace(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/g," ").replace(/^<br>|<br>$/g," ").replace(/<img[\s]+[^>]*?((alt*?[\s]?=[\s\"\']+(.*?)[\"\']+.*?)|(src*?[\s]?=[\s\"\']+(.*?)[\"\']+.*?))((src*?[\s]?=[\s\"\']+(.*?)[\"\']+.*?>)|(alt*?[\s]?=[\s\"\']+(.*?)[\"\']+.*?>)|>)/g," ");
            userPost = {
              author : rep[i].author,
              profile_image : 'https://worldarts2015.s3-us-west-2.amazonaws.com/images/default-profile-picture.jpg?cache=1473463677',
              title : rep[i].root_title,
              image : postImage,
              allTags : allTags,
               nsfw    : nsfw,
              titleZappl : text,
              body : htmlBody,
              net_votes : rep[i].net_votes,
              upvote:vote,
              permlink:rep[i].permlink,
              comments:rep[i].children,
              tags:rep[i].category,
              post_time:timeDate
            };
        userPostInfo.push(userPost);
      }
    }
    }
        objUserPostInfo.userPostInfo = userPostInfo;
        callback(null,objUserPostInfo);
      }
      catch(e){
        console.log(e.message);
        callback(e.message,null);
        }
      }


function getAuthorInfo(objUserPostInfo){
    var objAuthor = objUserPostInfo;
    var profile_image = '';
    var arrImage=[];
    for(var i = 0;i < objAuthor.userPostInfo.length;i++){
      var objImage={};
        http.get("https://api.steemjs.com/get_accounts?names[]=%5B%22"+objAuthor.userPostInfo[i].author+"%22%5D", function(res) {
            var body = '';
            res.on('data', function(data){
                body += data;
            });
            res.on('end', function(){
                var parsedBody = JSON.parse(body);
                if(parsedBody[0].json_metadata.length > 0){
                    var profileData = JSON.parse(parsedBody[0].json_metadata);
                    if(profileData.profile !== undefined){
                      profile_image = profileData.profile.profile_image;
                    }
                    else {
                        profile_image = 'https://cdn2.iconfinder.com/data/icons/social-flat-buttons-3/512/anonymous-512.png';
                    }
                }
                else {
                    profile_image = 'https://cdn2.iconfinder.com/data/icons/social-flat-buttons-3/512/anonymous-512.png';
                }
                objImage.i=i;
                objImage.profile_image=profile_image;
                arrImage.push(objImage);
            })
          })
      }
    return arrImage;
}

exports.getWalletDetails = function(userName,callback){
      var wallet_details={};
      var path = "/@"+userName+"/transfers";
      steem.api.getState(path, function(err, result) {
        if(err){
          callback(err,null);
        }
        else{
          try{
              if (typeof result !== 'undefined') {
              var name =   result['accounts'][userName].name;
              var steem1 = result['accounts'][userName].balance.replace('STEEM', ' ').trim();
              var savings = result['accounts'][userName].savings_balance.replace('STEEM', ' ').trim();
              var savingsSbd = result['accounts'][userName].savings_sbd_balance.replace('SBD', ' ').trim();
              var steemDollars1 = result['accounts'][userName].sbd_balance.replace("SBD", " ").trim();
              var base = result['feed_price'].base.replace("SBD", " ").trim();
              var vestingShare = result['accounts'][userName].vesting_shares.replace("VESTS", " ").trim();
              var totalVestingShare = result['props'].total_vesting_shares.replace("VESTS", " ").trim();
              var reward_sbd_balance = result['accounts'][userName].reward_sbd_balance.replace("SBD", " ").trim();
              var reward_vesting_steem = result['accounts'][userName].reward_vesting_steem;
              var totalVestingFundSteem = result['props'].total_vesting_fund_steem.replace('STEEM', ' ').trim();
              var reward_vesting_steem = result['accounts'][userName].reward_vesting_steem.replace('STEEM', ' ').trim();
              var steemPower1 = (totalVestingFundSteem)*(((vestingShare)/(totalVestingShare)));
              var pro = (base * steemPower1);
              var estimateAccValue1 = (parseFloat(pro) + parseFloat(steemDollars1));
              wallet_details = {
                  userName         : name,
                  steem            : parseFloat(steem1).toFixed(3),
                  steemDollars     : parseFloat(steemDollars1).toFixed(3),
                  steemPower       : parseFloat(steemPower1).toFixed(3),
                  estimateAccValue : parseFloat(estimateAccValue1).toFixed(3),
                  currentReward_firstValue : parseFloat(reward_sbd_balance).toFixed(3),
                  currentReward_secondValue : parseFloat(reward_vesting_steem).toFixed(3),
                  savings : parseFloat(savings).toFixed(3),
                  savingsSbd : parseFloat(savingsSbd).toFixed(3)
                };
              }
              else {
                wallet_details = {
                  steem            : '',
                  steemDollars     : '',
                  steemPower       : '',
                  estimateAccValue : '',
                  currentReward_firstValue : '',
                  currentReward_secondValue : ''
              };
            }
            callback(null,wallet_details);
          }
            catch(e){
              console.log(e);
              callback(e.message,null);
            }
        }
      });
  };

exports.getWalletHistory = function(userName,callback){
      var trx_history={};
      var  trx = {};
      var userWallethistory = [];
      var path = "/@"+userName+"/transfers";
      steem.api.getState(path, function(err, result) {
        if(err){
          callback(err,null);
        }
        else{
          if (typeof result !== 'undefined') {
          var history = result['accounts'][userName].transfer_history;
          for (var i=0;i <history.length;i++){
            if(history[i][1].op[0] == 'transfer'||history[i][1].op[0] == 'cancel_transfer_from_savings'||history[i][1].op[0] == 'withdraw_vesting'||history[i][1].op[0] == 'claim_reward_balance'||history[i][1].op[0] == 'transfer_to_savings'||history[i][1].op[0] == 'transfer_from_savings'||history[i][1].op[0] == 'transfer_to_vesting'){
              if(history[i][1].op[0] == 'withdraw_vesting'){
                if(history[i][1].op[1].vesting_shares != "0.000000 VESTS"){
                  history[i][1].op[1] = 'Start Power Down of '+ history[i][1].op[1].vesting_shares;
                  history[i][1].op[0] = 'Start Power Down';
                }
                else{
                  history[i][1].op[0] = 'Stop Power Down';
                  history[i][1].op[1] = 'Stop Power Down';
                }
              }
              else if(history[i][1].op[0] == 'transfer_to_vesting'){
                history[i][1].op[0] = 'Power Up';
                history[i][1].op[1] = "Transfer " + history[i][1].op[1].amount+" POWER to " + history[i][1].op[1].to;
              }
              else if(history[i][1].op[0] == 'cancel_transfer_from_savings'){
                history[i][1].op[0] = 'Transfer to savings cancelled';
                history[i][1].op[1] = "Cancel transfer from savings (request " +history[i][1].op[1].request_id+")";
              }

              else if(history[i][1].op[0] == 'transfer'){
                history[i][1].op[0] = 'Transfer';
                history[i][1].op[1] = "Transfer " + history[i][1].op[1].amount+" to " + history[i][1].op[1].to;
              }
              else if(history[i][1].op[0] == 'transfer_to_savings'){
                history[i][1].op[0] = 'Transfer to savings';
                history[i][1].op[1] = "Transfer to savings " + history[i][1].op[1].amount+" to " + history[i][1].op[1].to;
              }
              else if(history[i][1].op[0] == 'transfer_from_savings'){
                history[i][1].op[0] = 'Transfer from savings';
                history[i][1].op[1] = "Transfer from savings " + history[i][1].op[1].amount+" to " + history[i][1].op[1].to +"(request "+history[i][1].op[1].request_id+")";
              }
              else if(history[i][1].op[0] == 'claim_reward_balance'){
                history[i][1].op[0] = 'Claim rewards';
                history[i][1].op[1] = "Claim rewards " + history[i][1].op[1].reward_sbd+" and " + history[i][1].op[1].reward_vests;
              }
              var d1 = new Date(history[i][1].timestamp);
              var d2 = new Date();
              var timeDate;
              if(DateDiff.inDays(d1, d2) <= 30){
                var diff = DateDiff.inDays(d1, d2);
                if(diff != 0){
                timeDate = diff+ " "+"days"
                }
                else{
                  var minDiff = DateDiff.inMinutes(d1, d2);
                  if(minDiff <= 59){
                    timeDate = minDiff + " "+"minutes"
                  }
                  else{
                    timeDate = DateDiff.inHour(d1, d2) + " "+"hours"
                  }
                }
              }
              else if(DateDiff.inMonths(d1, d2) <= 12 && DateDiff.inDays(d1, d2) >= 31){
                timeDate =DateDiff.inMonths(d1, d2) +  " "+"months";
              }
              else if(DateDiff.inMonths(d1, d2) > 12 && DateDiff.inDays(d1, d2) >= 31){
                timeDate =DateDiff.inYears(d1, d2) +  " "+"years";
              }
            trx = {
                time : timeDate+ " ago",
                action : history[i][1].op[0],
                data : history[i][1].op[1]
              };
              userWallethistory.push(trx);
                }
              trx_history.userWallethistory = userWallethistory;
              }
            }
            else{
            var  trx = {};
              userWallethistory.push(trx);
              trx_history.userWallethistory = userWallethistory;
            }
        callback(null,trx_history);
        }
      });
      };


exports.getUserFollowingList = function(username,startLimit,endLimit,callback){
  var following_list={};
  var userFollowing = [];
  steem.api.getFollowing(username, '', 'blog', endLimit, function(err, result) {
    if(err){
      console.log("ERROR", err);
      callback(err,null);
    }
    else{
      if (typeof result !== 'undefined' &&  (startLimit < result.length)) {
            for(var i=startLimit;i<result.length;i++){
          var    followingList = {
                follower : result[i].follower,
                following : result[i].following
              };
              userFollowing.push(followingList);
            }
            following_list.userFollowing = userFollowing;
          }
        callback(null,following_list);
      }
  });
};

exports.getUserFollowerList = function(username,startLimit,endLimit,callback){
  var follower_list={};
  var userFollowers = [];
  steem.api.getFollowers(username, '', 'blog', endLimit, function(err, result) {
    if(err){
      console.log(err);
    }
    else{
      try{
        for(var i=startLimit;i<result.length;i++){
          var followerList = {
                follower : result[i].follower,
                following : result[i].following
              };
          userFollowers.push(followerList);
        }
        follower_list.userFollowers = userFollowers;
        callback(null,follower_list);
      }
      catch(e){
        console.log(e);
        callback(e.message,null);
      }
    }
  });
};

exports.getFollowingListFourParms = function(username,currentUser,startLimit,endLimit,callback){
  var following_list={};
  var userFollowing = [];
  steem.api.getFollowing(username, currentUser, 'blog', endLimit, function(err, result) {
    if(err){
      console.log("ERROR", err);
      callback(err,null);
    }
    else{
      if (typeof result !== 'undefined' &&  (startLimit < result.length)) {
            for(var i=startLimit;i<result.length;i++){
          var    followingList = {
                follower : result[i].follower,
                following : result[i].following
              };
              userFollowing.push(followingList);
            }
            following_list.userFollowing = userFollowing;
          }
        else{
              var followingList = {
                follower  : 0,
                following : 0
              };
            }
        callback(null,following_list);
    }
  });
};

exports.getCompareFollowingList = function(username,currentUser,callback){
  var following_list={};
  var userFollowing = [];
  var status = 'follow';
  steem.api.getFollowing(username, currentUser, 'blog', 1, function(err, result) {
    if(err){
      console.log("ERROR", err);
      callback(err,null);
    }
    else{
      if (typeof result[0] !== 'undefined' && result[0] !== '') {
        if(currentUser == result[0].following){
          status = 'unfollow';
        }
          }
        callback(null,status);
    }
  });
};

exports.getCompareFollowingList123 = function(list,callback){
  var following_list={};
  var userFollowing = [];
  var status;
  steem.api.getFollowing(list.username, list.author, 'blog', 1, function(err, result) {
    if(err){
      console.log("ERROR", err);
      callback(err,null);
    }
    else{
      if (typeof result[0] !== 'undefined' && result[0] !== '') {
        if(list.author == result[0].following){
          var list1 = {
            imgUrl : list.imgUrl,
            author : list.author,
            value : list.value,
            username : list.username,
            status : 'unfollow'
          }
        }
        else{
          var list1 = {
            imgUrl : list.imgUrl,
            author : list.author,
            value : list.value,
            username : list.username,
            status : 'follow'
          }
        }
        callback(null,list1);
          }
    }
  });
};

exports.getCompareFollowerList = function(username,currentUser,callback){
  var following_list={};
  var userFollowing = [];
  var status = 'Not_A_Follower';
  steem.api.getFollowers(username, currentUser, 'blog', 1, function(err, result) {
    if(err){
      console.log("ERROR", err);
      callback(err,null);
    }
    else{
      if (typeof result[0] !== 'undefined' && result[0] !== '') {
        if(currentUser == result[0].follower){
          status = 'Follower';
        }
          }
        callback(null,status);
    }
  });
};

exports.getRezapList = function(username,callback){
  var follower_list={};
  var list = [];
  var query = {"tag":username,"limit":100};
  steem.api.getDiscussionsByBlog(query, function(err, result) {
    if(err){
      console.log("ERROR", err);
      callback(err,null);
    }
    else{
      if (typeof result !== 'undefined') {
      for (var i = 0; i<result.length; i++){
        var rezapList ={
          permlink : result[i].permlink
        }
    list.push(rezapList);
  }
    callback(null,list);
  }
    }
  });
  }


exports.checkVote = function(author,permlink,username,callback){
  var voterList = [];
  var list = [];
  var percent;
  steem.api.getActiveVotes(author, permlink, function(err, result) {
    if(err){
      logger.info('post API - https://api.steemjs.com/get_active_votes, ','data(author,permlink,username) :- ',author,permlink,username,', ERROR :- ',e.message);
      callback(err, null);
    }
    else{
      if (typeof result !== 'undefined') {
        for (var i=0; i<result.length; i++){
          voterList.push(result[i].voter);
          var keepGoing = false;
          if(result[i].voter == username){
            percent = result[i].percent;
          }
          if(voterList.find(fl =>fl == username))
          {
            keepGoing = true;
          }
          var test = keepGoing;
        }
        var voteList = {
          status : test,
          percent : percent
        }
        list.push(voteList);
      }
        callback(null,list);
    }
  });
};

exports.checkVoteTest = function(author,permlink,username,value,callback){
  var voterList = [];
  var list = [];
  var percent;
  steem.api.getActiveVotes(author, permlink, function(err, result) {
    if(err){
      logger.info('post API - https://api.steemjs.com/get_active_votes, ','data(author,permlink,username) :- ',author,permlink,username,', ERROR :- ',e.message);
      callback(err, null);
    }
    else{
      for (var i=0; i<result.length; i++){
        voterList.push(result[i].voter);
        var keepGoing = false;
        if(result[i].voter == username){
          percent = result[i].percent;
        }
        if(voterList.find(fl =>fl == username))
        {
          keepGoing = true;
        }
        var test = keepGoing;
      }
      var voteList = {
        status : test,
        percent : percent,
        author : author,
        permlink : permlink,
        username :  username,
        value : value
      }
      list.push(voteList);
      callback(null,list);
    }
  });
};

exports.postVote = function(data,callback){
  var token = data.token;
  var decode = jwt.verify(token, secretKey);
      steem.broadcast.vote(decode.password, decode.userName, data.author, data.permlink, data.weight,function(err, result){
if(err){

  var error123 = err.payload.error.message;

  var right_text = error123.substring(error123.indexOf(".")+1);
  right_text = right_text.substring(0,right_text.indexOf("."));
  right_text = right_text.trim();

  var left_text = error123.substring(error123.indexOf(":")+1);
  left_text = left_text.substring(left_text.indexOf(":")+1);
  left_text = left_text.substring(0,left_text.indexOf("."));
  left_text = left_text.trim();

  if(right_text == "weight == 0: Voting weight is too small, please accumulate more voting power or steem power"){
    err = "Voting weight is too small, please accumulate more voting power or steem power";
    logger.info('post API - steem.broadcast.vote, ','data :- ',data,', ERROR :- ',err);
    callback(err, null);
  }
  else if(left_text == "Voter has used the maximum number of vote changes on this comment"){
    err = "Voter has used the maximum number of vote changes on this comment";
    logger.info('post API - steem.broadcast.vote, ','data :- ',data,', ERROR :- ',err);
    callback(err, null);
  }
  else{
    logger.info('post API - steem.broadcast.vote, ','data :- ',data,', ERROR :- ',err);
    err = "Sorry. Please try after some time!!!"
    callback(err, null);
  }
}
else{
  callback(null,result);
}
});
};

exports.draftPost = function(draftData,callback){
if(draftData.draftId !=='' && draftData.draftId !==undefined && draftData.draftId !==null)
{
  db.draftPost.findOne({
        "_id":ObjectId(draftData.draftId),
        "userName" : draftData.userName
      }, function(err, draftPostVal) {
        if (err) {
          logger.info('post API - draftPost, ','draftData :- ',draftData,', ERROR :- ',err.Message);
          }
        if(draftPostVal !== undefined && draftPostVal !== null && draftPostVal !=='')
        {
            db.draftPost.remove({
              "_id":ObjectId(draftData.draftId),
              "userName" : draftData.userName
            }, function(err) {
              if (err) {
                logger.info('post API - draftPost, ','draftData :- ',draftData,', ERROR :- ',err.Message);
              }
            });
        }
            db.draftPost.save({
              userName : draftData.userName,
              title : draftData.title,
              bodyString : draftData.bodyString,
              fileType : draftData.fileType,
              url : draftData.url,
              upvote : draftData.upvote,
              rewards : draftData.rewards,
              currentDate : moment(new Date()).format("MM/DD/YYYY hh:mm")
            }, function(err) {
              if (err) {
                logger.info('post API - draftPost, ','draftData :- ',draftData,', ERROR :- ',err.Message);
                callback(err,null);
              }
            callback(null,true);
          });
        });
      }
      else {
          db.draftPost.save({
            userName : draftData.userName,
            title : draftData.title,
            bodyString : draftData.bodyString,
            fileType : draftData.fileType,
            url : draftData.url,
            upvote : draftData.upvote,
            rewards : draftData.rewards,
            currentDate : moment(new Date()).format("MM/DD/YYYY hh:mm")
          }, function(err) {
            if (err) {
              logger.info('post API - draftPost, ','draftData :- ',draftData,', ERROR :- ',err.Message);
              callback(err,null);
            }
          callback(null,true);
        });
      }
    }

    exports.deleteDraftOnPost = function(draftData,callback){
      db.draftPost.findOne({
            "_id":ObjectId(draftData.draftId)
          }, function(err, draftPostVal) {
            if (err) {
              logger.info('post API - deleteDraftOnPost, ','draftData :- ',draftData,', ERROR :- ',err);
              console.log('Got error: ' + err.Message);
            }
            if(draftPostVal !== undefined && draftPostVal !== null && draftPostVal !=='')
            {
                db.draftPost.remove({
                  "_id":ObjectId(draftData.draftId)
                }, function(err) {
                  if (err) {
                    logger.info('post API - deleteDraftOnPost, ','draftData :- ',draftData,', ERROR :- ',err.Message);
                    callback(err,null);
                  }
                    callback(null,'true');
                });
            }
            else{
              logger.info('post API - deleteDraftOnPost, ','draftData :- ',draftData,', ERROR :- draftPostVal == undefined');
              callback('false',null);
            }
            });
          }

  exports.getDraftPost = function(userName,callback){
    db.draftPost.find({
          userName : userName
        }, function(err, draftPostVal) {
          if (err) {
              callback(err,null);
          }
      callback(null,draftPostVal);
    });
  }

exports.postCommentBlog = function(data,callback){
  var op = [];
  var token = data.token;
  var permlink;
   var decode = jwt.verify(token, secretKey);
   steem.broadcast.comment(decode.password, data.parentAuthor, data.parentPermlink, decode.userName, data.permlink, data.title, data.body, data.jsonMetadata,function(err, result) {
    if(err){
      //console.log("ERROR1 : ", err);
      if(err.payload.error.data.message == 'Assert Exception'){
          err.payload.error.data.message = 'You may only post once every 5 minutes.';
          callback('You may only post once every 5 minutes.',null);
          logger.info('post API - steem.broadcast.comment, ','Data :- ',data,', ERROR :- ',err.payload.error.data.message);
        }
        else if(err.payload.error.data.message == 'plugin exception'){
          var char = 'a';
          var mask = '';
          if (char.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
          var result123 = '';
          for (var i = 12; i > 0; --i) result123 += mask[Math.round(Math.random() * (mask.length - 1))];
          permlink = result123+"-"+data.permlink;
          steem.broadcast.comment(decode.password, data.parentAuthor, data.parentPermlink, decode.userName, permlink, data.title, data.body, data.jsonMetadata,function(err3, result3) {
            if(err3){
              //console.log("ERROR2 : ", err3);
              if(err3.payload.error.data.message == 'Assert Exception'){
                err3.payload.error.data.message = 'You may only post once every 5 minutes.';
                callback('You may only post once every 5 minutes.',null);
                logger.info('post API - steem.broadcast.comment, ','Data :- ',data,', ERROR :- ',err3.payload.error.data.message);
              }
              else{
                err3.payload.error.data.message = "Something went wrong!! Please try after some time.."
                logger.info('post API - steem.broadcast.comment, ','Data :- ',data,', ERROR :- ',err3.payload.error.data.message);
                callback(err3.payload.error.data.message,null);
              }
            }
            else{
              op.push(result3);
              steem.broadcast.commentOptions(decode.password, decode.userName, permlink, "1000000.000 SBD", 10000, true, true, [[0, { 'beneficiaries': [{ 'account':'zappl', 'weight':1500 }] }]], function(err4, result4) {
              if(err4){
                    logger.info('post API - steem.broadcast.comment, ','Data :- ',data,', ERROR2 :- ',err4.payload.error.data.message);
                    callback(err4.payload.error.data.message,null);
              }
              else{
                op.push(result4);
                callback(null,op);
              }
            })
            }
          })
        }
        else{
          callback(err.payload.error.data.message,null);
          err.payload.error.data.message = "Something went wrong!! Please try after some time.."
          logger.info('post API - steem.broadcast.comment, ','Data :- ',data,', ERROR :- ',err.payload.error.data.message);
        }
      }
      else{
        op.push(result);
        steem.broadcast.commentOptions(decode.password, decode.userName, data.permlink, "1000000.000 SBD", 10000, true, true, [[0, { 'beneficiaries': [{ 'account':'zappl', 'weight':1500 }] }]], function(err1, result1) {
        if(err1){
          logger.info('post API - steem.broadcast.comment, ','Data :- ',data,', ERROR2 :- ',err1.payload.error.data.message);
          callback(err1.payload.error.data.message,null);
        }
        else{
          op.push(result1);
          console.log("Result1 : ",op);
          callback(null,op);
        }
      })
      }
    })
  };

exports.postDeleteCommentBlog = function(data,callback){
  var token = data.token;
   var decode = jwt.verify(token, secretKey);

  steem.broadcast.deleteComment(decode.password, decode.userName, data.permlink, function(err, result) {
    if(err){
      console.log("ERROR :", err);
      callback(err,null);
      logger.info('post API - steem.broadcast.deleteComment, ','Data :- ',data,', ERROR :- ',err);
    }
    else{
      console.log("Result", result);
      callback(null,result);
    }
  });
};

exports.postFollowUnfollowRezappl = function(data,callback){
  var token = data.token;
   var decode = jwt.verify(token, secretKey);
  steem.broadcast.customJson(decode.password, [], [decode.userName], 'follow', data.json, function(err, result) {
    if(err){
      logger.info('post API - steem.broadcast.customJson, ','Data :- ',data,', ERROR :- ',err);
      callback(err,null);
    }
    else{
      console.log("Result", result);
      callback(null,result);
    }
  });
};

exports.postPublicProfile = function(data,callback){
  steem.broadcast.accountUpdate(data.activeWif, data.username, undefined, undefined, undefined, data.memoKey, data.jsonMetadata, function(err, result){
    if(err){
      logger.info('post API - steem.broadcast.accountUpdate, ','Data :- ',data,', ERROR :- ',err);
      callback(err,null);
    }
    else{
      console.log("Result", result);
      callback(null,result);
    }
  });
};

exports.generatePassword = function(callback){
  var  PASSWORD_LENGTH = 48;
  var privateKey = key_utils.get_random_key();
  var psw = privateKey.toWif().substring(3, 3 + PASSWORD_LENGTH);
  var str = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 2);
  var password = "P5"+ psw + str;
  callback(null, password);
};

exports.updatePassword = function(data,callback){
      var publicKeys = steem.auth.generateKeys(data.username, data.newPassword, ['owner', 'active', 'posting', 'memo']);
      var owner = { weight_threshold: 1, account_auths: [], key_auths: [[publicKeys.owner, 1]] };
      var active = { weight_threshold: 1, account_auths: [], key_auths: [[publicKeys.active, 1]] };
      var posting = { weight_threshold: 1, account_auths: [], key_auths: [[publicKeys.posting, 1]] };
      steem.broadcast.accountUpdate(data.ownerKey,data.username,owner,active,posting,publicKeys.memo,data.jsonMetadata,function (err,  result) {
        if(err){
          logger.info('post API - steem.broadcast.accountUpdate, ','Data :- ',data,', ERROR :- ',err);
          callback(err,null);
        }
        else{
          console.log("Result", result);
          callback(null,result);
        }
      });
};

exports.postPushNotificationAndroid = function(data){

  var token = data.token;
  var decode = jwt.verify(token, secretKey);
  var bdyMessage = decode.userName+" "+data.bodyMessage;
  var upr = bdyMessage.toUpperCase();
  var message = new gcm.Message({
      notification: {
          body : upr
      }
  });
  var sender = new gcm.Sender('AAAAvIArcIE:APA91bF3BtVarg1BZ04iNBnuACTT_pEuhVxQokdoJhOLfTrf4GEHR5uaQ9AR8cMAScr0ZMrOCQRrKrlP2Inze26Ztz3ADYiO_Reew5VYV96BtlCZXVmXCAAbNUKfeeyvfqhcpU4qO4Yw');
  var registrationTokens = [];
  registrationTokens.push(data.regToken);
  sender.send(message, { registrationTokens: registrationTokens }, 5, function (err, response) {
    if(err){
      console.error(err);
      }
    else{
      console.log(response);
      }
  });
}


exports.postPushNotificationApple = function(data){
var token = data.token;
var decode = jwt.verify(token, secretKey);
var options = {
  pfx : "./server/iOSCert/Certificates/Dev/APNs/devAPNsCertificates.p12",
  passphrase: '123',
  production     : false,
  batchFeedback  : true,
  interval       : 300,
  maxConnections : 5
};
var bdyMessage = decode.userName+" "+data.bodyMessage;
var upr = bdyMessage.toUpperCase();
var apnProvider = new apn.Provider(options);
var note = new apn.Notification();
var deviceToken = data.regToken;
note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
note.badge = 2;
note.sound = "ping.aiff";
note.alert = upr;
note.payload = {'messageFrom': 'Zappl App'};
apnProvider.send(note, deviceToken).then( (result) => {
  console.log("result",result, Object.keys(result)[1], result[Object.keys(result)[1]]);
});
}

exports.getPublicKeys = function(userName,callback){
    var user_keys={};
    var name = [userName];
     steem.api.getAccounts(name, function(err, result) {
       if(err){
         console.log("ERROR", err);
         logger.info('get API(getUserInfo) - https://api.steemjs.com/get_accounts, userName = ',userName);
         callback(err,null);
       }
       else{
         if (typeof result[0] !== 'undefined'){
               user_keys = {
                    publicPostingKey      : result[0].posting.key_auths[0][0],
                    publicActiveKey       : result[0].active.key_auths[0][0],
                    publicOwnerKey        : result[0].owner.key_auths[0][0],
                    publicMemoKey         : result[0].memo_key
                  }
                }
         else {
             user_keys = {};
             }
         callback(null,user_keys);
       }
     });
  };


  exports.postTransfer = function(data,callback){
      var token = data.token;
      var decode = jwt.verify(token, secretKey);
      steem.broadcast.transfer(data.activeWif, decode.userName, data.to, data.amount, "", function(err, result) {
      if(err){
        logger.info('post API - steem.broadcast.transfer, ','Data :- ',data,', ERROR :- ',err);
        callback(err,null);
      }
      else{
        console.log("Result", result);
        callback(null,result);
      }
    });
  };

  exports.postTransferToSaving = function(data,callback){
    var token = data.token;
    var decode = jwt.verify(token, secretKey);
    steem.broadcast.transferToSavings(data.activeWif, decode.userName, data.to, data.amount, "", function(err, result) {
      if(err){
        logger.info('post API - steem.broadcast.transferToSavings, ','Data :- ',data,', ERROR :- ',err);
        callback(err,null);
      }
      else{
        console.log("Result", result);
        callback(null,result);
      }
    });
  };

  exports.postPowerUp = function(data,callback){
    var token = data.token;
    var decode = jwt.verify(token, secretKey);
    steem.broadcast.transferToVesting(data.activeWif, decode.userName, data.to, data.amount, function(err, result) {
      if(err){
        logger.info('post API - steem.broadcast.transferToVesting, ','Data :- ',data,', ERROR :- ',err);
        callback(err,null);
      }
      else{
        console.log("Result", result);
        callback(null,result);
      }
    });
  };

  exports.postPowerDown = function(data,callback){
    var token = data.token;
    var decode = jwt.verify(token, secretKey);
    var userName = decode.userName;
    var name = userName.split(',');
    steem.api.getAccounts(name, function(err, res) {
      var vesting = res[0].vesting_shares;
      steem.broadcast.withdrawVesting(data.activeWif, userName, vesting, function(err, result) {
        if(err){
          logger.info('post API - steem.broadcast.withdrawVesting, ','Data :- ',data,', ERROR :- ',err);
          callback(err,null);
        }
        else{
          console.log("Result", result);
          callback(null,result);
        }
      });
    });
  };

  exports.postWithdrawSteem = function(data,callback){
    var token = data.token;
    var decode = jwt.verify(token, secretKey);
    var requestId = Math.floor((Date.now() / 1000) % 4294967295);
    steem.broadcast.transferFromSavings(data.activeWif, decode.userName,requestId, data.to, data.amount, "", function(err, result) {
      if(err){
        logger.info('post API - steem.broadcast.transferFromSavings, ','Data :- ',data,', ERROR :- ',err);
        callback(err,null);
      }
      else{
        console.log("Result", result);
        callback(null,result);
      }
    });
  };

  exports.postCancelTransferFromSavings = function(data,callback){
    var token = data.token;
    var decode = jwt.verify(token, secretKey);
      steem.broadcast.cancelTransferFromSavings(data.activeWif, decode.userName, parseInt(data.requestId), function(err, result) {
      if(err){
        logger.info('post API - steem.broadcast.cancelTransferFromSavings, ','Data :- ',data,', ERROR :- ',err);
        console.log("Error", err);
        callback(err,null);
      }
      else{
        console.log("Result", result);
        callback(null,result);
      }
    });
  };

  exports.reqReportAbuse = function(contentData,callback){
        if(contentData !==undefined && contentData !==null)
        {
            db.contentReportDetails.save({
              reportedBy : contentData.reportedBy,
              reportedOn : contentData.reportedOn,
              contentAuthor:contentData.contentAuthor,
              contentDetail : contentData.contentDetail,
              abuseReason : contentData.abuseReason,
              status : contentData.status,
              reportedOn : moment(contentData.reportedOn).format("MM/DD/YYYY hh:mm")
            }, function(err) {
              if (err) {
                logger.info('post API - reqReportAbuse, ','reqReportAbuse :- ',contentData,', ERROR :- ',err.Message);
                callback(err,null);
              }
            callback(null,true);
          });
        }
      }
