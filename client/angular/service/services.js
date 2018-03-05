ZapplApp.service('LoginService',function($http){this.setChat=function(data)
{var responce=$http.post("/api/setChat",data);return responce;}
this.getChat=function(room)
{var responce=$http.get("/api/getChat/"+room);return responce;}
this.getChatList=function(username)
{var responce=$http.get("/api/getChatList/"+username);return responce;}
this.setRoomList=function(data)
{var responce=$http.post("/api/setRoomList",data);return responce;}
this.getCompareFollowerList=function(username,currentUser)
{var responce=$http.get("/api/getCompareFollowerList/"+username+"/"+currentUser);return responce;}
this.getUserPost=function(loginUser,username,startLimit,endLimit)
{var responce=$http.get("/api/getUserPostData/"+loginUser+"/"+username+"/"+startLimit+"/"+endLimit);return responce;}
this.getImage_follower=function(username,startLimit,endLimit)
{var responce=$http.get("/api/getImage_follower/"+username+"/"+startLimit+"/"+endLimit);return responce;}
this.getTagTopicLists=function()
{var responce=$http.get("/api/getTagTopicList");return responce;}
this.getTagTopicList=function()
{var responce=$http.get("/api/getTagTopicLists");return responce;}
this.getUserProfileImage=function(username)
{var responce=$http.get("/api/getUserProfileImage/"+username);return responce;}
this.getPublicKeys=function(username)
{var responce=$http.get("/api/getPublicKeys/"+username);return responce;}
this.getToken=function(deviceIdNo)
{var data={deviceId:deviceIdNo,currentDate:new Date()}
var response=$http.post("/api/getToken",data);return response;}
this.logout=function(deviceIdNo)
{var data={deviceId:deviceIdNo}
$http.post("/api/logout",data);return true;}
this.login=function(username,password,expirationTime,deviceIdNo)
{var data={expiredLimit:expirationTime,deviceId:deviceIdNo,q:password,currentDate:new Date(),regToken:'',u:username,deviceType:''}
var response=$http.post("/api/generateToken",data)
return response;}
this.getTagTopicDetails=function(tag)
{var response=$http({method:"Get",url:"https://api.steemjs.com/get_discussions_by_created?query=%7B%22tag%22%3A%22"+tag+"%22%2C%20%22limit%22%3A%20%2210%22%7D"})
return response;}
this.validateUser=function(userName)
{var response=$http.get("/api/validateUser/"+userName);return response;}
this.getUserInfo=function(loginUser,username)
{var response=$http.get("/api/getUserInfo/"+loginUser+"/"+username);return response;}
this.getVotes=function(author,permlink,username)
{var responce=$http.get("/api/getVotes/"+author+"/"+permlink+"/"+username);return responce;}
this.getUserFeed=function(loginUser,username,startLimit,endLimit)
{var response=$http.get("/api/getUserFeed/"+loginUser+"/"+username+"/"+startLimit+"/"+endLimit);return response;}
this.getFeedInfo=function(loginUser,feedOption,startLimit,endLimit)
{var response=$http.get("/api/getFeedInfo/"+loginUser+"/"+feedOption+"/"+startLimit+"/"+endLimit);return response;}
this.getFeedTagInfo=function(loginUser,feedOption,tag,startLimit,endLimit)
{var response=$http.get("/api/getFeedTagInfo/"+loginUser+"/"+feedOption+"/"+tag+"/"+startLimit+"/"+endLimit);return response;}
this.getUserFollowingList=function(username,startLimit,endLimit)
{var response=$http.get("/api/getFollowingList/"+username+"/"+startLimit+"/"+endLimit);return response;}
this.getCompareFollowingList=function(username,currentUser)
{var response=$http.get("/api/getCompareFollowingList/"+username+"/"+currentUser);return response;}
this.getFollowingListFourParms=function(username,currentUser,startLimit,endLimit)
{var response=$http.get("/api/getFollowingListFourParms/"+username+"/"+currentUser+"/"+startLimit+"/"+endLimit);return response;}
this.getUserFollowingCount=function(username)
{var response=$http.get("/api/getUserFollowingCount/"+username);return response;}
this.getUserFollowerList=function(username,startLimit,endLimit)
{var response=$http.get("/api/getFollowerList/"+username+"/"+startLimit+"/"+endLimit);return response;}
this.getAllCommentOfUser=function(loginUser,username,startLimit,endLimit)
{var response=$http.get("/api/getComments/"+loginUser+"/"+username+"/"+startLimit+"/"+endLimit);return response;}
this.getUserCommentsOnPost=function(loginUser,tag,username,permlink){var response=$http.get("/api/getUserCommentsOnPost/"+loginUser+"/"+tag+"/"+username+"/"+permlink);return response;}
this.getCommentList=function(loginUser,tag,username,permlink){var response=$http.get("/api/getCommentList/"+loginUser+"/"+tag+"/"+username+"/"+permlink);return response;}
this.getUserPostContent=function(tag,username,permlink){var response=$http.get("/api/getUserPostContent/"+tag+"/"+username+"/"+permlink);return response;}
this.getTestUserCommentsOnPost=function(loginUser,parent,parentPermlink){var response=$http.get("/api/getTestUserCommentsOnPost/"+loginUser+"/"+parent+"/"+parentPermlink);return response;}
this.getWalletDetails=function(username){var response=$http.get("/api/getWalletDetails/"+username);return response;}
this.getUserReply=function(loginUser,username,startLimit,endLimit)
{var response=$http.get("/api/getReplies/"+loginUser+"/"+username+"/"+startLimit+"/"+endLimit);return response;}
this.getRezapList=function(username)
{var response=$http.get("/api/getRezapList/"+username);return response;}
this.getNewPassword=function()
{var responce=$http.get("/api/getPassword");return responce;}
this.postVote=function(data)
{var response=$http.post("/api/postVote",data);return response;}
this.draftPost=function(draftPost)
{var response=$http.post("/api/draftPost",draftPost);return response;}
this.deleteDraftOnPost=function(draftPost)
{var response=$http.post("/api/deleteDraftOnPost",draftPost);return response;}
this.getDraftPost=function(userName)
{var response=$http.get("/api/getDraftPost/"+userName);return response;}
this.getVotingWeight=function(userName)
{var response=$http.get("/api/getVotingWeight/"+userName);return response;}
this.setVotingWeight=function(userName,votingWeight)
{var response=$http.get("/api/setVotingWeight/"+userName+"/"+votingWeight);return response;}
this.getNsfwSettings=function(userName)
{var response=$http.get("/api/getNsfwSettings/"+userName);return response;}
this.setNsfwSettings=function(userName,nsfw)
{var response=$http.get("/api/setNsfwSettings/"+userName+"/"+nsfw);return response;}
this.postComment=function(data){var response=$http.post("/api/postComment",data);return response;}
this.postDeleteComment=function(data){var response=$http.post("/api/postDeleteComment",data);return response;}
this.postBlog=function(data){var responce=$http.post("/api/postBlog",data);return responce;}
this.postDeleteBlog=function(data){var response=$http.post("/api/postDeleteBlog",data);return response;}
this.postFollow=function(data){var response=$http.post("/api/postFollow",data);return response;}
this.postUnfollow=function(data){var response=$http.post("/api/postUnfollow",data);return response;}
this.postRezappl=function(data){var response=$http.post("/api/postRezappl",data);return response;}
this.postPublicProfile=function(data){var response=$http.post("/api/postPublicProfile",data);return response;}
this.postUpdatePassword=function(data){var responce=$http.post("/api/updatePassword",data);return responce;}
this.postTransfer=function(data){var response=$http.post("/api/postTransfer",data);return response;}
this.postTransferToSaving=function(data){var response=$http.post("/api/postTransferToSaving",data);return response;}
this.postPowerUp=function(data){var response=$http.post("/api/postPowerUp",data);return response;}
this.postPowerDown=function(data){var response=$http.post("/api/postPowerDown",data);return response;}
this.postWithdrawSteem=function(data){var response=$http.post("/api/postWithdrawSteem",data);return response;}
this.reportAbuse = function(data){var response = $http.post("/api/reportAbuse",data);return response;}
this.postCancelTransferFromSavings=function(data){var response=$http.post("/api/postCancelTransferFromSavings",data);return response;}});
