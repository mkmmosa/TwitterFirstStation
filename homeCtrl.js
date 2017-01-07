
app.controller('homeCtrl', function($scope, $rootScope,$http, $location, AuthService){
	$rootScope.title = 'Home Page';
        
        $scope.Feeds = Array();
        $scope.UsersNames = Array(); 
        $scope.loggedin = AuthService.isAuthenticated();
        console.log($scope.loggedin);
        $http.get('http://localhost:3000/loginUser').success(function(response){
            $scope.loginUser = response;
            if($scope.loginUser.username !== "null"){
                $scope.OnlineUser = $scope.loginUser.username;
                $scope.OnlineId = $scope.loginUser.id;
            }else{
                console.log('No login!');
            }
        });
        
        showTweets = function(){
                $scope.Feeds = Array();
                $scope.UsersNames = Array(); 
                $http.get("http://localhost:3000/tweets").success(function(response){
                for(var j=0; j<response.length; j++){
                    var userId = response[j].userId;
                    var text = response[j].text;
                    var twtid = response[j].id;
                    var votes = response[j].votes;
                    var date = response[j].date;
                    $scope.Feeds.push({text:text, date:date, votes:votes, userId:userId, index:j , id : twtid});
                    $http.get("http://localhost:3000/users/" + userId).success(function(response){
                        console.log(response);
                        $scope.UsersNames.push(response.username);

                    });

                }

          });
        };
        showTweets();
        $scope.LogoutMyUser = function(){
            AuthService.logout(); $location.path('/login');
        };
         
        $scope.goToMoreInfo = function(){
            $location.path('/moreInfo');
        };
        $scope.Send = function(txt){
         var newId = $scope.UsersNames.length + 1;
         var date0 = new Date().toString();
         console.log(date0);
         var feed =  {text : txt, date:date0 , votes:0, userId:$scope.OnlineId, index:$scope.UsersNames.length,
                      id: newId};
         
         console.log(feed);
         $scope.UsersNames.push($scope.OnlineUser);
         $scope.Feeds.push(feed);
        
         var topost = {text : txt, date: date0, votes:0, userId:$scope.OnlineId, id: newId};
          $http.post("http://localhost:3000/tweets" , topost);
      };
      
      $scope.Voting =function(id){
          $http.post("http://localhost:3000/tweets/"+id).success(function(response){
              
              if(response.success){
                  showTweets();
                  showSuccessToast()
              }else{
                  showNoticeToast();
              }
          });
      };
        
});