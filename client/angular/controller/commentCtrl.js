ZapplApp.controller("commentCtrl",function($rootScope, $stateParams,$sce, $state,$window, LoginService) {
  var cc = this;
  cc.permlinkString = new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();
  cc.username = localStorage.getItem("username");
  cc.postingWif = localStorage.getItem("postingWif");
  cc.loginToken = localStorage.getItem("loginToken");
  $rootScope.tokenValue = localStorage.getItem("loginToken");

cc.getAllCommentOfUser = function(startLimit,endLimit){
  if(cc.loginToken != null){
    var rep = LoginService.getAllCommentOfUser(cc.username,startLimit,endLimit);
    rep.then(function(data){
    var newObj = data.data.data.commentsByUser.userPostInfo;
    newObj.forEach(function(obj){
      var text = obj.body;
      text = text.replace(/<[^>]*>/g, '');
      obj.bodyTitle = text.toString().substr(0,300);
      //obj.bodyTitle=obj.bodyTitle.replace(/<a[^>]*>([^<]+)<\/a>/g," ").replace(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/g," ").replace(/^<br>|<br>$/g," ");
       var rep1 = LoginService.getUserProfileImage(obj.author);
       rep1.then(function(data){
         obj.profileImage = data.data.data.userProfileImage;
       })
       var rep2 = LoginService.getVotes(obj.author,obj.permlink,cc.username);
       rep2.then(function(data){
         obj.isVote = data.data.data.isUserAvailable[0].status;
         obj.weight = data.data.data.isUserAvailable[0].percent;
          if(obj.isVote == undefined || obj.isVote == false){
            obj.isVote = false;
          }
          else{
            if(obj.weight == 0){
              obj.isVote = false;
            }
            else {
              obj.isVote = true;
            }
          }
        })
       $rootScope.getAllCommentOfUser = newObj;

      //  console.log("$rootScope.getAllCommentOfUser", $rootScope.getAllCommentOfUser);
    },function(err){
        console.log("err",err);
    })
  },function(err){
      console.log("err",err);
  })
  }
  else{
    var path = $window.location.origin;
    localStorage.setItem('loginToken', '');
    $window.localStorage.clear();
    window.location = path+'/';
  }

}







cc.votingWeight = localStorage.getItem("votingWeight");
cc.postVote = function(author,permlink,index){
      var vote1 = $rootScope.getAllCommentOfUser[index].isVote ;
      var token = cc.loginToken;
      if(cc.loginToken != undefined){
        var voteWeight = parseInt(cc.votingWeight)*100;
        var w;
        var data = {};
        if(token !== undefined && token !==null && token !== ''){
          var vote = LoginService.getVotes(author,permlink,cc.username);
            vote.then(function(data){
              if(data.data.data.isUserAvailable[0].status == true){
                if(data.data.data.isUserAvailable[0].percent == voteWeight){
                  if (confirm("Removing your vote will reset your curation rewards for this post") == true){w = 0;}
                }
                else{
                      w = voteWeight;
                    }
              }
              else{
                w= voteWeight || 5000;
              }
              data = {
                    token     : token,
                    author    : author,
                    permlink  : permlink,
                    weight    : w
                  };
            var rep = LoginService.postVote(data);
            rep.then(function(data){
              if(data.data.error == 1){
                alert(data.data.Message);
              }
              else{

                if(vote1 == 'true' || vote1 == "true" || vote1 == true){
                    $rootScope.getAllCommentOfUser[index].isVote = false;
                    $rootScope.getAllCommentOfUser[index].net_votes = $rootScope.getAllCommentOfUser[index].net_votes - 1;
                }
                else{
                  $rootScope.getAllCommentOfUser[index].isVote = true;
                  $rootScope.getAllCommentOfUser[index].net_votes = $rootScope.getAllCommentOfUser[index].net_votes + 1;
                }
              }
            },function(err){
                console.log("err",err);
                alert('Error during processing, please try later');
            })
          });
        }
        else {
          alert('Error during processing, please try later');
          }
      }
      else{
            $('#myModal31').modal('show');
        }
    }

})


//   cc.getAllCommentOfUser = function(startLimit,endLimit){
//
//
//     rep.then(function(data){
//       var newObj = data.data.data.commentsByUser.userPostInfo;
//       newObj.forEach(function(obj){
//         var text = obj.body;
//         text = text.replace(/<[^>]*>/g, '');
//         obj.bodyTitle = text.toString().substr(0,300);
//         obj.bodyTitle=obj.bodyTitle.replace(/<a[^>]*>([^<]+)<\/a>/g," ").replace(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/g," ").replace(/^<br>|<br>$/g," ").replace(/<img[\s]+[^>]*?((alt*?[\s]?=[\s\"\']+(.*?)[\"\']+.*?)|(src*?[\s]?=[\s\"\']+(.*?)[\"\']+.*?))((src*?[\s]?=[\s\"\']+(.*?)[\"\']+.*?>)|(alt*?[\s]?=[\s\"\']+(.*?)[\"\']+.*?>)|>)/g," ");
//          var rep1 = LoginService.getUserProfileImage(obj.author);
//          rep1.then(function(data){
//            obj.profileImage = data.data.data.userProfileImage;
//          })
//        }
//     $rootScope.getAllCommentOfUser = newObj;
//     console.log($rootScope.getAllCommentOfUser);
//     },function(err){
//         console.log("err",err);
//       //  alert("on error");
//     })
//   };
//
//
// })
