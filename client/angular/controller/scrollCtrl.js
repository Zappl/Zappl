ZapplApp.controller('scrollCtrl',function($scope,$rootScope,$stateParams,$window,$http,$sce,$q,LoginService){var i=7;var sc=this;var prevTag='';var prevUser='';$rootScope.tokenValue=localStorage.getItem("loginToken");sc.loginToken=localStorage.getItem("loginToken");sc.feedType=$rootScope.feedValue;sc.tag=$rootScope.tagValue;sc.username=localStorage.getItem("username");sc.testCurrentUser=$stateParams.user;sc.currentUser1=localStorage.getItem("currentUser1");var bottomFlag;var arrFeetType=['#!/New/','#!/Hot/','#!/Trending/','#!/Promoted/']
angular.element($window).bind("scroll",function(){var windowHeight="innerHeight"in window?window.innerHeight:document.documentElement.offsetHeight;var body=document.body,html=document.documentElement;var docHeight=Math.max(body.scrollHeight,body.offsetHeight,html.clientHeight,html.scrollHeight,html.offsetHeight);windowBottom=windowHeight+window.pageYOffset+5;if($window.location.hash!=='#!/'){if(windowBottom>=docHeight){var rep;if(prevTag!==$window.location.hash){i=7;bottomFlag=false;}
if(prevUser!==$rootScope.currentUser)
{i=7;bottomFlag=false;}
if(!bottomFlag){switch($window.location.hash){case'#!/New/':rep=LoginService.getFeedInfo('New',i,i+10)
break;case'#!/Hot/':rep=LoginService.getFeedInfo('Hot',i,i+10)
break;case'#!/Trending/':rep=LoginService.getFeedInfo('Trending',i,i+10)
break;case'#!/Promoted/':rep=LoginService.getFeedInfo('Promoted',i,i+10)
break;case'#!/Home':rep=LoginService.getUserFeed(sc.username,i,i+10);break;case'#!/creategroup':rep=LoginService.getImage_follower(sc.username,i+8,i+18);break;case'#!/@'+$stateParams.user:case'#!/@'+$stateParams.user+'/Blog':rep=LoginService.getUserPost($stateParams.user,i,i+7);break;case'#!/@'+$stateParams.user+'/Reply':rep=LoginService.getUserReply($stateParams.user,i,i+7);break;case'#!/'+$rootScope.feedValue+'/'+$rootScope.tagValue:rep=LoginService.getFeedTagInfo($rootScope.feedValue,$rootScope.tagValue,i,i+10);break;case'#!/Comments':rep=LoginService.getAllCommentOfUser(sc.username,i,i+7);break;case'#!/Followings':rep=LoginService.getUserFollowingList(sc.username,i,i+10);break;case'#!/Followers':rep=LoginService.getUserFollowerList(sc.username,i,i+10);break;}
if($window.location.hash=='#!/@'+$stateParams.user){if(sc.loginToken==undefined){var previousUser='';var previousImage='';rep.then(function(data){if(data.data.data.userInfo.userPostInfo.length==0)
{bottomFlag=true;}
angular.forEach(data.data.data.userInfo.userPostInfo,function(value,key){if(!(($rootScope.userPostInfo.find(userFeed=>userFeed['author']===value.author))&&($rootScope.userPostInfo.find(userFeed=>userFeed['permlink']===value.permlink))))
{var displayPost=value.image;if(displayPost==null){displayPost="";}
if(displayPost.match(/\.(jpeg|jpg|gif|png)$/)!=null){value.i=true;value.v=false;value.y=false;value.image1=displayPost;}
else if(displayPost.match(/^.*\.(avi|AVI|wmv|WMV|flv|FLV|mpg|MPG|mp4|MP4)$/)!=null){value.v=true;value.y=false;value.i=false;value.image1=displayPost;}
else if(displayPost.match(/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/)!=null){value.y=true;value.v=false;value.i=false;value.image1=$sce.trustAsResourceUrl(displayPost);}
var text=value.body;text=text.replace(/<[^>]*>/g,'');value.bodyTitle=text.toString().substr(0,300);var rep1=LoginService.getUserProfileImage(value.author);rep1.then(function(data){value.profileImage=data.data.data.userProfileImage;})
var rep2=LoginService.getVotes(value.author,value.permlink,sc.username);rep2.then(function(data){value.isVote=data.data.data.isUserAvailable[0].status;value.weight=data.data.data.isUserAvailable[0].percent;if(value.isVote==undefined||value.isVote==false){value.isVote=false;}
else{if(value.weight==0){value.isVote=false;}
else{value.isVote=true;}}})
$rootScope.userPostInfo.push(value);}});},function(err){console.log("err",err);});}
else if(sc.loginToken!==undefined&&$stateParams.user!==sc.username){var previousUser='';var previousImage='';rep.then(function(data){if(data.data.data.userInfo.userPostInfo.length==0)
{bottomFlag=true;}
angular.forEach(data.data.data.userInfo.userPostInfo,function(value,key){if(!(($rootScope.userPostInfo.find(userFeed=>userFeed['author']===value.author))&&($rootScope.userPostInfo.find(userFeed=>userFeed['permlink']===value.permlink))))
{var displayPost=value.image;if(displayPost==null){displayPost="";}
if(displayPost.match(/\.(jpeg|jpg|gif|png)$/)!=null){value.i=true;value.v=false;value.y=false;value.image1=displayPost;}
else if(displayPost.match(/^.*\.(avi|AVI|wmv|WMV|flv|FLV|mpg|MPG|mp4|MP4)$/)!=null){value.v=true;value.y=false;value.i=false;value.image1=displayPost;}
else if(displayPost.match(/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/)!=null){value.y=true;value.v=false;value.i=false;value.image1=$sce.trustAsResourceUrl(displayPost);}
var text=value.body;text=text.replace(/<[^>]*>/g,'');value.bodyTitle=text.toString().substr(0,300);var rep1=LoginService.getUserProfileImage(value.author);rep1.then(function(data){value.profileImage=data.data.data.userProfileImage;})
var rep2=LoginService.getVotes(value.author,value.permlink,sc.username);rep2.then(function(data){value.isVote=data.data.data.isUserAvailable[0].status;value.weight=data.data.data.isUserAvailable[0].percent;if(value.isVote==undefined||value.isVote==false){value.isVote=false;}
else{if(value.weight==0){value.isVote=false;}
else{value.isVote=true;}}})
$rootScope.userPostInfo.push(value);}});},function(err){console.log("err",err);});}
else if(sc.loginToken!==undefined&&$stateParams.user==sc.username){rep.then(function(data){if(data.data.data.userInfo.userPostInfo.length==0)
{bottomFlag=true;}
var previousUser='';var previousImage='';angular.forEach(data.data.data.userInfo.userPostInfo,function(value,key){if(!(($rootScope.userPostInfoHome.find(userFeed=>userFeed['author']===value.author))&&($rootScope.userPostInfoHome.find(userFeed=>userFeed['permlink']===value.permlink))))
{var postTime=value.post_time;postTime=postTime.slice(2,9).trim();if(postTime=="days"){var postDay=value.post_time.slice(0,2).trim();if(postDay>=7){value.postTime=false;}
else{value.postTime=true;}}
else if(postTime=="hours"||postTime=="minute"||postTime=="minutes"){value.postTime=true;}
else{value.postTime=false;}
var displayPost=value.image;if(displayPost==null){displayPost="";}
if(displayPost.match(/\.(jpeg|jpg|gif|png)$/)!=null){value.i=true;value.v=false;value.y=false;value.image1=displayPost;}
else if(displayPost.match(/^.*\.(avi|AVI|wmv|WMV|flv|FLV|mpg|MPG|mp4|MP4)$/)!=null){value.v=true;value.y=false;value.i=false;value.image1=displayPost;}
else if(displayPost.match(/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/)!=null){value.y=true;value.v=false;value.i=false;value.image1=$sce.trustAsResourceUrl(displayPost);}
var text=value.body;text=text.replace(/<[^>]*>/g,'');value.bodyTitle=text.toString().substr(0,300);var rep1=LoginService.getUserProfileImage(value.author);rep1.then(function(data){value.profileImage=data.data.data.userProfileImage;})
var rep2=LoginService.getVotes(value.author,value.permlink,sc.username);rep2.then(function(data){value.isVote=data.data.data.isUserAvailable[0].status;value.weight=data.data.data.isUserAvailable[0].percent;if(value.isVote==undefined||value.isVote==false){value.isVote=false;}
else{if(value.weight==0){value.isVote=false;}
else{value.isVote=true;}}})
$rootScope.userPostInfoHome.push(value);}})},function(err){console.log("err",err);});}}
if($window.location.hash=='#!/@'+$stateParams.user+'/Blog'){var previousUser='';var previousImage='';rep.then(function(data){if(data.data.data.userInfo.userPostInfo.length==0)
{bottomFlag=true;}
angular.forEach(data.data.data.userInfo.userPostInfo,function(value,key){if(!(($rootScope.userPostInfo.find(userFeed=>userFeed['author']===value.author))&&($rootScope.userPostInfo.find(userFeed=>userFeed['permlink']===value.permlink))))
{var displayPost=value.image;if(displayPost==null){displayPost="";}
if(displayPost.match(/\.(jpeg|jpg|gif|png)$/)!=null){value.i=true;value.v=false;value.y=false;value.image1=displayPost;}
else if(displayPost.match(/^.*\.(avi|AVI|wmv|WMV|flv|FLV|mpg|MPG|mp4|MP4)$/)!=null){value.v=true;value.y=false;value.i=false;value.image1=displayPost;}
else if(displayPost.match(/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/)!=null){value.y=true;value.v=false;value.i=false;value.image1=$sce.trustAsResourceUrl(displayPost);}
var text=value.body;text=text.replace(/<[^>]*>/g,'');value.bodyTitle=text.toString().substr(0,300);var rep1=LoginService.getUserProfileImage(value.author);rep1.then(function(data){value.profileImage=data.data.data.userProfileImage;})
var rep2=LoginService.getVotes(value.author,value.permlink,sc.username);rep2.then(function(data){value.isVote=data.data.data.isUserAvailable[0].status;value.weight=data.data.data.isUserAvailable[0].percent;if(value.isVote==undefined||value.isVote==false){value.isVote=false;}
else{if(value.weight==0){value.isVote=false;}
else{value.isVote=true;}}})
$rootScope.userPostInfo.push(value);}});},function(err){console.log("err",err);});}
else if($window.location.hash==='#!/@'+$stateParams.user+'/Reply'){rep.then(function(data){if(data.data.data.repliesOnUser.userPostInfo.length==0)
{bottomFlag=true;}
angular.forEach(data.data.data.repliesOnUser.userPostInfo,function(value,key){if(!(($rootScope.userPostInfoReply.find(userFeed=>userFeed['author']===value.author))&&($rootScope.userPostInfoReply.find(userFeed=>userFeed['permlink']===value.permlink))))
{var text=value.body;text=text.replace(/<[^>]*>/g,'');value.body=text.toString();var rep1=LoginService.getUserProfileImage(value.author);rep1.then(function(data){value.profileImage=data.data.data.userProfileImage;})
var rep2=LoginService.getVotes(value.author,value.permlink,sc.username);rep2.then(function(data){value.isVote=data.data.data.isUserAvailable[0].status;value.weight=data.data.data.isUserAvailable[0].percent;if(value.isVote==undefined||value.isVote==false){value.isVote=false;}
else{if(value.weight==0){value.isVote=false;}
else{value.isVote=true;}}})
$rootScope.userPostInfoReply.push(value);}});},function(err){console.log("err",err);});}
else if($window.location.hash==='#!/Comments'){var previousUser='';var previousImage='';rep.then(function(data){if(data.data.data.commentsByUser.userPostInfo.length==0){bottomFlag=true;}
angular.forEach(data.data.data.commentsByUser.userPostInfo,function(value,key){if(!(($rootScope.getAllCommentOfUser.find(userFeed=>userFeed['author']===value.author))&&($rootScope.getAllCommentOfUser.find(userFeed=>userFeed['permlink']===value.permlink))))
{var text=value.body;text=text.replace(/<[^>]*>/g,'');value.bodyTitle=text.toString().substr(0,300);var compareText='<img[\s]+[^>]*?((alt*?[\s]?=[\s\"\']+(.*?)[\"\']+.*?)|(src*?[\s]?=[\s\"\']+(.*?)[\"\']+.*?))((src*?[\s]?=[\s\"\']+(.*?)[\"\']+.*?>)|(alt*?[\s]?=[\s\"\']+(.*?)[\"\']+.*?>)|>)/g'
var rep1=LoginService.getUserProfileImage(value.author);rep1.then(function(data){value.profileImage=data.data.data.userProfileImage;})
var rep2=LoginService.getVotes(value.author,value.permlink,sc.username);rep2.then(function(data){value.isVote=data.data.data.isUserAvailable[0].status;value.weight=data.data.data.isUserAvailable[0].percent;if(value.isVote==undefined||value.isVote==false){value.isVote=false;}
else{if(value.weight==0){value.isVote=false;}
else{value.isVote=true;}}})
$rootScope.getAllCommentOfUser.push(value);}});},function(err){console.log("err",err);});}
else if($window.location.hash==='#!/Home'){var previousUser='';var previousImage='';rep.then(function(data){if(data.data.data.userFeed.userPostInfo.length==0){bottomFlag=true;}
angular.forEach(data.data.data.userFeed.userPostInfo,function(value,key){if(!(($rootScope.userFeed.find(userFeed=>userFeed['author']===value.author))&&($rootScope.userFeed.find(userFeed=>userFeed['permlink']===value.permlink))))
{var displayPost=value.image;if(displayPost==null){displayPost="";}
if(displayPost.match(/\.(jpeg|jpg|gif|png)$/)!=null){value.i=true;value.v=false;value.y=false;value.image1=displayPost;}
else if(displayPost.match(/^.*\.(avi|AVI|wmv|WMV|flv|FLV|mpg|MPG|mp4|MP4)$/)!=null){value.v=true;value.y=false;value.i=false;value.image1=displayPost;}
else if(displayPost.match(/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/)!=null){value.y=true;value.v=false;value.i=false;value.image1=$sce.trustAsResourceUrl(displayPost);}
var text=value.body;text=text.replace(/<[^>]*>/g,'');value.bodyTitle=text.toString().substr(0,300);var rep1=LoginService.getUserProfileImage(value.author);rep1.then(function(data){value.profileImage=data.data.data.userProfileImage;})
var rep2=LoginService.getVotes(value.author,value.permlink,sc.username);rep2.then(function(data){value.isVote=data.data.data.isUserAvailable[0].status;value.weight=data.data.data.isUserAvailable[0].percent;if(value.isVote==undefined||value.isVote==false){value.isVote=false;}
else{if(value.weight==0){value.isVote=false;}
else{value.isVote=true;}}})
$rootScope.userFeed.push(value);}});},function(err){console.log("err",err);});}
else if($window.location.hash=='#!/Followings'||$window.location.hash=='#!/@Following'){rep.then(function(data){angular.forEach(data.data.data.following_list.userFollowing,function(value,key){if(!($rootScope.getFollowingList.find(followingLst=>followingLst['following']===value.following)))
{$rootScope.getFollowingList.push(value);}});},function(err){console.log("err",err);});}
else if($window.location.hash=='#!/creategroup'){rep.then(function(data){angular.forEach(data.data.data,function(value,key){$rootScope.followerlist_chat.push(value);});},function(err){console.log("err",err);});}
else if($window.location.hash=='#!/Followers'||$window.location.hash=='#!/@Followers'){rep.then(function(data){angular.forEach(data.data.data.following_list.userFollowers,function(value,key){if(!($rootScope.getFollowerList.find(followerLst=>followerLst['follower']===value.follower)))
{$rootScope.getFollowerList.push(value);}});},function(err){console.log("err",err);});}
else if($window.location.hash=='#!/'+$rootScope.feedValue+'/'+$rootScope.tagValue){var previousUser='';var previousImage='';rep.then(function(data){angular.forEach(data.data.data.following_list.userPostInfo,function(value,key){if(!(($rootScope.userFeedTagInfo.find(userFeed=>userFeed['author']==value.author))&&($rootScope.userFeedTagInfo.find(userFeed=>userFeed['permlink']==value.permlink))))
{var displayPost=value.image;if(displayPost==null){displayPost="";}
if(displayPost.match(/\.(jpeg|jpg|gif|png)$/)!=null){value.i=true;value.v=false;value.y=false;value.image1=displayPost;}
else if(displayPost.match(/^.*\.(avi|AVI|wmv|WMV|flv|FLV|mpg|MPG|mp4|MP4)$/)!=null){value.v=true;value.y=false;value.i=false;value.image1=displayPost;}
else if(displayPost.match(/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/)!=null){value.y=true;value.v=false;value.i=false;value.image1=$sce.trustAsResourceUrl(displayPost);}
var text=value.body;text=text.replace(/<[^>]*>/g,'');value.bodyTitle=text.toString().substr(0,300);var rep1=LoginService.getUserProfileImage(value.author);rep1.then(function(data){value.profileImage=data.data.data.userProfileImage;})
var rep2=LoginService.getVotes(value.author,value.permlink,sc.username);rep2.then(function(data){value.isVote=data.data.data.isUserAvailable[0].status;value.weight=data.data.data.isUserAvailable[0].percent;if(value.isVote==undefined||value.isVote==false){value.isVote=false;}
else{if(value.weight==0){value.isVote=false;}
else{value.isVote=true;}}})
$rootScope.userFeedTagInfo.push(value);}});},function(err){console.log("err",err);});}
else if(arrFeetType.indexOf($window.location.hash)>-1){var previousUser='';var previousImage='';rep.then(function(data){angular.forEach(data.data.data.following_list.userPostInfo,function(value,key){if(!(($rootScope.userFeedTagInfo.find(userFeed=>userFeed['author']==value.author))&&($rootScope.userFeedTagInfo.find(userFeed=>userFeed['permlink']==value.permlink))))
{var displayPost=value.image;if(displayPost==null){displayPost="";}
if(displayPost.match(/\.(jpeg|jpg|gif|png)$/)!=null){value.i=true;value.v=false;value.y=false;value.image1=displayPost;}
else if(displayPost.match(/^.*\.(avi|AVI|wmv|WMV|flv|FLV|mpg|MPG|mp4|MP4)$/)!=null){value.v=true;value.y=false;value.i=false;value.image1=displayPost;}
else if(displayPost.match(/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/)!=null){value.y=true;value.v=false;value.i=false;value.image1=$sce.trustAsResourceUrl(displayPost);}
var text=value.body;text=text.replace(/<[^>]*>/g,'');value.bodyTitle=text.toString().substr(0,300);var rep1=LoginService.getUserProfileImage(value.author);rep1.then(function(data){value.profileImage=data.data.data.userProfileImage;})
var rep2=LoginService.getVotes(value.author,value.permlink,sc.username);rep2.then(function(data){value.isVote=data.data.data.isUserAvailable[0].status;value.weight=data.data.data.isUserAvailable[0].percent;if(value.isVote==undefined||value.isVote==false){value.isVote=false;}
else{if(value.weight==0){value.isVote=false;}
else{value.isVote=true;}}})
$rootScope.userFeedTagInfo.push(value);}});},function(err){console.log("err",err);});}
prevTag=$window.location.hash;prevUser=$rootScope.currentUser;i=i+10;rep='';}}}});});
