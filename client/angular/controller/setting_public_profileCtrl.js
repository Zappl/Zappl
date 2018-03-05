ZapplApp.controller("setting_public_profileCtrl",function($scope,$rootScope,$stateParams,$state,$window,LoginService,){var sc=this;sc.permlinkString=new Date().toISOString().replace(/[^a-zA-Z0-9]+/g,'').toLowerCase();sc.username=localStorage.getItem("username");$scope.username=sc.username;sc.postingWif=localStorage.getItem("postingWif");sc.loginToken=localStorage.getItem("loginToken");sc.votingWeight=localStorage.getItem("votingWeight");$rootScope.tokenValue=localStorage.getItem("loginToken");sc.nsfw=localStorage.getItem("nsfw");sc.popUpListSelect=sc.nsfw;sc.popUpList=["Always hide","Always warn","Always show"];var imageUrl='https://s3-us-west-1.amazonaws.com/zapplweb%2FprofileImage/';$scope.fileNameChanged=function(input){var albumBucketName='zapplweb/profileImage';var bucketRegion='us-west-1';AWS.config.update({accessKeyId:"your key",secretAccessKey:"your key",region:bucketRegion});var s3=new AWS.S3({apiVersion:'2006-03-01',params:{Bucket:albumBucketName}});var file=input.files[0];if(file.type.slice(0,5)=='image')
{var fileName=new Date().valueOf()+file.name;var albumPhotosKey=encodeURIComponent("zapplProfileImage");var photoKey=albumPhotosKey+fileName;s3.upload({Key:photoKey,Body:file,ACL:'public-read'},function(err,data){if(err)
{alert('There was an error uploading your photo: '+err.message);console.log("upload err",err);}
else
{localStorage.setItem("profileImage",imageUrl+data.key);$window.location.reload();}});}
else{alert("File Formate Not Supported");}}
sc.getPublicKeys=function(){var rep=LoginService.getPublicKeys(sc.username);rep.then(function(data){sc.publicPostingKey=data.data.data.publicPassword.publicPostingKey;sc.publicActiveKey=data.data.data.publicPassword.publicActiveKey;sc.publicOwnerKey=data.data.data.publicPassword.publicOwnerKey;sc.publicMemoKey=data.data.data.publicPassword.publicMemoKey;sc.privatePosting=localStorage.getItem('privatePosting');sc.privatePosting=sc.privatePosting.substring(12);sc.privatePosting=sc.privatePosting.slice(0,-12);})}
sc.toggleButton=function(){if($scope.toggle==undefined){$scope.toggle=true;}
else if($scope.toggle==true)
{$scope.toggle=false;}
else{$scope.toggle=true;}
$scope.$watch('toggle',function(){$scope.toggleText=$scope.toggle?'Show Private Key':'Hide Private Key';})}
sc.toggleButton2=function(){if($scope.toggle2==undefined){$scope.toggle2=true;}
else if($scope.toggle2==true)
{$scope.toggle2=false;}
else{$scope.toggle2=true;}
$scope.$watch('toggle2',function(){$scope.toggleText2=$scope.toggle2?'Show Private Key':'Hide Private Key';})}
sc.postPublicProfile=function(profile_image,name,about,location,website,activeWif){if(activeWif==undefined||activeWif==''||steem.auth.isWif(activeWif)!=true){$scope.wrongWif="Please Enter Private Active Key";}
else{var publicActiveKey=steem.auth.wifToPublic(activeWif);if(publicActiveKey===$scope.publicActiveKey){var data={activeWif:activeWif,username:sc.username,memoKey:$scope.memo_key,profile_image:profile_image,name:name,about:about,location:location,website:website,activeKey:$scope.publicActiveKey}
var rep=LoginService.postPublicProfile(data);localStorage.setItem("profileImage",'');$window.location.reload();}
else{$scope.wrongWif="Please Enter Correct Private Active Key";}}};sc.getUserInfo=function(){if(sc.loginToken!=null){var rep=LoginService.getUserInfo(sc.username,sc.username);rep.then(function(data){sc.userInfo=data.data.data.userInfo;sc.userFInfo=data.data.data.userFollowingFollowersInfo;var profileImage=localStorage.getItem("profileImage");var image;if(profileImage==''||profileImage==null||profileImage==undefined){image=sc.userInfo.profile_image;}
else{image=profileImage;}
$scope.publicActiveKey=sc.userInfo.publicActiveKey;$scope.memo_key=sc.userInfo.memo_key;$scope.name=sc.userInfo.name;$scope.profile_image=image;$scope.about=sc.userInfo.about;$scope.website=sc.userInfo.website;$scope.location=sc.userInfo.location;$scope.postingKey=sc.userInfo.postingKey;},function(err){console.log("err",err);});}
else{var path=$window.location.origin;localStorage.setItem('loginToken','');$window.localStorage.clear();window.location=path+'/';}};sc.getNewPassword=function(){var rep=LoginService.getNewPassword();rep.then(function(data){$scope.newPassword=data.data.data.newPassword;})};sc.getVotingWeight=function(){var rep=LoginService.getVotingWeight(sc.username);rep.then(function(data){var votingWeight=data.data.data.votingWeight;if(votingWeight!==localStorage.getItem("votingWeight"))
{sc.votingWeight=votingWeight;localStorage.setItem("votingWeight",votingWeight);}});};sc.setVotingWeight=function(){var votingWeight=document.getElementById("ageOutputId").value;var rep=LoginService.setVotingWeight(sc.username,votingWeight);rep.then(function(data){alert('Voting(%) saved successfully')
localStorage.setItem('votingWeight',votingWeight);sc.votingWeight=votingWeight;});};sc.setNsfwSettings=function(){var nsfw=sc.popUpListSelect;var rep=LoginService.setNsfwSettings(sc.username,nsfw);rep.then(function(data){alert('Saved successfully')
localStorage.setItem('nsfw',nsfw);sc.nsfw=nsfw;sc.popUpListSelect=sc.nsfw;localStorage.setItem("nsfw",sc.nsfw);});};sc.postUpdatePassword=function(ownerKey,rePassword){if($scope.newPassword==rePassword){var verifyOwnerKey=steem.auth.verify(sc.username,ownerKey,{posting:[[$scope.postingKey,1]]})
if(verifyOwnerKey==true){$scope.errorMessage="";var answer=confirm("You'll be redirected to Login page!!")
if(answer){var privateKey=steem.auth.getPrivateKeys(sc.username,ownerKey,['owner']);var data={username:sc.username,newPassword:$scope.newPassword,ownerKey:privateKey.owner,profile_image:$scope.profile_image,name:$scope.name,about:$scope.about,location:$scope.location,website:$scope.website,}
var rep=LoginService.postUpdatePassword(data);var browserDeviceId='';var json='https://api.ipify.org?format=json';$http.get(json).then(function(result){browserDeviceId=result.data.ip;var path=$window.location.origin;LoginService.logout(browserDeviceId);localStorage.setItem('loginToken','');$window.localStorage.clear();window.location=path+'/';},function(e){console.log('err',e);});}}
else{$scope.errorMessage="Enter Valid Private Owner Key";}}
else{$scope.errorMessage="Password do not match";}};});
