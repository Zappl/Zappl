ZapplApp.controller("feedInfoCtrl",function($scope,$rootScope,$stateParams,$state,$sce,$window,LoginService){var fi=this;fi.feedType=$stateParams.child;fi.tag=$stateParams.tagChild;fi.loginToken=localStorage.getItem("loginToken");fi.username=localStorage.getItem("username");$rootScope.tagValue=$stateParams.tagChild;$rootScope.feedValue=$stateParams.child;$rootScope.tokenValue=localStorage.getItem("loginToken");fi.nsfw=localStorage.getItem("nsfw");fi.getselectFeed=function(feed){if(feed==undefined||feed==''){$scope.selectFeed='Feed';}
else{$scope.selectFeed=feed;}
return $scope.selectFeed;}
fi.username=localStorage.getItem("username");fi.postingWif=localStorage.getItem("postingWif");
fi.reportAbuse = function(contentAuthor,permlink){if(fi.loginToken != undefined){var data = {reportedBy:fi.username,contentAuthor:contentAuthor,contentDetail:permlink,abuseReason:'Report Abuse'}
if (confirm("Are you sure you want to Block this post?") == true){var rep = LoginService.reportAbuse(data);rep.then(function(data){if(data.data.error == 1){alert(data.data.Message);}
else{alert(contentAuthor.toUpperCase() +" POST BLOCKED WITH POSTNAME : "+ permlink.toUpperCase());$window.location.reload();return rep;}},function(err){console.log("err",err);alert('Error during processing, please try later');})}}
else{$('#myModal31').modal('show');}}
fi.getUserFeed=function(startLimit,endLimit){var rep=LoginService.getUserFeed(fi.username,fi.username,startLimit,endLimit);rep.then(function(data){var newObj=data.data.data.userFeed.userPostInfo;newObj.forEach(function(obj){var displayPost=obj.image;if(displayPost==null){displayPost="";}
if(displayPost.match(/\.(JPEG|jpeg|JPG|jpg|GIF|gif|PNG|png|ICO|ico)$/)!=null){obj.i=true;obj.v=false;obj.y=false;obj.image1=displayPost;}
else if(displayPost.match(/^.*\.(avi|AVI|wmv|WMV|flv|FLV|mpg|MPG|mp4|MP4)$/)!=null){obj.v=true;obj.y=false;obj.i=false;obj.image1=displayPost;}
else if(displayPost.match(/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/)!=null){obj.y=true;obj.v=false;obj.i=false;obj.image1=$sce.trustAsResourceUrl(displayPost);}
var text=obj.body;text=text.replace(/<[^>]*>/g,'');obj.bodyTitle=text.toString().substr(0,300);var rep1=LoginService.getUserProfileImage(obj.author);rep1.then(function(data){obj.profileImage=data.data.data.userProfileImage;})
var rep2=LoginService.getVotes(obj.author,obj.permlink,fi.username);rep2.then(function(data){obj.isVote=data.data.data.isUserAvailable[0].status;obj.weight=data.data.data.isUserAvailable[0].percent;if(obj.isVote==undefined||obj.isVote==false){obj.isVote=false;}
else{if(obj.weight==0){obj.isVote=false;}
else{obj.isVote=true;}}})})
$rootScope.userFeed=newObj;},function(err){console.log("err",err);});};fi.getFeedTagInfo=function(startLimit,endLimit){if(fi.tag==''||fi.tag==undefined){var rep=LoginService.getFeedInfo(fi.username,fi.feedType,startLimit,endLimit);}
else{var rep=LoginService.getFeedTagInfo(fi.username,fi.feedType,fi.tag,startLimit,endLimit);}
rep.then(function(data){var newObj=data.data.data.following_list.userPostInfo;if(newObj.length!=0){newObj.forEach(function(obj){var displayPost=obj.image;if(displayPost==null){displayPost="";}
if(displayPost.match(/\.(jpeg|jpg|gif|png)$/)!=null){obj.i=true;obj.v=false;obj.y=false;obj.image1=displayPost;}
else if(displayPost.match(/^.*\.(avi|AVI|wmv|WMV|flv|FLV|mpg|MPG|mp4|MP4)$/)!=null){obj.v=true;obj.y=false;obj.i=false;obj.image1=displayPost;}
else if(displayPost.match(/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/)!=null){obj.y=true;obj.v=false;obj.i=false;obj.image1=$sce.trustAsResourceUrl(displayPost);}
var text=obj.body;text=text.replace(/<[^>]*>/g,'');obj.bodyTitle=text.toString().substr(0,300);var rep1=LoginService.getUserProfileImage(obj.author);rep1.then(function(data){obj.profileImage=data.data.data.userProfileImage;})
var rep2=LoginService.getVotes(obj.author,obj.permlink,fi.username);rep2.then(function(data){obj.isVote=data.data.data.isUserAvailable[0].status;obj.weight=data.data.data.isUserAvailable[0].percent;if(obj.isVote==undefined||obj.isVote==false){obj.isVote=false;}
else{if(obj.weight==0){obj.isVote=false;}
else{obj.isVote=true;}}})})
$rootScope.userFeedTagInfo=newObj;}
else{$rootScope.userFeedTagInfo="";var html=document.getElementById("demo");if(fi.tag==''){localStorage.setItem('nameTag','');html.innerHTML='<div class="col-md-12 col-sm-12 col-xs-12 div_sec1" style="border-radius:5px;padding-top:47px;border-bottom:0px;position:relative" ><div class="col-md-1"></div><div class="col-md-10"><p style="font-size: 25px;font-family: inherit;margin-left: 105px;">No Post Found</p></div><div class="col-md-1"></div></div>';}
else{fi.tag='<span style="font-size: 25px;font-family: inherit"> With</span><span style="color:red;font-size: 25px;font-family: inherit"> #'+fi.tag+'</span>';html.innerHTML='<div class="col-md-12 col-sm-12 col-xs-12 div_sec1" style="border-radius:5px;padding-top:47px;border-bottom:0px;position:relative" ><div class="col-md-1"></div><div class="col-md-10"><p style="font-size: 25px;font-family: inherit">No Post Found'+fi.tag+'</p></div><div class="col-md-1"></div></div>';}}},function(err){console.log("err",err);})};fi.getFeedInfo=function(startLimit,endLimit){var rep=LoginService.getFeedInfo(fi.username,fi.feedType,startLimit,endLimit);rep.then(function(data){$rootScope.userFeedInfo=data.data.data.following_list.userPostInfo;},function(err){console.log("err",err);});};fi.getRezapList=function(author,permlink){if(fi.loginToken!=undefined){var isExist=false;var rep=LoginService.getRezapList(fi.username);rep.then(function(data){for(var i=0;i<data.data.data.checkRezap.length;i++){if(data.data.data.checkRezap[i].permlink==permlink){isExist=true;break;}}
if(isExist==true){alert('You have already Rezapped this post');}
else{fi.postReZappl(author,permlink)}})}
else{$('#myModal31').modal('show');}}
fi.postReZappl=function(author,permlink){var token=fi.loginToken;var data={token:token,userName:fi.username,author:author,permlink:permlink}
if(confirm("Are you sure you want to ReZap this post?")==true){var rep=LoginService.postRezappl(data);return rep;}};fi.votingWeight=localStorage.getItem("votingWeight");fi.postVote_feedTagInfo=function(author,permlink,index){var text123;var vote1;text123=$rootScope.userFeedTagInfo;vote1=text123[index].isVote;var token=fi.loginToken;if(fi.loginToken!=undefined){var voteWeight=parseInt(fi.votingWeight)*100;var w;var data={};if(token!==undefined&&token!==null&&token!==''){var vote=LoginService.getVotes(author,permlink,fi.username);vote.then(function(data){if(data.data.data.isUserAvailable[0].status==true){if(data.data.data.isUserAvailable[0].percent==voteWeight){if(confirm("Removing your vote will reset your curation rewards for this post")==true){w=0;}}
else{w=voteWeight;}}
else{w=voteWeight||5000;}
data={token:token,author:author,permlink:permlink,weight:w};var rep=LoginService.postVote(data);rep.then(function(data){if(data.data.error==1){alert(data.data.Message);}
else{if(vote1=='true'||vote1=="true"||vote1==true){text123[index].isVote=false;text123[index].net_votes=text123[index].net_votes-1;}
else{text123[index].isVote=true;text123[index].net_votes=text123[index].net_votes+1;}}},function(err){console.log("err",err);alert('Error during processing, please try later');})});}
else{alert('Error during processing, please try later');}}
else{$('#myModal31').modal('show');}}
fi.postVote_feed=function(author,permlink,index){var text123;var vote1;text123=$rootScope.userFeed;vote1=text123[index].isVote;var token=fi.loginToken;if(fi.loginToken!=undefined){var voteWeight=parseInt(fi.votingWeight)*100;var w;var data={};if(token!==undefined&&token!==null&&token!==''){var vote=LoginService.getVotes(author,permlink,fi.username);vote.then(function(data){if(data.data.data.isUserAvailable[0].status==true){if(data.data.data.isUserAvailable[0].percent==voteWeight){if(confirm("Removing your vote will reset your curation rewards for this post")==true){w=0;}}
else{w=voteWeight;}}
else{w=voteWeight||5000;}
data={token:token,author:author,permlink:permlink,weight:w};var rep=LoginService.postVote(data);rep.then(function(data){if(data.data.error==1){alert(data.data.Message);}
else{if(vote1=='true'||vote1=="true"||vote1==true){text123[index].isVote=false;text123[index].net_votes=text123[index].net_votes-1;}
else{text123[index].isVote=true;text123[index].net_votes=text123[index].net_votes+1;}}},function(err){console.log("err",err);alert('Error during processing, please try later');})});}
else{alert('Error during processing, please try later');}}
else{$('#myModal31').modal('show');}}});
