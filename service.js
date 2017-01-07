app.factory('sessionService', function(){
	return{

		set: function(key, value){
			return sessionStorage.setItem(key, value);

		},
		get: function(key){
			return sessionStorage.getItem(key);

		},
		destroy: function(key){
			return sessionStorage.remove(key);

		}

	};
})


app.service('AuthService',  function($q, $http) {
   var LOCAL_TOKEN_KEY = 'yourTokenKey';
   var isAuthenticated =false;
   var authToken;
   function loadUserCredentials() {
     var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
     if (token) {
      useCredentials(token);
    }
  }
   function storeUserCredentials(token) {
    window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
    useCredentials(token);
  }
   function useCredentials(token) {
    isAuthenticated =  true;
    authToken = token;
     // Set the token as header for your requests!
    $http.defaults.headers.common.Authorization = authToken;
  }
   function destroyUserCredentials() {
    authToken = undefined;
    isAuthenticated =  false;
    $http.defaults.headers.common.Authorization = undefined;
    window.localStorage.removeItem(LOCAL_TOKEN_KEY);
  }

   var login =  function(user) {
     return $q( function(resolve, reject) {
      $http.post('http://localhost:3000/authenticate', user). then( function(result) {
         if (result.data.success) {
            console.log(result.data.token);
          storeUserCredentials(result.data.token);
          resolve(result.data.msg);
        }  else {
          reject(result.data.msg);
        }
      });
    });
  };
   var logout =  function() {
    destroyUserCredentials();
  };
  loadUserCredentials();
   return {
    login: login,
    logout: logout,
    isAuthenticated:  function() { return isAuthenticated;}
  };
});