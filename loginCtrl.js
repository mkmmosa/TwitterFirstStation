app.controller('loginCtrl', function($scope, $rootScope, $location, AuthService){
    
    $rootScope.title = 'Login Page';
    
    $scope.login = function(){
        AuthService.login($scope.MyUser).then(function(msg){
            console.log('ok');
            $location.path('/home');
        },function(errmsg){
            $scope.message = 'Invalid username/password';
        });
    };
    
    $scope.goToMoreInfo = function(){
        $location.path('/moreInfo');
    };
    $scope.Browse = function(){
        $location.path('/home');
    };
});