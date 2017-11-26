ZapplApp.controller('walletCtrl',function($scope,$rootScope, $stateParams, $state,$window, LoginService){
  var wc = this;
  wc.permlinkString = new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();
  wc.username = localStorage.getItem("username");
  $scope.username = wc.username;
  wc.postingWif = localStorage.getItem("postingWif");
  wc.loginToken = localStorage.getItem("loginToken");
  $rootScope.tokenValue = localStorage.getItem("loginToken");
  var publicActiveKey = localStorage.getItem('publicActiveKey');




  wc.getWalletDetails = function(){
    if(wc.loginToken != null){
      var rep = LoginService.getWalletDetails(wc.username);
      rep.then(function(data){
         wc.userWalletInfo = data.data.data.wallet_details;
         $scope.steem = wc.userWalletInfo.steem;
         $scope.sbd = wc.userWalletInfo.steemDollars;
         $scope.savings = wc.userWalletInfo.savings;
         $scope.savingsSbd = wc.userWalletInfo.savingsSbd;
         wc.userWalletHistory = data.data.data.trx_history.userWallethistory;
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
     };

 wc.transferOption = function(){
   if(wc.transferOption1 == undefined){
     wc.transferOption1 = "SBD";
   }
   if(wc.transferOption1 == "STEEM"){
     wc.transferOption1 = "SBD";
     wc.transferOption2 = "STEEM";
     wc.bal = $scope.sbd +' SBD';
     wc.bal2 = $scope.sbd;
     wc.savBal = $scope.savingsSbd +' SBD';
     wc.savBal2 = $scope.savingsSbd;
   }
   else{
        wc.bal = $scope.steem +' STEEM';
        wc.bal2 = $scope.steem;

        wc.savBal = $scope.savings +' STEEM';
        wc.savBal2 = $scope.savings;
       wc.transferOption1 = "STEEM";
       wc.transferOption2 = "SBD";
   }
 }



 wc.transferClick = function(){
   var amt = (Math.round(parseFloat($scope.transferAmount)*1000)/1000);
   var bal = (Math.round(parseFloat(wc.bal2)*1000)/1000);
   console.log(amt, bal);
   if(amt <= bal){
     document.getElementById("transferLink").setAttribute("data-target", "#myModal2");
     document.getElementById("transferLink").setAttribute("data-toggle", "modal");
     $scope.transferError = " ";
   }
   else{
     $scope.transferError = "Enter amount equal to or less then your current amount.";
   }
 }



  wc.postTransfer = function(){
    var token = wc.loginToken;
    var data = {};
    var transferActiveWif = $scope.transferActiveWif;
    var transferTo = $scope.transferTo;
    var amt = $scope.transferAmount;
    if(amt.slice(0,1) == '.'){
      amt = '0'+amt;
    }
    var a = parseFloat(amt).toFixed(3);
    var transferAmount = a+" "+wc.transferOption1;

    if (transferActiveWif == undefined || transferActiveWif=='' || steem.auth.isWif(transferActiveWif) != true){
      $scope.transferError ="Please Enter Correct Private Active Key";
    }
    else{
          var publicAKey = steem.auth.wifToPublic(transferActiveWif);
          if (publicAKey === publicActiveKey){
            data = {
              token : token,
              activeWif : transferActiveWif,
              to : transferTo,
              amount : transferAmount
            }
            var rep = LoginService.postTransfer(data);
            rep.then(function(err,res){
              $window.location.reload();
            })
          }
          else{
            $scope.transferError ="Please Enter Correct Private Active Key";
          }
    }
  }


  wc.transferToSavingClick = function(){
    var amt = (Math.round(parseFloat($scope.transferAmount)*1000)/1000);
     var bal = (Math.round(parseFloat(wc.bal2)*1000)/1000);
    if(amt <= bal){
      document.getElementById("transferToSavingLink").setAttribute("data-target", "#myModal321");
      document.getElementById("transferToSavingLink").setAttribute("data-toggle", "modal");
      $scope.transferError = " ";
    }
    else{
      $scope.transferError = "Enter amount equal to or less then your current amount.";
    }
  }
  wc.postTransferToSaving = function(){
    var token = wc.loginToken;
    var data = {};
    var transferActiveWif = $scope.transferActiveWif;
    var transferTo = $scope.transferTo;
    var amt = $scope.transferAmount;
    if(amt.slice(0,1) == '.'){
      amt = '0'+amt;
    }
    var a = parseFloat(amt).toFixed(3);
    var transferAmount = a+" "+wc.transferOption1;

    if (transferActiveWif == undefined || transferActiveWif=='' || steem.auth.isWif(transferActiveWif) != true){
      $scope.transferError ="Please Enter Correct Private Active Key";
    }
    else{
          var publicAKey = steem.auth.wifToPublic(transferActiveWif);
          if (publicAKey === publicActiveKey){
            data = {
              token : token,
              activeWif : transferActiveWif,
              to : transferTo,
              amount : transferAmount
            }
            var rep = LoginService.postTransferToSaving(data);
            rep.then(function(err,res){
              $window.location.reload();
              return res;
            })
          }
          else{
            $scope.transferError ="Please Enter Correct Private Active Key";
          }
    }
  }

  wc.transferPowerUp = function(){
    var amt = (Math.round(parseFloat($scope.transferAmount)*1000)/1000);
     var bal = (Math.round(parseFloat(wc.bal2)*1000)/1000);
    if(amt <= bal){
      document.getElementById("transferPowerUpLink").setAttribute("data-target", "#myModal4321");
      document.getElementById("transferPowerUpLink").setAttribute("data-toggle", "modal");
      $scope.transferError = " ";
    }
    else{
      $scope.transferError = "Enter amount equal to or less then your current amount.";
    }
  }
  wc.postPowerUp = function(){
    var token = wc.loginToken;
    var data = {};
    var transferActiveWif = $scope.transferActiveWif;
    var transferTo = $scope.transferTo;
    var amt = $scope.transferAmount;
    if(amt.slice(0,1) == '.'){
      amt = '0'+amt;
    }
    var a = parseFloat(amt).toFixed(3);
    var transferAmount = a+" "+wc.transferOption1;

    if (transferActiveWif == undefined || transferActiveWif=='' || steem.auth.isWif(transferActiveWif) != true){
      $scope.transferError ="Please Enter Correct Private Active Key";
    }
    else{
          var publicAKey = steem.auth.wifToPublic(transferActiveWif);
          if (publicAKey === publicActiveKey){
            data = {
              token : token,
              activeWif : transferActiveWif,
              to : transferTo,
              amount : transferAmount
            }
            var rep = LoginService.postPowerUp(data);
            rep.then(function(err,res){
              $window.location.reload();
              return res;
            })
          }
          else{
            $scope.transferError ="Please Enter Correct Private Active Key";
          }
    }
  }

  wc.postPowerDown = function(){
    var token = wc.loginToken;
    var data = {};
    var transferActiveWif = $scope.transferActiveWif;
    if (transferActiveWif == undefined || transferActiveWif=='' || steem.auth.isWif(transferActiveWif) != true){
      $scope.transferError ="Please Enter Correct Private Active Key";
    }
    else{
          var publicAKey = steem.auth.wifToPublic(transferActiveWif);
          if (publicAKey === publicActiveKey){
            data = {
              token : token,
              activeWif : transferActiveWif
            }
            var rep = LoginService.postPowerDown(data);
            rep.then(function(err,res){
              $window.location.reload();
              return res;
            })
          }
          else{
            $scope.transferError ="Please Enter Correct Private Active Key";
          }
    }
  }


  wc.postCancelTransferFromSavings = function(){
    var token = wc.loginToken;
    var data = {};
    var transferActiveWif = $scope.transferActiveWif;
    var requestId = $scope.requestId;
    if (transferActiveWif == undefined || transferActiveWif=='' || steem.auth.isWif(transferActiveWif) != true){
      $scope.transferError ="Please Enter Correct Private Active Key";
    }
    else{
          var publicAKey = steem.auth.wifToPublic(transferActiveWif);
          if (publicAKey === publicActiveKey){
            data = {
              token : token,
              activeWif : transferActiveWif,
              requestId : requestId
            }
            var rep = LoginService.postCancelTransferFromSavings(data);
            rep.then(function(err,res){
              $window.location.reload();
              return res;
            })
          }
          else{
            $scope.transferError ="Please Enter Correct Private Active Key";
          }
    }
  }

  wc.saveClick = function(){
    var amt = (Math.round(parseFloat($scope.transferAmount)*1000)/1000);
     var bal = (Math.round(parseFloat(wc.savBal2)*1000)/1000);
     console.log(amt , bal);
    if(amt <= bal){
      document.getElementById("saveLink").setAttribute("data-target", "#myModal54321");
      document.getElementById("saveLink").setAttribute("data-toggle", "modal");
      $scope.transferError = " ";
    }
    else{
      $scope.transferError = "Enter amount equal to or less then your current amount.";
    }
  }
  wc.postWithdrawSteem = function(){
    var token = wc.loginToken;
    var data = {};
    var transferActiveWif = $scope.transferActiveWif;
    var transferTo = $scope.transferTo;
    var amt = $scope.transferAmount;
    if(amt.slice(0,1) == '.'){
      amt = '0'+amt;
    }
    var a = parseFloat(amt).toFixed(3);
    var transferAmount = a+" "+wc.transferOption1;
    if (transferActiveWif == undefined || transferActiveWif=='' || steem.auth.isWif(transferActiveWif) != true){
      $scope.transferError ="Please Enter Correct Private Active Key";
    }
    else{
          var publicAKey = steem.auth.wifToPublic(transferActiveWif);
          if (publicAKey === publicActiveKey){
            data = {
              token : token,
              activeWif : transferActiveWif,
              to : transferTo,
              amount : transferAmount
            }
            console.log(data);
            var rep = LoginService.postWithdrawSteem(data);
            rep.then(function(err,res){
              $window.location.reload();
              return res;
            })
          }
          else{
            $scope.transferError ="Please Enter Correct Private Active Key";
          }
    }
  }

})
