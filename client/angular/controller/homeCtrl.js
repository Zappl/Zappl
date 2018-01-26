ZapplApp.controller("homeCtrl", function ($http, $scope, $rootScope, $stateParams, $state, LoginService, $q, $sce, $window, $compile, orderByFilter,$location,ngMeta) {
    var hc = this;
    hc.absoluteUrl = $location.$$absUrl;
    hc.permlinkString = new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();
    hc.username = localStorage.getItem("username");
    $rootScope.username = localStorage.getItem("username");
    hc.postingWif = localStorage.getItem("postingWif");
    hc.nsfw = localStorage.getItem("nsfw");
    hc.author = $stateParams.author;
    hc.testCurrentUser = $stateParams.user;
    localStorage.setItem("currentUser1", hc.testCurrentUser);
    hc.loginToken = localStorage.getItem("loginToken");
    hc.votingWeight = localStorage.getItem("votingWeight");
    $rootScope.tokenValue = localStorage.getItem("loginToken");
    var imageUrl = 'https://s3-us-west-1.amazonaws.com/zapplweb%2FpostImage/';
    hc.postTag = $stateParams.tag;
    hc.postUser = $stateParams.username;
    hc.postPermlink = $stateParams.permlink;
    hc.hasPost = false;
    hc.popUpListSelect = "Default (50% / 50%)";
    hc.popUpList = ["Power Up 100%", "Default (50% / 50%)", "Decline Payout"];
    hc.draftId = '';
    var finalPostKV = [];
    var finalImageList = [];
    $scope.nameTag = localStorage.getItem('nameTag');
    var maxcharlimit = 240;
    $('#txtModal12').keyup(function () {
        if ($(this).val().length > maxcharlimit) {
            $(this).val($(this).val().substr(0, maxcharlimit));
        }
        $('#chars-remaining').html((maxcharlimit - $(this).val().length) + ' characters remaining');
    });
    hc.getName = function (name) {
        $scope.nameTag = '#' + name;
        localStorage.setItem('nameTag', $scope.nameTag);
        document.getElementById('txtSearch').value = '';
    }
    hc.getName2 = function (name) {
        $scope.nameTag = '#' + name;
        localStorage.setItem('nameTag', $scope.nameTag);
        setTimeout(function () {
            window.location.reload();
        }, 600);
    }
    hc.postActive = function () {
        setTimeout(function () {
            if ($window.location.pathname == '/@' + hc.testCurrentUser) {
                document.getElementById('postPost').style.color = 'black';
                document.getElementById('postBlog').style.color = '#21a3f2';
                document.getElementById('postReply').style.color = '#21a3f2';
            }
            else if ($window.location.pathname == '/@' + hc.testCurrentUser + '/Blog') {
                document.getElementById('postPost').style.color = '#21a3f2';
                document.getElementById('postBlog').style.color = 'black';
                document.getElementById('postReply').style.color = '#21a3f2';
            }
            else if ($window.location.pathname == '/@' + hc.testCurrentUser + '/Reply') {
                document.getElementById('postPost').style.color = '#21a3f2';
                document.getElementById('postBlog').style.color = '#21a3f2';
                document.getElementById('postReply').style.color = 'black';
            }
        }, 1000);
    }
    hc.getUserInfo = function () {
        var username = hc.testCurrentUser;
        localStorage.setItem('currentProfileUser', username);
        $rootScope.currentUser = username;
        if (username == undefined || username == '') {
            username = hc.username;
        }
        else {
            username = username;
        }
        var rep = LoginService.getUserInfo(username);
        rep.then(function (data) {
            hc.userInfo = data.data.data;
            var profilename = '/@' + hc.testCurrentUser;
            var userrname = '/@' + hc.username;
            var blog = profilename + '/blog';
            var blog2 = profilename + '/Blog';
            if (($window.location.pathname == profilename && profilename !== userrname) || $window.location.pathname == blog2 || $window.location.pathname == blog) {
                var newObj = data.data.data.userPostInfo.userPostInfo;
                newObj.forEach(function (obj) {
                    var displayPost = obj.image;
                    if (displayPost == null) {
                        displayPost = "";
                    }
                    if (displayPost.match(/\.(JPEG|jpeg|JPG|jpg|GIF|gif|PNG|png|ICO|ico)$/) != null) {
                        obj.i = true;
                        obj.v = false;
                        obj.y = false;
                        obj.image1 = displayPost;
                    }
                    else if (displayPost.match(/^.*\.(avi|AVI|wmv|WMV|flv|FLV|mpg|MPG|mp4|MP4)$/) != null) {
                        obj.v = true;
                        obj.y = false;
                        obj.i = false;
                        obj.image1 = displayPost;
                    }
                    else if (displayPost.match(/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/) != null) {
                        obj.y = true;
                        obj.v = false;
                        obj.i = false;
                        obj.image1 = $sce.trustAsResourceUrl(displayPost);
                    }
                    var text = obj.body;
                    text = text.replace(/<[^>]*>/g, '');
                    obj.bodyTitle = text.toString().substr(0, 300);
                    var rep1 = LoginService.getUserProfileImage(obj.author);
                    rep1.then(function (data) {
                        obj.profileImage = data.data.data.userProfileImage;
                    })
                    var rep2 = LoginService.getVotes(obj.author, obj.permlink, hc.username);
                    rep2.then(function (data) {
                        obj.isVote = data.data.data.isUserAvailable[0].status;
                        obj.weight = data.data.data.isUserAvailable[0].percent;
                        if (obj.isVote == undefined || obj.isVote == false) {
                            obj.isVote = false;
                        }
                        else {
                            if (obj.weight == 0) {
                                obj.isVote = false;
                            }
                            else {
                                obj.isVote = true;
                            }
                        }
                    })
                })
                $rootScope.userPostInfo = newObj;
            }
        }, function (err) {
            console.log('err', err);
        });
    };
    hc.getImageForNavBar = function () {
        var rep = LoginService.getUserProfileImage(hc.username);
        rep.then(function (data) {
            hc.currentImage = data.data.data.userProfileImage;
        })
    }
    hc.getUserInfoHome = function () {
        var rep = LoginService.getUserInfo(hc.username);
        rep.then(function (data) {
            hc.userInfo = data.data.data;
            var newObj = data.data.data.userPostInfo.userPostInfo;
            newObj.forEach(function (obj) {
                var postTime = obj.post_time;
                postTime = postTime.slice(2, 9).trim();
                if (postTime == "days") {
                    var postDay = obj.post_time.slice(0, 2).trim();
                    if (postDay >= 7) {
                        obj.postTime = false;
                    }
                    else {
                        obj.postTime = true;
                    }
                }
                else if (postTime == "hours" || postTime == "minute" || postTime == "minutes") {
                    obj.postTime = true;
                }
                else {
                    obj.postTime = false;
                }
                var displayPost = obj.image;
                if (displayPost == null) {
                    displayPost = "";
                }
                if (displayPost.match(/\.(JPEG|jpeg|JPG|jpg|GIF|gif|PNG|png|ICO|ico)$/) != null) {
                    obj.i = true;
                    obj.v = false;
                    obj.y = false;
                    obj.image1 = displayPost;
                }
                else if (displayPost.match(/^.*\.(avi|AVI|wmv|WMV|flv|FLV|mpg|MPG|mp4|MP4)$/) != null) {
                    obj.v = true;
                    obj.y = false;
                    obj.i = false;
                    obj.image1 = displayPost;
                }
                else if (displayPost.match(/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/) != null) {
                    obj.y = true;
                    obj.v = false;
                    obj.i = false;
                    obj.image1 = $sce.trustAsResourceUrl(displayPost);
                }
                var text = obj.body;
                text = text.replace(/<[^>]*>/g, '');
                obj.bodyTitle = text.toString().substr(0, 300);
                var rep1 = LoginService.getUserProfileImage(obj.author);
                rep1.then(function (data) {
                    obj.profileImage = data.data.data.userProfileImage;
                })
                var rep2 = LoginService.getVotes(obj.author, obj.permlink, hc.username);
                rep2.then(function (data) {
                    obj.isVote = data.data.data.isUserAvailable[0].status;
                    obj.weight = data.data.data.isUserAvailable[0].percent;
                    if (obj.isVote == undefined || obj.isVote == false) {
                        obj.isVote = false;
                    }
                    else {
                        if (obj.weight == 0) {
                            obj.isVote = false;
                        }
                        else {
                            obj.isVote = true;
                        }
                    }
                })
            })
            $rootScope.userPostInfoHome = newObj;
        }, function (err) {
            console.log('err', err);
        });
    };
    $scope.getUserInfoHome_test = function () {
        if ($window.location.pathname == '/Home') {
            var rep = LoginService.getUserInfo(hc.username);
            rep.then(function (data) {
                hc.userInfo = data.data.data;
                var newObj = data.data.data.userPostInfo.userPostInfo;
                newObj.forEach(function (obj) {
                    var postTime = obj.post_time;
                    postTime = postTime.slice(2, 9).trim();
                    if (postTime == "days") {
                        var postDay = obj.post_time.slice(0, 2).trim();
                        if (postDay >= 7) {
                            obj.postTime = false;
                        }
                        else {
                            obj.postTime = true;
                        }
                    }
                    else if (postTime == "hours" || postTime == "minute" || postTime == "minutes") {
                        obj.postTime = true;
                    }
                    else {
                        obj.postTime = false;
                    }
                    var displayPost = obj.image;
                    if (displayPost == null) {
                        displayPost = "";
                    }
                    if (displayPost.match(/\.(JPEG|jpeg|JPG|jpg|GIF|gif|PNG|png|ICO|ico)$/) != null) {
                        obj.i = true;
                        obj.v = false;
                        obj.y = false;
                        obj.image1 = displayPost;
                    }
                    else if (displayPost.match(/^.*\.(avi|AVI|wmv|WMV|flv|FLV|mpg|MPG|mp4|MP4)$/) != null) {
                        obj.v = true;
                        obj.y = false;
                        obj.i = false;
                        obj.image1 = displayPost;
                    }
                    else if (displayPost.match(/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/) != null) {
                        obj.y = true;
                        obj.v = false;
                        obj.i = false;
                        obj.image1 = $sce.trustAsResourceUrl(displayPost);
                    }
                    var text = obj.body;
                    text = text.replace(/<[^>]*>/g, '');
                    obj.bodyTitle = text.toString().substr(0, 300);
                    var strng = "/<img[\s]+[^>]*?((alt*?[\s]?=[\s\"\']+(.*?)[\"\']+.*?)|(src*?[\s]?=[\s\"\']+(.*?)[\"\']+.*?))((src*?[\s]?=[\s\"\']+(.*?)[\"\']+.*?>)|(alt*?[\s]?=[\s\"\']+(.*?)[\"\']+.*?>)|>)/g";
                    obj.bodyTitle = obj.bodyTitle.replace(/<a[^>]*>([^<]+)<\/a>/g, " ").replace(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/g, " ").replace(/^<br>|<br>$/g, " ").replace(strng, " ");
                    var rep1 = LoginService.getUserProfileImage(obj.author);
                    rep1.then(function (data) {
                        obj.profileImage = data.data.data.userProfileImage;
                    })
                    var rep2 = LoginService.getVotes(obj.author, obj.permlink, hc.username);
                    rep2.then(function (data) {
                        obj.isVote = data.data.data.isUserAvailable[0].status;
                        obj.weight = data.data.data.isUserAvailable[0].percent;
                        if (obj.isVote == undefined || obj.isVote == false) {
                            obj.isVote = false;
                        }
                        else {
                            if (obj.weight == 0) {
                                obj.isVote = false;
                            }
                            else {
                                obj.isVote = true;
                            }
                        }
                    })
                })
                $rootScope.userPostInfoHome = newObj;
            }, function (err) {
                console.log('err', err);
            });
        }
    };
    hc.routeToDraft = function () {
        var path = $window.location.origin;
        window.location = path + "/Drafts";
        $window.location.reload();
    }
    //for initial tag topic list
    hc.getTagTopicList = function () {
        var rep = LoginService.getTagTopicList();
        rep.then(function (data) {
            hc.TagTopicList = data.data.data.tagTopicsList;
        }, function (err) {
            console.log('err', err);
        });
    };
    // for show more tag topic list
    hc.getTagTopicLists = function () {
        var rep = LoginService.getTagTopicLists();
        rep.then(function (data) {
            hc.TagTopicLists = data.data.data.tagTopicsList.list;
        }, function (err) {
            console.log('err', err);
        });
    };
    hc.getUserFollowingList = function () {
        var currentProfileUser = localStorage.getItem("currentProfileUser");
        if (hc.username !== undefined && hc.username !== null && hc.username !== '') {
            var rep = LoginService.getUserFollowingList(hc.username, 0, 100);
            rep.then(function (data) {
                hc.getFollowingList = data.data.data.following_list.userFollowing;
                var keepGoing = true;
                if (hc.getFollowingList.find(fl => fl.following == currentProfileUser)) {
                    keepGoing = false;
                }
                hc.Following = keepGoing;
            }, function (err) {
                console.log("err", err);
            });
        }
    };
    hc.getUserFollowingList1423 = function () {
        var rep = LoginService.getCompareFollowingList(hc.username, hc.testCurrentUser);
        rep.then(function (data) {
            if (data.data.data.status == 'follow') {
                hc.FollList = true;
            }
            else {
                hc.FollList = false;
            }
        })
    };
    hc.getUserFollowingListByUserName = function (startLimit, endLimit) {
        var followingList = [];
        var fullList = {};
        if (hc.testCurrentUser == undefined || hc.testCurrentUser == '') {
            user = hc.username;
        }
        else {
            user = hc.testCurrentUser;
        }
        var currentUserList = LoginService.getUserFollowingList(user, 0, 100);
        currentUserList.then(function (data) {
            $rootScope.getFollowingListByUserName = data.data.data.following_list.userFollowing;
            var followingCount = LoginService.getUserFollowingCount(hc.username);
            followingCount.then(function (data) {
                var count = data.data.data.userFollowingFollowersInfo.following_count;
                var rawQuotient = (count) / 100;
                var remainder = rawQuotient % 1;
                var quotient = rawQuotient - remainder;
                console.log('quotient', quotient);
                if (quotient == 0) {
                    var loginUserList = LoginService.getUserFollowingList(hc.username, 0, 100);
                    loginUserList.then(function (data) {
                        var list = data.data.data.following_list.userFollowing;
                        for (var i = 0; i < $rootScope.getFollowingListByUserName.length; i++) {
                            var userName = $rootScope.getFollowingListByUserName[i].following;
                            var keepGoing = true;
                            if (list.find(fl => fl.following == userName)) {
                                keepGoing = false;
                            }
                            var test = {user: userName, status: keepGoing}
                            followingList.push(test);
                        }
                        hc.following = followingList;
                    })
                }
                else {
                    var test = {};
                    var list = [];
                    var finalLogUserList = [];
                    var loginUserList = LoginService.getUserFollowingList(hc.username, 0, 100);
                    loginUserList.then(function (data) {
                        list = data.data.data.following_list.userFollowing;
                        finalLogUserList.push(list);
                        var currentUser = data.data.data.following_list.userFollowing[99].following;
                        var i = 0;
                        getfulllist();
                        function getfulllist() {
                            console.log('currentUser', currentUser);
                            var rep = LoginService.getFollowingListFourParms(hc.username, currentUser, 1, 100);
                            console.log(i);
                            rep.then(function (data) {
                                list = data.data.data.following_list.userFollowing;
                                length = list.length;
                                finalLogUserList.push(list);
                                currentUser = list[length - 1].following;
                                i++;
                                if (i < quotient + 1) {
                                    getfulllist();
                                }
                            })
                        }

                        fullList.finalLogUserList = finalLogUserList;
                        console.log('fullList', fullList);
                        for (var j = 0; j < $rootScope.getFollowingListByUserName.length; j++) {
                            var userName = $rootScope.getFollowingListByUserName[j].following;
                            var keepGoing = true;
                            var p = 0;
                            if (fullList.finalLogUserList[p].find(fl => fl.following == userName)) {
                                keepGoing = false;
                            }
                            test = {user: userName, status: keepGoing}
                            p++;
                            if (p < quotient + 1) {
                                followingList.push(test);
                            }
                        }
                        hc.following = followingList;
                        console.log('followingList', followingList);
                    })
                }
            })
        })
    }
    hc.getUserFollowerList = function () {
        var rep = LoginService.getUserFollowerList(hc.username, 0, 100);
        rep.then(function (data) {
            hc.getFollowerList = data.data.data.following_list.userFollowers;
        }, function (err) {
            console.log("err", err);
        });
    };
    hc.getUserFollowerListByUserName = function (startLimit, endLimit) {
        var followerList = [];
        var fullList = {};
        if (hc.testCurrentUser == undefined || hc.testCurrentUser == '') {
            user = hc.username;
        }
        else {
            user = hc.testCurrentUser;
        }
        var currentUserList = LoginService.getUserFollowerList(user, 0, 1000);
        currentUserList.then(function (data) {
            console.log(data);
            $rootScope.getFollowerListByUserName = data.data.data.following_list.userFollowers;
            var followingCount = LoginService.getUserFollowingCount(hc.username);
            followingCount.then(function (data) {
                var count = data.data.data.userFollowingFollowersInfo.following_count;
                var rawQuotient = (count) / 100;
                var remainder = rawQuotient % 1;
                var quotient = rawQuotient - remainder;
                console.log('quotient', quotient);
                if (quotient == 0) {
                    var loginUserList = LoginService.getUserFollowingList(hc.username, 0, 100);
                    loginUserList.then(function (data) {
                        var list = data.data.data.following_list.userFollowing;
                        for (var i = 0; i < $rootScope.getFollowerListByUserName.length; i++) {
                            var userName = $rootScope.getFollowerListByUserName[i].follower;
                            var keepGoing = true;
                            var test = {};
                            if (list.find(fl => fl.following == userName)) {
                                keepGoing = false;
                            }
                            test = {user: userName, status: keepGoing}
                            followerList.push(test);
                        }
                        hc.follower = followerList;
                    })
                }
                else {
                    var test = {};
                    var list = [];
                    var finalLogUserList = [];
                    var loginUserList = LoginService.getUserFollowingList(hc.username, 0, 100);
                    loginUserList.then(function (data) {
                        list = data.data.data.following_list.userFollowing;
                        finalLogUserList.push(list);
                        var currentUser = data.data.data.following_list.userFollowing[99].following;
                        var i = 0;
                        getfulllist();
                        function getfulllist() {
                            console.log('currentUser', currentUser);
                            var rep = LoginService.getFollowingListFourParms(hc.username, currentUser, 1, 100);
                            console.log(i);
                            rep.then(function (data) {
                                list = data.data.data.following_list.userFollowing;
                                length = list.length;
                                finalLogUserList.push(list);
                                currentUser = list[length - 1].following;
                                i++;
                                if (i < quotient + 1) {
                                    getfulllist();
                                }
                            })
                        }

                        fullList.finalLogUserList = finalLogUserList;
                        console.log('fullList', fullList);
                        for (var j = 0; j < $rootScope.getFollowerListByUserName.length; j++) {
                            var userName = $rootScope.getFollowerListByUserName[j].follower;
                            var keepGoing = true;
                            var p = 0;
                            if (fullList.finalLogUserList[p].find(fl => fl.following == userName)) {
                                keepGoing = false;
                            }
                            test = {user: userName, status: keepGoing}
                            p++;
                            if (p < quotient + 1) {
                                followerList.push(test);
                            }
                        }
                        hc.follower = followerList;
                        console.log('followingList', followerList);
                    })
                }
            })
        })
    }
    hc.getList = function (startLimit, endLimit) {
        var followerList = [];
        var fullList = {};
        var userName;
        if (hc.testCurrentUser == undefined || hc.testCurrentUser == '') {
            user = hc.username;
        }
        else {
            user = hc.testCurrentUser;
        }
        var currentUserList = LoginService.getUserFollowerList(user, 0, 20);
        currentUserList.then(function (data) {
            var newObj = data.data.data.following_list.userFollowers;
            newObj.forEach(function (obj) {
                var rep1 = LoginService.getUserProfileImage(obj.follower);
                rep1.then(function (data) {
                    obj.img = data.data.data.userProfileImage;
                })
            })
            hc.list = newObj;
        })
    }
    $scope.view = false;
    hc.checkFollower = function () {
        var check = LoginService.getCompareFollowerList(hc.username, $scope.findFollower);
        check.then(function (data) {
            var status = data.data.data.status;
            if (status == 'Not_A_Follower') {
                $scope.view = false;
                alert($scope.findFollower + ' is not in your follower list.');
                $scope.findFollower = '';
            }
            else {
                $scope.view = true;
                hc.findFollower = $scope.findFollower;
                var rep1 = LoginService.getUserProfileImage($scope.findFollower);
                rep1.then(function (data) {
                    $scope.img123 = data.data.data.userProfileImage;
                })
            }
        })
    }
    hc.FollowerList_Chat = function (sl, el) {
        var check = LoginService.getImage_follower(hc.username, sl, el);
        check.then(function (data) {
            $rootScope.followerlist_chat = data.data.data;
        })
    }
    hc.checkFollower1 = function () {
        var check = LoginService.getCompareFollowerList(hc.username, $scope.findFollower1);
        check.then(function (data) {
            var status = data.data.data.status;
            if (status == 'Not_A_Follower') {
                alert($scope.findFollower1 + ' is not in your follower list.');
            }
            else {
                var path = $window.location.origin;
                window.location = path + "/Message/" + hc.username + "/" + $scope.findFollower1;
                $scope.findFollower1 = '';
            }
        })
    }
    hc.getWhoToFollow = function () {
        var userFollowers = [];
        var userFollowing = [];
        var rep = LoginService.getUserFollowerList(hc.username, 0, 100);
        rep.then(function (data) {
            var followerList = data.data.data.following_list.userFollowers;
            if (Object.keys(data.data.data.following_list).length != 0) {
                for (var i = 0; i < followerList.length; i++) {
                    follower = followerList[i].follower
                    userFollowers.push(follower)
                }
                $rootScope.a = userFollowers;
            }
            var rep1 = LoginService.getUserFollowingList(hc.username, 0, 100);
            rep1.then(function (data) {
                var followingList = data.data.data.following_list.userFollowing;
                if (Object.keys(data.data.data.following_list).length != 0) {
                    for (var j = 0; j < followingList.length; j++) {
                        following = followingList[j].following
                        userFollowing.push(following)
                    }
                    $rootScope.b = userFollowing;
                }
                hc.getWhoList();
            })
        })
    }
    hc.getWhoList = function () {
        var whoToFollow = [];
        var userTemporary = [];
        if ($rootScope.a != undefined && $rootScope.b != undefined) {
            var a = $rootScope.a;
            var b = $rootScope.b;
            for (k = 0; k < a.length; k++) {
                var bl = true;
                for (l = 0; l < b.length; l++) {
                    if (a[k] == b[l]) {
                        bl = false;
                    }
                }
                if (bl) {
                    whoToFollow.push(a[k]);
                }
            }
            if (whoToFollow.length >= 6) {
                $scope.whoFollowList = whoToFollow;
                $scope.random = function () {
                    return 0.5 - Math.random();
                }
                $scope.whoFollowList = orderByFilter($scope.whoFollowList, $scope.random);
            }
        }
        else {
            var myArray = ['always1success', 'good-karma', 'klye', 'gtg', 'roelandp', 'pfunk', 'xeldal', 'wackou', 'abit', 'jesta', 'bhuz'];
            var random = myArray[Math.floor(Math.random() * myArray.length)];
            var rep2 = LoginService.getUserFollowingList(random, 0, 100);
            rep2.then(function (data) {
                var followingList1 = data.data.data.following_list.userFollowing;
                for (var j = 0; j < followingList1.length; j++) {
                    following1 = followingList1[j].following
                    if (following1 != hc.username) {
                        userTemporary.push(following1)
                    }
                }
                $scope.whoFollowList = userTemporary;
                $scope.random = function () {
                    return 0.5 - Math.random();
                }
                $scope.whoFollowList = orderByFilter($scope.whoFollowList, $scope.random);
            })
        }
    }
    hc.getCommentList = function () {
        var arr = [];
        var rep = LoginService.getCommentList(hc.postTag, hc.postUser, hc.postPermlink);
        rep.then(function (data) {
            var newObj1 = data.data.data.withoutComments;
            if (newObj1 != undefined) {
                newObj1.forEach(function (obj) {
                    obj.net_votes = obj.vote;
                    var text = obj.body;
                    text = text.replace(/<[^>]*>/g, '');
                    text = text.toString().substr(0, 300);
                    obj.postWithoutCommentBody = text.replace(/<a[^>]*>([^<]+)<\/a>/g, " ").replace(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/g, " ").replace(/^<br>|<br>$/g, " ").replace(/<img[\s]+[^>]*?((alt*?[\s]?=[\s\"\']+(.*?)[\"\']+.*?)|(src*?[\s]?=[\s\"\']+(.*?)[\"\']+.*?))((src*?[\s]?=[\s\"\']+(.*?)[\"\']+.*?>)|(alt*?[\s]?=[\s\"\']+(.*?)[\"\']+.*?>)|>)/g, " ");
                    var postTime = obj.post_time;
                    postTime = postTime.slice(2, 9).trim();
                    if (postTime == "days") {
                        var postDay = obj.post_time.slice(0, 2).trim();
                        if (postDay >= 7) {
                            obj.postTime = false;
                        }
                        else {
                            obj.postTime = true;
                        }
                    }
                    else if (postTime == "hours" || postTime == "minute" || postTime == "minutes") {
                        obj.postTime = true;
                    }
                    else {
                        obj.postTime = false;
                    }
                    var rep1 = LoginService.getUserProfileImage(obj.author);
                    rep1.then(function (data) {
                        obj.profileImage = data.data.data.userProfileImage;
                    })
                    var rep2 = LoginService.getVotes(obj.author, obj.permlink, hc.username);
                    rep2.then(function (data) {
                        obj.isVote = data.data.data.isUserAvailable[0].status;
                        obj.weight = data.data.data.isUserAvailable[0].percent;
                        if (obj.isVote == undefined || obj.isVote == false) {
                            obj.isVote = false;
                        }
                        else {
                            if (obj.weight == 0) {
                                obj.isVote = false;
                            }
                            else {
                                obj.isVote = true;
                            }
                        }
                    })
                })
                hc.withoutComments = newObj1;
            }
            else {
                hc.withoutComments = '';
            }
            var newObj2 = data.data.data.withComments;
            if (newObj2 !== undefined && newObj2 !== null && newObj2 !== '') {
                newObj2.forEach(function (obj) {
                    obj.net_votes = obj.vote;
                    var text = obj.body;
                    text = text.replace(/<[^>]*>/g, '');
                    text = text.toString().substr(0, 300);
                    obj.postCommentBody = text.replace(/<a[^>]*>([^<]+)<\/a>/g, " ").replace(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/g, " ").replace(/^<br>|<br>$/g, " ").replace(/<img[\s]+[^>]*?((alt*?[\s]?=[\s\"\']+(.*?)[\"\']+.*?)|(src*?[\s]?=[\s\"\']+(.*?)[\"\']+.*?))((src*?[\s]?=[\s\"\']+(.*?)[\"\']+.*?>)|(alt*?[\s]?=[\s\"\']+(.*?)[\"\']+.*?>)|>)/g, " ");
                    var postTime = obj.post_time;
                    postTime = postTime.slice(2, 9).trim();
                    if (postTime == "days") {
                        var postDay = obj.post_time.slice(0, 2).trim();
                        if (postDay >= 7) {
                            obj.postTime = false;
                        }
                        else {
                            obj.postTime = true;
                        }
                    }
                    else if (postTime == "hours" || postTime == "minute" || postTime == "minutes") {
                        obj.postTime = true;
                    }
                    else {
                        obj.postTime = false;
                    }
                    var rep3 = LoginService.getUserProfileImage(obj.author);
                    rep3.then(function (data) {
                        obj.profileImage = data.data.data.userProfileImage;
                    })
                    var rep4 = LoginService.getVotes(obj.author, obj.permlink, hc.username);
                    rep4.then(function (data) {
                        obj.isVote = data.data.data.isUserAvailable[0].status;
                        obj.weight = data.data.data.isUserAvailable[0].percent;
                        if (obj.isVote == undefined || obj.isVote == false) {
                            obj.isVote = false;
                        }
                        else {
                            if (obj.weight == 0) {
                                obj.isVote = false;
                            }
                            else {
                                obj.isVote = true;
                            }
                        }
                    })
                })
                hc.withComments = newObj2;
            }
            else {
                hc.withComments = '';
            }
        }, function (err) {
            console.log('err', err);
        });
    }
    hc.getUserPostContent = function () {
        var rep = LoginService.getUserPostContent(hc.postTag, hc.postUser, hc.postPermlink);
        rep.then(function (data) {
            console.log('data',data);
            hc.getPostContent = data.data.data.commentsOnPost.comments[0];
            var text = hc.getPostContent.body;
            if (text.match(/#(\w+)/g)) {
                text = text.replace(/#(\w+)/g, '<a href="https://zappl.com/New/$1">#$1</a>');
            }
            if (text.match(/@([a-z\d_]+)/g)) {
                text = text.replace(/@([a-z\d_]+)/g, '<a href="https://zappl.com/@$1">@$1</a>');
            }
            if (text.match(/<(button)(?!([^>]*?)analytics-on)(?:[^>]*?)>(?:[^<]*)<\/(button)>/g)) {
                text = text.replace(/<(button)(?!([^>]*?)analytics-on)(?:[^>]*?)>(?:[^<]*)<\/(button)>/g, '');
            }
            if (text.match(/onerror=/g)){
                text = text.replace(/onerror=/g, '');
            }
            $scope.body = $sce.trustAsHtml(text);
            console.log('$scope.body',hc.getPostContent.body);

            console.log('text',text);
            var image = LoginService.getUserProfileImage(hc.postUser);
            image.then(function (data) {
                hc.postImage12 = data.data.data.userProfileImage;
            })
            var rep2 = LoginService.getVotes(hc.postUser, hc.postPermlink, hc.username);
            rep2.then(function (data) {
                hc.getPostContent.isVote = data.data.data.isUserAvailable[0].status;
                hc.weight = data.data.data.isUserAvailable[0].percent;
                if (hc.getPostContent.isVote == undefined || hc.getPostContent.isVote == false) {
                    hc.getPostContent.isVote = false;
                }
                else {
                    if (hc.weight == 0) {
                        hc.getPostContent.isVote = false;
                    }
                    else {
                        hc.getPostContent.isVote = true;
                    }
                }
            })
            var postTime = hc.getPostContent.post_time;
            postTime = postTime.slice(2, 9).trim();
            if (postTime == "days") {
                var postDay = hc.getPostContent.post_time.slice(0, 2).trim();
                if (postDay >= 7) {
                    hc.postTime = false;
                }
                else {
                    hc.postTime = true;
                }
            }
            else if (postTime == "hours" || postTime == "minute" || postTime == "minutes") {
                hc.postTime = true;
            }
            else {
                hc.postTime = false;
            }

            ngMeta.setTag('og:url', hc.absoluteUrl);
            ngMeta.setTag('og:title', hc.postUser + ' Zap');
            ngMeta.setTag('og:description', text.replace(/(<([^>]+)>)/ig, ''));
            ngMeta.setTag('og:type', 'Website');
            ngMeta.setTag('og:website', 'https://zappl.com');
            if (hc.getPostContent.image != ''){
                ngMeta.setTag('og:image', hc.getPostContent.image);
            }else{
                ngMeta.setTag('og:image', 'https://zappl.com/1/images/favicon.png');
            }

        }, function (err) {
            console.log("err", err);
        })
    };
    hc.getTestUserCommentsOnPost = function (n) {
        $scope.userInfo = n;
        $scope.$sce = $sce;
        $scope.bindHTML = $sce.trustAsHtml($scope.userInfo.body);
        var rep = LoginService.getTestUserCommentsOnPost($scope.userInfo.author, $scope.userInfo.permlink);
        rep.then(function (data) {
            hc.getTestCommentsOnPost = data.data.data.commentsOnPost.comments;
        }, function (err) {
            console.log("err", err);
        })
    };
    hc.getUserPostData = function (startLimit, endLimit) {
        var rep = LoginService.getUserPost(hc.username, startLimit, endLimit);
        rep.then(function (data) {
            var newObj = data.data.data.userInfo.userPostInfo;
            newObj.foreach(function (obj) {
                obj.body = $sce.trustAsHtml(obj.body);
                var rep1 = LoginService.getUserProfileImage(obj.author);
                rep1.then(function (data) {
                    obj.profileImage = data.data.data.userProfileImage;
                })
            })
            $rootScope.userPostInfo = newObj;
        });
    };
    hc.getPostComment = function () {
        var rep = LoginService.getPostComment(hc.feedType);
        rep.then(function (data) {
            hc.getPostComment = data.data;
        }, function (err) {
            console.log("err", err);
        });
    };
    hc.postVote = function (author, permlink, index) {
        var text123;
        var vote1;
        if ($rootScope.userPostInfoHome !== undefined && $rootScope.userPostInfo == undefined && hc.withComments == undefined && hc.withoutComments == undefined) {
            text123 = $rootScope.userPostInfoHome;
            vote1 = text123[index].isVote;
        }
        else if ($rootScope.userPostInfoHome == undefined && $rootScope.userPostInfo !== undefined && hc.withComments == undefined && hc.withoutComments == undefined) {
            text123 = $rootScope.userPostInfo;
            vote1 = text123[index].isVote;
        }
        else if ($rootScope.userPostInfoHome == undefined && $rootScope.userPostInfo == undefined && hc.withComments !== '' && hc.withoutComments == '') {
            text123 = hc.withComments;
            vote1 = text123[index].isVote;
        }
        else if ($rootScope.userPostInfoHome == undefined && $rootScope.userPostInfo == undefined && hc.withComments == '' && hc.withoutComments !== '') {
            text123 = hc.withoutComments;
            vote1 = text123[index].isVote;
        }
        var token = hc.loginToken;
        if (hc.loginToken != undefined) {
            var voteWeight = parseInt(hc.votingWeight) * 100;
            var w;
            var data = {};
            if (token !== undefined && token !== null && token !== '') {
                var vote = LoginService.getVotes(author, permlink, hc.username);
                vote.then(function (data) {
                    if (data.data.data.isUserAvailable[0].status == true) {
                        if (data.data.data.isUserAvailable[0].percent == voteWeight) {
                            if (confirm("Removing your vote will reset your curation rewards for this post") == true) {
                                w = 0;
                            }
                        }
                        else {
                            w = voteWeight;
                        }
                    }
                    else {
                        w = voteWeight || 5000;
                    }
                    data = {token: token, author: author, permlink: permlink, weight: w};
                    var rep = LoginService.postVote(data);
                    rep.then(function (data) {
                        if (data.data.error == 1) {
                            alert(data.data.Message);
                        }
                        else {
                            if (vote1 == 'true' || vote1 == "true" || vote1 == true) {
                                text123[index].isVote = false;
                                text123[index].net_votes = text123[index].net_votes - 1;
                            }
                            else {
                                text123[index].isVote = true;
                                text123[index].net_votes = text123[index].net_votes + 1;
                            }
                        }
                    }, function (err) {
                        console.log("err", err);
                        alert('Error during processing, please try later');
                    })
                });
            }
            else {
                alert('Error during processing, please try later');
            }
        }
        else {
            $('#myModal31').modal('show');
        }
    }
    hc.postVote_Profile = function (author, permlink, index) {
        var text123;
        var vote1;
        text123 = $rootScope.userPostInfo;
        vote1 = text123[index].isVote;
        var token = hc.loginToken;
        if (hc.loginToken != undefined) {
            var voteWeight = parseInt(hc.votingWeight) * 100;
            var w;
            var data = {};
            if (token !== undefined && token !== null && token !== '') {
                var vote = LoginService.getVotes(author, permlink, hc.username);
                vote.then(function (data) {
                    if (data.data.data.isUserAvailable[0].status == true) {
                        if (data.data.data.isUserAvailable[0].percent == voteWeight) {
                            if (confirm("Removing your vote will reset your curation rewards for this post") == true) {
                                w = 0;
                            }
                        }
                        else {
                            w = voteWeight;
                        }
                    }
                    else {
                        w = voteWeight || 5000;
                    }
                    data = {token: token, author: author, permlink: permlink, weight: w};
                    var rep = LoginService.postVote(data);
                    rep.then(function (data) {
                        if (data.data.error == 1) {
                            alert(data.data.Message);
                        }
                        else {
                            if (vote1 == 'true' || vote1 == "true" || vote1 == true) {
                                text123[index].isVote = false;
                                text123[index].net_votes = text123[index].net_votes - 1;
                            }
                            else {
                                text123[index].isVote = true;
                                text123[index].net_votes = text123[index].net_votes + 1;
                            }
                        }
                    }, function (err) {
                        console.log("err", err);
                        alert('Error during processing, please try later');
                    })
                });
            }
            else {
                alert('Error during processing, please try later');
            }
        }
        else {
            $('#myModal31').modal('show');
        }
    }
    hc.postVote_Home = function (author, permlink, index) {
        var text123;
        var vote1;
        text123 = $rootScope.userPostInfoHome;
        vote1 = text123[index].isVote;
        var token = hc.loginToken;
        if (hc.loginToken != undefined) {
            var voteWeight = parseInt(hc.votingWeight) * 100;
            var w;
            var data = {};
            if (token !== undefined && token !== null && token !== '') {
                var vote = LoginService.getVotes(author, permlink, hc.username);
                vote.then(function (data) {
                    if (data.data.data.isUserAvailable[0].status == true) {
                        if (data.data.data.isUserAvailable[0].percent == voteWeight) {
                            if (confirm("Removing your vote will reset your curation rewards for this post") == true) {
                                w = 0;
                            }
                        }
                        else {
                            w = voteWeight;
                        }
                    }
                    else {
                        w = voteWeight || 5000;
                    }
                    data = {token: token, author: author, permlink: permlink, weight: w};
                    var rep = LoginService.postVote(data);
                    rep.then(function (data) {
                        if (data.data.error == 1) {
                            alert(data.data.Message);
                        }
                        else {
                            if (vote1 == 'true' || vote1 == "true" || vote1 == true) {
                                text123[index].isVote = false;
                                text123[index].net_votes = text123[index].net_votes - 1;
                            }
                            else {
                                text123[index].isVote = true;
                                text123[index].net_votes = text123[index].net_votes + 1;
                            }
                        }
                    }, function (err) {
                        console.log("err", err);
                        alert('Error during processing, please try later');
                    })
                });
            }
            else {
                alert('Error during processing, please try later');
            }
        }
        else {
            $('#myModal31').modal('show');
        }
    }
    hc.postVote_withComments = function (author, permlink, index) {
        var text123;
        var vote1;
        text123 = hc.withComments;
        vote1 = text123[index].isVote;
        var token = hc.loginToken;
        if (hc.loginToken != undefined) {
            var voteWeight = parseInt(hc.votingWeight) * 100;
            var w;
            var data = {};
            if (token !== undefined && token !== null && token !== '') {
                var vote = LoginService.getVotes(author, permlink, hc.username);
                vote.then(function (data) {
                    if (data.data.data.isUserAvailable[0].status == true) {
                        if (data.data.data.isUserAvailable[0].percent == voteWeight) {
                            if (confirm("Removing your vote will reset your curation rewards for this post") == true) {
                                w = 0;
                            }
                        }
                        else {
                            w = voteWeight;
                        }
                    }
                    else {
                        w = voteWeight || 5000;
                    }
                    data = {token: token, author: author, permlink: permlink, weight: w};
                    var rep = LoginService.postVote(data);
                    rep.then(function (data) {
                        if (data.data.error == 1) {
                            alert(data.data.Message);
                        }
                        else {
                            if (vote1 == 'true' || vote1 == "true" || vote1 == true) {
                                text123[index].isVote = false;
                                text123[index].net_votes = text123[index].net_votes - 1;
                            }
                            else {
                                text123[index].isVote = true;
                                text123[index].net_votes = text123[index].net_votes + 1;
                            }
                        }
                    }, function (err) {
                        console.log("err", err);
                        alert('Error during processing, please try later');
                    })
                });
            }
            else {
                alert('Error during processing, please try later');
            }
        }
        else {
            $('#myModal31').modal('show');
        }
    }
    hc.postVote_withoutComments = function (author, permlink, index) {
        var text123;
        var vote1;
        text123 = hc.withoutComments;
        vote1 = text123[index].isVote;
        var token = hc.loginToken;
        if (hc.loginToken != undefined) {
            var voteWeight = parseInt(hc.votingWeight) * 100;
            var w;
            var data = {};
            if (token !== undefined && token !== null && token !== '') {
                var vote = LoginService.getVotes(author, permlink, hc.username);
                vote.then(function (data) {
                    if (data.data.data.isUserAvailable[0].status == true) {
                        if (data.data.data.isUserAvailable[0].percent == voteWeight) {
                            if (confirm("Removing your vote will reset your curation rewards for this post") == true) {
                                w = 0;
                            }
                        }
                        else {
                            w = voteWeight;
                        }
                    }
                    else {
                        w = voteWeight || 5000;
                    }
                    data = {token: token, author: author, permlink: permlink, weight: w};
                    var rep = LoginService.postVote(data);
                    rep.then(function (data) {
                        if (data.data.error == 1) {
                            alert(data.data.Message);
                        }
                        else {
                            if (vote1 == 'true' || vote1 == "true" || vote1 == true) {
                                text123[index].isVote = false;
                                text123[index].net_votes = text123[index].net_votes - 1;
                            }
                            else {
                                text123[index].isVote = true;
                                text123[index].net_votes = text123[index].net_votes + 1;
                            }
                        }
                    }, function (err) {
                        console.log("err", err);
                        alert('Error during processing, please try later');
                    })
                });
            }
            else {
                alert('Error during processing, please try later');
            }
        }
        else {
            $('#myModal31').modal('show');
        }
    }
    hc.postVote123 = function (author, permlink, vote1) {
        var token = hc.loginToken;
        if (hc.loginToken != undefined) {
            var voteWeight = parseInt(hc.votingWeight) * 100;
            var w;
            var data = {};
            if (token !== undefined && token !== null && token !== '') {
                var vote = LoginService.getVotes(author, permlink, hc.username);
                vote.then(function (data) {
                    if (data.data.data.isUserAvailable[0].status == true) {
                        if (data.data.data.isUserAvailable[0].percent == voteWeight) {
                            if (confirm("Removing your vote will reset your curation rewards for this post") == true) {
                                w = 0;
                            }
                        }
                        else {
                            w = voteWeight;
                        }
                    }
                    else {
                        w = voteWeight || 5000;
                    }
                    data = {token: token, author: author, permlink: permlink, weight: w};
                    var rep = LoginService.postVote(data);
                    rep.then(function (data) {
                        if (data.data.error == 1) {
                            alert(data.data.Message);
                        }
                        else {
                            if (vote1 == 'true' || vote1 == "true" || vote1 == true) {
                                hc.getPostContent.isVote = false;
                                hc.getPostContent.vote = hc.getPostContent.vote - 1;
                            }
                            else {
                                hc.getPostContent.isVote = true;
                                hc.getPostContent.vote = hc.getPostContent.vote + 1;
                            }
                        }
                    }, function (err) {
                        console.log("err", err);
                        alert('Error during processing, please try later');
                    })
                });
            }
            else {
                alert('Error during processing, please try later');
            }
        }
        else {
            $('#myModal31').modal('show');
        }
    }
    hc.postComment = function (currentUser, tags, title) {
        var token = hc.loginToken;
        var parentPermlink = title.toLowerCase().replace(/ |[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/g, " ").replace(/[^a-zA-Z 0-9]+/g, " ").replace(/[\s-]+/g, "-");
        if (parentPermlink.charAt(parentPermlink.length - 1) == '-') {
            parentPermlink = parentPermlink.substr(0, parentPermlink.length - 1);
        }
        var permlink = "re-" + hc.username + "-" + title.toLowerCase().replace(/ |[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/g, "-").replace(/[^a-zA-Z 0-9]+/g, " ").replace(/[\s-]+/g, "-");
        if (permlink.charAt(permlink.length - 1) == '-') {
            permlink = permlink.substr(0, permlink.length - 1);
        }
        permlink = permlink + "-" + new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();
        if (token !== undefined && token !== null && token !== '') {
            var data = {
                token: token,
                parentAuthor: currentUser,
                parentPermlink: parentPermlink,
                permlink: permlink,
                body: document.getElementById("comment").value,
                tags: tags
            }
            var rep = LoginService.postComment(data);
            rep.then(function (data) {
                document.getElementById("comment").value = '';
                hc.getCommentList();
            });
        }
    };
    hc.postCommentOnComment = function (currentUser, tags, title) {
        var test = document.getElementById(title).value;
        var trimTitle = title.substring(0, title.length - 20);
        var token = hc.loginToken;
        if (token !== undefined && token !== null && token !== '') {
            var data = {
                token: token,
                parentAuthor: currentUser,
                parentPermlink: title.toLowerCase().replace(/ |[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/g, "-").replace(/[^a-zA-Z 0-9]+/g, '-').replace(/--/g, "-"),
                permlink: trimTitle.toLowerCase().replace(/ |[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/g, "-").replace(/[^a-zA-Z 0-9]+/g, '-').replace(/--/g, "-") + "-" + new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '').toLowerCase(),
                body: test,
                tags: tags
            }
            var rep = LoginService.postComment(data);
            rep.then(function (data) {
                console.log("DATA : ", data.data.Message);
                document.getElementById(title).value = '';
                hc.getCommentList();
            });
        }
    };
    $scope.fileUpload = function (input) {
        var albumBucketName = 'zapplweb/postImage';
        var bucketRegion = 'us-west-1';
        AWS.config.update({
            accessKeyId: "your key",
            secretAccessKey: "your key",
            region: bucketRegion
        });
        var s3 = new AWS.S3({apiVersion: '2006-03-01', params: {Bucket: albumBucketName}});
        var file = input.files[0];
        if (file.type.slice(0, 5) == 'image' || file.type.slice(0, 5) == 'video') {
            var name;
            if (file.type.slice(0, 5) == 'image') {
                name = file.type.replace("image/", '');
            } else {
                name = file.type.replace("video/", '');
            }
            name = '.' + name;
            var fileName = new Date().valueOf() + name;
            var albumPhotosKey = encodeURIComponent("zapplPostImage");
            var photoKey = albumPhotosKey + fileName;
            s3.upload({Key: photoKey, Body: file, ACL: 'public-read'}, function (err, data) {
                if (err) {
                    alert('There was an error uploading your' + file.type.slice(0, 5) + ':' + err.message);
                    console.log("upload err", err);
                }
                else {
                    var list = {};
                    var value;
                    test = document.getElementById("noiseWidgIframe").contentWindow.document.body.innerHTML;
                    document.getElementById("noiseWidgIframe").contentWindow.document.body.innerHTML = test + data.Key;
                    if (file.type.slice(0, 5) == 'image') {
                        value = '<img src="' + imageUrl + data.key + ' ">';
                        finalImageList.push(imageUrl + data.key);
                    }
                    else {
                        var key = (data.Key).substring(10);
                        value = '<video width="320" height="240" controls><source src="' + imageUrl + key + '" type="' + file.type + '"></video>';
                        finalImageList.push(imageUrl + key);
                    }
                    list = {key: data.Key, value: value};
                    finalPostKV.push(list);
                }
            });
        }
        else {
            alert("File Formate Not Supported");
        }
    }
    hc.youTube = function () {
        var video = document.getElementById("youtubeVideo1").value;
        if (video.length != 0) {
            var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
            var match = video.match(regExp);
            if (match && match[2].length == 11) {
                hc.ytbErr = '';
                document.getElementById("appearUrlVideo").style.display = "block";
                document.getElementById("uploadImages").style.display = "none";
                document.getElementById("uploadVideos").style.display = "none";
                var test = video.replace(/(?:http:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g, '<iframe width="100%" height="300" src="https://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe>');
                console.log("TEST : ", test);
                if (test.slice(0, 8) == 'https://') {
                    $scope.videoUrlSources = test.substring(8);
                }
                else {
                    $scope.videoUrlSources = test;
                }
                var addy = (($scope.videoUrlSources).match(/(?:http:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/))[0];
                var streetaddress = addy.substr(0, addy.indexOf('"'));
                streetaddress = "https://" + streetaddress;
                hc.happeningBody = '<br/>' + $scope.videoUrlSources;
                localStorage.setItem("videoYT", hc.happeningBody);
                localStorage.setItem("listYT", streetaddress);
                localStorage.setItem("fileType", "urlYT");
            }
            else {
                hc.ytbErr = 'Please Enter Correct YouTube URL.';
            }
        }
        else {
            hc.ytbErr = 'Please Enter YouTube URL.';
        }
    }
    $scope.fileWhatsHappening = function (input) {
        var albumBucketName = 'zapplweb/postImage';
        var bucketRegion = 'us-west-1';
        var isMedia = '';
        AWS.config.update({
            accessKeyId: "your key",
            secretAccessKey: "your key",
            region: bucketRegion
        });
        var s3 = new AWS.S3({apiVersion: '2006-03-01', params: {Bucket: albumBucketName}});
        var file = input.files[0];
        if (file.type.slice(0, 5) == 'image' || file.type.slice(0, 5) == 'video') {
            var name;
            if (file.type.slice(0, 5) == 'image') {
                name = file.type.replace("image/", '');
            } else {
                name = file.type.replace("video/", '');
            }
            name = '.' + name;
            var fileName = new Date().valueOf() + name;
            var albumPhotosKey = encodeURIComponent("zapplPostImage");
            var photoKey = albumPhotosKey + fileName;
            s3.upload({Key: photoKey, Body: file, ACL: 'public-read'}, function (err, data) {
                if (err) {
                    alert('There was an error uploading your' + file.type.slice(0, 5) + ':' + err.message);
                    console.log("upload err", err);
                }
                else {
                    var list = {};
                    var value;
                    if (file.type.slice(0, 5) == 'image') {
                        value = '<img src="' + imageUrl + data.key + '" class="img-responsive" width="100%" height="auto">';
                        localStorage.setItem("fileType", "image");
                        document.getElementById("appearImage").style.display = "block";
                        document.getElementById("uploadImages").style.display = "none";
                        document.getElementById("uploadVideos").style.display = "none";
                        document.getElementById("imgLoad").src = imageUrl + data.key;
                        hc.happeningBody = value;
                        localStorage.setItem("videoYT", hc.happeningBody);
                        localStorage.setItem("listYT", imageUrl + data.key);
                        list = {key: data.key, value: value};
                        finalPostKV.push(list);
                    }
                    else {
                        var key = (data.Key).substring(10);
                        if ((data.Key).substring(0, 10) == 'postImage/') {
                            key = key;
                        }
                        else {
                            key = data.Key;
                        }
                        console.log("key2", imageUrl + key);
                        value = '<video width="100%" height="300" controls><source src="' + imageUrl + key + '" type="' + file.type + '"></video>';
                        localStorage.setItem("fileType", "video");
                        document.getElementById("appearVideo").style.display = "block";
                        document.getElementById("uploadImages").style.display = "none";
                        document.getElementById("uploadVideos").style.display = "none";
                        document.getElementById("videoLoad").src = imageUrl + key;
                        hc.happeningBody = value;
                        localStorage.setItem("videoYT", hc.happeningBody);
                        localStorage.setItem("listYT", imageUrl + key);
                        list = {key: data.Key, value: value};
                        finalPostKV.push(list);
                    }
                }
            });
        }
        else {
            alert("File Formate Not Supported");
        }
    }
    hc.deleteUploadMedia = function () {
        finalImageList = [];
        hc.happeningBody = '';
        localStorage.setItem("videoYT", '');
        localStorage.setItem("listYT", '');
        localStorage.setItem("fileType", '');
        document.getElementById("imgLoad").src = '';
        document.getElementById("videoLoad").src = '';
        document.getElementById("uploadImages").style.display = "block";
        document.getElementById("uploadVideos").style.display = "block";
        document.getElementById("appearVideo").style.display = "none";
        document.getElementById("appearImage").style.display = "none";
        document.getElementById("appearUrlVideo").style.display = "none";
        document.getElementById("youtubeVideo1").value = '';
        $scope.videoUrlSources = '';
    }
    hc.postWhatsHappening = function () {
        hc.deleteDraft();
        var videoYT = localStorage.getItem("videoYT");
        var listYT = localStorage.getItem("listYT");
        hc.happeningBody = videoYT;
        finalImageList.push(listYT);
        var tagsList = [];
        var token = hc.loginToken;
        hc.title = $scope.title || document.getElementById("titles").value;
        var permlink = hc.title.toLowerCase().replace(/ |[-!$%•√π¶∆°=©®™✓^@#&¢÷×€£¥₹*()_+|~=`{}\[\]:";'<>?,.\/]/g, "-").replace(/[\s-]+/g, "-");
        var test = document.getElementById("txtModal12").value;
        hc.body = test;
        if (hc.body.match(/#/gi) !== null) {
            if (hc.body.match(/#/gi).length !== undefined && hc.body.match(/#/gi).length !== null && hc.body.match(/#/gi).length > 0) {
                var tagCount = hc.body.match(/#/gi).length;
                for (var i = 0; i < tagCount; i++) {
                    hc.body = hc.body.substr(hc.body.indexOf("#") + 1, hc.body.length);
                    var Tag = ((hc.body.split(' ')[0]).split('<')[0]).split('&')[0];
                    tagsList.push(Tag);
                }
            }
        }
        else {
            tagsList = ['zappl'];
        }
        test = test.replace(new RegExp('\n', 'g'), '<br />');
        if (test.match(/<(button|a)(?!([^>]*?)analytics-on)(?:[^>]*?)>(?:[^<]*)<\/(button|a)>/g)) {
            alert('Please remove the following HTML elements from your post: <button> ');
        }
        else if (test.match(/(<iframe.+?<\/iframe>)/g)) {
            alert('Invalid iframe URL: Please remove the following HTML elements from your post');
        }
        else if (test == '' || hc.title == '') {
            alert('Please enter text in Title and Body both');
        }
        else {
            if (hc.happeningBody != undefined) {
                test = '<div class="container-fluid pad_10"><div class="col-md-12 pad_zero "><p class="text-left fon_text" style="font-size:1em;">' + test + '</p><center>' + hc.happeningBody + '</center></div></div>';
            }
            else {
                test = '<div class="container-fluid pad_10"><div class="col-md-12 pad_zero "><p class="text-left fon_text" style="font-size:1em;">' + test + '</p></div></div>';
            }
            var data = {
                token: token,
                parentPermlink: tagsList[0],
                title: hc.title,
                htmlBody: test,
                tags: tagsList,
                image: finalImageList,
                permlink: permlink
            };
            var rep = LoginService.postBlog(data)
            rep.then(function (data) {
                if (data.data.Message == "Successful") {
                    finalPostKV = [];
                    finalImageList = [];
                    localStorage.setItem("videoYT", '');
                    localStorage.setItem("listYT", '');
                    localStorage.setItem("fileType", '');
                    $scope.videoUrlSources = '';
                    document.getElementById("idField").value = '';
                    document.getElementById("chkPassport").checked = false;
                    document.getElementById("titles").value = '';
                    document.getElementById("txtModal12").value = '';
                    document.getElementById("sel2").value = "Default (50% / 50%)";
                    document.getElementById("appearImage").style.display = "none";
                    document.getElementById("appearUrlVideo").style.display = "none";
                    document.getElementById("appearUrlVideo").style.display = "none";
                    document.getElementById("uploadImages").style.display = "block";
                    document.getElementById("uploadVideos").style.display = "block";
                    document.getElementById("youtubeVideo1").value = '';
                    document.getElementById("imgLoad").src = '';
                    document.getElementById("videoLoad").src = '';
                    if (hc.hasPost) {
                        hc.title = $scope.title;
                        var voteWeight;
                        var weight = '';
                        voteWeight = parseInt(hc.votingWeight || 50) * 100;
                        switch (hc.popUpListSelect) {
                            case"Power Up 100%":
                                weight = voteWeight
                                break;
                            case"Default (50% / 50%)":
                                weight = (voteWeight) / 2
                                break;
                            case"Decline Payout":
                                weight = 900
                                break;
                        }
                        if (token !== undefined && token !== null && token !== '' && weight !== '') {
                            var data = {token: token, author: hc.username, permlink: permlink, weight: weight};
                            var vote = LoginService.postVote(data);
                            vote.then(function (data) {
                                console.log("Error vote", data);
                                hc.getUserInfoHome();
                            });
                        }
                        else {
                            alert('Error during processing, please try later');
                        }
                    }
                    else {
                        hc.getUserInfoHome();
                    }
                }
                else if (data.data.error == 1) {
                    alert(data.data.Message);
                }
            }, function (err) {
                alert(err.data.Message);
            })
        }
    }
    function randomString(length, chars) {
        var mask = '';
        if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
        if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (chars.indexOf('#') > -1) mask += '0123456789';
        if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
        var result = '';
        for (var i = length; i > 0; --i)result += mask[Math.round(Math.random() * (mask.length - 1))];
        return result;
    }

    hc.postBlog = function () {
        var tagsList = [];
        var token = hc.loginToken;
        hc.title = $scope.title || document.getElementById("titles").value;
        var permlink = hc.title.toLowerCase().replace(/ |[-!$%^@•√π¶∆°=©®™✓#&€÷×¢£¥₹*()_+|~=`{}\[\]:";'<>?,.\/]/g, "-").replace(/[\s-]+/g, "-");
        var name1 = LoginService.getRezapList(hc.username);
        name1.then(function (data) {
            for (var i = 0; i < data.data.data.checkRezap.length; i++) {
                if (data.data.data.checkRezap[i].permlink == permlink) {
                    permlink = randomString(5, 'a') + '-' + permlink;
                    break;
                }
                else {
                    permlink = permlink;
                }
            }
            var test = document.getElementById("noiseWidgIframe").contentWindow.document.body.innerHTML;
            finalPostKV.forEach(function (element) {
                var key1 = element.key;
                var value1 = element.value;
                test = test.replace(key1, value1);
            });
            hc.body = test;
            if (hc.body.match(/#/gi) !== null) {
                if (hc.body.match(/#/gi).length !== undefined && hc.body.match(/#/gi).length !== null && hc.body.match(/#/gi).length > 0) {
                    var tagCount = hc.body.match(/#/gi).length;
                    for (var i = 0; i < tagCount; i++) {
                        hc.body = hc.body.substr(hc.body.indexOf("#") + 1, hc.body.length);
                        var Tag = ((hc.body.split(' ')[0]).split('<')[0]).split('&')[0];
                        tagsList.push(Tag);
                    }
                }
            }
            else {
                tagsList = ['zappl'];
            }
            var data = {
                token: token,
                parentPermlink: tagsList[0],
                title: hc.title,
                htmlBody: test,
                tags: tagsList,
                image: finalImageList,
                permlink: permlink
            };
            var rep = LoginService.postBlog(data);
            rep.then(function (err, res) {
                if (err) {
                    console.log('Error', err);
                }
                finalPostKV = [];
                finalImageList = [];
                $window.location.reload();
                return res;
            })
        })
    };
    hc.deleteDraft = function () {
        if (document.getElementById("idField").value !== '') {
            var draftPost = {draftId: document.getElementById("idField").value}
            var rep = LoginService.deleteDraftOnPost(draftPost);
            return rep;
        }
    }
    hc.checkPost = function () {
        hc.deleteDraft();
        if (hc.hasPost) {
            hc.title = $scope.title;
            var voteWeight;
            var weight = '';
            var permlink = hc.title.toLowerCase().replace(/ /g, "-");
            var token = hc.loginToken;
            voteWeight = parseInt(hc.votingWeight || 50) * 100;
            switch (hc.popUpListSelect) {
                case"Power Up 100%":
                    weight = voteWeight
                    break;
                case"Default (50% / 50%)":
                    weight = (voteWeight) / 2
                    break;
                case"Decline Payout":
                    weight = 0
                    break;
            }
            if (token !== undefined && token !== null && token !== '' && weight !== '') {
                var data = {token: token, author: hc.username, permlink: permlink, weight: weight};
                var vote = LoginService.postVote(data);
                vote.then(function (err, response) {
                    if (err) {
                        console.log("Error", err);
                    }
                    else {
                        return response;
                    }
                    hc.postBlog();
                });
            }
            else {
                alert('Error during processing, please try later');
            }
        }
        else {
            hc.postBlog();
        }
    };
    hc.draftPost = function () {
        var file = '';
        var listYT = '';
        file = localStorage.getItem("fileType");
        listYT = localStorage.getItem("listYT");
        if (document.getElementById("idField").value != '') {
            var draftId = document.getElementById("idField").value;
        }
        else {
            var draftId = '';
        }
        var title = document.getElementById("titles").value || '(no title)';
        var bodyString = document.getElementById("txtModal12").value || '';
        var fileType = file;
        var url = listYT;
        var rewards = 1;
        var upvote = 0;
        var userName = hc.username;
        switch (hc.popUpListSelect) {
            case"Power Up 100%":
                rewards = 100
                break;
            case"Default (50% / 50%)":
                rewards = 50
                break;
            case"Decline Payout":
                rewards = 0
                break;
        }
        if (hc.hasPost) {
            upvote = 1;
        }
        var draftData = {
            userName: userName,
            draftId: draftId,
            title: title,
            bodyString: bodyString,
            fileType: fileType,
            url: url,
            upvote: upvote,
            rewards: rewards
        }
        var rep = LoginService.draftPost(draftData);
        rep.then(function (data) {
            hc.deleteUploadMedia();
            $window.location.reload();
            return rep;
        });
    };
    hc.getDraftPost = function () {
        var rep = LoginService.getDraftPost(hc.username);
        rep.then(function (data) {
            var newObj = data.data.data;
            newObj.forEach(function (obj) {
                var rep1 = LoginService.getUserProfileImage(hc.username);
                rep1.then(function (data) {
                    obj.profileImage = data.data.data.userProfileImage;
                })
            })
            hc.draftData = newObj;
            return rep;
        });
    };
    hc.showDraftPost = function (n) {
        hc.data = n;
        document.getElementById("idField").value = hc.data._id;
        if (hc.data.upvote == 1) {
            document.getElementById("chkPassport").checked = true;
        }
        else {
            document.getElementById("chkPassport").checked = false;
        }
        hc.hasPost = document.getElementById("chkPassport").checked;
        document.getElementById("titles").value = hc.data.title;
        document.getElementById("txtModal12").innerHTML = hc.data.bodyString;
        switch (hc.data.rewards) {
            case 100:
                document.getElementById("sel2").value = "Power Up 100%"
                break;
            case 50:
                document.getElementById("sel2").value = "Default (50% / 50%)"
                break;
            case 0:
                document.getElementById("sel2").value = "Decline Payout"
                break;
            case 1:
                document.getElementById("sel2").value = ""
                break;
        }
        if (hc.data.fileType == 'image') {
            localStorage.setItem("fileType", "image");
            localStorage.setItem("listYT", hc.data.url);
            var value = '<img src="' + hc.data.url + ' ">';
            document.getElementById("appearImage").style.display = "block";
            document.getElementById("uploadImages").style.display = "none";
            document.getElementById("uploadVideos").style.display = "none";
            document.getElementById("imgLoad").src = hc.data.url;
        }
        else if (hc.data.fileType == 'video') {
            localStorage.setItem("fileType", "video");
            localStorage.setItem("listYT", hc.data.url);
            var value = '<video width="320" height="240" controls><source src="' + hc.data.url + '"></video>';
            document.getElementById("appearVideo").style.display = "block";
            document.getElementById("uploadImages").style.display = "none";
            document.getElementById("uploadVideos").style.display = "none";
            document.getElementById("videoLoad").src = hc.data.url;
        }
        else if (hc.data.fileType == 'urlYT') {
            localStorage.setItem("fileType", "urlYT");
            localStorage.setItem("listYT", hc.data.url);
            var video = hc.data.url;
            document.getElementById("appearUrlVideo").style.display = "block";
            document.getElementById("uploadImages").style.display = "none";
            document.getElementById("uploadVideos").style.display = "none";
            var test = video.replace(/(?:http:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g, '<iframe width="420" height="345" src="https://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe>');
            if (test.slice(0, 8) == 'https://') {
                $scope.videoUrlSources = test.substring(8);
            }
            else {
                $scope.videoUrlSources = test;
            }
            document.getElementById("youtubeVideo1").value = '';
            var addy = (($scope.videoUrlSources).match(/(?:http:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/))[0];
            var streetaddress = addy.substr(0, addy.indexOf('"'));
            streetaddress = "https://" + streetaddress;
            hc.happeningBody = '<br/>' + $scope.videoUrlSources;
            localStorage.setItem("videoYT", hc.happeningBody);
            localStorage.setItem("listYT", streetaddress);
            localStorage.setItem("fileType", "urlYT");
        }
        else if (hc.data.fileType == '') {
            hc.deleteUploadMedia();
        }
    }
    hc.clearCreateZapPopup = function () {
        $('#chars-remaining').html('240 characters remaining');
        finalImageList = [];
        localStorage.setItem("videoYT", '');
        localStorage.setItem("listYT", '');
        localStorage.setItem("fileType", '');
        $scope.videoUrlSources = '';
        document.getElementById("idField").value = '';
        document.getElementById("chkPassport").checked = false;
        document.getElementById("titles").value = '';
        document.getElementById("txtModal12").value = '';
        document.getElementById("sel2").value = "Default (50% / 50%)";
        document.getElementById("appearImage").style.display = "none";
        document.getElementById("appearUrlVideo").style.display = "none";
        document.getElementById("appearUrlVideo").style.display = "none";
        document.getElementById("uploadImages").style.display = "block";
        document.getElementById("uploadVideos").style.display = "block";
        document.getElementById("youtubeVideo1").value = '';
        document.getElementById("imgLoad").src = '';
        document.getElementById("videoLoad").src = '';
    }
    hc.postDeleteBlog = function (permlink) {
        var token = hc.loginToken;
        var data = {token: token, permlink: permlink};
        var rep = LoginService.postDeleteBlog(data);
        var path = $window.location.origin;
        window.location = path + "/Home";
        $window.location.reload();
        return rep;
    };
    hc.postDeleteComment = function (permlink) {
        var token = hc.loginToken;
        var data = {token: token, permlink: permlink};
        var rep = LoginService.postDeleteComment(data);
        setTimeout(function () {
            hc.getUserInfoHome();
        }, 2000);
    };
    hc.postDeleteComment_withC = function (permlink) {
        var token = hc.loginToken;
        var data = {token: token, permlink: permlink};
        var rep = LoginService.postDeleteComment(data);
        setTimeout(function () {
            hc.getCommentList();
        }, 2000);
    };
    hc.postDeleteComment_withoutC = function (permlink) {
        var token = hc.loginToken;
        var data = {token: token, permlink: permlink};
        var rep = LoginService.postDeleteComment(data);
        setTimeout(function () {
            hc.getCommentList();
        }, 2000);
    };
    hc.postFollow = function (following) {
        var token = hc.loginToken;
        if (token != undefined) {
            var data = {token: token, userName: hc.username, following: following};
            var rep = LoginService.postFollow(data);
            rep.then(function (data) {
                if (data.data.Message == "Successful") {
                    if ($window.location.pathname == '/Followers') {
                        setTimeout(function () {
                            hc.getUserFollowerListByUserName(0, 100);
                            hc.getWhoToFollow();
                            hc.getUserInfo();
                        }, 20);
                    } else {
                        hc.getWhoToFollow();
                        hc.getUserInfo();
                    }
                }
                else {
                    alert('Please try after sometime!!')
                }
            })
        }
        else {
            $('#myModal31').modal('show');
        }
    };
    hc.postUnfollow = function (following) {
        var token = hc.loginToken;
        if (token != undefined) {
            var data = {token: token, userName: hc.username, following: following};
            var rep = LoginService.postUnfollow(data);
            rep.then(function (data) {
                if (data.data.Message == "Successful") {
                    if ($window.location.pathname == '/Followers') {
                        setTimeout(function () {
                            hc.getUserFollowerListByUserName(0, 100);
                        }, 20);
                    } else {
                        setTimeout(function () {
                            hc.getUserFollowingListByUserName(0, 1000);
                        }, 20);
                    }
                }
                else {
                    alert('Please try after sometime!!')
                }
            })
        }
        else {
            $('#myModal31').modal('show');
        }
    };
    hc.testFollow = function (following) {
        var token = hc.loginToken;
        if (token != undefined) {
            var data = {token: token, userName: hc.username, following: following};
            var rep = LoginService.postFollow(data);
            rep.then(function (data) {
                if (data.data.Message == "Successful") {
                    hc.FollList = !hc.FollList;
                }
                else {
                    alert('Please try after sometime!!')
                }
            })
        }
        else {
            $('#myModal31').modal('show');
        }
    };
    hc.testUnfollow = function (following) {
        var token = hc.loginToken;
        if (token != undefined) {
            var data = {token: token, userName: hc.username, following: following};
            var rep = LoginService.postUnfollow(data);
            rep.then(function (data) {
                if (data.data.Message == "Successful") {
                    hc.FollList = !hc.FollList;
                }
                else {
                    alert('Please try after sometime!!')
                }
            })
        }
        else {
            $('#myModal31').modal('show');
        }
    };
});
