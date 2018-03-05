var express = require('express');
var router = express.Router();
var apiController = require('./api');
var steem = require('steem');
var moment = require('moment');
var atob = require('atob');
var permlinkString = new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();


router.post('/api/setRoomHistory',function(req,res){
  var apiReponse={};
  var errorText='';
  var data = {
    createdBy : req.body.createdBy,
    roomType : req.body.roomType,
    userName : req.body.userName,
    roomName : req.body.roomName,
    newRoomName : req.body.newRoomName,
    roomDisplayName : req.body.roomDisplayName,
    roomMembers : req.body.roomMembers,
    roomImg : req.body.roomImg,
    timestamp : req.body.timestamp
   }
  //  console.log(data);
  apiController.setRoomHistory(data,function(err){
      if(err){
          errorText = res.status(500).json(err);
          console.log(err);
      }
      if(errorText ==='')
          {
            apiReponse.error = 0;
            apiReponse.success = 1;
            apiReponse.Message = 'Successful';
          }
      else {
            apiReponse.error = 1;
            apiReponse.success = 0;
            apiReponse.Message = errorText;
          }
      res.status(200).json(apiReponse);
  });
});


router.post('/api/setRoomList',function(req,res){
  var apiReponse={};
  var errorText='';
  var data = {
    username : req.body.username,
    room : req.body.room
   }
  //  console.log(data);
  apiController.setRoomList(data,function(err){
      if(err){
          errorText = res.status(500).json(err);
          console.log(err);
      }
      if(errorText ==='')
          {
            apiReponse.error = 0;
            apiReponse.success = 1;
            apiReponse.Message = 'Successful';
          }
      else {
            apiReponse.error = 1;
            apiReponse.success = 0;
            apiReponse.Message = errorText;
          }
      res.status(200).json(apiReponse);
  });
});


router.post('/api/setChat',function(req,res){
  var apiReponse={};
  var errorText='';
  var data = {
    room : req.body.room,
    chat : req.body.chat,
    displayName : req.body.displayName,
    type : req.body.type,
    members : req.body.members,
    img : req.body.img
   }
  apiController.setChat(data,function(err){
      if(err){
          errorText = res.status(500).json(err);
          console.log(err);
      }
      if(errorText ==='')
          {
            apiReponse.error = 0;
            apiReponse.success = 1;
            apiReponse.Message = 'Successful';
          }
      else {
            apiReponse.error = 1;
            apiReponse.success = 0;
            apiReponse.Message = errorText;
          }
      res.status(200).json(apiReponse);
  });
});

// router.post('/api/setChat',function(req,res){
//   var apiReponse={};
//   var errorText='';
//   var data = {
//     room : req.body.room,
//     displayName : req.body.displayName,
//     type : req.body.type,
//     members : req.body.members,
//     img : req.body.img,
//     chat : req.body.chat
//    }
//   apiController.setChat(data,function(err){
//       if(err){
//           errorText = res.status(500).json(err);
//           console.log(err);
//       }
//       if(errorText ==='')
//           {
//             apiReponse.error = 0;
//             apiReponse.success = 1;
//             apiReponse.Message = 'Successful';
//           }
//       else {
//             apiReponse.error = 1;
//             apiReponse.success = 0;
//             apiReponse.Message = errorText;
//           }
//       res.status(200).json(apiReponse);
//   });
// });


router.get('/api/getChat/:room',function(req,res){
    var apiReponse={};
    var finalRes = {};
    var room = req.params.room;
    var errorText='';
    apiController.getChat(room,function(err,responce){
        if(err){
          errorText = err;
          console.log(err);
        }
        finalRes.chatData = responce;
        if(errorText ==='')
            {
              apiReponse.error = 0;
              apiReponse.success = 1;
              apiReponse.Message = 'Successful';
            }
        else {
              apiReponse.error = 1;
              apiReponse.success = 0;
              apiReponse.Message = errorText;
            }
        apiReponse.data = finalRes;
        res.status(200).json(apiReponse);
   });
  });

  router.get('/api/getChatList/:username',function(req,res){
      var apiReponse={};
      var finalList = {};
      var fullDetail = [];
      var username = req.params.username;
      var errorText='';
      apiController.getChatList(username,function(err,responce){
          if(err){
            apiReponse.error = 1;
            apiReponse.success = 0;
            apiReponse.Message = errorText;
            res.status(500).json(apiReponse);
          }
          else
              {
                for(var i = 0; i<responce.length; i++){
                  var p = 0;
                  apiController.getUserProfileImage_Chat(responce[i].roomname,responce[i].time,responce[i].type,responce[i].room,responce[i].members,responce[i].img,function(error,response){
                    if(error){
                        apiReponse.error = 1;
                        apiReponse.success = 0;
                        apiReponse.Message = errorText;
                        res.status(500).json(apiReponse);
                      }
                      else{
                        finalList = {};
                        finalList.username = response.username;
                        finalList.time = response.time;
                        finalList.profile_image = response.profile_image;
                        finalList.room = response.room;
                        finalList.type = response.type;
                        finalList.members = response.members;
                        p = p+1;
                      }
                      fullDetail.push(finalList);
                      if(p == responce.length){
                        apiReponse.error=0;
                        apiReponse.success=1;
                        apiReponse.Message="Successful";
                        apiReponse.data = fullDetail.sort(function(a,b){
                              var c = a.time;
                              var d = b.time;
                              return new Date(d)-new Date(c);
                            });
                        res.status(200).json(apiReponse);
                      }
                  })
                }
              }
            });
          });


// router.get('/api/getChatList/:username',function(req,res){
//     var apiReponse={};
//     var finalList = {};
//     var fullDetail = [];
//     var username = req.params.username;
//     var errorText='';
//     apiController.getChatList(username,function(err,responce){
//         if(err){
//           apiReponse.error = 1;
//           apiReponse.success = 0;
//           apiReponse.Message = errorText;
//           res.status(500).json(apiReponse);
//         }
//         else
//             {
//               for(var i = 0; i<responce.length; i++){
//                 var p = 0;
//                 apiController.getUserProfileImage_Chat(responce[i].roomname,responce[i].time,function(error,response){
//                   if(error){
//                       apiReponse.error = 1;
//                       apiReponse.success = 0;
//                       apiReponse.Message = errorText;
//                       res.status(500).json(apiReponse);
//                     }
//                     else{
//                       finalList = {};
//                       finalList.username = response.username;
//                       finalList.time = response.time;
//                       finalList.profile_image = response.profile_image;
//                       p = p+1;
//                     }
//                     fullDetail.push(finalList);
//                     if(p == responce.length){
//                       apiReponse.error=0;
//                       apiReponse.success=1;
//                       apiReponse.Message="Successful";
//                       apiReponse.data = fullDetail.sort(function(a,b){
//                             var c = a.time;
//                             var d = b.time;
//                             return new Date(d)-new Date(c);
//                           });
//                       res.status(200).json(apiReponse);
//                     }
//                 })
//               }
//             }
//           });
//         });



 // Login
router.get('/',function(req,res){
  res.render('layout.html');
});


router.post('/api/getToken',function(req,res){

  var deviceId = req.body.deviceId;
  var currentDate = req.body.currentDate;


  apiController.getToken(deviceId,function(err,token){
      if(err){
            res.status(500).json(err);
      }
      console.log('tokkkken',token);
        //res.send(token);
      if(token !== undefined && token !== null && token !== ''){
        var  tokenData = {
                          success:'true',
                          message:'token generated',
                          tokenInfo:token.token
                        };
        // var  tokenData = {
        //         tokenInfo:token.token
        //       };
              res.send(tokenData);
            }
            else{
              var  tokenData = {
                                success:'false',
                                message:'token failed',
                                tokenInfo:token
                              };
          res.send(tokenData);
        }
        //res.json({
        //   tokenData:token.data.token
        // })
  });

});

// router.post('/api/generateToken', function(req, res){
// apiSession = req.session;
// var memo_key;
// var publicActiveKey;
// var postingKey;
// var newPassword;
// var username = req.body.username;
// var password = req.body.password;
// var deviceId = req.body.deviceId;
// var currentDate = new Date();
// var expiredLimit = req.body.expiredLimit;
// var data = {};
// var finalRes = {};
// var apiReponse = {};
// var errorText='';
// var currentDate =  new Date();
// if(username !== '' && username !== null && username !== undefined && password !== '' && password !== null && password !== undefined ){
//   apiController.validateUser(username,function(err,userInfo){
//     if(err){
//       res.status(500).json({
//           error:1,
//           success:0,
//           message: err,
//           token: '',
//           memo_key: '',
//           publicActiveKey:'',
//           username : '',
//           votingWeight : ''
//       })
//     }
//     else{
//       var length = Object.keys(userInfo).length;
//       if(length == 0){
//           res.status(500).json({
//               error:1,
//               success:0,
//               message: 'Please Enter Valid User Name',
//               token: '',
//               memo_key: '',
//               publicActiveKey:'',
//               username : '',
//               votingWeight :''
//           })
//       }
//       else{
//         memo_key   = userInfo.memo_key;
//         publicActiveKey = userInfo.publicActiveKey;
//         postingKey = userInfo.postingKey;
//           if(password.length !== 51){
//             var verify = steem.auth.verify(username, password, {posting:[[postingKey,1]]});
//               if(verify == true){
//                 newPassword = steem.auth.getPrivateKeys(username,password, ['posting']);
//                 newPassword = newPassword.posting;
//                 data = {
//                             userName : username,
//                             password : newPassword,
//                             deviceId : deviceId,
//                             currentDate : currentDate
//                           };
//               var d = new Date(moment(currentDate).format());
//               var expirationTimestamp = (d.getTime()/1000) + expiredLimit;
//               data.expirationTimestamp = expirationTimestamp;
//               apiController.generateToken(data,function(err1,responce){
//                 if(err1){
//                     res.status(500).json({
//                         error:1,
//                         success: 0,
//                         message: err,
//                         token: '',
//                         memo_key: '',
//                         publicActiveKey:'',
//                         username : '',
//                         votingWeight :''
//                     })
//                 }
//                 else{
//                   apiController.getVotingWeight(username,function(err,votingWeight){
//                     console.log("votingWeight",votingWeight);
//                     if(err){
//                       res.status(500).json({
//                           error:1,
//                           success: 0,
//                           message: err,
//                           token: '',
//                           memo_key: '',
//                           publicActiveKey:'',
//                           username : '',
//                           votingWeight :''
//                       })
//                     }
//                     else{
//                       var char = 'a';
//                       var mask = '';
//                       if (char.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
//                       var result = '';
//                       var result2 = '';
//                       for (var i = 12; i > 0; --i) result += mask[Math.round(Math.random() * (mask.length - 1))];
//                       for (var i = 12; i > 0; --i) result2 += mask[Math.round(Math.random() * (mask.length - 1))];
//
//                       res.status(200).json({
//                           error:0,
//                           success: 1,
//                           message: 'Successful',
//                           token: responce,
//                           memo_key: memo_key,
//                           publicActiveKey:publicActiveKey,
//                           username : username,
//                           votingWeight : votingWeight,
//                           privatePosting : result+newPassword+result2
//                       })
//                     }
//                   })
//                 }
//                 })
//               }
//               else{
//                 res.status(500).json({
//                     error:1,
//                     success: 0,
//                     message: 'Please Enter Valid Password',
//                     token: '',
//                     memo_key: '',
//                     publicActiveKey:'',
//                     username : '',
//                     votingWeight :''
//                 })
//               }
//           }
//           else{
//           var wifIsValid  = steem.auth.wifIsValid(password, postingKey);
//               if(wifIsValid == true){
//                 newPassword = password;
//                 data = {
//                             userName : username,
//                             password : newPassword,
//                             deviceId : deviceId,
//                             currentDate : currentDate
//                           };
//               var d = new Date(moment(currentDate).format());
//               var expirationTimestamp = (d.getTime()/1000) + expiredLimit;
//               data.expirationTimestamp = expirationTimestamp;
//               apiController.generateToken(data,function(err1,responce){
//                 if(err1){
//                   res.status(500).json({
//                       error:1,
//                       success: 0,
//                       message: err1,
//                       token: '',
//                       memo_key: '',
//                       publicActiveKey:'',
//                       username : '',
//                       votingWeight :''
//                   })
//                 }
//                 else{
//                   apiController.getVotingWeight(username,function(err,votingWeight){
//                     if(err){
//                       res.status(500).json({
//                           error:1,
//                           success: 0,
//                           message: err,
//                           token: '',
//                           memo_key: '',
//                           publicActiveKey:'',
//                           username : '',
//                           votingWeight :''
//                       })
//                     }
//                     else{
//                       var char = 'a';
//                         var mask = '';
//                         if (char.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
//                         var result = '';
//                         var result2 = '';
//                         for (var i = 12; i > 0; --i) result += mask[Math.round(Math.random() * (mask.length - 1))];
//                         for (var i = 12; i > 0; --i) result2 += mask[Math.round(Math.random() * (mask.length - 1))];
//                       res.status(200).json({
//                           error:0,
//                           success: 1,
//                           message: 'Successful',
//                           token: responce,
//                           memo_key: memo_key,
//                           publicActiveKey:publicActiveKey,
//                           username : username,
//                           votingWeight : votingWeight,
//                           privatePosting : result+newPassword+result2
//                       })
//                     }
//                   })
//                 }
//                 })
//               }
//               else{
//                 res.status(500).json({
//                     error:1,
//                     success: 0,
//                     message: 'Please Enter Valid Password',
//                     token: '',
//                     memo_key: '',
//                     publicActiveKey:'',
//                     username : '',
//                     votingWeight :''
//                 })
//               }
//             }
//           }
//         }
//       })
//     }
//     else{
//       res.status(500).json({
//           error:1,
//           success: 0,
//           message: 'Please Enter Both Fields',
//           token: '',
//           memo_key: '',
//           publicActiveKey:'',
//           username : '',
//           votingWeight :''
//       })
//     }
//   });


router.post('/api/generateToken', function(req, res){
apiSession = req.session;

var psw = atob(req.body.q);    //password
var usr = atob(req.body.u);   //username
var memo_key;
var publicActiveKey;
var postingKey;
var newPassword;
var votingWeight;
var username = usr;
var password = psw;
var deviceId = req.body.deviceId;
var regToken = req.body.regToken;
var deviceType = req.body.deviceType;
var currentDate = new Date();
var expiredLimit = req.body.expiredLimit;
var data = {};
var finalRes = {};
var apiReponse = {};
var errorText='';
var currentDate =  new Date();
if(username !== '' && username !== null && username !== undefined && password !== '' && password !== null && password !== undefined ){
  apiController.validateUser(username,function(err,userInfo){
    if(err){
      res.status(500).json({
          error:1,
          success:0,
          message: err,
          token: '',
          memo_key: '',
          publicActiveKey:'',
          username : '',
          votingWeight : '',
          nsfw : ''
      })
    }
    else{
      var length = Object.keys(userInfo).length;
      if(length == 0){
          res.status(500).json({
              error:1,
              success:0,
              message: 'Please Enter Valid User Name',
              token: '',
              memo_key: '',
              publicActiveKey:'',
              username : '',
              votingWeight :'',
              nsfw : ''
          })
      }
      else{
        if (regToken !== '' && regToken !== null && regToken !== undefined){
          apiController.setRegToken(username,regToken,deviceType);
        }
        memo_key   = userInfo.memo_key;
        publicActiveKey = userInfo.publicActiveKey;
        postingKey = userInfo.postingKey;
          if(password.length !== 51){
            var verify = steem.auth.verify(username, password, {posting:[[postingKey,1]]});
              if(verify == true){
                newPassword = steem.auth.getPrivateKeys(username,password, ['posting']);
                newPassword = newPassword.posting;
                data = {
                            userName : username,
                            password : newPassword,
                            deviceId : deviceId,
                            currentDate : currentDate,
                            regToken : regToken,
                            deviceType : deviceType
                          };
              var d = new Date(moment(currentDate).format());
              var expirationTimestamp = (d.getTime()/1000) + expiredLimit;
              data.expirationTimestamp = expirationTimestamp;
              apiController.generateToken(data,function(err1,responce){
                if(err1){
                    res.status(500).json({
                        error:1,
                        success: 0,
                        message: err,
                        token: '',
                        memo_key: '',
                        publicActiveKey:'',
                        username : '',
                        votingWeight :'',
                        nsfw : ''
                    })
                }
                else{
                  apiController.getVotingWeight(username,function(err,votingWeight){
                    // console.log("votingWeight",votingWeight);
                    if(err){
                      res.status(500).json({
                          error:1,
                          success: 0,
                          message: err,
                          token: '',
                          memo_key: '',
                          publicActiveKey:'',
                          username : '',
                          votingWeight :'',
                          nsfw : ''
                      })
                    }
                    else{
                      votingWeight = votingWeight;
                      apiController.getNsfwSettings(username,function(err,nsfw){
                        if(err){
                          res.status(500).json({
                              error:1,
                              success: 0,
                              message: err,
                              token: '',
                              memo_key: '',
                              publicActiveKey:'',
                              username : '',
                              votingWeight :'',
                              nsfw : ''
                          })
                        }
                        else{
                          var char = 'a';
                          var mask = '';
                          if (char.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
                          var result = '';
                          var result2 = '';
                          for (var i = 12; i > 0; --i) result += mask[Math.round(Math.random() * (mask.length - 1))];
                          for (var i = 12; i > 0; --i) result2 += mask[Math.round(Math.random() * (mask.length - 1))];

                          res.status(200).json({
                              error:0,
                              success: 1,
                              message: 'Successful',
                              token: responce,
                              memo_key: memo_key,
                              publicActiveKey:publicActiveKey,
                              username : username,
                              votingWeight : votingWeight,
                              nsfw : nsfw,
                              privatePosting : result+newPassword+result2
                          })
                        }
                      })
                    }
                  })
                }
                })
              }
              else{
                res.status(500).json({
                    error:1,
                    success: 0,
                    message: 'Please Enter Valid Password',
                    token: '',
                    memo_key: '',
                    publicActiveKey:'',
                    username : '',
                    votingWeight :'',
                    nsfw : ''
                })
              }
          }
          else{
          var wifIsValid  = steem.auth.wifIsValid(password, postingKey);
              if(wifIsValid == true){
                newPassword = password;
                data = {
                            userName    : username,
                            password    : newPassword,
                            deviceId    : deviceId,
                            currentDate : currentDate,
                            regToken    : regToken,
                            deviceType  : deviceType
                          };
              var d = new Date(moment(currentDate).format());
              var expirationTimestamp = (d.getTime()/1000) + expiredLimit;
              data.expirationTimestamp = expirationTimestamp;
              apiController.generateToken(data,function(err1,responce){
                if(err1){
                  res.status(500).json({
                      error:1,
                      success: 0,
                      message: err1,
                      token: '',
                      memo_key: '',
                      publicActiveKey:'',
                      username : '',
                      votingWeight :'',
                      nsfw : ''
                  })
                }
                else{
                  apiController.getVotingWeight(username,function(err,votingWeight){
                    if(err){
                      res.status(500).json({
                          error:1,
                          success: 0,
                          message: err,
                          token: '',
                          memo_key: '',
                          publicActiveKey:'',
                          username : '',
                          votingWeight :'',
                          nsfw : ''
                      })
                    }
                    else{
                      votingWeight = votingWeight;
                      apiController.getNsfwSettings(username,function(err,nsfw){
                        if(err){
                          res.status(500).json({
                              error:1,
                              success: 0,
                              message: err,
                              token: '',
                              memo_key: '',
                              publicActiveKey:'',
                              username : '',
                              votingWeight :'',
                              nsfw : ''
                          })
                        }
                        else{
                          var char = 'a';
                            var mask = '';
                            if (char.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
                            var result = '';
                            var result2 = '';
                            for (var i = 12; i > 0; --i) result += mask[Math.round(Math.random() * (mask.length - 1))];
                            for (var i = 12; i > 0; --i) result2 += mask[Math.round(Math.random() * (mask.length - 1))];
                          res.status(200).json({
                              error:0,
                              success: 1,
                              message: 'Successful',
                              token: responce,
                              memo_key: memo_key,
                              publicActiveKey:publicActiveKey,
                              username : username,
                              votingWeight : votingWeight,
                              nsfw : nsfw,
                              privatePosting : result+newPassword+result2
                          })
                        }
                      })
                    }
                  })
                }
                })
              }
              else{
                res.status(500).json({
                    error:1,
                    success: 0,
                    message: 'Please Enter Valid Password',
                    token: '',
                    memo_key: '',
                    publicActiveKey:'',
                    username : '',
                    votingWeight :'',
                    nsfw : ''
                })
              }
            }
          }
        }
      })
    }
    else{
      res.status(500).json({
          error:1,
          success: 0,
          message: 'Please Enter Both Fields',
          token: '',
          memo_key: '',
          publicActiveKey:'',
          username : '',
          votingWeight :'',
          nsfw : ''
      })
    }
  });



router.post('/api/logout',function(req,res){

  var deviceId = req.body.deviceId;
  apiController.logout(deviceId,function(err){

      if(err){
            res.status(500).json(err);
            console.log(err);
      }
    var  responce= {
        success:true
      };
      res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.status(200).json(responce);
  });

});

router.post('/api/getAccessToken',function(req,res){
  var deviceId = req.body.deviceId;
  apiController.getToken(deviceId,function(err1,responce1){
    if(err1){
          res.status(500).json(err1);
          console.log(err1);
    }
    res.status(200).json(responce1);
          res.send(responce1);
  });


});

router.get('/api/validateUser/:userName',function(req,res){
  var userName = req.params.userName;
  // console.log('validate User Name',userName);
  apiController.validateUser(userName,function(err,responce){
      if(err){
        res.status(500).json('');
        console.log(err);
      }
      res.status(200).json(responce);
    });
});

router.get('/api/getUserInfo/:loginUser/:userName',function(req,res){

    var apiReponse={};

    var finalRes = {};
    var userName = req.params.userName;
    var loginUser=req.params.loginUser;
    var errorText='';
    var startLimit=0;
    var endLimit=7;

    apiController.getUserInfo(userName,function(err1,responce1){
        if(err1){
          errorText = err1;
          console.log(err1);
        }
        finalRes.userInfo = responce1;

    apiController.getUserFollowingFollowersNo(userName,function(err2,responce2){
        if(err2){
          errorText = err2;
          console.log(err2);
        }
        finalRes.userFollowingFollowersInfo = responce2;
    apiController.getUserPostData(loginUser,userName,startLimit,endLimit,function(err3,responce3){
        if(err3){
          errorText = err3;
          console.log(err3);
        }
      finalRes.userPostInfo = responce3;
      if(errorText ==='')
        {
          apiReponse.error = 0;
          apiReponse.success = 1;
          apiReponse.Message = 'Successful';
        }
    else {
          apiReponse.error = 1;
          apiReponse.success = 0;
          apiReponse.Message = errorText;
        }
          apiReponse.data = finalRes;
          res.status(200).json(apiReponse);

        });
      });
    });

  });


  router.get('/api/getUserFollowingCount/:userName',function(req,res){
      var apiReponse={};
      var finalRes = {};
      var userName = req.params.userName;
      var errorText='';
      apiController.getUserFollowingFollowersNo(userName,function(err2,responce2){
          if(err2){
            errorText = err2;
          }
          finalRes.userFollowingFollowersInfo = responce2;
      if(errorText ==='')
          {
            apiReponse.error = 0;
            apiReponse.success = 1;
            apiReponse.Message = 'Successful';
          }
      else {
            apiReponse.error = 1;
            apiReponse.success = 0;
            apiReponse.Message = errorText;
          }
            apiReponse.data = finalRes;
            res.status(200).json(apiReponse);
          });
        });



  router.get('/api/getTagTopicList',function(req,res){
      var apiReponse={};
      var errorText='';
      var finalRes = {};
      // var userName = req.params.userName;

      apiController.getTagTopicList(function(err,responce){
          if(err){
            errorText = err;
            console.log(err);
          }
          finalRes.tagTopicsList = responce;
          if(errorText ==='')
              {
                apiReponse.error = 0;
                apiReponse.success = 1;
                apiReponse.Message = 'Successful';
              }
          else {
                apiReponse.error = 1;
                apiReponse.success = 0;
                apiReponse.Message = errorText;
              }
          apiReponse.data = finalRes;
          res.status(200).json(apiReponse);
     });
  });

  router.get('/api/getTagTopicLists',function(req,res){
      var apiReponse={};
      var errorText='';
      var finalRes = {};
      // var userName = req.params.userName;

      apiController.getTagTopicLists(function(err,responce){
          if(err){
            errorText = err;
            console.log(err);
          }
          finalRes.tagTopicsList = responce;
          if(errorText ==='')
              {
                apiReponse.error = 0;
                apiReponse.success = 1;
                apiReponse.Message = 'Successful';
              }
          else {
                apiReponse.error = 1;
                apiReponse.success = 0;
                apiReponse.Message = errorText;
              }
          apiReponse.data = finalRes;
          res.status(200).json(apiReponse);
     });
  });


router.get('/api/getUserProfileImage/:userName',function(req,res){
    var apiReponse={};
    var errorText='';
    var finalRes = {};
    var userName = req.params.userName;

    apiController.getUserProfileImage(userName,function(err,responce){
        if(err){
          errorText = err;
          console.log(err);
        }
        finalRes.userProfileImage = responce;
        if(errorText ==='')
            {
              apiReponse.error = 0;
              apiReponse.success = 1;
              apiReponse.Message = 'Successful';
            }
        else {
              apiReponse.error = 1;
              apiReponse.success = 0;
              apiReponse.Message = errorText;
            }
        apiReponse.data = finalRes;
        res.status(200).json(apiReponse);
   });
});
router.get('/api/getUserPostData/:loginUser/:userName/:startLimit/:endLimit',function(req,res){
    var apiReponse={};
    var errorText='';
    var finalRes = {};
    var userName = req.params.userName;
    var loginUser = req.params.loginUser;
    var startLimit = req.params.startLimit || 0;
    var endLimit = req.params.endLimit || 10;
    apiController.getUserPostData(loginUser,userName,startLimit,endLimit,function(err,responce){
        if(err){
          errorText = err;
          console.log(err);
        }
        finalRes.userInfo = responce;
        if(errorText ==='')
            {
              apiReponse.error = 0;
              apiReponse.success = 1;
              apiReponse.Message = 'Successful';
            }
        else {
              apiReponse.error = 1;
              apiReponse.success = 0;
              apiReponse.Message = errorText;
            }
        apiReponse.data = finalRes;
        res.status(200).json(apiReponse);
   });
});

router.get('/api/getVotingWeight/:userName',function(req,res){
  var apiReponse={};
  var errorText='';
  var finalRes = {};
  var userName = req.params.userName;

  apiController.getVotingWeight(userName,function(err,responce){
      if(err){
          errorText = res.status(500).json(err);
          console.log(err);
      }
      finalRes.votingWeight = responce;
      if(errorText ==='')
          {
            apiReponse.error = 0;
            apiReponse.success = 1;
            apiReponse.Message = 'Successful';
          }
      else {
            apiReponse.error = 1;
            apiReponse.success = 0;
            apiReponse.Message = errorText;
          }
      apiReponse.data = finalRes;
      res.status(200).json(apiReponse);
  });
});

router.get('/api/setVotingWeight/:userName/:votingWeight',function(req,res){
  var apiReponse={};
  var errorText='';

  var userName = req.params.userName;
  var votingWeight = req.params.votingWeight;

  apiController.setVotingWeight(userName,votingWeight,function(err){
      if(err){
          errorText = res.status(500).json(err);
          console.log(err);
      }

      if(errorText ==='')
          {
            apiReponse.error = 0;
            apiReponse.success = 1;
            apiReponse.Message = 'Successful';
          }
      else {
            apiReponse.error = 1;
            apiReponse.success = 0;
            apiReponse.Message = errorText;
          }
      res.status(200).json(apiReponse);
  });
});


router.get('/api/setNsfwSettings/:userName/:nsfw',function(req,res){
  var apiReponse={};
  var errorText='';

  var userName = req.params.userName;
  var nsfw = req.params.nsfw;

  apiController.setNsfwSettings(userName,nsfw,function(err){
      if(err){
          errorText = res.status(500).json(err);
          console.log(err);
      }

      if(errorText ==='')
          {
            apiReponse.error = 0;
            apiReponse.success = 1;
            apiReponse.Message = 'Successful';
          }
      else {
            apiReponse.error = 1;
            apiReponse.success = 0;
            apiReponse.Message = errorText;
          }
      res.status(200).json(apiReponse);
  });
});

router.get('/api/getNsfwSettings/:userName',function(req,res){
  var apiReponse={};
  var errorText='';
  var finalRes = {};
  var userName = req.params.userName;
  apiController.getNsfwSettings(userName,function(err,responce){
      if(err){
          errorText = res.status(500).json(err);
          console.log(err);
      }
      finalRes.nsfwSetting = responce;
      if(errorText ==='')
          {
            apiReponse.error = 0;
            apiReponse.success = 1;
            apiReponse.Message = 'Successful';
          }
      else {
            apiReponse.error = 1;
            apiReponse.success = 0;
            apiReponse.Message = errorText;
          }
      apiReponse.data = finalRes;
      res.status(200).json(apiReponse);
  });
});



router.get('/api/getCustomSettings/:userName',function(req,res){
  var apiReponse={};
  var errorText='';
  var finalRes = {};
  var userName = req.params.userName;

  apiController.getCustomSettings(userName,function(err,responce){
      if(err){
          errorText = res.status(500).json(err);
          console.log(err);
      }
      finalRes.customSettings = responce;
      apiController.getVotingWeight(userName,function(err,votingWeight){
        if(err){
            errorText = res.status(500).json(err);
            console.log(err);
        }
        finalRes.votingWeight = votingWeight;
        if(errorText ==='')
            {
              apiReponse.error = 0;
              apiReponse.success = 1;
              apiReponse.Message = 'Successful';
            }
        else {
              apiReponse.error = 1;
              apiReponse.success = 0;
              apiReponse.Message = errorText;
            }
            apiReponse.data = finalRes;
            res.status(200).json(apiReponse);
      })

  });
});


router.get('/api/setCustomSettings/:vote/:comment/:follow/:mention/:reblog/:votingWeight/:userName',function(req,res){
  var apiReponse={};
  var errorText='';

  var userName = req.params.userName;
  var vote = req.params.vote;
  var comment = req.params.comment;
  var follow = req.params.follow;
  var mention = req.params.mention;
  var reblog = req.params.reblog;
  var votingWeight = req.params.votingWeight;

  apiController.setCustomSettings(vote,comment,follow,mention,reblog,userName,function(err){
      if(err){
          errorText = res.status(500).json(err);
          console.log(err);
      }
    apiController.setVotingWeight(userName,votingWeight,function(err1){
      if(err1){
          errorText = res.status(500).json(err1);
          console.log(err1);
      }
      if(errorText ==='')
          {
            apiReponse.error = 0;
            apiReponse.success = 1;
            apiReponse.Message = 'Successful';
          }
      else {
            apiReponse.error = 1;
            apiReponse.success = 0;
            apiReponse.Message = errorText;
          }
      res.status(200).json(apiReponse);
    })
  });
});

router.get('/api/getUserCommentsOnPost/:loginUser/:tag/:username/:permlink',function(req,res){
    var apiReponse={};
    var errorText='';
    var finalRes = {};
    var tag = req.params.tag;
    var username = req.params.username;
    var loginUser = req.params.loginUser;
    var permlink = req.params.permlink;
    apiController.getUserCommentsOnPost(loginUser,tag,username,permlink,function(err,responce){
        if(err){
            errorText = res.status(500).json(err);
            console.log(err);
        }
        finalRes.commentsOnPost = responce;
        if(errorText ==='')
            {
              apiReponse.error = 0;
              apiReponse.success = 1;
              apiReponse.Message = 'Successful';
            }
        else {
              apiReponse.error = 1;
              apiReponse.success = 0;
              apiReponse.Message = errorText;
            }
        apiReponse.data = finalRes;
        res.status(200).json(apiReponse);
    });
});

router.get('/api/getUserCommentsOnPosts/:loginUser/:tag/:username/:permlink/:startLimit/:endLimit',function(req,res){
    var apiReponse={};
    var errorText='';
    var finalRes = {};
    var tag = req.params.tag;
    var loginUser = req.params.loginUser;
    var username = req.params.username;
    var permlink = req.params.permlink;
    var startLimit = req.params.startLimit;
    var endLimit = req.params.endLimit;
    startLimit = parseInt(startLimit);
    endLimit = parseInt(endLimit);
    apiController.getUserCommentsOnPost_App(loginUser,tag,username,permlink,startLimit,endLimit,function(err,responce){
        if(err){
          apiReponse.error = 1;
          apiReponse.success = 0;
          apiReponse.Message = err;
          apiReponse.data = finalRes;
          res.status(500).json(apiReponse);
        }

        else
            {
              finalRes.commentsOnPost = responce;
              apiReponse.error = 0;
              apiReponse.success = 1;
              apiReponse.Message = 'Successful';
              apiReponse.data = finalRes;
              res.status(200).json(apiReponse);
            }
    });
});

router.get('/api/getTestUserCommentsOnPost/:loginUser/:parent/:parentPermlink',function(req,res,next){
    var apiReponse={};
    var errorText='';
    var finalRes = {};
    var parent = req.params.parent;
    var loginUser = req.params.loginUser;
    var parentPermlink = req.params.parentPermlink;
    apiController.getTestUserCommentsOnPost(loginUser,parent, parentPermlink,function(err,responce){
        if(err){
            errorText = res.status(500).json(err);
            console.log(err);
        }
        finalRes.commentsOnPost = responce;
        if(errorText ==='')
            {
              apiReponse.error=0;
              apiReponse.success=1;
              apiReponse.Message="Successful";
            }
        else {
              apiReponse.error=1;
              apiReponse.success=0;
              apiReponse.Message=errorText;
            }
        apiReponse.data = finalRes;
        res.status(200).json(apiReponse);
    });
})

router.get('/api/getCommentList/:loginUser/:tag/:username/:permlink',function(req,res,next){
  var errorText='';
  var apiReponse = {};
  var mainObj = {};
  var subObj = {};
  var finalRes = {}
  var tag = req.params.tag;
  var loginUser = req.params.loginUser;
  var username = req.params.username;
  var permlink = req.params.permlink;
  apiController.getTestUserCommentsOnPost(loginUser,username,permlink,function(err,response){
    if(err){
      errorText = err;
    }
    else{
      mainObj = response;
      apiController.getUserCommentsOnPost(loginUser,tag,username,permlink,function(err1,response1){
        if(err1){
          errorText = err1;
        }
        else{
          subObj = response1;
          apiController.getCommentList(mainObj,subObj,function(err2,response2){
            if(err2){
              errorText = err2;
            }
            if(errorText ==='')
                {
                  apiReponse.error=0;
                  apiReponse.success=1;
                  apiReponse.Message="Successful";
                  apiReponse.data = response2;
                  res.status(200).json(apiReponse);
                }
            else {
                  apiReponse.error=1;
                  apiReponse.success=0;
                  apiReponse.Message=errorText;
                  res.status(200).json(apiReponse);
                }

          })
        }
      })
    }
})
})

router.get('/api/getUserPostContent/:tag/:username/:permlink',function(req,res){
    var apiReponse={};
    var errorText='';
    var finalRes = {};
    var tag = req.params.tag;
    var username = req.params.username;
    var permlink = req.params.permlink;
    apiController.getUserPostContent(tag,username,permlink,function(err,responce){
        if(err){
            errorText = res.status(500).json(err);
        }
        finalRes.commentsOnPost = responce;
        if(errorText ==='')
            {
              apiReponse.error = 0;
              apiReponse.success = 1;
              apiReponse.Message = 'Successful';
            }
        else {
              apiReponse.error = 1;
              apiReponse.success = 0;
              apiReponse.Message = errorText;
            }
        apiReponse.data = finalRes;
        res.status(200).json(apiReponse);
    });
});

router.get('/api/getUserFeed/:loginUser/:userName/:startLimit/:endLimit',function(req,res){
    var apiReponse={};
    var errorText='';
    var username = req.params.userName;
    var loginUser = req.params.loginUser;
    var startLimit = req.params.startLimit || 0;
    var endLimit = req.params.endLimit || 7;
    var finalRes = {};
    apiController.getUserFeed(loginUser,username,startLimit,endLimit,function(err,responce){
        if(err){
            errorText = err;
            console.log(err);
        }
        finalRes.userFeed = responce;
        if(errorText ==='')
            {
              apiReponse.error = 0;
              apiReponse.success = 1;
              apiReponse.Message = 'Successful';
            }
        else {
              apiReponse.error = 1;
              apiReponse.success = 0;
              apiReponse.Message = errorText;
            }
        apiReponse.data = finalRes;
        res.status(200).json(apiReponse);
    });
});

router.get('/api/getFeedTagInfo/:loginUser/:type/:tag/:startLimit/:endLimit',function(req,res){
    var apiReponse={};
    var errorText='';
    var tags = req.params.tag;
    var types = req.params.type;
    var loginUser = req.params.loginUser;
    var startLimit = req.params.startLimit || 0;
    var endLimit = req.params.endLimit || 7;
    var finalRes = {};
    apiController.getUserTopicFeed(loginUser,types,tags,startLimit,endLimit,function(err,responce){
        if(err){
            errorText = err;
            console.log(err);
        }
        finalRes.following_list = responce;
        if(errorText ==='')
            {
              apiReponse.error = 0;
              apiReponse.success = 1;
              apiReponse.Message = 'Successful';
            }
        else {
              apiReponse.error = 1;
              apiReponse.success = 0;
              apiReponse.Message = errorText;
            }
        apiReponse.data = finalRes;
        res.status(200).json(apiReponse);
        });
    });

router.get('/api/getFeedInfo/:loginUser/:type/:startLimit/:endLimit',function(req,res){
    var apiReponse = {};
    var errorText = '';
    var tags = '';
    var types = req.params.type;
    var loginUser = req.params.loginUser;
    var startLimit = req.params.startLimit || 0;
    var endLimit = req.params.endLimit || 10;
    var finalRes = {};
    apiController.getUserTopicFeed(loginUser,types,tags,startLimit,endLimit,function(err,responce){
        if(err){
            errorText = err;
            console.log(err);
        }
        //console.log("responce", responce);
        finalRes.following_list = responce;
        if(errorText ==='')
            {
              apiReponse.error = 0;
              apiReponse.success = 1;
              apiReponse.Message = 'Successful';
            }
        else {
              apiReponse.error=1;
              apiReponse.success=0;
              apiReponse.Message=errorText;
            }
        apiReponse.data = finalRes;
        res.status(200).json(apiReponse);
        });
    });

router.get('/api/getWalletDetails/:username',function(req,res){
    var apiReponse={};
    var errorText='';
    var userName = req.params.username;
    var finalRes = {};
    apiController.getWalletDetails(userName,function(err1,responce1){
        if(err1){
            errorText = err1;
            console.log(err1);
        }
        finalRes.wallet_details = responce1;
        apiController.getWalletHistory(userName,function(err2,responce2){
            if(err2){
                errorText = err2;
                console.log(err2);
            }
        finalRes.trx_history = responce2;
        if(errorText ==='')
            {
              apiReponse.error=0;
              apiReponse.success=1;
              apiReponse.Message='Successful';
            }
        else {
              apiReponse.error=1;
              apiReponse.success=0;
              apiReponse.Message=errorText;
            }
        apiReponse.data = finalRes;
        res.status(200).json(apiReponse);
        });
    });
  });

  router.get('/api/getFollowingList/:userName/:startLimit/:endLimit',function(req,res){
      var apiReponse={};
      var errorText='';
      var username = req.params.userName;
      var startLimit = req.params.startLimit;
      var endLimit = req.params.endLimit;
      var finalRes = {};
      apiController.getUserFollowingList(username,startLimit,endLimit,function(err,responce){
        console.log(err);
          if(err){
              errorText = err;
              console.log(err);
          }
          finalRes.following_list = responce;
          if(errorText ==='')
              {
                apiReponse.error=0;
                apiReponse.success=1;
                apiReponse.Message='Successful';
              }
          else {
                apiReponse.error=1;
                apiReponse.success=0;
                apiReponse.Message=errorText;
              }
          apiReponse.data = finalRes;
          res.status(200).json(apiReponse);
          });
      });

      router.get('/api/getFollowerList/:userName/:startLimit/:endLimit',function(req,res){
          var apiReponse={};
          var errorText='';
          var username = req.params.userName;
          var startLimit = req.params.startLimit;
          var endLimit = req.params.endLimit;
          var finalRes = {};
          apiController.getUserFollowerList(username,startLimit,endLimit,function(err,responce){
              if(err){
                  errorText = err;
                  console.log(err);
              }
              finalRes.following_list = responce;
              if(errorText ==='')
                  {
                    apiReponse.error=0;
                    apiReponse.success=1;
                    apiReponse.Message='Successful';
                  }
              else {
                    apiReponse.error=1;
                    apiReponse.success=0;
                    apiReponse.Message=errorText;
                  }
              apiReponse.data = finalRes;
              res.status(200).json(apiReponse);
              });
          });


          router.get('/api/getCompareFollowingList/:userName/:currentUser',function(req,res){
            // console.log(req);
              var apiReponse={};
              var errorText='';
              var username = req.params.userName;
              var currentUser = req.params.currentUser;
              var finalRes = {};
              apiController.getCompareFollowingList(username,currentUser,function(err,responce){
                  if(err){
                      errorText = err;
                      console.log(err);
                  }
                  finalRes.status = responce;
                  if(errorText ==='')
                      {
                        apiReponse.error=0;
                        apiReponse.success=1;
                        apiReponse.Message='Successful';
                      }
                  else {
                        apiReponse.error=1;
                        apiReponse.success=0;
                        apiReponse.Message=errorText;
                      }
                  apiReponse.data = finalRes;
                  res.status(200).json(apiReponse);
                  });
              });

              router.get('/api/getCompareFollowerList/:userName/:currentUser',function(req,res){
                  var apiReponse={};
                  var errorText='';
                  var username = req.params.userName;
                  var currentUser = req.params.currentUser;
                  var finalRes = {};
                  apiController.getCompareFollowerList(username,currentUser,function(err,responce){
                      if(err){
                          errorText = err;
                          console.log(err);
                      }
                      finalRes.status = responce;
                      if(errorText ==='')
                          {
                            apiReponse.error=0;
                            apiReponse.success=1;
                            apiReponse.Message='Successful';
                          }
                      else {
                            apiReponse.error=1;
                            apiReponse.success=0;
                            apiReponse.Message=errorText;
                          }
                      apiReponse.data = finalRes;
                      res.status(200).json(apiReponse);
                      });
                  });


              router.get('/api/getFollowingListFourParms/:userName/:currentUser/:startLimit/:endLimit',function(req,res){
                  var apiReponse={};
                  var errorText='';
                  var username = req.params.userName;
                  var startLimit = req.params.startLimit;
                  var endLimit = req.params.endLimit;
                  var currentUser = req.params.currentUser;
                  var finalRes = {};
                  apiController.getFollowingListFourParms(username,currentUser,startLimit,endLimit,function(err,responce){
                    console.log(err);
                      if(err){
                          errorText = err;
                          console.log(err);
                      }
                      finalRes.following_list = responce;
                      if(errorText ==='')
                          {
                            apiReponse.error=0;
                            apiReponse.success=1;
                            apiReponse.Message='Successful';
                          }
                      else {
                            apiReponse.error=1;
                            apiReponse.success=0;
                            apiReponse.Message=errorText;
                          }
                      apiReponse.data = finalRes;
                      res.status(200).json(apiReponse);
                      });
                  });


          router.get('/api/getComments/:loginUser/:userName/:startLimit/:endLimit',function(req,res){
              var apiReponse={};
              var errorText='';
              var username = req.params.userName;
              var loginUser = req.params.loginUser;
              var startLimit = req.params.startLimit || 0;
              var endLimit = req.params.endLimit || 10;
              var finalRes = {};
              apiController.getUserComments(loginUser,username,startLimit,endLimit,function(err,responce){
                if(err){
                      errorText = err;
                      console.log(err);
                  }
                  finalRes.commentsByUser = responce;
                  if(errorText ==='')
                      {
                        apiReponse.error=0;
                        apiReponse.success=1;
                        apiReponse.Message='Successful';
                      }
                  else {
                        apiReponse.error=1;
                        apiReponse.success=0;
                        apiReponse.Message=errorText;
                      }
                  apiReponse.data = finalRes;
                  res.status(200).json(apiReponse);
              });
          });



          router.get('/api/getReplies/:loginUser/:userName/:startLimit/:endLimit',function(req,res){
              var apiReponse={};
              var errorText='';
              var username = req.params.userName;
              var loginUser = req.params.loginUser;
              var startLimit = req.params.startLimit || 0;
              var endLimit = req.params.endLimit || 10;
              var finalRes = {};
              apiController.getUserReply(loginUser,username,startLimit,endLimit,function(err,responce){
                  if(err){
                      errorText = err;
                  }
                  finalRes.repliesOnUser = responce;
                  if(errorText ==='' && responce.userPostInfo.length !==0)
                      {
                        apiReponse.error=0;
                        apiReponse.success=1;
                        apiReponse.Message='Successful';
                        apiReponse.data = finalRes;
                        res.status(200).json(apiReponse);
                      }
                      else if(errorText ==='' && responce.userPostInfo.length ==0){
                        apiReponse.error=0;
                        apiReponse.success=1;
                        apiReponse.Message='No Data Found';
                        res.status(200).json(apiReponse);
                      }
                  else {
                        apiReponse.error=1;
                        apiReponse.success=0;
                        apiReponse.Message=errorText;
                        res.status(500).json(apiReponse);
                      }
                  // apiReponse.data = finalRes;
                  // res.status(200).json(apiReponse);
              });
          });

  router.get('/api/getPassword',function(req,res,next){
    var apiReponse={};
    var errorText='';
    var finalRes = {};
    apiController.generatePassword(function(err,responce){
        if(err){
            errorText = err;
        }
        finalRes.newPassword = responce;
        if(errorText ==='')
            {
              apiReponse.error=0;
              apiReponse.success=1;
              apiReponse.Message="Successful";
            }
        else {
              apiReponse.error=1;
              apiReponse.success=0;
              apiReponse.Message=errorText;
            }
        apiReponse.data = finalRes;
        res.status(200).json(apiReponse);
      });
  })

  router.get('/api/getPublicKeys/:username',function(req,res,next){
    var apiReponse={};
    var errorText='';
    var finalRes = {};
    var username = req.params.username;
    apiController.getPublicKeys(username,function(err,responce){
      // console.log("responce",responce);
        if(err){
            errorText = err;
        }
        finalRes.publicPassword = responce;
        if(errorText ==='')
            {
              apiReponse.error=0;
              apiReponse.success=1;
              apiReponse.Message="Successful";
            }
        else {
              apiReponse.error=1;
              apiReponse.success=0;
              apiReponse.Message=errorText;
            }
        apiReponse.data = finalRes;
        res.status(200).json(apiReponse);
      });
  })


  router.get('/api/getRezapList/:username',function(req,res,next){
    var apiReponse={};
    var errorText='';
    var finalRes = {};
    var username = req.params.username;
    apiController.getRezapList(username,function(err,responce){
        if(err){
            errorText = err;
        }
        finalRes.checkRezap = responce;
        if(errorText ==='')
            {
              apiReponse.error=0;
              apiReponse.success=1;
              apiReponse.Message="Successful";
            }
        else {
              apiReponse.error=1;
              apiReponse.success=0;
              apiReponse.Message=errorText;
            }
        apiReponse.data = finalRes;
        res.status(200).json(apiReponse);
      });
  })


  router.get('/api/getVotes/:author/:permlink/:username',function(req,res,next){
    var apiReponse={};
    var errorText='';
    var finalRes = {};
    var author = req.params.author;
    var permlink = req.params.permlink;
    var username = req.params.username;
    apiController.checkVote(author,permlink,username,function(err,responce){
        if(err){
            errorText = err;
        }
        finalRes.isUserAvailable = responce;
        if(errorText ==='')
            {
              apiReponse.error=0;
              apiReponse.success=1;
              apiReponse.Message="Successful";
            }
        else {
              apiReponse.error=1;
              apiReponse.success=0;
              apiReponse.Message=errorText;
            }
        apiReponse.data = finalRes;
        res.status(200).json(apiReponse);
      });
  })

router.post('/api/postVote',function(req,res){
          var apiReponse={};
          var errorText='';
          var finalRes = {};
          var author = req.body.author;
          var data = {
            token : req.body.token,
            author : author,
            permlink : req.body.permlink,
            weight : parseInt(req.body.weight)
           }
          var val = {};
          apiController.postVote(data,function(err,responce){
            if(err){
                apiReponse.error=1;
                apiReponse.success=0;
                apiReponse.Message=err;
                }
                else
                    {
                        apiController.getRegToken(author, function(err,response){
                          if(err){
                            console.log(err);
                          }
                          else{
                            apiController.getCustomSettings(author, function(err1,res1){
                              if(res1.vote == "true"){
                                  if(response !== undefined){
                                  var deviceType  = response.deviceType;
                                  var regToken    = response.regToken;
                                  if(deviceType == 'Android'){
                                    val = {
                                      bodyMessage : "voted on your post "+req.body.permlink,
                                      regToken : regToken,
                                      token    : req.body.token
                                    }
                                    apiController.postPushNotificationAndroid(val);
                                  }
                                  else if(deviceType == 'iOS'){
                                    val = {
                                      bodyMessage : "voted on your post "+req.body.permlink,
                                      regToken : regToken,
                                      token    : req.body.token
                                    }
                                    apiController.postPushNotificationApple(val);
                                  }
                                }
                              }
                            })
                          }
                        })
                        apiReponse.error=0;
                        apiReponse.success=1;
                        apiReponse.Message="Successful";
                      }
                      // console.log("apiReponse",apiReponse);
                      res.status(200).json(apiReponse);
                  });
              });


// router.post('/api/postComment',function(req,res){
//               var jsonMetadata = {
//                 tags    : [req.body.tags],
//                 app     : "secretdev/0.1",
//                 format  : "html"
//               }
//             var errorText='';
//             var apiReponse={};
//             var data = {
//               token : req.body.token,
//               parentAuthor : req.body.parentAuthor,
//               parentPermlink : req.body.parentPermlink,
//               permlink : req.body.permlink,
//               title : '',
//               body : req.body.body,
//               jsonMetadata : jsonMetadata
//             }
//             apiController.postCommentBlog(data,function(err,responce){
//               if(err){
//                   errorText = err;
//               }
//               if(errorText ==='')
//                   {
//                     apiReponse.error=0;
//                     apiReponse.success=1;
//                     apiReponse.Message='Successful';
//                   }
//               else {
//                     apiReponse.error=1;
//                     apiReponse.success=0;
//                     apiReponse.Message=errorText;
//                   }
//                 res.status(200).json(apiReponse);
//             });
//         });


router.post('/api/postComment',function(req,res){
            var jsonMetadata = {
                tags    : [req.body.tags],
                //app     : "secretdev/0.1",
                app     : "zappl/0.1",
                format  : "html"
              }
            var apiReponse={};
            var data = {
              token : req.body.token,
              parentAuthor : req.body.parentAuthor,
              parentPermlink : req.body.parentPermlink,
              permlink : req.body.permlink,
              title : '',
              body : req.body.body,
              jsonMetadata : jsonMetadata
            }
            // console.log("DATA", data);
            var val = {};
            apiController.postCommentBlog(data,function(err,responce){
              if(err){
                apiReponse.error=1;
                apiReponse.success=0;
                apiReponse.Message=err;
              }
              else
                  {
                    apiController.getRegToken(req.body.parentAuthor, function(err,response){
                      // console.log("RESPONCE", response);
                      if(err){
                        console.log(err);
                      }
                      else{
                        apiController.getCustomSettings(req.body.parentAuthor, function(err1,res1){
                          if(res1.vote == "true"){
                            if(response !== undefined){
                              var deviceType  = response.deviceType;
                              var regToken    = response.regToken;
                              if(deviceType == 'Android'){
                                val={
                                  bodyMessage : "commented on your post "+req.body.parentPermlink,
                                  regToken    : regToken,
                                  token       : req.body.token
                                }
                              apiController.postPushNotificationAndroid(val);
                              }
                              else if(deviceType == 'iOS'){
                              val={
                                  bodyMessage : "commented on your post "+req.body.parentPermlink,
                                  regToken    : regToken,
                                  token       : req.body.token
                                }
                                apiController.postPushNotificationApple(val);
                              }
                            }
                          }
                        })
                      }
                    })
                    apiReponse.error=0;
                    apiReponse.success=1;
                    apiReponse.Message='Successful';
                  }
                  res.status(200).json(apiReponse);
              });
            });



// router.post('/api/postDeleteComment',function(req,res){
//
//             var data = {
//               password : req.body.password,
//               username : req.body.username,
//               permlink : req.body.permlink,
//             };
//             apiController.postDeleteCommentBlog(data,function(err,responce){
//
//             });
//         });

router.post('/api/postDeleteComment',function(req,res){
  var errorText='';
    var apiReponse={};
            var data = {
              token : req.body.token,
              permlink : req.body.permlink,
            };
            apiController.postDeleteCommentBlog(data,function(err,responce){
              if(err){
                  errorText = err;
              }
              if(errorText ==='')
                  {
                    apiReponse.error=0;
                    apiReponse.success=1;
                    apiReponse.Message='Successful';
                  }
              else {
                    apiReponse.error=1;
                    apiReponse.success=0;
                    apiReponse.Message='Something went wrong, please try after sometime!!';
                  }
              res.status(200).json(apiReponse);
              });

        });

// router.post('/api/postBlog',function(req,res){
//     var errorText='';
//     var apiReponse={};
//             var jsonMetadata = {
//               tags    : req.body.tags,
//               image   : req.body.image,
//               //app     : "secretdev/0.1",
//               app     : "zappl/0.1",
//               format  : "html"
//             }
//             var data = {
//               token :  req.body.token,
//               parentAuthor : '',
//               parentPermlink : req.body.parentPermlink,
//               permlink : req.body.permlink || req.body.title.toLowerCase().replace(/ |[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/g, "-").replace(/[\s-]+/g,"-"),
//               title : req.body.title,
//               body : req.body.htmlBody,
//               jsonMetadata : jsonMetadata
//             }
//             // console.log("Blog data", data);
//             apiController.postCommentBlog(data,function(err,responce){
//               if(err){
//                 apiReponse.error=1;
//                 apiReponse.success=0;
//                 apiReponse.Message=err;
//                 console.log("outer error",err);
//               }
//               else
//                   {
//                     apiReponse.error=0;
//                     apiReponse.success=1;
//                     apiReponse.Message='Successful';
//
//                   }
//                   res.status(200).json(apiReponse);
//               });
//         });


router.post('/api/postBlog',function(req,res){
    var errorText='';
    var apiReponse={};
    var tags = [];
    tags = req.body.tags;
    var index = tags.indexOf('');
    if (index !== -1) {
        tags[index] = 'zappl';
    }
    var pp = req.body.parentPermlink;
    if(pp !== '')
    {
      pp = pp.substring(0,24).replace(/[`~!@#$€£¥₹÷×¢%•√π¶∆°’“=©®™✓^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
      if(pp == ''){
        pp = 'zappl';
      }
    }
    else{
      pp = 'zappl';
    }
    if(req.body.permlink !== undefined){
      var permlink = req.body.permlink;
      permlink = permlink.replace(/\\/g, "");
      permlink = permlink.replace(/ |[-!•√π¶∆°=©®™✓@#$€£¥₹%^¢÷×&*()_+|~=’“`{}\[\]:";'<>?,.\/]/g, "-").replace(/[\s-]+/g,"-");
      if (permlink.substring(permlink.length-1) == "-")
      {
          permlink = permlink.substring(0, permlink.length-1);
          permlink = permlink.replace(/\\/g, "");
          if(permlink == ''){
            var char = 'a';
            var mask = '';
            if (char.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
            var result1234 = '';
            for (var i = 25; i > 0; --i) result1234 += mask[Math.round(Math.random() * (mask.length - 1))];
            permlink = result1234;
          }
      }
    }
    var title =req.body.title.toLowerCase().replace(/ |[-!•√π¶∆°=©®™✓@#$€£¥₹%^¢÷×&*()_+|~=`{}\[\]:";'<>?,.\/]/g, "-").replace(/[\s-]+/g,"-");
    title = title.replace(/\\/g, "");
    title = title.replace(/ |[-!•√π¶∆°=©®™✓@#$€£¥₹%^¢÷×&*()_+|~=’“`{}\[\]:";'<>?,.\/]/g, "-").replace(/[\s-]+/g,"-");
    if (title.substring(title.length-1) == "-")
    {
        title = title.substring(0, title.length-1);
        if(title == ''){
          var char = 'a';
          var mask = '';
          if (char.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
          var result123 = '';
          for (var i = 25; i > 0; --i) result123 += mask[Math.round(Math.random() * (mask.length - 1))];
          title = result123;
        }
    }
    pp = pp.toLowerCase();
            var jsonMetadata = {
              tags    : tags,
              image   : req.body.image,
              //app     : "secretdev/0.1",
              app     : "zappl/0.1",
              format  : "html"
            }
            var data = {
              token :  req.body.token,
              parentAuthor : '',
              parentPermlink : pp,
              permlink : permlink || title,
              title : req.body.title,
              body : req.body.htmlBody,
              jsonMetadata : jsonMetadata
            }
            apiController.postCommentBlog(data,function(err,responce){
              if(err){
                apiReponse.error=1;
                apiReponse.success=0;
                apiReponse.Message=err;
                res.status(500).json(apiReponse);
                console.log("outer error",err);
              }
              else
                  {
                    apiReponse.error=0;
                    apiReponse.success=1;
                    apiReponse.Message='Successful';
                    res.status(200).json(apiReponse);
                  }
                  //res.status(200).json(apiReponse);
              });
        });

router.post('/api/draftPost',function(req,res){
var errorText = '';
var apiReponse= {};
  var draftData = {
    userName : req.body.userName,
    title : req.body.title,
    bodyString : req.body.bodyString,
    fileType : req.body.fileType,
    url : req.body.url,
    upvote : req.body.upvote,
    rewards : req.body.rewards,
    draftId : req.body.draftId
  }
  apiController.draftPost(draftData,function(err,response){
    if(err)
    {
      errorText = err;
      console.log(err);
    }
    if(errorText ==='')
        {
          apiReponse.error=0;
          apiReponse.success=1;
          apiReponse.Message='Successful';
        }
    else {
          apiReponse.error=1;
          apiReponse.success=0;
          apiReponse.Message=errorText;
        }
    res.status(200).json(apiReponse);
  });
})

router.post('/api/deleteDraftOnPost',function(req,res){
var errorText = '';
var apiReponse= {};
  var draftData = {
    draftId : req.body.draftId
  }
  apiController.deleteDraftOnPost(draftData,function(err,response){
    if(err)
    {
      errorText = err;
      console.log(err);
    }
    if(errorText ==='')
        {
          apiReponse.error=0;
          apiReponse.success=1;
          apiReponse.Message='Successful';
        }
    else {
          apiReponse.error=1;
          apiReponse.success=0;
          apiReponse.Message=errorText;
        }
    res.status(200).json(apiReponse);
  });
})

router.get('/api/getDraftPost/:userName',function(req,res){
  var errorText = '';
  var apiReponse= {};
  apiController.getDraftPost(req.params.userName,function(err,response){
    if(err)
    {
      errorText = err;
      console.log(err);
    }
    if(errorText ==='')
        {
          apiReponse.error=0;
          apiReponse.success=1;
          apiReponse.Message='Successful';
          apiReponse.data = response;
        }
    else {
          apiReponse.error=1;
          apiReponse.success=0;
          apiReponse.Message=errorText;
        }
    res.status(200).json(apiReponse);
  });
})

router.post('/api/postDeleteBlog',function(req,res){
  var errorText='';
    var apiReponse={};
            var data = {
              token : req.body.token,
              //username : req.body.username,
              permlink : req.body.permlink
            };
            apiController.postDeleteCommentBlog(data,function(err,responce){
            if(err){
                errorText = err;
                console.log(err);
            }
            if(errorText ==='')
                {
                  apiReponse.error=0;
                  apiReponse.success=1;
                  apiReponse.Message='Successful';
                }
            else {
                  apiReponse.error=1;
                  apiReponse.success=0;
                  apiReponse.Message=errorText;
                }
            res.status(200).json(apiReponse);
            });
        });


// router.post('/api/postFollow',function(req,res){
//   var errorText='';
//     var apiReponse={};
//             var json = JSON.stringify(
//                 ['follow',{
//                   follower  : req.body.userName,
//                   following : req.body.following,
//                   what      : ['blog']
//                 }]
//               );
//             var data = {
//               token : req.body.token,
//               json     : json
//             };
//           apiController.postFollowUnfollowRezappl(data,function(err,responce){
//           console.log('2nd res : ',responce);
//           if(err){
//               errorText = err;
//           }
//           if(errorText ==='')
//               {
//                 apiReponse.error=0;
//                 apiReponse.success=1;
//                 apiReponse.Message='Successful';
//               }
//           else {
//                 apiReponse.error=1;
//                 apiReponse.success=0;
//                 apiReponse.Message=errorText;
//               }
//           res.status(200).json(apiReponse);
//             });
//         });

router.post('/api/postFollow',function(req,res){
    var val = {};
    var apiReponse={};
    var json = JSON.stringify(
        ['follow',{
          follower  : req.body.userName,
          following : req.body.following,
          what      : ['blog']
        }]
      );
    var data = {
      token : req.body.token,
      json     : json
    };
          apiController.postFollowUnfollowRezappl(data,function(err,responce){
          // console.log('2nd res : ',responce);
          if(err){
            apiReponse.error=1;
            apiReponse.success=0;
            apiReponse.Message=errorText;

          }
          else
              {
                apiController.getRegToken(req.body.following, function(err,response){
                  if(err){
                    console.log(err);
                  }
                  else{
                    apiController.getCustomSettings(req.body.following, function(err1,res1){
                      if(res1.vote == "true"){
                        if(response !== undefined){
                          var deviceType  = response.deviceType;
                          var regToken    = response.regToken;
                          if(deviceType == 'Android'){
                            val = {
                              bodyMessage : "followed you",
                              regToken : regToken,
                              token    : req.body.token
                            }
                            apiController.postPushNotificationAndroid(val);
                          }
                          else if(deviceType == 'iOS'){
                            val = {
                              bodyMessage : "followed you",
                              regToken : regToken,
                              token    : req.body.token
                            }
                            apiController.postPushNotificationApple(val);
                          }
                        }
                      }
                    })
                  }
                })
                apiReponse.error=0;
                apiReponse.success=1;
                apiReponse.Message='Successful';
              }
              res.status(200).json(apiReponse);
            });
          });

router.post('/api/postUnfollow',function(req,res){
  var errorText='';
    var apiReponse={};
            var json = JSON.stringify(
              ['follow',{
                follower  : req.body.userName,
                following : req.body.following,
                what: []
              }]
              );
            var data = {
            token : req.body.token,
            //userName :[req.body.userName],
            json     : json
          };
            apiController.postFollowUnfollowRezappl(data,function(err,responce){
            // console.log('2nd res : ',responce);
            if(err){
                errorText = err;
            }
            if(errorText ==='')
                {
                  apiReponse.error=0;
                  apiReponse.success=1;
                  apiReponse.Message='Successful';
                }
            else {
                  apiReponse.error=1;
                  apiReponse.success=0;
                  apiReponse.Message=errorText;
                }
            res.status(200).json(apiReponse);
            });
        });


// router.post('/api/postRezappl',function(req,res){
//   var errorText='';
//     var apiReponse={};
//             var json = JSON.stringify(['reblog', {
//             account: req.body.userName,
//             author: req.body.author,
//             permlink: req.body.permlink
//             }]);
//             var data = {
//             token : req.body.token,
//             json     : json
//           };
//             apiController.postFollowUnfollowRezappl(data,function(err,responce){
//               if(err){
//                   errorText = err;
//               }
//               if(errorText ==='')
//                   {
//                     apiReponse.error=0;
//                     apiReponse.success=1;
//                     apiReponse.Message='Successful';
//                   }
//               else {
//                     apiReponse.error=1;
//                     apiReponse.success=0;
//                     apiReponse.Message=errorText;
//                   }
//               res.status(200).json(apiReponse);
//             });
//         });

router.post('/api/postRezappl',function(req,res){
    var val = {};
    var apiReponse={};
    var json = JSON.stringify(['reblog', {
      account: req.body.userName,
      author: req.body.author,
      permlink: req.body.permlink
    }]);
    var data = {
      token : req.body.token,
      json     : json
  };
    apiController.postFollowUnfollowRezappl(data,function(err,responce){
      if(err){
        apiReponse.error=1;
        apiReponse.success=0;
        apiReponse.Message=errorText;
      }
      else
          {

          apiController.getRegToken(req.body.author, function(err,response){
              if(err){
                console.log(err);
              }
              else{
              var response = response;
          apiController.getCustomSettings(req.body.author, function(err1,res1){
                  if(res1.vote == "true"){
                    if(response !== undefined){
                      var deviceType  = response.deviceType;
                      var regToken    = response.regToken;
                      if(deviceType == 'Android'){
                      val = {
                          bodyMessage : "has Rezap your post "+req.body.permlink,
                          regToken : regToken,
                          token    : req.body.token
                        }
                        apiController.postPushNotificationAndroid(val);
                      }
                      else if(deviceType == 'iOS'){
                        val = {
                          bodyMessage : "has Rezap your post "+req.body.permlink,
                          regToken : regToken,
                          token    : req.body.token
                        }
                        apiController.postPushNotificationApple(val);
                      }
                    }
                  }
                })
              }
            })
            apiReponse.error=0;
            apiReponse.success=1;
            apiReponse.Message='Successful';
          }
          // console.log("apiReponse",apiReponse);
          res.status(200).json(apiReponse);
        });
      });

router.post('/api/postPublicProfile',function(req,res){
            var errorText='';
            var apiReponse={};
            var jsonMetadata = {profile: {name: req.body.name, profile_image : req.body.profile_image,about : req.body.about,
                      website : req.body.website,location : req.body.location}};
            var data = {
              activeWif : req.body.activeWif,
              username : req.body.username,
              memoKey : req.body.memoKey,
              jsonMetadata : jsonMetadata
          };
            apiController.postPublicProfile(data,function(err,responce){
              if(err){
                  errorText = err;
              }
              if(errorText ==='')
                  {
                    apiReponse.error=0;
                    apiReponse.success=1;
                    apiReponse.Message='Successful';
                  }
              else {
                    apiReponse.error=1;
                    apiReponse.success=0;
                    apiReponse.Message=errorText;
                  }
              res.status(200).json(apiReponse);
            });
        });

router.post('/api/updatePassword',function(req,res){
            var errorText='';
            var apiReponse={};
            var jsonMetadata = {profile: {name: req.body.name, profile_image : req.body.profile_image,about : req.body.about,
                      website : req.body.website,location : req.body.location}};
            var data = {
              username      : req.body.username,
              newPassword   : req.body.newPassword,
              ownerKey      : req.body.ownerKey,
              jsonMetadata  : jsonMetadata
          };
            apiController.updatePassword(data,function(err,responce){
              if(err){
                  errorText = err;
              }
              if(errorText ==='')
                  {
                    apiReponse.error=0;
                    apiReponse.success=1;
                    apiReponse.Message='Successful';
                  }
              else {
                    apiReponse.error=1;
                    apiReponse.success=0;
                    apiReponse.Message=errorText;
                  }
              res.status(200).json(apiReponse);
            });
        });

        router.post('/api/postTransfer',function(req,res){
                    var errorText='';
                    var apiReponse={};
                    var data = {
                      token : req.body.token,
                      activeWif : req.body.activeWif,
                      to : req.body.to,
                      amount : req.body.amount
                      // memo : req.body.memo
                  };
                    apiController.postTransfer(data,function(err,responce){
                      if(err){
                          errorText = err;
                      }
                      if(errorText ==='')
                          {
                            apiReponse.error=0;
                            apiReponse.success=1;
                            apiReponse.Message='Successful';
                          }
                      else {
                            apiReponse.error=1;
                            apiReponse.success=0;
                            apiReponse.Message=errorText;
                          }
                      res.status(200).json(apiReponse);
                    });
                });


router.post('/api/postTransferToSaving',function(req,res){
var errorText='';
var apiReponse={};
var data = {
  token : req.body.token,
  activeWif : req.body.activeWif,
  amount : req.body.amount,
  to : req.body.to
};
apiController.postTransferToSaving(data,function(err,responce){
  if(err){
      errorText = err;
  }
  if(errorText ==='')
      {
        apiReponse.error=0;
        apiReponse.success=1;
        apiReponse.Message='Successful';
      }
  else {
        apiReponse.error=1;
        apiReponse.success=0;
        apiReponse.Message=errorText;
      }
  res.status(200).json(apiReponse);
});
});

router.post('/api/postPowerUp',function(req,res){
        var errorText='';
        var apiReponse={};
        var data = {
          token : req.body.token,
          activeWif : req.body.activeWif,
          amount : req.body.amount,
          to : req.body.to
      };
        apiController.postPowerUp(data,function(err,responce){
          if(err){
              errorText = err;
          }
          if(errorText ==='')
              {
                apiReponse.error=0;
                apiReponse.success=1;
                apiReponse.Message='Successful';
              }
          else {
                apiReponse.error=1;
                apiReponse.success=0;
                apiReponse.Message=errorText;
              }
          res.status(200).json(apiReponse);
        });
    });

    router.post('/api/postPowerDown',function(req,res){
                var errorText='';
                var apiReponse={};
                var data = {
                  token : req.body.token,
                  activeWif : req.body.activeWif
              };
                apiController.postPowerDown(data,function(err,responce){
                  if(err){
                      errorText = err;
                  }
                  if(errorText ==='')
                      {
                        apiReponse.error=0;
                        apiReponse.success=1;
                        apiReponse.Message='Successful';
                      }
                  else {
                        apiReponse.error=1;
                        apiReponse.success=0;
                        apiReponse.Message=errorText;
                      }
                  res.status(200).json(apiReponse);
                });
            });

  router.post('/api/postWithdrawSteem',function(req,res){
              var errorText='';
              var apiReponse={};
              var data = {
                token : req.body.token,
                activeWif : req.body.activeWif,
                amount : req.body.amount,
                to : req.body.to
            };
              apiController.postWithdrawSteem(data,function(err,responce){
                if(err){
                    errorText = err;
                }
                if(errorText ==='')
                    {
                      apiReponse.error=0;
                      apiReponse.success=1;
                      apiReponse.Message='Successful';
                    }
                else {
                      apiReponse.error=1;
                      apiReponse.success=0;
                      apiReponse.Message=errorText;
                    }
                res.status(200).json(apiReponse);
              });
          });

router.post('/api/postCancelTransferFromSavings',function(req,res){
            var errorText='';
            var apiReponse={};
            var data = {
              token : req.body.token,
              activeWif : req.body.activeWif,
              requestId : req.body.requestId
          };
            apiController.postCancelTransferFromSavings(data,function(err,responce){
              if(err){
                  errorText = err;
              }
              if(errorText ==='')
                  {
                    apiReponse.error=0;
                    apiReponse.success=1;
                    apiReponse.Message='Successful';
                  }
              else {
                    apiReponse.error=1;
                    apiReponse.success=0;
                    apiReponse.Message=errorText;
                  }
              res.status(200).json(apiReponse);
            });
        });



// router.post('/api/postPushNotificationAndroid',function(req,res){
//             var errorText='';
//             var apiReponse={};
//             var data = {
//               token         : req.body.token
//           };
//             apiController.postPushNotification(data,function(err,responce){
//               if(err){
//                   errorText = err;
//               }
//               if(errorText ==='')
//                   {
//                     apiReponse.error=0;
//                     apiReponse.success=1;
//                     apiReponse.Message='Successful';
//                   }
//               else {
//                     apiReponse.error=1;
//                     apiReponse.success=0;
//                     apiReponse.Message=errorText;
//                   }
//               res.status(200).json(apiReponse);
//             });
//         });






router.get('/api/getUserImgVote/:author/:permlink/:username',function(req,res,next){
  var apiReponse={};
  var finalRes = {};
  var author = req.params.author;
  var permlink = req.params.permlink;
  var username = req.params.username;
  apiController.checkVote(author,permlink,username,function(err,responce){
      if(err){
        apiReponse.error=1;
        apiReponse.success=0;
        apiReponse.Message=errorText;
      }
      finalRes.isVote = responce;
      apiController.getUserProfileImage(author,function(error,response){
      if(err){
        apiReponse.error=1;
        apiReponse.success=0;
        apiReponse.Message=errorText;
      }
      else{
        finalRes.profileImageUrl = response;
        apiReponse.error=0;
        apiReponse.success=1;
        apiReponse.Message="Successful";
      }
      apiReponse.data = finalRes;
      res.status(200).json(apiReponse);

    })

    });
})


router.get('/api/getImageInfo/:loginUser/:userName/:startLimit/:endLimit',function(req,res){
    var apiReponse={};
    var finalRes = {};
    var userName = req.params.userName;
    var errorText='';
    var startLimit=req.params.startLimit;
    var endLimit=req.params.endLimit;
    var loginUser = req.params.loginUser;
    var list = {};
    var userPostInfo123 = [];
    var final_userPostInfo123 = [];
    apiController.getUserPostData(loginUser,userName,startLimit,endLimit,function(err,responce){
        if(err){
          errorText = err;
          console.log(err);
        }
        for (var i = 0; i < responce.userPostInfo.length; i++){
        list = {
            author : responce.userPostInfo[i].author,
            permlink : responce.userPostInfo[i].permlink,
            value : i
          }
          userPostInfo123.push(list);
        }
        for (var j = 0; j < userPostInfo123.length; j++){
          // console.log(userPostInfo123[j].permlink);
          var p = 0;
          var finalList = {};
          var img;
          var vote;
          apiController.getUserProfileImage_ForApp(userPostInfo123[j].author,userPostInfo123[j].permlink,userPostInfo123[j].value,function(err,responce){
            if(err){
              apiReponse.error=1;
              apiReponse.success=0;
              apiReponse.Message=errorText;
              res.status(500).json(apiReponse);
            }
            else{
              finalList = {};
              // console.log("responce", responce);
              finalList.imgUrl = responce.profile_image;
              finalList.author = responce.author;
              finalList.permlink = responce.permlink;
              finalList.value = responce.value;
              p = p+1;
            }
            final_userPostInfo123.push(finalList);
            if(p == userPostInfo123.length){
              apiReponse.error=0;
              apiReponse.success=1;
              apiReponse.Message="Successful";
              //apiReponse.data = final_userPostInfo123;
              apiReponse.data = final_userPostInfo123.sort(function(a,b){
                var c = a.value;
                var d = b.value;
                return c-d;
              });
              res.status(200).json(apiReponse);
            }
          })
          }
        });
      });

router.get('/api/getImageInfo_userfeed/:loginUser/:userName/:startLimit/:endLimit',function(req,res){
    var apiReponse={};
    var finalRes = {};
    var userName = req.params.userName;
    var loginUser = req.params.loginUser;
    var errorText='';
    var startLimit=req.params.startLimit;
    var endLimit=req.params.endLimit;
    var list = {};
    var userPostInfo123 = [];
    var final_userPostInfo123 = [];
    apiController.getUserFeed(loginUser,userName,startLimit,endLimit,function(err,responce){
        if(err){
          errorText = err;
          console.log(err);
        }
        for (var i = 0; i < responce.userPostInfo.length; i++){
        list = {
            author : responce.userPostInfo[i].author,
            permlink : responce.userPostInfo[i].permlink,
            value : i
          }
          userPostInfo123.push(list);
        }
        for (var j = 0; j < userPostInfo123.length; j++){
          // console.log(userPostInfo123[j].permlink);
          var p = 0;
          var finalList = {};
          var img;
          var vote;
          apiController.getUserProfileImage_ForApp(userPostInfo123[j].author,userPostInfo123[j].permlink,userPostInfo123[j].value,function(err,responce){
            if(err){
              apiReponse.error=1;
              apiReponse.success=0;
              apiReponse.Message=errorText;
              res.status(500).json(apiReponse);
            }
            else{
              finalList = {};
              // console.log("responce", responce);
              finalList.imgUrl = responce.profile_image;
              finalList.author = responce.author;
              finalList.permlink = responce.permlink;
              finalList.value = responce.value;
              p = p+1;
            }
            final_userPostInfo123.push(finalList);
            if(p == userPostInfo123.length){
              apiReponse.error=0;
              apiReponse.success=1;
              apiReponse.Message="Successful";
              //apiReponse.data = final_userPostInfo123;
              apiReponse.data = final_userPostInfo123.sort(function(a,b){
                var c = a.value;
                var d = b.value;
                return c-d;
              });
              res.status(200).json(apiReponse);
            }
          })
          }
        });
      });

router.get('/api/getImageInfo_feedinfo/:loginUser/:type/:startLimit/:endLimit',function(req,res){
  var apiReponse={};
  var finalRes = {};
  var type = req.params.type;
  var loginUser = req.params.loginUser;
  var tags = '';
  var errorText='';
  var startLimit=req.params.startLimit;
  var endLimit=req.params.endLimit;
  var list = {};
  var userPostInfo123 = [];
  var final_userPostInfo123 = [];
  apiController.getUserTopicFeed(loginUser,type,tags,startLimit,endLimit,function(err,responce){
      if(err){
        errorText = err;
        console.log(err);
      }
      for (var i = 0; i < responce.userPostInfo.length; i++){
      list = {
          author : responce.userPostInfo[i].author,
          permlink : responce.userPostInfo[i].permlink,
          value : i
        }
        userPostInfo123.push(list);
      }
      for (var j = 0; j < userPostInfo123.length; j++){
        // console.log(userPostInfo123[j].permlink);
        var p = 0;
        var finalList = {};
        var img;
        var vote;
        apiController.getUserProfileImage_ForApp(userPostInfo123[j].author,userPostInfo123[j].permlink,userPostInfo123[j].value,function(err,responce){
          if(err){
            apiReponse.error=1;
            apiReponse.success=0;
            apiReponse.Message=errorText;
            res.status(500).json(apiReponse);
          }
          else{
            finalList = {};
            // console.log("responce", responce);
            finalList.imgUrl = responce.profile_image;
            finalList.author = responce.author;
            finalList.permlink = responce.permlink;
            finalList.value = responce.value;
            p = p+1;
          }
          final_userPostInfo123.push(finalList);
          if(p == userPostInfo123.length){
            apiReponse.error=0;
            apiReponse.success=1;
            apiReponse.Message="Successful";
            //apiReponse.data = final_userPostInfo123;
            apiReponse.data = final_userPostInfo123.sort(function(a,b){
              var c = a.value;
              var d = b.value;
              return c-d;
            });
            res.status(200).json(apiReponse);
          }
        })
        }
      });
    });

router.get('/api/getImageInfo_feedtaginfo/:loginUser/:type/:tag/:startLimit/:endLimit',function(req,res){
  var apiReponse={};
  var finalRes = {};
  var type = req.params.type;
  var tags = req.params.tag;
  var loginUser = req.params.loginUser;
  var errorText='';
  var startLimit=req.params.startLimit;
  var endLimit=req.params.endLimit;
  var list = {};
  var userPostInfo123 = [];
  var final_userPostInfo123 = [];
  apiController.getUserTopicFeed(loginUser,type,tags,startLimit,endLimit,function(err,responce){
      if(err){
        errorText = err;
        console.log(err);
      }
      for (var i = 0; i < responce.userPostInfo.length; i++){
      list = {
          author : responce.userPostInfo[i].author,
          permlink : responce.userPostInfo[i].permlink,
          value : i
        }
        userPostInfo123.push(list);
      }
      for (var j = 0; j < userPostInfo123.length; j++){
        console.log(userPostInfo123[j].permlink);
        var p = 0;
        var finalList = {};
        var img;
        var vote;
        apiController.getUserProfileImage_ForApp(userPostInfo123[j].author,userPostInfo123[j].permlink,userPostInfo123[j].value,function(err,responce){
          if(err){
            apiReponse.error=1;
            apiReponse.success=0;
            apiReponse.Message=errorText;
            res.status(500).json(apiReponse);
          }
          else{
            finalList = {};
            // console.log("responce", responce);
            finalList.imgUrl = responce.profile_image;
            finalList.author = responce.author;
            finalList.permlink = responce.permlink;
            finalList.value = responce.value;
            p = p+1;
          }
          final_userPostInfo123.push(finalList);
          if(p == userPostInfo123.length){
            apiReponse.error=0;
            apiReponse.success=1;
            apiReponse.Message="Successful";
            //apiReponse.data = final_userPostInfo123;
            apiReponse.data = final_userPostInfo123.sort(function(a,b){
              var c = a.value;
              var d = b.value;
              return c-d;
            });
            res.status(200).json(apiReponse);
          }
        })
        }
      });
    });


router.get('/api/getImage_following/:userName/:startLimit/:endLimit',function(req,res){
    var apiReponse={};
    var finalRes = {};
    var userName = req.params.userName;
    var errorText='';
    var startLimit=req.params.startLimit;
    var endLimit=req.params.endLimit;
    var list = {};
    var userPostInfo123 = [];
    var final_userPostInfo123 = [];
    apiController.getUserFollowingList(userName,startLimit,endLimit,function(err,responce){
        if(err){
          errorText = err;
          console.log(err);
        }
      for (var i = 0; i < responce.userFollowing.length; i++){
        list = {
            author : responce.userFollowing[i].following,
            value : i
          }
          userPostInfo123.push(list);
        }
        for (var j = 0; j < userPostInfo123.length; j++){

          var p = 0;
          var finalList = {};
          var img;
          var vote;
          apiController.getUserProfileImage_ForApp(userPostInfo123[j].author,'',userPostInfo123[j].value,function(err,responce){
            if(err){
              apiReponse.error=1;
              apiReponse.success=0;
              apiReponse.Message=errorText;
              res.status(500).json(apiReponse);
            }
            else{
              finalList = {};
              // console.log("responce", responce);
              finalList.imgUrl = responce.profile_image;
              finalList.author = responce.author;
              finalList.value = responce.value;
              p = p+1;
            }
            final_userPostInfo123.push(finalList);
            if(p == userPostInfo123.length){
              apiReponse.error=0;
              apiReponse.success=1;
              apiReponse.Message="Successful";
              apiReponse.data = final_userPostInfo123.sort(function(a,b){
                var c = a.value;
                var d = b.value;
                return c-d;
              });
              res.status(200).json(apiReponse);
            }
          })
          }
        });
      });


// router.get('/api/getImage_following/:userName/:startLimit/:endLimit',function(req,res){
//     var apiReponse={};
//     var finalRes = {};
//     var userName = req.params.userName;
//     var errorText='';
//     var startLimit=req.params.startLimit;
//     var endLimit=req.params.endLimit;
//     var list = {};
//     var userPostInfo123 = [];
//     var final_userPostInfo123 = [];
//     apiController.getUserFollowingList(userName,startLimit,endLimit,function(err,responce){
//         if(err){
//           errorText = err;
//           console.log(err);
//         }
//       for (var i = 0; i < responce.userFollowing.length; i++){
//         list = {
//             author : responce.userFollowing[i].following,
//             value : i
//           }
//           userPostInfo123.push(list);
//         }
//         for (var j = 0; j < userPostInfo123.length; j++){
//
//           var p = 0;
//           var finalList = {};
//           var img;
//           var vote;
//           apiController.getUserProfileImage_ForApp(userPostInfo123[j].author,'',userPostInfo123[j].value,function(err,responce){
//             if(err){
//               apiReponse.error=1;
//               apiReponse.success=0;
//               apiReponse.Message=errorText;
//               res.status(500).json(apiReponse);
//             }
//             else{
//               finalList = {};
//               console.log("responce", responce);
//               finalList.imgUrl = responce.profile_image;
//               finalList.author = responce.author;
//               finalList.value = responce.value;
//               apiController.getCompareFollowingList(username,currentUser,function(err,responce){
//
//               })
//               p = p+1;
//             }
//             final_userPostInfo123.push(finalList);
//             if(p == userPostInfo123.length){
//               apiReponse.error=0;
//               apiReponse.success=1;
//               apiReponse.Message="Successful";
//               apiReponse.data = final_userPostInfo123.sort(function(a,b){
//                 var c = a.value;
//                 var d = b.value;
//                 return c-d;
//               });
//               res.status(200).json(apiReponse);
//             }
//           })
//           }
//         });
//       });


    router.get('/api/getImage_follower/:userName/:startLimit/:endLimit',function(req,res){
        var apiReponse={};
        var finalRes = {};
        var userName = req.params.userName;
        var errorText='';
        var startLimit=req.params.startLimit;
        var endLimit=req.params.endLimit;
        var list = {};
        var userPostInfo123 = [];
        var final_userPostInfo123 = [];
        apiController.getUserFollowingFollowersNo(userName,function(err5,responce5){
            if(err5){
              errorText = err5;
              console.log(err5);
            }
            else{
              if(responce5.follower_count > 1000){
                endLimit = 1000;
              }
              else{
                endLimit = responce5.follower_count;
              }
              apiController.getUserFollowerList(userName,startLimit,endLimit,function(err,responce){
                if(err){
                  errorText = err;
                  console.log(err);
                }
              for (var i = 0; i < responce.userFollowers.length; i++){
                list = {
                    author : responce.userFollowers[i].follower,
                    value : i
                  }
                  userPostInfo123.push(list);
                }
                for (var j = 0; j < userPostInfo123.length; j++){
                  var p = 0;
                  var finalList = {};
                  var img;
                  var vote;
                  apiController.getUserProfileImage_ForApp(userPostInfo123[j].author,'',userPostInfo123[j].value,function(err,responce){
                    if(err){
                      apiReponse.error=1;
                      apiReponse.success=0;
                      apiReponse.Message=errorText;
                      res.status(500).json(apiReponse);
                    }
                    else{
                      finalList = {};
                      finalList.imgUrl = responce.profile_image;
                      finalList.author = responce.author;
                      finalList.value = responce.value;
                      p = p+1;
                    }
                    final_userPostInfo123.push(finalList);
                    // console.log(final_userPostInfo123);
                    if(p == userPostInfo123.length){
                      apiReponse.error=0;
                      apiReponse.success=1;
                      apiReponse.Message="Successful";
                      //apiReponse.data = final_userPostInfo123;
                      apiReponse.data = final_userPostInfo123.sort(function(a,b){
                        var c = a.value;
                        var d = b.value;
                        return c-d;
                      });
                      res.status(200).json(apiReponse);
                    }
                  })
                  }
              })
            }
          });
          });

// router.get('/api/getImage_follower/:userName/:startLimit/:endLimit',function(req,res){
//     var apiReponse={};
//     var finalRes = {};
//     var userName = req.params.userName;
//     var errorText='';
//     var startLimit=req.params.startLimit;
//     var endLimit=req.params.endLimit;
//     var list = {};
//     var userPostInfo123 = [];
//     var final_userPostInfo123 = [];
//     apiController.getUserFollowerList(userName,startLimit,endLimit,function(err,responce){
//         if(err){
//           errorText = err;
//           console.log(err);
//         }
//       for (var i = 0; i < responce.userFollowers.length; i++){
//         list = {
//             author : responce.userFollowers[i].follower,
//             value : i
//           }
//           userPostInfo123.push(list);
//         }
//         for (var j = 0; j < userPostInfo123.length; j++){
//
//           var p = 0;
//           var finalList = {};
//           var img;
//           var vote;
//           apiController.getUserProfileImage_ForApp(userPostInfo123[j].author,'',userPostInfo123[j].value,function(err,responce){
//             if(err){
//               apiReponse.error=1;
//               apiReponse.success=0;
//               apiReponse.Message=errorText;
//               res.status(500).json(apiReponse);
//             }
//             else{
//               finalList = {};
//               finalList.imgUrl = responce.profile_image;
//               finalList.author = responce.author;
//               finalList.value = responce.value;
//               p = p+1;
//             }
//             final_userPostInfo123.push(finalList);
//             // console.log(final_userPostInfo123);
//             if(p == userPostInfo123.length){
//               apiReponse.error=0;
//               apiReponse.success=1;
//               apiReponse.Message="Successful";
//               //apiReponse.data = final_userPostInfo123;
//               apiReponse.data = final_userPostInfo123.sort(function(a,b){
//                 var c = a.value;
//                 var d = b.value;
//                 return c-d;
//               });
//               res.status(200).json(apiReponse);
//             }
//           })
//           }
//         });
//       });

router.get('/api/getImage_comments/:loginUser/:userName/:startLimit/:endLimit',function(req,res){
    var apiReponse={};
    var finalRes = {};
    var userName = req.params.userName;
    var loginUser = req.params.loginUser;
    var errorText='';
    var startLimit=req.params.startLimit;
    var endLimit=req.params.endLimit;
    var list = {};
    var userPostInfo123 = [];
    var final_userPostInfo123 = [];
    apiController.getUserComments(loginUser,userName,startLimit,endLimit,function(err,responce){
        if(err){
          errorText = err;
          console.log(err);
        }
    for (var i = 0; i < responce.userPostInfo.length; i++){
        list = {
            author : responce.userPostInfo[i].author,
            permlink : responce.userPostInfo[i].permlink,
            value : i
          }
          userPostInfo123.push(list);
        }
        for (var j = 0; j < userPostInfo123.length; j++){
          // console.log(userPostInfo123[j].permlink);
          var p = 0;
          var finalList = {};
          var img;
          var vote;
          apiController.getUserProfileImage_ForApp(userPostInfo123[j].author,userPostInfo123[j].permlink,userPostInfo123[j].value,function(err,responce){
            if(err){
              apiReponse.error=1;
              apiReponse.success=0;
              apiReponse.Message=errorText;
              res.status(500).json(apiReponse);
            }
            else{
              finalList = {};
              // console.log("responce", responce);
              finalList.imgUrl = responce.profile_image;
              finalList.author = responce.author;
              finalList.permlink = responce.permlink;
              finalList.value = responce.value;
              p = p+1;
            }
            final_userPostInfo123.push(finalList);
            if(p == userPostInfo123.length){
              apiReponse.error=0;
              apiReponse.success=1;
              apiReponse.Message="Successful";
              //apiReponse.data = final_userPostInfo123;
              apiReponse.data = final_userPostInfo123.sort(function(a,b){
                var c = a.value;
                var d = b.value;
                return c-d;
              });
              res.status(200).json(apiReponse);
            }
          })
          }
        });
      });


router.get('/api/getVoteInfo/:loginUser/:userName/:startLimit/:endLimit',function(req,res){
    var apiReponse={};
    var finalRes = {};
    var userName = req.params.userName;
    var errorText='';
    var startLimit=req.params.startLimit;
    var endLimit=req.params.endLimit;
    var loginUser=req.params.loginUser;
    var list = {};
    var userPostInfo123 = [];
    var final_userPostInfo123 = [];
    apiController.getUserPostData(loginUser,userName,startLimit,endLimit,function(err,responce){
        if(err){
          errorText = err;
          console.log(err);
        }
        for (var i = 0; i < responce.userPostInfo.length; i++){
        list = {
            author : responce.userPostInfo[i].author,
            permlink : responce.userPostInfo[i].permlink,
            value : i
          }
          userPostInfo123.push(list);
        }
        for (var j = 0; j < userPostInfo123.length; j++){
          var p = 0;
          var finalList = {};
          var img;
          var vote;
          apiController.checkVoteTest(userPostInfo123[j].author,userPostInfo123[j].permlink,userName,userPostInfo123[j].value,function(err,responce){
            if(err){
              apiReponse.error=1;
              apiReponse.success=0;
              apiReponse.Message=errorText;
              res.status(500).json(apiReponse);
            }
            else{
              finalList = {};
              finalList.status = responce[0].status;
              finalList.weight = responce[0].percent;
              finalList.permlink = responce[0].permlink;
              finalList.author = responce[0].author;
              finalList.value = responce[0].value;
              p = p+1;
            }
            final_userPostInfo123.push(finalList);
            if(p == userPostInfo123.length){
              apiReponse.error=0;
              apiReponse.success=1;
              apiReponse.Message="Successful";
              apiReponse.data = final_userPostInfo123.sort(function(a,b){
                var c = a.value;
                var d = b.value;
                return c-d;
              });
              res.status(200).json(apiReponse);
            }
            });
          }

        });
      });


// router.get('/api/getVoteInfo123/:userName/:startLimit/:endLimit',function(req,res){
//     var apiReponse={};
//     var finalRes = {};
//     var userName = req.params.userName;
//     var errorText='';
//     var startLimit=req.params.startLimit;
//     var endLimit=req.params.endLimit;
//     var list = {};
//     var userPostInfo123 = [];
//     var final_userPostInfo123 = [];
//     apiController.getUserPostData(userName,startLimit,endLimit,function(err,responce){
//       console.log("responce",responce);
//         if(err){
//           errorText = err;
//           console.log(err);
//         }
//         for (var i = 0; i < responce.userPostInfo.length; i++){
//         list = {
//             author : responce.userPostInfo[i].author,
//             permlink : responce.userPostInfo[i].permlink,
//             profile_image : responce.userPostInfo[i].profile_image,
//             title : responce.userPostInfo[i].title,
//             image : responce.userPostInfo[i].image,
//             allTags : responce.userPostInfo[i].allTags,
//              nsfw    : responce.userPostInfo[i].nsfw,
//             titleZappl : responce.userPostInfo[i].titleZappl,
//             body : responce.userPostInfo[i].body,
//             net_votes : responce.userPostInfo[i].net_votes,
//             upvote:responce.userPostInfo[i].upvote,
//             comments:responce.userPostInfo[i].comments,
//             tags:responce.userPostInfo[i].tags,
//             post_time:responce.userPostInfo[i].post_time,
//             value : i
//           }
//           userPostInfo123.push(list);
//         }
//         for (var j = 0; j < userPostInfo123.length; j++){
//           var p = 0;
//           var finalList = {};
//           var finalList123 = {};
//           var img;
//           var vote;
//           apiController.checkVoteTest(userPostInfo123[j].author,userPostInfo123[j].permlink,userName,userPostInfo123[j].value,list,function(err,responce){
//             if(err){
//               apiReponse.error=1;
//               apiReponse.success=0;
//               apiReponse.Message=errorText;
//               res.status(500).json(apiReponse);
//             }
//             else{
//               finalList = {};
//               finalList.status = responce[0].status;
//               finalList.weight = responce[0].percent;
//               finalList.permlink = responce[0].permlink;
//               finalList.author = responce[0].author;
//               finalList.value = responce[0].value;
//               finalList.profile_image = responce[0].profile_image;
//               finalList.title = responce[0].title;
//               finalList.image = responce[0].image;
//               finalList.allTags = responce[0].allTags;
//               finalList.nsfw    = responce[0].nsfw;
//               finalList.titleZappl = responce[0].titleZappl;
//               finalList.body = responce[0].body;
//               finalList.net_votes = responce[0].net_votes;
//               finalList.upvote=responce[0].upvote;
//               finalList.comments=responce[0].comments;
//               finalList.tags=responce[0].tags;
//               finalList.post_time=responce[0].post_time;
//               apiController.getUserProfileImage_ForApp(responce[0].author,responce[0].permlink,responce[0].value,finalList,function(err,responce){
//                 if(err){
//                   apiReponse.error=1;
//                   apiReponse.success=0;
//                   apiReponse.Message=errorText;
//                   res.status(500).json(apiReponse);
//                 }
//                 else{
//                   finalList123 = {};
//                   finalList123.imgUrl = responce.profile_image1;
//                   finalList123.author = responce.author;
//                   finalList123.permlink = responce.permlink;
//                   finalList123.value = responce.value;
//                   finalList123.status = responce.status;
//                   finalList123.weight = responce.percent;
//                   finalList123.profile_image = responce.profile_image;
//                   finalList123.title = responce.title;
//                   finalList123.image = responce.image;
//                   finalList123.allTags = responce.allTags;
//                   finalList123.nsfw    = responce.nsfw;
//                   finalList123.titleZappl = responce.titleZappl;
//                   finalList123.body = responce.body;
//                   finalList123.net_votes = responce.net_votes;
//                   finalList123.upvote=responce.upvote;
//                   finalList123.comments=responce.comments;
//                   finalList123.tags=responce.tags;
//                   finalList123.post_time=responce.post_time;
//                   p = p+1;
//                 }
//                 final_userPostInfo123.push(finalList123);
//                 if(p == userPostInfo123.length){
//                   apiReponse.error=0;
//                   apiReponse.success=1;
//                   apiReponse.Message="Successful";
//                   apiReponse.data = final_userPostInfo123.sort(function(a,b){
//                     var c = a.value;
//                     var d = b.value;
//                     return c-d;
//                   });
//                   res.status(200).json(apiReponse);
//                 }
//               })
//             }
//             });
//           }
//
//         });
//       });


router.get('/api/getVoteInfo_userfeed/:loginUser/:userName/:startLimit/:endLimit',function(req,res){
    var apiReponse={};
    var finalRes = {};
    var userName = req.params.userName;
    var loginUser = req.params.loginUser;
    var errorText='';
    var startLimit=req.params.startLimit;
    var endLimit=req.params.endLimit;
    var list = {};
    var userPostInfo123 = [];

    var final_userPostInfo123 = [];
    apiController.getUserFeed(loginUser,userName,startLimit,endLimit,function(err,responce){
        if(err){
          errorText = err;
          console.log(err);
        }
        for (var i = 0; i < responce.userPostInfo.length; i++){
        list = {
            author : responce.userPostInfo[i].author,
            permlink : responce.userPostInfo[i].permlink,
            value : i
          }
          userPostInfo123.push(list);
        }
        for (var j = 0; j < userPostInfo123.length; j++){
          var p = 0;
          var finalList = {};
          var img;
          var vote;
          apiController.checkVoteTest(userPostInfo123[j].author,userPostInfo123[j].permlink,userName,userPostInfo123[j].value,function(err,responce){
            if(err){
              apiReponse.error=1;
              apiReponse.success=0;
              apiReponse.Message=errorText;
              res.status(500).json(apiReponse);
            }
            else{
              finalList = {};
              finalList.status = responce[0].status;
              finalList.weight = responce[0].percent;
              finalList.permlink = responce[0].permlink;
              finalList.author = responce[0].author;
              finalList.value = responce[0].value;
              p = p+1;
            }
            final_userPostInfo123.push(finalList);
            if(p == userPostInfo123.length){
              apiReponse.error=0;
              apiReponse.success=1;
              apiReponse.Message="Successful";
              apiReponse.data = final_userPostInfo123.sort(function(a,b){
                var c = a.value;
                var d = b.value;
                return c-d;
              });
              res.status(200).json(apiReponse);
            }
            });
          }

        });
      });


router.get('/api/getVoteInfo_feedinfo/:loginUser/:userName/:type/:startLimit/:endLimit',function(req,res){
    var apiReponse={};
    var finalRes = {};
    var type = req.params.type;
    var userName = req.params.userName;
    var loginUser = req.params.loginUser;
    var tags = '';
    var errorText='';
    var startLimit=req.params.startLimit;
    var endLimit=req.params.endLimit;
    var list = {};
    var userPostInfo123 = [];

    var final_userPostInfo123 = [];
    apiController.getUserTopicFeed(loginUser,type,tags,startLimit,endLimit,function(err,responce){
        if(err){
          errorText = err;
          console.log(err);
        }
        for (var i = 0; i < responce.userPostInfo.length; i++){
        list = {
            author : responce.userPostInfo[i].author,
            permlink : responce.userPostInfo[i].permlink,
            value : i
          }
          userPostInfo123.push(list);
        }
        for (var j = 0; j < userPostInfo123.length; j++){
          var p = 0;
          var finalList = {};
          var img;
          var vote;
          apiController.checkVoteTest(userPostInfo123[j].author,userPostInfo123[j].permlink,userName,userPostInfo123[j].value,function(err,responce){
            if(err){
              apiReponse.error=1;
              apiReponse.success=0;
              apiReponse.Message=errorText;
              res.status(500).json(apiReponse);
            }
            else{
              finalList = {};
              finalList.status = responce[0].status;
              finalList.weight = responce[0].percent;
              finalList.permlink = responce[0].permlink;
              finalList.author = responce[0].author;
              finalList.value = responce[0].value;
              p = p+1;
            }
            final_userPostInfo123.push(finalList);
            if(p == userPostInfo123.length){
              apiReponse.error=0;
              apiReponse.success=1;
              apiReponse.Message="Successful";
              apiReponse.data = final_userPostInfo123.sort(function(a,b){
                var c = a.value;
                var d = b.value;
                return c-d;
              });
              res.status(200).json(apiReponse);
            }
            });
          }

        });
      });


router.get('/api/getVoteInfo_feedtaginfo/:loginUser/:userName/:type/:tag/:startLimit/:endLimit',function(req,res){
    var apiReponse={};
    var finalRes = {};
    var type = req.params.type;
    var tags = req.params.tag;
    var userName = req.params.userName;
    var loginUser = req.params.loginUser;
    var tags = '';
    var errorText='';
    var startLimit=req.params.startLimit;
    var endLimit=req.params.endLimit;
    var list = {};
    var userPostInfo123 = [];
    var final_userPostInfo123 = [];
    apiController.getUserTopicFeed(loginUser,type,req.params.tag,startLimit,endLimit,function(err,responce){
        if(err){
          errorText = err;
          console.log(err);
        }
        for (var i = 0; i < responce.userPostInfo.length; i++){
        list = {
            author : responce.userPostInfo[i].author,
            permlink : responce.userPostInfo[i].permlink,
            value : i
          }
          userPostInfo123.push(list);
        }
        for (var j = 0; j < userPostInfo123.length; j++){
          var p = 0;
          var finalList = {};
          var img;
          var vote;
          apiController.checkVoteTest(userPostInfo123[j].author,userPostInfo123[j].permlink,userName,userPostInfo123[j].value,function(err,responce){
            if(err){
              apiReponse.error=1;
              apiReponse.success=0;
              apiReponse.Message=errorText;
              res.status(500).json(apiReponse);
            }
            else{
              finalList = {};
              finalList.status = responce[0].status;
              finalList.weight = responce[0].percent;
              finalList.permlink = responce[0].permlink;
              finalList.author = responce[0].author;
              finalList.value = responce[0].value;
              p = p+1;
            }
            final_userPostInfo123.push(finalList);
            if(p == userPostInfo123.length){
              apiReponse.error=0;
              apiReponse.success=1;
              apiReponse.Message="Successful";
              apiReponse.data = final_userPostInfo123.sort(function(a,b){
                var c = a.value;
                var d = b.value;
                return c-d;
              });
              res.status(200).json(apiReponse);
            }
            });
          }
        });
      });

router.get('/api/getVote_comments/:loginUser/:userName/:startLimit/:endLimit',function(req,res){
    var apiReponse={};
    var finalRes = {};
    var userName = req.params.userName;
    var loginUser = req.params.loginUser;
    var errorText='';
    var startLimit=req.params.startLimit;
    var endLimit=req.params.endLimit;
    var list = {};
    var userPostInfo123 = [];
    var final_userPostInfo123 = [];
    apiController.getUserComments(loginUser,userName,startLimit,endLimit,function(err,responce){
        if(err){
          errorText = err;
          console.log(err);
        }
        for (var i = 0; i < responce.userPostInfo.length; i++){
        list = {
            author : responce.userPostInfo[i].author,
            permlink : responce.userPostInfo[i].permlink,
            value : i
          }
          userPostInfo123.push(list);
        }
        for (var j = 0; j < userPostInfo123.length; j++){
          var p = 0;
          var finalList = {};
          var img;
          var vote;
          apiController.checkVoteTest(userPostInfo123[j].author,userPostInfo123[j].permlink,userName,userPostInfo123[j].value,function(err,responce){
            if(err){
              apiReponse.error=1;
              apiReponse.success=0;
              apiReponse.Message=errorText;
              res.status(500).json(apiReponse);
            }
            else{
              finalList = {};
              finalList.status = responce[0].status;
              finalList.weight = responce[0].percent;
              finalList.permlink = responce[0].permlink;
              finalList.author = responce[0].author;
              finalList.value = responce[0].value;
              p = p+1;
            }
            final_userPostInfo123.push(finalList);
            if(p == userPostInfo123.length){
              apiReponse.error=0;
              apiReponse.success=1;
              apiReponse.Message="Successful";
              apiReponse.data = final_userPostInfo123.sort(function(a,b){
                var c = a.value;
                var d = b.value;
                return c-d;
              });
              res.status(200).json(apiReponse);
            }
            });
          }
        });
      });


// router.post('/api/getPostDataVote',function(req,res){
//   var apiReponse={};
//   var finalRes = {};
//   var list = {};
//   var userPostInfo123 = [];
//   var final_userPostInfo123 = [];
//   var data = [];
//   data = req.body.data;
//   for (var i = 0; i < data.length; i++){
//   list = {
//       author : data[i].author,
//       permlink : data[i].permlink,
//       username : data[i].username,
//       value : i
//     }
//     userPostInfo123.push(list);
//   }
//   for (var j = 0; j < userPostInfo123.length; j++){
//     var p = 0;
//     var finalList = {};
//     var img;
//     var vote;
//     apiController.checkVoteTest(userPostInfo123[j].author,userPostInfo123[j].permlink,userPostInfo123[j].username,userPostInfo123[j].value,function(err,responce){
//       if(err){
//         apiReponse.error=1;
//         apiReponse.success=0;
//         apiReponse.Message=errorText;
//         res.status(500).json(apiReponse);
//       }
//       else{
//         finalList = {};
//         finalList.status = responce[0].status;
//         finalList.weight = responce[0].percent;
//         finalList.permlink = responce[0].permlink;
//         finalList.author = responce[0].author;
//         finalList.value = responce[0].value;
//         p = p+1;
//       }
//       final_userPostInfo123.push(finalList);
//       if(p == userPostInfo123.length){
//         apiReponse.error=0;
//         apiReponse.success=1;
//         apiReponse.Message="Successful";
//         apiReponse.data = final_userPostInfo123.sort(function(a,b){
//           var c = a.value;
//           var d = b.value;
//           return c-d;
//         });
//         res.status(200).json(apiReponse);
//       }
//           });
//         }
//   });


// router.post('/api/getPostDataImage',function(req,res){
//   var apiReponse={};
//   var finalRes = {};
//   var list = {};
//   var userPostInfo123 = [];
//   var final_userPostInfo123 = [];
//   data = req.body.data;
//   for (var i = 0; i < data.length; i++){
//   list = {
//       author : data[i].author,
//       permlink : data[i].permlink,
//       value : i
//       }
//   userPostInfo123.push(list);
//   }
//   for (var j = 0; j < userPostInfo123.length; j++){
//     console.log(userPostInfo123[j].permlink);
//     var p = 0;
//     var finalList = {};
//     var img;
//     var vote;
//     apiController.getUserProfileImage_ForApp(userPostInfo123[j].author,userPostInfo123[j].permlink,userPostInfo123[j].value,function(err,responce){
//       if(err){
//         apiReponse.error=1;
//         apiReponse.success=0;
//         apiReponse.Message=errorText;
//         res.status(500).json(apiReponse);
//       }
//       else{
//         finalList = {};
//         console.log("responce", responce);
//         finalList.imgUrl = responce.profile_image;
//         finalList.author = responce.author;
//         finalList.permlink = responce.permlink;
//         finalList.value = responce.value;
//         p = p+1;
//       }
//       final_userPostInfo123.push(finalList);
//       if(p == userPostInfo123.length){
//         apiReponse.error=0;
//         apiReponse.success=1;
//         apiReponse.Message="Successful";
//         apiReponse.data = final_userPostInfo123.sort(function(a,b){
//           var c = a.value;
//           var d = b.value;
//           return c-d;
//         });
//         res.status(200).json(apiReponse);
//       }
//     })
//     }
//       });

router.post('/api/getPostDataVoteImg',function(req,res){
  var apiReponse={};
  var finalRes = {};
  var list = {};
  var userPostInfo123 = [];
  var final_userPostInfo123 = [];
  var data = [];
  data = req.body.data;
  for (var i = 0; i < data.length; i++){
  list = {
      author   : data[i].author,
      permlink : data[i].permlink,
      username : data[i].username,
      value    : i
    }
    userPostInfo123.push(list);
  }
  for (var j = 0; j < userPostInfo123.length; j++){
    var p = 0;
    var finalList = {};
    var img;
    var vote;
    apiController.checkVoteTest(userPostInfo123[j].author,userPostInfo123[j].permlink,userPostInfo123[j].username,userPostInfo123[j].value,function(err,responce){
      if(err){
        apiReponse.error=1;
        apiReponse.success=0;
        apiReponse.Message=errorText;
        res.status(500).json(apiReponse);
      }
      else{
        finalList = {};
        finalList.status = responce[0].status;
        finalList.weight = responce[0].percent;
        finalList.permlink = responce[0].permlink;
        finalList.author = responce[0].author;
        finalList.value = responce[0].value;
        finalList.username = responce[0].username;
        apiController.getUserProfileImage_ForApp123(finalList,function(err,response){
          if(err){
            apiReponse.error=1;
            apiReponse.success=0;
            apiReponse.Message=errorText;
            res.status(500).json(apiReponse);
          }
          else{
            finalList = {};
            finalList.imgUrl = response.profile_image;
            finalList.author = response.author;
            finalList.permlink = response.permlink;
            finalList.value = response.value;
            finalList.status = response.status;
            finalList.weight = response.weight;
            finalList.author = response.author;
            p = p+1;
          }
          final_userPostInfo123.push(finalList);
          if(p == userPostInfo123.length){
            apiReponse.error=0;
            apiReponse.success=1;
            apiReponse.Message="Successful";
            apiReponse.data = final_userPostInfo123.sort(function(a,b){
              var c = a.value;
              var d = b.value;
              return c-d;
            });
            res.status(200).json(apiReponse);
          }
        })
        }
    });
        }
  });

router.get('/Home',function(req,res){
  res.render('layout.html');
});

//reportAbuse
//
router.post('/api/reportAbuse',function(req,res){
  var apiReponse={};
  var errorText='';
  var data = {
    reportedBy : req.body.reportedBy,
    contentAuthor : req.body.contentAuthor,
    contentDetail : req.body.contentDetail,
    abuseReason : req.body.abuseReason,
    status : "Pending",
    reportedOn : new Date()
   }
  //  console.log(data);
  apiController.reqReportAbuse(data,function(err){
      if(err){
          errorText = res.status(500).json(err);
          console.log(err);
      }
      if(errorText ==='')
          {
            apiReponse.error = 0;
            apiReponse.success = 1;
            apiReponse.Message = 'Successful';
          }
      else {
            apiReponse.error = 1;
            apiReponse.success = 0;
            apiReponse.Message = errorText;
          }
      res.status(200).json(apiReponse);
  });
});

module.exports = router;
