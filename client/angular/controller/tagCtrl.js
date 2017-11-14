
  ZapplApp.controller('tagCtrl', function( $rootScope, $stateParams, $state, LoginService) {
    $rootScope.tokenValue = localStorage.getItem("loginToken");
  var tags = this;
   tags.tagtopic = {};
    tags.getTagTopicDetails = function() {
      $rootScope.itemName = $stateParams.itemName;
              var rep =   LoginService.getTagTopicDetails($rootScope.itemName);
             rep.then(function(data){
               tags.tagtopic = data.data;
             },function(err){
                 console.log('err',err);
                // alert('on error');
             });
         };
    });
