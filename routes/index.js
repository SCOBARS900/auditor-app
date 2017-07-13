var express = require('express');
var passport = require('passport');
var router = express.Router();
var User = require('../models/user');
var Aula = require('../models/aulas');


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();
  res.redirect('/');
}

router.get('/', function(req, res) {
   res.render('login.ejs', { message: req.flash('loginMessage') }); 
});

router.post('/', passport.authenticate('local-login', {
  successRedirect: '/progresso',
  failureRedirect: '/',
  failureFlash: true,
}));


router.get('/signup', function(req, res) {
  res.render('signup.ejs', { message: req.flash('signupMessage') });
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/signup',
  failureFlash: true,
}));

router.get('/progresso', isLoggedIn, function(req, res) {
  userId = req.user._id;
  userName = req.user.local.name;
  tMaterias = [];
    
  Aula.find({ }, function(err, data) {
     if(err) {
         throw err;
     }
      
     if (data) {
        var grabingMaterias = data.map(function(mat) {
           tMaterias.push(mat.materia);
        });
         
         res.render('progresso.ejs', { tdMaterias: tMaterias, user: userName });
     } else {
         res.render('progresso.ejs');
     }
      
      
  });
    
});

router.post('/registryaulas', function(req, res) {
   userName = req.user.local.name;
   infoImp = req.body.aulaId.split('/');
   qfezFlag = false;
   
   aulaName = infoImp[0];
   aulaNumber = infoImp[1];
   
   Aula.findOne({ 'materia.name':  aulaName }, function(err, data) {
      if(err) {
          throw err;
      }
       
      if (data) {
          var findingAula = data.materia.aulas.map(function(aula) {
              var intAula = parseInt(aula.numAula);
              
              if (intAula == aulaNumber) {
                
                var findingUser = aula.quemFez.map(function(qfez) {
                   if (qfez.userName == userName) {
                       aula.quemFez.remove(qfez);
                       qfezFlag = true;
                   } 
                });
                  
                if (!qfezFlag) {
                   aula.quemFez.push({ userName });
                }     
              }
             
          });
          data.save(function(err) {
              if (err) {
                  throw err;
              }
          })
          
          
      }
       
       
   });
    
   res.redirect('/progresso');
    
});


router.post('/materias', function(req, res) {
    var splitedAulas = req.body.aula.split('/');
    
    var newAula = new Aula();
    newAula.materia.name = req.body.nDamateria;
    for (i = 0; i < splitedAulas.length; i++) {
          newAula.materia.aulas.push({ 'numAula': splitedAulas[i] });  
    }
    newAula.save(function(err) {
          if(err) {
            throw err;
          } 
     });     
    res.redirect('/progresso');
     
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});



module.exports = router;