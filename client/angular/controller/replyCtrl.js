ZapplApp.controller("replyCtrl",function($scope,$rootScope,$stateParams,$state,LoginService,$sce){var rc=this;rc.username=localStorage.getItem("username");rc.postingWif=localStorage.getItem("postingWif");rc.testCurrentUser=$stateParams.user;$rootScope.tokenValue=localStorage.getItem("loginToken");rc.getUserReply=function(startLimit,endLimit){currentUser=rc.testCurrentUser;var rep=LoginService.getUserReply(rc.username,currentUser,startLimit,endLimit);rep.then(function(data){var reply=data.data.data.repliesOnUser.userPostInfo;reply.forEach(function(obj){var text=obj.body;text=text.replace(/<[^>]*>/g,'');obj.body=text.toString();var rep1=LoginService.getUserProfileImage(obj.author);rep1.then(function(data){obj.profileImage=data.data.data.userProfileImage;})
var rep2=LoginService.getVotes(obj.author,obj.permlink,rc.username);rep2.then(function(data){obj.isVote=data.data.data.isUserAvailable[0].status;obj.weight=data.data.data.isUserAvailable[0].percent;if(obj.isVote==undefined||obj.isVote==false){obj.isVote=false;}
else{if(obj.weight==0){obj.isVote=false;}
else{obj.isVote=true;}}})})
$rootScope.userPostInfoReply=reply;rc.userReply=reply;},function(err){console.log("err",err);})};rc.loginToken=localStorage.getItem("loginToken");rc.votingWeight=localStorage.getItem("votingWeight");rc.postVote=function(author,permlink,index){var vote1=$rootScope.userPostInfoReply[index].isVote;var token=rc.loginToken;if(rc.loginToken!=undefined){var voteWeight=parseInt(rc.votingWeight)*100;var w;var data={};if(token!==undefined&&token!==null&&token!==''){var vote=LoginService.getVotes(author,permlink,rc.username);vote.then(function(data){if(data.data.data.isUserAvailable[0].status==true){if(data.data.data.isUserAvailable[0].percent==voteWeight){if(confirm("Removing your vote will reset your curation rewards for this post")==true){w=0;}}
else{w=voteWeight;}}
else{w=voteWeight||5000;}
data={token:token,author:author,permlink:permlink,weight:w};var rep=LoginService.postVote(data);rep.then(function(data){if(data.data.error==1){alert(data.data.Message);}
else{if(vote1=='true'||vote1=="true"||vote1==true){$rootScope.userPostInfoReply[index].isVote=false;$rootScope.userPostInfoReply[index].net_votes=$rootScope.userPostInfoReply[index].net_votes-1;}
else{$rootScope.userPostInfoReply[index].isVote=true;$rootScope.userPostInfoReply[index].net_votes=$rootScope.userPostInfoReply[index].net_votes+1;}}},function(err){console.log("err",err);alert('Error during processing, please try later');})});}
else{alert('Error during processing, please try later');}}
else{$('#myModal31').modal('show');}}});
