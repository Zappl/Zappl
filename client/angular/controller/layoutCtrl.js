// ZapplApp.controller('layoutCtrl',function($rootScope,$stateParams,$state,$window,$http,$scope,$sce,LoginService){document.getElementById("body").style.display="block";var layout=this;layout.userInfo={};layout.username=localStorage.getItem('username');layout.afterTag='steemit';layout.deviceId='abc@ABC1231';layout.loginToken=localStorage.getItem("loginToken");$rootScope.tokenValue=localStorage.getItem("loginToken");layout.checkToken=function()
// {var result=true;if(layout.loginToken==null){var path=$window.location.origin;window.location=path+'/';result=false;}
// return result;}
// layout.getToken=function(){var browserDeviceId='';var json='https://api.ipify.org?format=json';$http.get(json).then(function(result){browserDeviceId=result.data.ip;var rep=LoginService.getToken(browserDeviceId);rep.then(function(data){if(data.data.tokenInfo!==undefined&&data.data.tokenInfo!==null&&data.data.tokenInfo!=='')
// {}},function(err){console.log('err',err);});},function(e){console.log('err',e);});};layout.logout=function(){var browserDeviceId='';var json='https://api.ipify.org?format=json';$http.get(json).then(function(result){browserDeviceId=result.data.ip;var path=$window.location.origin;LoginService.logout(browserDeviceId);localStorage.setItem('loginToken','');$rootScope.tokenValue='';$window.localStorage.clear();window.location=path+'/';},function(e){console.log('err',e);});};});



  ZapplApp.controller('layoutCtrl', function($rootScope, $stateParams, $state, $window,$http,$scope,$sce,LoginService) {
    document.getElementById("body").style.display = "block";
    var layout = this;
    layout.userInfo = {};
    layout.username = localStorage.getItem('username');
    layout.afterTag = 'steemit';
    layout.deviceId = 'abc@ABC1231';
    layout.loginToken = localStorage.getItem("loginToken");
    $rootScope.tokenValue = localStorage.getItem("loginToken");

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
        var json = 'https://api.ipify.org?format=json';
        $http.get(json).then(function(result) {
             browserDeviceId = result.data.ip;
              var rep =   LoginService.getToken(browserDeviceId);
              rep.then(function(data){
                if(data.data.tokenInfo !== undefined && data.data.tokenInfo !== null && data.data.tokenInfo !== '')
                {
                  //  window.location = path+"/#!/Home";
                }

              },function(err){
                  console.log('err',err);
              });
          }, function(e) {
              console.log('err',e);
          });
    };

    layout.logout = function(){
      var browserDeviceId='';
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
        });
