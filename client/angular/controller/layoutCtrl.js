

  ZapplApp.controller('layoutCtrl', function($rootScope, $stateParams, $state, $window,$http,$scope,$sce,LoginService) {
    document.getElementById("body").style.display = "block";
    var layout = this;

    layout.userInfo = {};
    layout.username = localStorage.getItem('username');
    layout.afterTag = 'steemit';
    layout.deviceId = 'abc@ABC1231';
    layout.loginToken = localStorage.getItem("loginToken");
    $rootScope.tokenValue = localStorage.getItem("loginToken");

    // if(layout.loginToken == null && layout.loginToken == '' && layout.loginToken != undefined){
    //
    // }

    layout.checkToken = function()
    {
      var result = true;
      if(layout.loginToken == null){
        var path = $window.location.origin;
        window.location = path+'/';
        result = false;
      }
      return result;
    }

    layout.getToken = function(){
        var browserDeviceId='';
        //var json = 'http://ipv4.myexternalip.com/json';
        var json = 'https://api.ipify.org?format=json';
        $http.get(json).then(function(result) {
             browserDeviceId = result.data.ip;
            //  var path = $window.location.origin;
              var rep =   LoginService.getToken(browserDeviceId);
              rep.then(function(data){
                if(data.data.tokenInfo !== undefined && data.data.tokenInfo !== null && data.data.tokenInfo !== '')
                {
                  //  window.location = path+"/#!/Home";
                }

              },function(err){
                  console.log('err',err);
                //  alert('on error');
              });
          }, function(e) {
              console.log('err',e);
              // alert('error');
          });
    };

    layout.logout = function(){
      var browserDeviceId='';
      //var json = 'http://ipv4.myexternalip.com/json';
      var json = 'https://api.ipify.org?format=json';
      $http.get(json).then(function(result) {
            browserDeviceId = result.data.ip;
            var path = $window.location.origin;
            LoginService.logout(browserDeviceId);
            localStorage.setItem('loginToken', '');
            $rootScope.tokenValue = '';
            $window.localStorage.clear();
            window.location = path+'/';
            }, function(e) {
          console.log('err',e);
        });
    };

    // layout.logout = function(){
    //   var browserDeviceId='';
    //   var json = 'http://ipv4.myexternalip.com/json';
    //   $http.get(json).then(function(result) {
    //         browserDeviceId = result.data.ip;
    //         var path = $window.location.origin;
    //         LoginService.logout(browserDeviceId);
    //         localStorage.setItem('loginToken', '');
    //         $window.localStorage.clear();
    //         window.close();
    //         window.open(path+'/', '_blank');
    //
    //         }, function(e) {
    //       console.log('err',e);
    //     });
    // };

    // layout.getName = function(name){
    //   console.log(name);
    //     $scope.nameTag = name;
    // }



    // layout.getSearch = function(){
    //   if($scope.search == undefined || $scope.search == ''){
    //     alert("Please enter text to search");
    //   }
    //   else{
    //     var myString =  $scope.search;
    //     layout.feedType = $stateParams.child;
    //     if(layout.feedType == undefined){
    //       layout.feedType = 'New';
    //     }
    //       var rep =   LoginService.getFeedTagInfo(layout.feedType,myString,0,20);
    //       rep.then(function(data){
    //         var newObj = data.data.data.following_list.userPostInfo;
    //         newObj.forEach(function(obj){
    //
    //           var displayPost = obj.image;
    //           if(displayPost == null){
    //             displayPost = "";
    //           }
    //           if(displayPost.match(/\.(jpeg|jpg|gif|png)$/) != null){
    //             obj.i = true;
    //             obj.v = false;
    //             obj.y = false;
    //             obj.image1 = displayPost;
    //           }
    //           else if(displayPost.match(/^.*\.(avi|AVI|wmv|WMV|flv|FLV|mpg|MPG|mp4|MP4)$/) != null){
    //             obj.v = true;
    //             obj.y = false;
    //             obj.i = false;
    //             obj.image1 = displayPost;
    //           }
    //           else if(displayPost.match(/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/) != null){
    //              obj.y = true;
    //              obj.v = false;
    //              obj.i = false;
    //              obj.image1 = $sce.trustAsResourceUrl(displayPost);
    //            }
    //
    //           var text = obj.body;
    //           text = text.replace(/<[^>]*>/g, '');
    //           obj.bodyTitle = text.toString().substr(0,300);
    //           obj.bodyTitle=obj.bodyTitle.replace(/<a[^>]*>([^<]+)<\/a>/g," ").replace(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/g," ").replace(/^<br>|<br>$/g," ").replace(/<img[\s]+[^>]*?((alt*?[\s]?=[\s\"\']+(.*?)[\"\']+.*?)|(src*?[\s]?=[\s\"\']+(.*?)[\"\']+.*?))((src*?[\s]?=[\s\"\']+(.*?)[\"\']+.*?>)|(alt*?[\s]?=[\s\"\']+(.*?)[\"\']+.*?>)|>)/g," ");
    //
    //           var rep1 = LoginService.getUserProfileImage(obj.author);
    //           rep1.then(function(data){
    //             obj.profileImage = data.data.data.userProfileImage;
    //           })
    //         })
    //          $rootScope.userFeedTagInfo = newObj;
    //          },function(err){
    //            console.log("err",err);
    //        })
    //   }
    //   $scope.search = '';
    //   }

//     layout.getUserInfo = function() {
//
// console.log("layout.username",layout.username);
// console.log("layout",layout);
//       if(layout.username)
//       {
//         alert();
//       var rep =   LoginService.getUserInfo(layout.username);
//         rep.then(function(data){
//            layout.userInfo = data.data.data;
//           },function(err){
//              console.log('err',err);
//             alert('on error');
//          });
//       }
//        };

        // layout.getTagTopicList = function(){
        //     var rep = LoginService.getTagTopicList(layout.afterTag, 20);
        //     rep.then(function(data){
        //       layout.TagTopicList = data.data;
        //     },function(err){
        //         console.log('err',err);
        //        alert('on error');
        //     });
        // };

        // layout.getWalletDetails = function(){
        //   var rep = LoginService.getWalletDetails(layout.username);
        //
        //   rep.then(function(data){
        //     //data.data['accounts'][layout.username].other_history
        //     layout.wallet = data.data;
        //     var steem = layout.wallet['accounts'][layout.username].balance;
        //     var steemDollars = layout.wallet['accounts'][layout.username].sbd_balance;
        //     var base = layout.wallet['feed_price'].base.replace('SBD', ' ');
        //     var vestingShare = layout.wallet['accounts'][layout.username].vesting_shares.replace('VESTS', ' ');
        //     var totalVestingShare = layout.wallet['props'].total_vesting_shares.replace('VESTS', ' ');
        //     var totalVestingFundSteem = layout.wallet['props'].total_vesting_fund_steem.replace('STEEM', ' ');
        //     var steemPower = (totalVestingFundSteem)*(((vestingShare)/(totalVestingShare)));
        //     var estimateAccValue = ((base * steemPower)+steemDollars);
        //
        //     var test = layout.wallet['accounts'][layout.username].other_history;
        //     console.log('STEEM:',steem);
        //     console.log('STEEM DOLLAR:',steemDollars);
        //     console.log('SteemPower:',steemPower);
        //     console.log('ESTIMATE acc value:',estimateAccValue);
        //     for (var i=0;i <test.length;i++){
        //       if(test[i][1].op[0] == 'comment_benefactor_reward' || test[i][1].op[0] == 'transfer' || test[i][1].op[0] == 'claim_reward_balance'){
        //         console.log(test[i][1].op[0]);
        //         console.log(test[i][1].op[1]);
        //       }
        //   }
        //   },function(err){
        //     console.log('err',err);
        //     alert('on error');
        //   });
        // };

          // layout.getUserCommentsOnPost = function(){
          //   var rep = LoginService.getUserCommentsOnPost('esteem-features','good-karma','esteem-feature-set-11-login-with-qr-code-add-multiple-accounts-2017611t111958860z');
          //   rep.then(function(data){
          //     layout.comment = data.data;
          //     //var test = 'steemsports/will-tiger-woods-ever-win-another-major';
          //     var obj = layout.comment.content;
          //   //  var length = Object.keys(obj).length;
          //     console.log('Length : ', obj);
          //
          //     // Object.keys(obj).forEach(function(key) {
          //     //   console.log(layout.comment.content[key]);
          //     // });
          //
          //     var example = obj[Object.keys(obj)[8]];
          //     console.log('Length123 : ',example.json_metadata);
          //
          //   },function(err){
          //     console.log('err',err);
          //     alert('on error');
          //   });
          // };
        });
