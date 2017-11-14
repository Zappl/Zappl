// ZapplApp.controller('messageCtrl', function(cfCryptoHttpInterceptor,$rootScope, $stateParams, $state, $window,$http,$scope,$sce,LoginService){
//
// $rootScope.base64Key = CryptoJS.enc.Hex.parse('0123456789abcdef0123456789abcdef');
// $rootScope.iv = CryptoJS.enc.Hex.parse('abcdef9876543210abcdef9876543210');
//
// var mc = this;
//
// mc.username = localStorage.getItem("username");
// mc.user2 = $stateParams.user2;
//
// var socket = io.connect();
// $scope.users = [];
// $scope.currentUser = '';
// socket.on('connect', function () { });
//
// $(document).on('keypress', function(e) {
//   var target = $( e.target );
//     if ( target.is( "div" ) ) {
//         $('.emojionearea-editor').on("keypress paste", function (e) {
//           if (this.innerHTML.length >= this.getAttribute("max")) {
//                 e.preventDefault();
//                 return false;
//             }
//         });
//       }
//   });
//
// socket.on('updatechat', function (username,room, data){
//   var user = {};
//   user.username = username;
//   var cipherParams = CryptoJS.lib.CipherParams.create({
//    ciphertext: CryptoJS.enc.Base64.parse(data)
//    });
//    var decrypted = CryptoJS.AES.decrypt(
//    cipherParams,
//    $rootScope.base64Key,
//    { iv: $rootScope.iv }
//    );
//    $scope.descrString = decrypted.toString(CryptoJS.enc.Utf8);
//    if($scope.descrString.indexOf('</audio>') > -1){
//      user.audio = 'false';
//    }
//    else if($scope.descrString.indexOf('</video>') > -1){
//      user.audio = 'false';
//    }
//    else{
//      user.audio = 'true';
//    }
//    user.message = data;
//    user.message1 = $sce.trustAsHtml($scope.descrString);
//    user.date = new Date().getTime();
//    user.room = room;
//    $scope.users.push(user);
//    var data = {
//       room : room,
//       displayName : room,
//       type : 'one',
//       members : '',
//       img : '',
//       chat : $scope.users
//       }
//   LoginService.setChat(data);
// });
//
// socket.on('roomcreated', function (data) {
//   socket.emit('adduser', data);
// });
//
// $scope.createRoom = function () {
//   var img = LoginService.getUserProfileImage(mc.user2);
//   img.then(function(data){
//   mc.userImg = data.data.data.userProfileImage;
//   })
//   var room = mc.username+"-"+$stateParams.user2;
//   var room2 = $stateParams.user2+"-"+mc.username;
//   var finalRoom = '';
//   var rep = LoginService.getChat(room);
//   rep.then(function(data){
//     if(data.data.data.chatData == undefined){
//         $scope.users = [];
//         var rep2 = LoginService.getChat(room2);
//         rep2.then(function(data){
//           if(data.data.data.chatData == undefined){
//             $scope.users = [];
//             finalRoom = room;
//             $scope.currentUser =  { username: mc.username, receiver : mc.user2, room : finalRoom} ;
//             socket.emit('createroom', $scope.currentUser);
//           }
//           else{
//             var newObj = data.data.data.chatData.chat;
//             newObj.forEach(function(obj){
//                var cipherParams = CryptoJS.lib.CipherParams.create({
//                ciphertext: CryptoJS.enc.Base64.parse(obj.message)
//                });
//                var decrypted = CryptoJS.AES.decrypt(
//                cipherParams,
//                $rootScope.base64Key,
//                { iv: $rootScope.iv }
//                );
//                $scope.descrString2 = decrypted.toString(CryptoJS.enc.Utf8);
//                if($scope.descrString2.indexOf('</audio>') > -1){
//                  obj.audio = 'false';
//                }
//                else if($scope.descrString2.indexOf('</video>') > -1){
//                  obj.audio = 'false';
//                }
//                else{
//                  obj.audio = 'true';
//                }
//                obj.message1 = $sce.trustAsHtml($scope.descrString2);
//             })
//             $scope.users = newObj;
//             finalRoom = room2;
//             $scope.currentUser =  { username: mc.username, receiver : mc.user2, room : finalRoom} ;
//             socket.emit('createroom', $scope.currentUser);
//           }
//         })
//     }
//     else{
//       var newObj = data.data.data.chatData.chat;
//       newObj.forEach(function(obj){
//          var cipherParams = CryptoJS.lib.CipherParams.create({
//          ciphertext: CryptoJS.enc.Base64.parse(obj.message)
//          });
//          var decrypted = CryptoJS.AES.decrypt(
//          cipherParams,
//          $rootScope.base64Key,
//          { iv: $rootScope.iv }
//          );
//          $scope.descrString1 = decrypted.toString(CryptoJS.enc.Utf8);
//          obj.message1 = $sce.trustAsHtml($scope.descrString1);
//       })
//       $scope.users = newObj;
//       finalRoom = room;
//       $scope.currentUser =  { username: mc.username, receiver : mc.user2, room : finalRoom} ;
//       socket.emit('createroom', $scope.currentUser);
//     }
//   })
// }
//
// $scope.joinRoom = function (data) {
//   $scope.currentUser = data.username;
//   socket.emit('adduser', data);
// }
//
//
// $scope.doPost = function () {
//   var x = document.getElementsByClassName("emojionearea-editor");
//   if( x["0"].innerHTML != ''){
//     var text = x["0"].innerHTML;
//     text = text.replace(/<div>/gi,'<br>').replace(/<\/div>/gi,'').replace(/^(\s*<br\s*\/?\s*>\s*)*|(\s*<br\s*\/?\s*>\s*)*\s*$/g,'').replace(/&nbsp;/gi,'').trim().replace(/^(\s*<br\s*\/?\s*>\s*)*|(\s*<br\s*\/?\s*>\s*)*\s*$/g,'');
//     if(text !== ''){
//       var encrypted = CryptoJS.AES.encrypt(
//         text,
//         $rootScope.base64Key,
//         { iv: $rootScope.iv }
//         );
//         $scope.ciphertext = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
//         socket.emit('sendchat', $scope.ciphertext);
//           x["0"].innerHTML = '';
//
//           var height = $(document).height();
//           var thirtypc = (999999999999999999 * height);
//           thirtypc = parseInt(thirtypc) ;
//           socket.emit('setscrollheight', thirtypc);
//     }
//     else{
//       x["0"].innerHTML = '';
//     }
//   }
// }
//
// socket.on("getscrollheight", function(data) {
//   $("html, body").animate({ scrollTop: 99999999999999999999 }, 600);
// })
//
// $scope.refresh = function(){
//   setTimeout(function(){ $window.location.reload(); }, 500);
// }
//
// $(document).ready(function() {
//     $("#emojiIcon").emojioneArea({
//       pickerPosition: "top",
//       tonesStyle: "bullet"
//     });
//   $('[data-toggle="tooltip"]').tooltip();
//   var height = $(document).height();
//   var thirtypc = (999999999999999999 * height);
//   thirtypc = parseInt(thirtypc) ;
//   $("html, body").animate({ scrollTop: thirtypc }, 500);
//   console.log(thirtypc);
// })
//
//   $(document).on('keypress', function(e) {
//     var target = $( e.target );
//       if ( target.is( "div" ) ) {
//         if (e.which !== 13) {
//           if (typing === false) {
//               typing = true;
//             socket.emit("typing", true);
//           }
//           else {
//             clearTimeout(timeout);
//             timeout = setTimeout(function(){
//             typing = false;
//             socket.emit("typing", false);}, 2000);
//           }
//         }
//       }
//     });
//
//
// var typing = false;
// var timeout = undefined;
//
// socket.on("isTyping", function(data) {
// if (data.isTyping) {
//   if ($("#"+data.person+"").length === 0 && data.person !== mc.username) {
//     $("#updates").append("<li id='"+ data.person +"'><span class='text-muted'><small><i class='fa fa-keyboard-o'></i> " + data.person + " is typing...</small></li>");
//     timeout = setTimeout(function(){
//       typing = false;
//       socket.emit("typing", false);}, 2000);
//   }
// } else {
//   $("#"+data.person+"").remove();
// }
// });
//
// var imageUrl = 'https://s3-us-west-1.amazonaws.com/zapplweb/chatFiles/';
// $scope.uploadFile1 = function (input) {
//
//   var check = LoginService.getCompareFollowerList(mc.username, $stateParams.user2);
//   check.then(function(data){
//     var status = data.data.data.status;
//     if(status == 'Not_A_Follower'){
//       alert($stateParams.user2 + ' is not in your follower list.');
//       var path = $window.location.origin;
//       window.location = path+"/#!/Message/"+mc.username;
//     }
//     else{
//       var albumBucketName = 'zapplweb/chatFiles';
//       var bucketRegion = 'us-west-1';
//       var isMedia = '';
//       AWS.config.update({
//            accessKeyId: "your key",
//            secretAccessKey: "your key",
//           region: bucketRegion
//        });
//        var s3 = new AWS.S3({
//          apiVersion: '2006-03-01',
//          params: {Bucket: albumBucketName}
//        });
//     var file = input.files[0];
//     if(file.type.slice(0,5) == 'image')
//     {
//      var fileName = new Date().valueOf() + file.name;
//      var albumPhotosKey = encodeURIComponent("zapplChat");
//      var photoKey = albumPhotosKey + fileName;
//      s3.upload({
//        Key: photoKey,
//        Body: file,
//        ACL: 'public-read'
//      }, function(err, data) {
//        if (err)
//        {
//            alert('There was an error uploading your'+file.type.slice(0,5)+':'+err.message);
//            console.log("upload err",err);
//        }
//        else
//        {
//            var list = {};
//            var value;
//              value = '<a href="'+imageUrl+data.key+' " download><img src="'+imageUrl+data.key+' "class="img-responsive" width="390" height="200""></a>'
//              var encrypted = CryptoJS.AES.encrypt(
//               value,
//               $rootScope.base64Key,
//               { iv: $rootScope.iv }
//               );
//               $scope.ciphertext123 = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
//               socket.emit('sendchat', $scope.ciphertext123);
//
//               var height = $(document).height();
//               var thirtypc = (999999999999999999 * height);
//               thirtypc = parseInt(thirtypc) ;
//               socket.emit('setscrollheight', thirtypc);
//        }
//      });
//     }
//     else{
//     alert("File Formate Not Supported");
//     }
//     }
//   })
// }
//
//
// $scope.uploadFile2 = function (input) {
//   var check = LoginService.getCompareFollowerList(mc.username, $stateParams.user2);
//   check.then(function(data){
//     var status = data.data.data.status;
//     if(status == 'Not_A_Follower'){
//       alert($stateParams.user2 + ' is not in your follower list.');
//       var path = $window.location.origin;
//       window.location = path+"/#!/Message/"+mc.username;
//     }
//     else{
//       var albumBucketName = 'zapplweb/chatFiles';
//       var bucketRegion = 'us-west-1';
//       var isMedia = '';
//       AWS.config.update({
//            accessKeyId: "your key",
//            secretAccessKey: "your key",
//           region: bucketRegion
//        });
//        var s3 = new AWS.S3({
//          apiVersion: '2006-03-01',
//          params: {Bucket: albumBucketName}
//        });
//
//       var file = input.files[0];
//       if(file.type.slice(0,5) == 'video')
//       {
//       var fileName = new Date().valueOf() + file.name;
//       var albumPhotosKey = encodeURIComponent("zapplChat");
//       var photoKey = albumPhotosKey + fileName;
//       s3.upload({
//        Key: photoKey,
//        Body: file,
//        ACL: 'public-read'
//       }, function(err, data) {
//        if (err)
//        {
//            alert('There was an error uploading your'+file.type.slice(0,5)+':'+err.message);
//            console.log("upload err",err);
//        }
//        else
//        {
//            var list = {};
//            var value;
//               var key = (data.Key).substring(10);
//               if((data.Key).substring(0, 10) == 'postImage/'){
//                 key = key;
//               }
//               else{
//                 key = data.Key;
//               }
//               value = '<a href="'+imageUrl+key+' " download><video width="100%" height="300" class="embed-responsive-item" controls><source src="'+imageUrl+key+'" type="'+file.type+'"></video></a>';
//               var encrypted = CryptoJS.AES.encrypt(
//                value,
//                $rootScope.base64Key,
//                { iv: $rootScope.iv }
//                );
//                $scope.ciphertext12 = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
//                socket.emit('sendchat', $scope.ciphertext12);
//
//                var height = $(document).height();
//                var thirtypc = (999999999999999999 * height);
//                thirtypc = parseInt(thirtypc) ;
//                socket.emit('setscrollheight', thirtypc);
//        }
//       });
//       }
//       else{
//       alert("File Formate Not Supported");
//       }
//     }
//   })
// }
//
// $scope.uploadFile3 = function (input) {
//   var check = LoginService.getCompareFollowerList(mc.username, $stateParams.user2);
//   check.then(function(data){
//     var status = data.data.data.status;
//     if(status == 'Not_A_Follower'){
//       alert($stateParams.user2 + ' is not in your follower list.');
//       var path = $window.location.origin;
//       window.location = path+"/#!/Message/"+mc.username;
//     }
//     else{
//       var albumBucketName = 'zapplweb/chatFiles';
//       var bucketRegion = 'us-west-1';
//       var isMedia = '';
//       AWS.config.update({
//            accessKeyId: "your key",
//            secretAccessKey: "your key",
//           region: bucketRegion
//        });
//        var s3 = new AWS.S3({
//          apiVersion: '2006-03-01',
//          params: {Bucket: albumBucketName}
//        });
//
//       var file = input.files[0];
//       if(file.type.slice(0,5) == 'audio')
//       {
//       var fileName = new Date().valueOf() + file.name;
//       var albumPhotosKey = encodeURIComponent("zapplChat");
//       var photoKey = albumPhotosKey + fileName;
//       s3.upload({
//        Key: photoKey,
//        Body: file,
//        ACL: 'public-read'
//       }, function(err, data) {
//        if (err)
//        {
//            alert('There was an error uploading your'+file.type.slice(0,5)+':'+err.message);
//            console.log("upload err",err);
//        }
//        else
//        {
//            var list = {};
//            var value;
//               var key = (data.Key).substring(10);
//               if((data.Key).substring(0, 10) == 'postImage/'){
//                 key = key;
//               }
//               else{
//                 key = data.Key;
//               }
//               value = '<a href="'+imageUrl+key+' " download><audio controls><source src="'+imageUrl+key+'" type="'+file.type+'">Your browser does not support the audio element.</audio></a>';
//               var encrypted = CryptoJS.AES.encrypt(
//                value,
//                $rootScope.base64Key,
//                { iv: $rootScope.iv }
//                );
//                $scope.ciphertext12 = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
//                socket.emit('sendchat', $scope.ciphertext12);
//
//
//                var height = $(document).height();
//                var thirtypc = (999999999999999999 * height);
//                thirtypc = parseInt(thirtypc) ;
//                socket.emit('setscrollheight', thirtypc);
//        }
//       });
//       }
//       else{
//       alert("File Formate Not Supported");
//       }
//     }
//   })
// }
//
//
// $scope.uploadFile4 = function (input) {
//
//
//   var check = LoginService.getCompareFollowerList(mc.username, $stateParams.user2);
//   check.then(function(data){
//     var status = data.data.data.status;
//     if(status == 'Not_A_Follower'){
//       alert($stateParams.user2 + ' is not in your follower list.');
//       var path = $window.location.origin;
//       window.location = path+"/#!/Message/"+mc.username;
//     }
//     else{
//       var albumBucketName = 'zapplweb/chatFiles';
//       var bucketRegion = 'us-west-1';
//       var isMedia = '';
//       AWS.config.update({
//            accessKeyId: "Your key",
//            secretAccessKey: "Your key",
//           region: bucketRegion
//        });
//        var s3 = new AWS.S3({
//          apiVersion: '2006-03-01',
//          params: {Bucket: albumBucketName}
//        });
//
//    var file = input.files[0];
//    if(file.type.slice(0,11) == 'application'){
//      var fileName = new Date().valueOf() + file.name;
//      var albumPhotosKey = encodeURIComponent("zapplChat");
//      var photoKey = albumPhotosKey + fileName;
//      s3.upload({
//        Key: photoKey,
//        Body: file,
//        ACL: 'public-read'
//      }, function(err, data) {
//        if (err)
//        {
//            alert('There was an error uploading your'+file.type.slice(0,5)+':'+err.message);
//            console.log("upload err",err);
//        }
//        else
//        {
//            var list = {};
//            var value;
//            var src;
//
//            if(file.type.slice(12,15) == 'zip'){
//              src = "https://s3-us-west-1.amazonaws.com/zapplweb/chatFiles/zapplChat1505205175238zip-file.ico" || "http://icons.iconseeker.com/ico/black-pearl-files/zip-file.ico";
//            }
//            else if(file.type.slice(12,15) == 'pdf'){
//              src = "https://s3-us-west-1.amazonaws.com/zapplweb/chatFiles/zapplChat1505204972920pdf.png" || "http://www.probonoaccountancy.sg/wp-content/uploads/2016/03/Word-icon.png";
//            }
//            else if(file.name.split('.').pop().trim() == 'doc'||file.name.split('.').pop().trim() == 'dot'||file.name.split('.').pop().trim() == 'wbk'||file.name.split('.').pop().trim() == 'docx'||file.name.split('.').pop().trim() == 'docm'||file.type.slice(12,17) == 'dotx'||file.name.split('.').pop().trim() == 'dotm' || file.name.split('.').pop().trim() == 'docb'){
//              src = "https://s3-us-west-1.amazonaws.com/zapplweb/chatFiles/zapplChat1505204988891Word-icon.png" || "http://www.probonoaccountancy.sg/wp-content/uploads/2016/03/Word-icon.png";
//            }
//            else if(file.name.split('.').pop().trim() == 'xls'||file.name.split('.').pop().trim() == 'xlt'||file.name.split('.').pop().trim() == 'xlm'||file.name.split('.').pop().trim() == 'xlsx'||file.name.split('.').pop().trim() == 'xlsm'||file.type.slice(12,17) == 'xltx'||file.name.split('.').pop().trim() == 'xltm' || file.name.split('.').pop().trim() == 'xlsb'||file.name.split('.').pop().trim() == 'xla'||file.type.slice(12,17) == 'xlam'||file.name.split('.').pop().trim() == 'xll' || file.name.split('.').pop().trim() == 'xlw'){
//              src = "https://s3-us-west-1.amazonaws.com/zapplweb/chatFiles/zapplChat1505209445860Excel2013FileIcon.png" || "http://www.emmielewis.com/wp-content/uploads/2016/01/Excel2013FileIcon.png";
//            }
//            else if(file.name.split('.').pop().trim() == 'ppt'||file.name.split('.').pop().trim() == 'pot'||file.name.split('.').pop().trim() == 'pps'||file.name.split('.').pop().trim() == 'pptx'||file.name.split('.').pop().trim() == 'pptm'||file.type.slice(12,17) == 'potx'||file.name.split('.').pop().trim() == 'potm' || file.name.split('.').pop().trim() == 'ppam'||file.name.split('.').pop().trim() == 'ppsx'||file.type.slice(12,17) == 'ppsm'||file.name.split('.').pop().trim() == 'sldx' || file.name.split('.').pop().trim() == 'sldm'){
//              src = "https://s3-us-west-1.amazonaws.com/zapplweb/chatFiles/zapplChat1505209560848ppt.jpg" || "http://4.bp.blogspot.com/-BC5O86r76jw/VekoxHOV8kI/AAAAAAAAAXM/zAIIMxn8nKE/s1600/ppt.jpg";
//            }
//            else{
//              src = "https://s3-us-west-1.amazonaws.com/zapplweb/chatFiles/zapplChat1505204539075document-icon.png";
//            }
//               value = '<a href="'+imageUrl+data.key+' " download><img src='+src+' alt="zappl file" style="width:100px;height:90px;margin-left: 30px;" class="img-responsive"><p style="margin-left: 50px;font-size: inherit;font-family: sans-serif;color: black;">'+file.name+'</p></a>';
//               var encrypted = CryptoJS.AES.encrypt(
//               value,
//               $rootScope.base64Key,
//               { iv: $rootScope.iv }
//               );
//               $scope.ciphertext1 = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
//               socket.emit('sendchat', $scope.ciphertext1);
//
//
//               var height = $(document).height();
//               var thirtypc = (999999999999999999 * height);
//               thirtypc = parseInt(thirtypc) ;
//               socket.emit('setscrollheight', thirtypc);
//        }
//      });
//    }
//   else{
//     alert("File Formate Not Supported");
//   }
//     }
//   })
// }
//
// //method to delete message
// $scope.checkIndex = function(index, users, user){
//   if (confirm("Are you sure you want to Delete this message?") == true) {
//     users.splice(index, 1);
//     var data = {
//       room : user.room,
//       displayName : user.room,
//       img : '',
//       members : '',
//       type : 'one',
//       chat : users
//       }
//     socket.emit('test321', data);
//   }
// }
//
//
// socket.on('test123', function (data){
//   LoginService.setChat(data);
//   var newObj = data.chat;
//   newObj.forEach(function(obj){
//      var cipherParams = CryptoJS.lib.CipherParams.create({
//      ciphertext: CryptoJS.enc.Base64.parse(obj.message)
//      });
//      var decrypted = CryptoJS.AES.decrypt(
//      cipherParams,
//      $rootScope.base64Key,
//      { iv: $rootScope.iv }
//      );
//      $scope.descrString1 = decrypted.toString(CryptoJS.enc.Utf8);
//      obj.message1 = $sce.trustAsHtml($scope.descrString1);
//   })
//   $scope.users = newObj;
//   finalRoom = data.room;
//   $scope.currentUser =  { username: mc.username, receiver : mc.user2, room : finalRoom} ;
//   socket.emit('createroom', $scope.currentUser);
// });
//
// // mc.deleteAll = function(len){
// //   len.splice(0, len.length);
// //   console.log(len);
// //   var data = {
// //     room : mc.username+"-"+$stateParams.user2,
// //     chat : len
// //     }
// //   LoginService.setChat(data);
// // }
//
// $('.editable').each(function(){
//  this.contentEditable = true;
//  });
//
//  $('.editable').on("keypress paste", function (e) {
//        if (this.innerHTML.length >= this.getAttribute("max")) {
//            e.preventDefault();
//            return false;
//        }
//   });
//
// mc.editMessage = function(index, user, users){
//   $scope.index_editmsg = index;
//   $scope.userMsg_edit = users;
//   $scope.message1423 = true;
//   var cipherParams = CryptoJS.lib.CipherParams.create({
//    ciphertext: CryptoJS.enc.Base64.parse(user.message)
//    });
//    var decrypted = CryptoJS.AES.decrypt(
//    cipherParams,
//    $rootScope.base64Key,
//    { iv: $rootScope.iv }
//    );
//    $scope.descrString143 = decrypted.toString(CryptoJS.enc.Utf8);
//    document.getElementById("editable").innerHTML = $scope.descrString143;
//    }
//
//    $scope.doPost12 = function () {
//      if( document.getElementById("editable").innerHTML != ''){
//        var text = document.getElementById("editable").innerHTML;
//        text = text.replace(/<div>/gi,'<br>').replace(/<\/div>/gi,'').replace(/^(\s*<br\s*\/?\s*>\s*)*|(\s*<br\s*\/?\s*>\s*)*\s*$/g,'').replace(/&nbsp;/gi,'').trim().replace(/^(\s*<br\s*\/?\s*>\s*)*|(\s*<br\s*\/?\s*>\s*)*\s*$/g,'');
//        if(text !== ''){
//          var encrypted = CryptoJS.AES.encrypt(
//          text,
//          $rootScope.base64Key,
//          { iv: $rootScope.iv }
//          );
//          $scope.ciphertext = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
//          socket.emit('sendchat123', $scope.ciphertext);
//        }
//      }
//      }
//
//
//      $scope.doPost23123 = function () {
//        var x = document.getElementsByClassName("emojionearea-editor");
//        if( x["0"].innerHTML != ''){
//          var text = x["0"].innerHTML;
//          text = text.replace(/<div>/gi,'<br>').replace(/<\/div>/gi,'').replace(/^(\s*<br\s*\/?\s*>\s*)*|(\s*<br\s*\/?\s*>\s*)*\s*$/g,'').replace(/&nbsp;/gi,'').trim().replace(/^(\s*<br\s*\/?\s*>\s*)*|(\s*<br\s*\/?\s*>\s*)*\s*$/g,'');
//          if(text !== ''){
//            var encrypted = CryptoJS.AES.encrypt(
//            text,
//            $rootScope.base64Key,
//            { iv: $rootScope.iv }
//            );
//            $scope.ciphertext = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
//            socket.emit('sendchat', $scope.ciphertext);
//              x["0"].innerHTML = '';
//          }
//          else{
//            x["0"].innerHTML = '';
//          }
//        }
//        }
//
// socket.on('updatechat123', function (username,room, data){
//     $scope.users.splice($scope.index_editmsg,1);
//     var user = {};
//     user.username = username;
//     var cipherParams = CryptoJS.lib.CipherParams.create({
//      ciphertext: CryptoJS.enc.Base64.parse(data)
//      });
//      var decrypted = CryptoJS.AES.decrypt(
//      cipherParams,
//      $rootScope.base64Key,
//      { iv: $rootScope.iv }
//      );
//      $scope.descrString = decrypted.toString(CryptoJS.enc.Utf8);
//      user.message = data;
//      user.message1 = $sce.trustAsHtml($scope.descrString);
//      user.date = new Date().getTime();
//      user.room = room;
//      $scope.users.splice($scope.index_editmsg,0,user);
//      var data1 = {
//         room : room,
//         displayName : room,
//         type : 'one',
//         members : '',
//         img : '',
//         chat : $scope.users
//       }
//       socket.emit('test321', data1);
//   });
//
// mc.getChatList = function(){
//   var rep =   LoginService.getChatList(mc.username);
//   rep.then(function(data){
//     mc.list = data.data.data;
//   })
// }
//
// $scope.chatRedirect = function(n){
//   var path = $window.location.origin;
//   if(n.type == 'one'){
//     window.location = path+"/#!/Message/"+mc.username+"/"+n.username;
//   }
//   else if(n.type == 'group'){
//     window.location = path+"/#!/Message/"+mc.username+"/group/"+n.room;
//   }
// }
//
//
// // ------------------GROUP METHODS------------------------
//
//
// $scope.createGroup1 = function(){
//   var imglist = [];
//   var list = {};
//   var image;
//   var name = {};
//   var room = $stateParams.groupname;
//   var rep = LoginService.getChat(room);
//   rep.then(function(data){
//     $scope.grpimg = data.data.data.chatData.img;
//     $scope.grpname = data.data.data.chatData.displayName;
//     $scope.grplength = data.data.data.chatData.members.length;
//     $scope.grpmembers = data.data.data.chatData.members;
//     if(data.data.data.chatData.chat == ""){
//         $scope.users = [];
//         finalRoom = data.data.data.chatData.room;
//         $scope.currentGroup =  { username: mc.username, room : finalRoom, displayName : data.data.data.chatData.displayName, members : data.data.data.chatData.members, type : data.data.data.chatData.type, chat : data.data.data.chatData.chat, img : data.data.data.chatData.img};
//         socket.emit('creategroup', $scope.currentGroup);
//     }
//     else{
//   var newObj = data.data.data.chatData.chat;
//   newObj.forEach(function(obj){
//      var cipherParams = CryptoJS.lib.CipherParams.create({
//      ciphertext: CryptoJS.enc.Base64.parse(obj.message)
//      });
//      var decrypted = CryptoJS.AES.decrypt(
//      cipherParams,
//      $rootScope.base64Key,
//      { iv: $rootScope.iv }
//      );
//      $scope.descrString1 = decrypted.toString(CryptoJS.enc.Utf8);
//      if($scope.descrString1.indexOf('</audio>') > -1){
//        obj.audio = 'false';
//      }
//      else if($scope.descrString1.indexOf('</video>') > -1){
//        obj.audio = 'false';
//      }
//      else{
//        obj.audio = 'true';
//      }
//      obj.message1 = $sce.trustAsHtml($scope.descrString1);
//   })
//   $scope.users = newObj;
//   finalRoom = room;
//   $scope.currentGroup =  { username: mc.username, room : finalRoom, displayName : data.data.data.chatData.displayName, members : data.data.data.chatData.members, type : data.data.data.chatData.type, chat : data.data.data.chatData.chat, img : data.data.data.chatData.img} ;
//   socket.emit('creategroup', $scope.currentGroup);
// }
//   })
// }
//
// socket.on('groupcreated', function (data) {
//   socket.emit('addgroup', data);
// });
//
// $scope.doPostGroup = function () {
//   if($scope.currentGroup.members.indexOf(mc.username) > -1){
//     var x = document.getElementsByClassName("emojionearea-editor");
//     if( x["0"].innerHTML != ''){
//       var text = x["0"].innerHTML;
//       text = text.replace(/<div>/gi,'<br>').replace(/<\/div>/gi,'').replace(/^(\s*<br\s*\/?\s*>\s*)*|(\s*<br\s*\/?\s*>\s*)*\s*$/g,'').replace(/&nbsp;/gi,'').trim().replace(/^(\s*<br\s*\/?\s*>\s*)*|(\s*<br\s*\/?\s*>\s*)*\s*$/g,'');
//       if(text !== ''){
//       var encrypted = CryptoJS.AES.encrypt(
//       text,
//       $rootScope.base64Key,
//       { iv: $rootScope.iv }
//       );
//       $scope.ciphertext = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
//       socket.emit('sendgroupchat', $scope.ciphertext);
//         x["0"].innerHTML = '';
//
//         var height = $(document).height();
//         var thirtypc = (999999999999999999 * height);
//         thirtypc = parseInt(thirtypc) ;
//         socket.emit('setscrollheight', thirtypc);
//       }
//       else{
//         x["0"].innerHTML = '';
//       }
//     }
//   }
// else{
//   alert("You are not a member of this group!!");
//   var path = $window.location.origin;
//   window.location = path+"/#!/Message/"+mc.username;
//   }
// }
//
//   socket.on('updategroupchat', function (username,room,displayName,members,data){
//     var user = {};
//     user.username = username;
//     var cipherParams = CryptoJS.lib.CipherParams.create({
//      ciphertext: CryptoJS.enc.Base64.parse(data)
//      });
//      var decrypted = CryptoJS.AES.decrypt(
//      cipherParams,
//      $rootScope.base64Key,
//      { iv: $rootScope.iv }
//      );
//      $scope.descrString = decrypted.toString(CryptoJS.enc.Utf8);
//      if($scope.descrString.indexOf('</audio>') > -1){
//        user.audio = 'false';
//      }
//      else if($scope.descrString.indexOf('</video>') > -1){
//        user.audio = 'false';
//      }
//      else{
//        user.audio = 'true';
//      }
//      user.message = data;
//      user.message1 = $sce.trustAsHtml($scope.descrString);
//      user.date = new Date().getTime();
//      user.room = room;
//      user.displayName = displayName;
//      $scope.users.push(user);
//      var data = {
//         room : room,
//         displayName : displayName,
//         type : 'group',
//         members : members,
//         img : $scope.currentGroup.img,
//         chat : $scope.users
//         }
//     LoginService.setChat(data);
//   });
//
//   $scope.selectedList = {};
//   $scope.check= function(){
//       $scope.findFollower = '';
//       $scope.view = false;
//       var list_group = {};
//       list_group = $scope.selectedList;
//       for(var key in list_group){
//         if(list_group.hasOwnProperty(key) && list_group[key] == false){
//           delete list_group[key];
//         }
//       }
//       $scope.list1423 = Object.keys(list_group);
//   }
//
//   $scope.addToGroup = function(){
//     if($scope.list1423.length !== 0){
//     $scope.currentGroup.members = $scope.currentGroup.members.concat($scope.list1423);
//     $scope.currentGroup.members.sort();
//     var char = 'a';
//     var mask = '';
//     if (char.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
//     var result = '';
//     for (var i = 12; i > 0; --i) result += mask[Math.round(Math.random() * (mask.length - 1))];
//     var text = $scope.currentGroup.displayName+result;
//
//     for (var i = 0; i < $scope.currentGroup.members.length; i++){
//       var test = $scope.currentGroup.members[i];
//       text = text+'_'+test;
//     }
//     $scope.currentGroup.room =  text;
//     if($scope.currentGroup.chat.length !== 0){
//       for (var j = 0; j < $scope.currentGroup.chat.length; j++){
//           $scope.currentGroup.chat[j].room = text;
//       }
//     }
//     setTimeout(function(){
//       data = {
//       room : $scope.currentGroup.room,
//       displayName : $scope.currentGroup.displayName,
//       type : $scope.currentGroup.type,
//       members : $scope.currentGroup.members,
//       img : $scope.currentGroup.img,
//       chat : $scope.currentGroup.chat
//     }
//     LoginService.setChat(data);
//     window.location.reload();
//     var path = $window.location.origin;
//     window.location = path+"/#!/Message/"+mc.username+"/group/"+$scope.currentGroup.room;
//   }, 1500);
//     $scope.list1423 = '';
//     $scope.selectedList = {};
// }
// else{
//   alert('Please select name to add user..');
// }
//   }
//
// $scope.createGroupz = function(){
//     $scope.list1423.push(mc.username);
//     $scope.list1423.sort();
//     var text;
//     var text1;
//     var data = {};
//     var grpname = mc.grpname;
//
//     if( grpname != ''){
//       text = text1 = grpname;
//       var char = 'a';
//       var mask = '';
//       if (char.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
//       var result = '';
//       for (var i = 12; i > 0; --i) result += mask[Math.round(Math.random() * (mask.length - 1))];
//       text = text+result;
//       for (var i = 0; i < $scope.list1423.length; i++){
//         var test = $scope.list1423[i];
//         text = text+'_'+test;
//       }
//     }
//     data = {
//       room : text,
//       displayName : text1,
//       type : 'group',
//       members : $scope.list1423,
//       img : $scope.grpImage || "https://s3-us-west-1.amazonaws.com/zapplweb/chatFiles/zapplChat1507812160651585e4d1ccb11b227491c339b.png",
//       chat : ''
//     }
//     LoginService.setChat(data);
//     var path = $window.location.origin;
//     window.location = path+"/#!/Message/"+mc.username+"/group/"+text;
//     window.location.reload();
//   }
//
// $scope.chatredirect = function(p){
//   var check = LoginService.getCompareFollowerList(mc.username, p);
//   check.then(function(data){
//     var status = data.data.data.status;
//     if(status == 'Not_A_Follower'){
//       alert( p + 'is not in your follower list.');
//     }
//     else{
//       window.location.reload();
//       var path = $window.location.origin;
//       window.location = path+"/#!/Message/"+mc.username+"/"+p;
//     }
//   })
// }
//
// $scope.profileredirect = function(p){
//   window.location.reload();
//   var path = $window.location.origin;
//   window.location = path+"/#!/@"+p;
// }
//
//
// var imageUrl = 'https://s3-us-west-1.amazonaws.com/zapplweb/chatFiles/';
// $scope.uploadFile11 = function (input) {
//   if($scope.currentGroup.members.indexOf(mc.username) > -1){
//     var albumBucketName = 'zapplweb/chatFiles';
//     var bucketRegion = 'us-west-1';
//     var isMedia = '';
//     AWS.config.update({
//          accessKeyId: "Your key",
//          secretAccessKey: "Your key",
//         region: bucketRegion
//      });
//      var s3 = new AWS.S3({
//        apiVersion: '2006-03-01',
//        params: {Bucket: albumBucketName}
//      });
//  var file = input.files[0];
//  if(file.type.slice(0,5) == 'image')
//  {
//    var fileName = new Date().valueOf() + file.name;
//    var albumPhotosKey = encodeURIComponent("zapplChat");
//    var photoKey = albumPhotosKey + fileName;
//    s3.upload({
//      Key: photoKey,
//      Body: file,
//      ACL: 'public-read'
//    }, function(err, data) {
//      if (err)
//      {
//          alert('There was an error uploading your'+file.type.slice(0,5)+':'+err.message);
//          console.log("upload err",err);
//      }
//      else
//      {
//          var list = {};
//          var value;
//            value = '<a href="'+imageUrl+data.key+' " download><img src="'+imageUrl+data.key+' "class="img-responsive" width="390" height="200""></a>'
//            var encrypted = CryptoJS.AES.encrypt(
//             value,
//             $rootScope.base64Key,
//             { iv: $rootScope.iv }
//             );
//             $scope.ciphertext123 = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
//             socket.emit('sendgroupchat', $scope.ciphertext123);
//
//             var height = $(document).height();
//             var thirtypc = (999999999999999999 * height);
//             thirtypc = parseInt(thirtypc) ;
//             socket.emit('setscrollheight', thirtypc);
//      }
//    });
//  }
// else{
//   alert("File Formate Not Supported");
// }
//   }
//   else{
//     alert("You are not a member of this group!!");
//     var path = $window.location.origin;
//     window.location = path+"/#!/Message/"+mc.username;
//     }
// }
//
//
// $scope.uploadFile12 = function (input) {
//   if($scope.currentGroup.members.indexOf(mc.username) > -1){
//     var albumBucketName = 'zapplweb/chatFiles';
//     var bucketRegion = 'us-west-1';
//     var isMedia = '';
//     AWS.config.update({
//          accessKeyId: "Your key",
//          secretAccessKey: "Your key",
//         region: bucketRegion
//      });
//      var s3 = new AWS.S3({
//        apiVersion: '2006-03-01',
//        params: {Bucket: albumBucketName}
//      });
//
//  var file = input.files[0];
//  if(file.type.slice(0,5) == 'video')
//  {
//    var fileName = new Date().valueOf() + file.name;
//    var albumPhotosKey = encodeURIComponent("zapplChat");
//    var photoKey = albumPhotosKey + fileName;
//    s3.upload({
//      Key: photoKey,
//      Body: file,
//      ACL: 'public-read'
//    }, function(err, data) {
//      if (err)
//      {
//          alert('There was an error uploading your'+file.type.slice(0,5)+':'+err.message);
//          console.log("upload err",err);
//      }
//      else
//      {
//          var list = {};
//          var value;
//             var key = (data.Key).substring(10);
//             if((data.Key).substring(0, 10) == 'postImage/'){
//               key = key;
//             }
//             else{
//               key = data.Key;
//             }
//             value = '<a href="'+imageUrl+key+' " download><video width="100%" height="300" class="embed-responsive-item" controls><source src="'+imageUrl+key+'" type="'+file.type+'"></video></a>';
//             var encrypted = CryptoJS.AES.encrypt(
//              value,
//              $rootScope.base64Key,
//              { iv: $rootScope.iv }
//              );
//              $scope.ciphertext12 = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
//              socket.emit('sendgroupchat', $scope.ciphertext12);
//
//              var height = $(document).height();
//              var thirtypc = (999999999999999999 * height);
//              thirtypc = parseInt(thirtypc) ;
//              socket.emit('setscrollheight', thirtypc);
//      }
//    });
//  }
// else{
//   alert("File Formate Not Supported");
// }
//   }
//   else{
//     alert("You are not a member of this group!!");
//     var path = $window.location.origin;
//     window.location = path+"/#!/Message/"+mc.username;
//     }
// }
//
// $scope.uploadFile13 = function (input) {
//   if($scope.currentGroup.members.indexOf(mc.username) > -1){
//     var albumBucketName = 'zapplweb/chatFiles';
//     var bucketRegion = 'us-west-1';
//     var isMedia = '';
//     AWS.config.update({
//          accessKeyId: "Your key",
//          secretAccessKey: "Your key",
//         region: bucketRegion
//      });
//      var s3 = new AWS.S3({
//        apiVersion: '2006-03-01',
//        params: {Bucket: albumBucketName}
//      });
//
//  var file = input.files[0];
//  if(file.type.slice(0,5) == 'audio')
//  {
//    var fileName = new Date().valueOf() + file.name;
//    var albumPhotosKey = encodeURIComponent("zapplChat");
//    var photoKey = albumPhotosKey + fileName;
//    s3.upload({
//      Key: photoKey,
//      Body: file,
//      ACL: 'public-read'
//    }, function(err, data) {
//      if (err)
//      {
//          alert('There was an error uploading your'+file.type.slice(0,5)+':'+err.message);
//          console.log("upload err",err);
//      }
//      else
//      {
//          var list = {};
//          var value;
//             var key = (data.Key).substring(10);
//             if((data.Key).substring(0, 10) == 'postImage/'){
//               key = key;
//             }
//             else{
//               key = data.Key;
//             }
//             value = '<a href="'+imageUrl+key+' " download><audio controls><source src="'+imageUrl+key+'" type="'+file.type+'">Your browser does not support the audio element.</audio></a>';
//             var encrypted = CryptoJS.AES.encrypt(
//              value,
//              $rootScope.base64Key,
//              { iv: $rootScope.iv }
//              );
//              $scope.ciphertext12 = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
//              socket.emit('sendgroupchat', $scope.ciphertext12);
//
//              var height = $(document).height();
//              var thirtypc = (999999999999999999 * height);
//              thirtypc = parseInt(thirtypc) ;
//              socket.emit('setscrollheight', thirtypc);
//      }
//    });
//  }
//  else{
//   alert("File Formate Not Supported");
// }
//   }
//   else{
//     alert("You are not a member of this group!!");
//     var path = $window.location.origin;
//     window.location = path+"/#!/Message/"+mc.username;
//     }
// }
//
//
// $scope.uploadFile14 = function (input) {
//   if($scope.currentGroup.members.indexOf(mc.username) > -1){
//     var albumBucketName = 'zapplweb/chatFiles';
//     var bucketRegion = 'us-west-1';
//     var isMedia = '';
//     AWS.config.update({
//          accessKeyId: "Your key",
//          secretAccessKey: "Your key",
//         region: bucketRegion
//      });
//      var s3 = new AWS.S3({
//        apiVersion: '2006-03-01',
//        params: {Bucket: albumBucketName}
//      });
//
//  var file = input.files[0];
//  if(file.type.slice(0,11) == 'application'){
//    var fileName = new Date().valueOf() + file.name;
//    var albumPhotosKey = encodeURIComponent("zapplChat");
//    var photoKey = albumPhotosKey + fileName;
//    s3.upload({
//      Key: photoKey,
//      Body: file,
//      ACL: 'public-read'
//    }, function(err, data) {
//      if (err)
//      {
//          alert('There was an error uploading your'+file.type.slice(0,5)+':'+err.message);
//          console.log("upload err",err);
//      }
//      else
//      {
//          var list = {};
//          var value;
//          var src;
//
//          if(file.type.slice(12,15) == 'zip'){
//            src = "https://s3-us-west-1.amazonaws.com/zapplweb/chatFiles/zapplChat1505205175238zip-file.ico" || "http://icons.iconseeker.com/ico/black-pearl-files/zip-file.ico";
//          }
//          else if(file.type.slice(12,15) == 'pdf'){
//            src = "https://s3-us-west-1.amazonaws.com/zapplweb/chatFiles/zapplChat1505204972920pdf.png" || "http://www.probonoaccountancy.sg/wp-content/uploads/2016/03/Word-icon.png";
//          }
//          else if(file.name.split('.').pop().trim() == 'doc'||file.name.split('.').pop().trim() == 'dot'||file.name.split('.').pop().trim() == 'wbk'||file.name.split('.').pop().trim() == 'docx'||file.name.split('.').pop().trim() == 'docm'||file.type.slice(12,17) == 'dotx'||file.name.split('.').pop().trim() == 'dotm' || file.name.split('.').pop().trim() == 'docb'){
//            src = "https://s3-us-west-1.amazonaws.com/zapplweb/chatFiles/zapplChat1505204988891Word-icon.png" || "http://www.probonoaccountancy.sg/wp-content/uploads/2016/03/Word-icon.png";
//          }
//          else if(file.name.split('.').pop().trim() == 'xls'||file.name.split('.').pop().trim() == 'xlt'||file.name.split('.').pop().trim() == 'xlm'||file.name.split('.').pop().trim() == 'xlsx'||file.name.split('.').pop().trim() == 'xlsm'||file.type.slice(12,17) == 'xltx'||file.name.split('.').pop().trim() == 'xltm' || file.name.split('.').pop().trim() == 'xlsb'||file.name.split('.').pop().trim() == 'xla'||file.type.slice(12,17) == 'xlam'||file.name.split('.').pop().trim() == 'xll' || file.name.split('.').pop().trim() == 'xlw'){
//            src = "https://s3-us-west-1.amazonaws.com/zapplweb/chatFiles/zapplChat1505209445860Excel2013FileIcon.png" || "http://www.emmielewis.com/wp-content/uploads/2016/01/Excel2013FileIcon.png";
//          }
//          else if(file.name.split('.').pop().trim() == 'ppt'||file.name.split('.').pop().trim() == 'pot'||file.name.split('.').pop().trim() == 'pps'||file.name.split('.').pop().trim() == 'pptx'||file.name.split('.').pop().trim() == 'pptm'||file.type.slice(12,17) == 'potx'||file.name.split('.').pop().trim() == 'potm' || file.name.split('.').pop().trim() == 'ppam'||file.name.split('.').pop().trim() == 'ppsx'||file.type.slice(12,17) == 'ppsm'||file.name.split('.').pop().trim() == 'sldx' || file.name.split('.').pop().trim() == 'sldm'){
//            src = "https://s3-us-west-1.amazonaws.com/zapplweb/chatFiles/zapplChat1505209560848ppt.jpg" || "http://4.bp.blogspot.com/-BC5O86r76jw/VekoxHOV8kI/AAAAAAAAAXM/zAIIMxn8nKE/s1600/ppt.jpg";
//          }
//          else{
//            src = "https://s3-us-west-1.amazonaws.com/zapplweb/chatFiles/zapplChat1505204539075document-icon.png";
//          }
//             value = '<a href="'+imageUrl+data.key+' " download><img src='+src+' alt="zappl file" style="width:100px;height:90px;margin-left: 30px;" class="img-responsive"><p style="margin-left: 50px;font-size: inherit;font-family: sans-serif;color: black;">'+file.name+'</p></a>';
//             var encrypted = CryptoJS.AES.encrypt(
//             value,
//             $rootScope.base64Key,
//             { iv: $rootScope.iv }
//             );
//             $scope.ciphertext1 = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
//             socket.emit('sendgroupchat', $scope.ciphertext1);
//
//
//             var height = $(document).height();
//             var thirtypc = (999999999999999999 * height);
//             thirtypc = parseInt(thirtypc) ;
//             socket.emit('setscrollheight', thirtypc);
//      }
//    });
//  }
// else{
//   alert("File Formate Not Supported");
// }
//   }
//   else{
//     alert("You are not a member of this group!!");
//     var path = $window.location.origin;
//     window.location = path+"/#!/Message/"+mc.username;
//     }
// }
//
//
//
// $scope.uploadgrpimage = function (input){
//     var albumBucketName = 'zapplweb/chatFiles';
//     var bucketRegion = 'us-west-1';
//     var isMedia = '';
//     AWS.config.update({
//          accessKeyId: "Your key",
//          secretAccessKey: "Your key",
//         region: bucketRegion
//      });
//      var s3 = new AWS.S3({
//        apiVersion: '2006-03-01',
//        params: {Bucket: albumBucketName}
//      });
//  var file = input.files[0];
//  if(file.type.slice(0,5) == 'image')
//  {
//    var fileName = new Date().valueOf() + file.name;
//    var albumPhotosKey = encodeURIComponent("zapplChat");
//    var photoKey = albumPhotosKey + fileName;
//    s3.upload({
//      Key: photoKey,
//      Body: file,
//      ACL: 'public-read'
//    }, function(err, data) {
//      if (err)
//      {
//          alert('There was an error uploading your'+file.type.slice(0,5)+':'+err.message);
//          console.log("upload err",err);
//      }
//      else
//      {
//          var list = {};
//          var value;
//            $scope.grpImage = imageUrl+data.key;
//            document.getElementById("imggrp").src = imageUrl+data.key;
//      }
//    });
//  }
// else{
//   alert("File Formate Not Supported");
// }
// }
//
//
//
// $scope.checkName = function(){
//   if($scope.currentGroup.members.indexOf($scope.finduser) > -1){
//     alert("User already in group!!!");
//     $scope.finduser = '';
//   }
//   else {
//     var check = LoginService.getCompareFollowerList(mc.username, $scope.finduser);
//     check.then(function(data){
//       var status = data.data.data.status;
//       if(status == 'Not_A_Follower'){
//         $scope.view = false;
//         alert($scope.finduser + ' is not in your follower list.');
//         $scope.finduser = '';
//       }
//       else{
//         $scope.view = true;
//         mc.finduser = $scope.finduser;
//         var rep1 = LoginService.getUserProfileImage($scope.finduser);
//         rep1.then(function(data){
//           $scope.img123 = data.data.data.userProfileImage;
//         })
//         $scope.finduser = '';
//       }
//     })
//   }
// }
//
// $scope.deletemsg_grp = function(index, users, user){
//   if (confirm("Are you sure you want to Delete this message?") == true) {
//   users.splice(index, 1);
//   var data = {
//     room : user.room,
//     displayName : user.displayName,
//     img : $scope.currentGroup.img,
//     members : $scope.currentGroup.members,
//     type : 'group',
//     chat : users
//     }
//     socket.emit('deletechat', data);
//   }
// }
//
// socket.on('deletechatz', function (data){
//   LoginService.setChat(data);
//   var newObj = data.chat;
//   newObj.forEach(function(obj){
//      var cipherParams = CryptoJS.lib.CipherParams.create({
//      ciphertext: CryptoJS.enc.Base64.parse(obj.message)
//      });
//      var decrypted = CryptoJS.AES.decrypt(
//      cipherParams,
//      $rootScope.base64Key,
//      { iv: $rootScope.iv }
//      );
//      $scope.descrString1 = decrypted.toString(CryptoJS.enc.Utf8);
//      obj.message1 = $sce.trustAsHtml($scope.descrString1);
//   })
//   $scope.users = newObj;
//   finalRoom = data.room;
//   $scope.currentGroup =  { username: mc.username, room : finalRoom, displayName : data.displayName, members : data.members, type : data.type, chat : data.chat, img : data.img} ;
//   socket.emit('creategroup', $scope.currentGroup);
// });
//
//
//
//
//    $scope.editPost = function () {
//      if( document.getElementById("editable").innerHTML != ''){
//        var text = document.getElementById("editable").innerHTML;
//        text = text.replace(/<div>/gi,'<br>').replace(/<\/div>/gi,'').replace(/^(\s*<br\s*\/?\s*>\s*)*|(\s*<br\s*\/?\s*>\s*)*\s*$/g,'').replace(/&nbsp;/gi,'').trim().replace(/^(\s*<br\s*\/?\s*>\s*)*|(\s*<br\s*\/?\s*>\s*)*\s*$/g,'');
//        if(text !== ''){
//        var encrypted = CryptoJS.AES.encrypt(
//        text,
//        $rootScope.base64Key,
//        { iv: $rootScope.iv }
//        );
//        $scope.ciphertext = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
//        socket.emit('sendeditmessage', $scope.ciphertext);
//      }
//      }
//      }
//
//      socket.on('updatechat1234', function (username,room,displayName,members, data){
//          $scope.users.splice($scope.index_editmsg,1);
//          var user = {};
//          user.username = username;
//          var cipherParams = CryptoJS.lib.CipherParams.create({
//           ciphertext: CryptoJS.enc.Base64.parse(data)
//           });
//           var decrypted = CryptoJS.AES.decrypt(
//           cipherParams,
//           $rootScope.base64Key,
//           { iv: $rootScope.iv }
//           );
//           $scope.descrString = decrypted.toString(CryptoJS.enc.Utf8);
//           user.message = data;
//           user.message1 = $sce.trustAsHtml($scope.descrString);
//           user.date = new Date().getTime();
//           user.room = room;
//           user.displayName = displayName;
//           $scope.users.splice($scope.index_editmsg,0,user);
//           var data = {
//              room : room,
//              displayName : displayName,
//              type : 'group',
//              members : members,
//              img : $scope.currentGroup.img,
//              chat : $scope.users
//            }
//           socket.emit('deletechat', data);
//        });
//
// $scope.viewimgname = function(){
//   $scope.list1423123 = [];
//   var name = {};
//   for (var i = 0; i < $scope.grpmembers.length; i++){
//     name = {
//       name : $scope.grpmembers[i]
//     }
//     $scope.list1423123.push(name);
//   }
//   setTimeout(function(){ $scope.viewimgname123(); }, 500);
// }
//
// $scope.viewimgname123 = function(){
//   var newObj = $scope.list1423123;
//   newObj.forEach(function(obj){
//     var rep1 = LoginService.getUserProfileImage(obj.name);
//     rep1.then(function(data){
//       obj.Image = data.data.data.userProfileImage;
//     })
//   })
//   $scope.imgnamelist = newObj;
// }
//
// });
