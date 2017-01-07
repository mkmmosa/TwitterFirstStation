var express = require('express');
var bodyParser  = require('body-parser');
var jwt = require('jsonwebtoken');
var morgan = require('morgan');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev'));
app.use(function(req, res, next){
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','*');
    res.setHeader('Access-Control-Allow-Headers','X-Requested-With, content-type, Authorization');
    next();
});

app.use(express.static(__dirname+ "/site"));

var users = [
	{ id:1, username: 'ahmad', password: 'password' },
	{ id:2, username: 'khaled', password: 'password' }
];

var tweets= [
    {
      text: "Hello every body",
      date: "August 25, 2014 at 22:30 PM ",
      userId: 1,
      votes: 13,
      id: 1,
      votingUsers: []
    },
    {
      text: "Hiii",
      date: "August 25, 2014 at 20:00 PM",
      userId: 2,
      votes: 1,
      id: 2,
      votingUsers: []
    }
];


getToken =  function (headers) {
   if (headers && headers.authorization) {
     var parted = headers.authorization.split(' ');
     if (parted.length === 2) {
       return parted[1];
    }  else {
       return  null;
    }
  }  else {
     return  null;
  }
};


app.post('/authenticate', function(req, res){
	console.log(req.body.username);
	var user = users.find(function(user){ return (user.username === req.body.username )});

	if (!user){
		res.send({ success: false })
	} else {

		if (user.password !== req.body.password){
			res.send({ success: false })
		} else {

			var token = jwt.sign(user, 'mytopsecret')

			res.send({
				success: true,
				token: 'JWT '  + token
			})
                }
	}
});

app.get('/loginUser',function(req, res){
    
    var token = getToken(req.headers);
    console.log('Token in login user: '+ token);
    if(token){
        jwt.verify(token, 'mytopsecret', function(err, decoded){
	 	if (err){
                    res.send({username : 'null', id : 0});
			
	 	} else {
                    res.send({username : decoded.username, id : decoded.id})

	 	}
	 })
 
    }else{
        res.send({username : 'null', id : 0});
    }
});

app.get('/tweets',function(req, res){
    console.log('GET tweets request');
    res.send(tweets);
});

app.get('/users/:id',function(req, res){
    var id = req.params.id;
    var user = users.find(function(user){ return (user.id == id )});
    res.send(user);
});

app.post('/tweets', function(req, res){
    var tweet ={text:req.body.text, userId : req.body.userId, votes:req.body.votes, id:req.body.id, date: req.body.date, votingUsers:[]};
    console.log('tweet is '+ tweet);
    
    tweets.push(tweet);
});

app.post('/tweets/:id', function(req, res){
    var id = req.params.id;
    
    console.log(id);
    var token = getToken(req.headers);
    console.log('Token in voting: '+ token);
    if(token){
        jwt.verify(token, 'mytopsecret', function(err, decoded){
	 	if (err){
                    res.send({success: false, message : 'You need to login another time please!'});
			
	 	} else {
                    var userId = decoded.id;
                    tweet = tweets.find(function(tweet){return(tweet.id == id)});
                    console.log(tweet.text);
                    var result = false;  
                    for(var i = 0; i<tweet.votingUsers.length; i++){
                        if(tweet.votingUsers[i] == userId){
                            result = true;
                            break;
                        }
                    }
                    console.log(result);
                    
                    if(result === false){
                        console.log('inside');
                        for(var i=0; i<tweets.length; i++)
                            if(id == tweets[i].id)
                            {
                                tweets[i].votes = tweets[i].votes+1;
                                tweets[i].votingUsers.push(userId);
                                break;
                            }
                            res.send({success : true, message : 'Voting done.'});
                    }else{
                        res.send({success : false, message : 'You already have voted this.'});
                    }
                    
	 	}
	 });
 
    }else{
        res.send({success : false, message : 'no token'});;
    }
//    var tweet ={text:req.body.text, userId : req.body.userId, votes:req.body.votes, id:req.body.id, date: req.body.date, votingUsers:[]};
//    console.log('tweet is '+ tweet);
//    
//    tweets.push(tweet);
});

app.listen(3000, function(){
	console.log('server running on port 3000!');
});