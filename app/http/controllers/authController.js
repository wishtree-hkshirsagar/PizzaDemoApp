const User = require('../../models/user').User;
const bcrypt = require('bcrypt');
const passport = require('passport');

function authController() {
    return {
        login(req, res, next) {
            passport.authenticate('local', (error, user, info) => {
                console.log('passport.authenticate')
                if(error){
                    console.log('****error*****');
                    res.json({
                        error: info.message
                    });
                    return next(error);
                }

                if(!user){
                    console.log('****Invalid credentials*****');
                    // res.redirect('/login');
                   return res.status(401).json({
                        error: info.message
                    });
                    // return res.redirect('/login');
                }

                req.logIn(user, (error) => {
                    if(error){
                        res.json({
                            error: info.message
                        });
                        return next(error)
                    }
                    console.log('user', user);
                //    return res.redirect('/')
                    return res.status(200).json({
                        success: 'Logged in successfully'
                    })
                })
            })(req, res, next)
        },
        async register(req, res) {
            const { name, email, contact, password } = req.body;
            console.log(req.body);

            if(!name || !email || !contact || !password) {
                console.log('error, require all fields');
                return res.status(400).json({
                    error: 'All fields are required'
                });
            }

            User.exists({email: email}, (err, result) => {
                if(result) {
                    console.log('***if***');
                    return res.status(409).json({
                        error: 'Email ID already exists'
                    });
                }
            });

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = new User({
                name: name,
                email: email,
                contact: contact,
                password: hashedPassword
            });

            user.save().then((user) => {
                // return res.redirect('/');
               return res.status(200).json({
                    success: 'User registered successfully'
                })
            }).catch((err) => {
              return res.status(500).json({
                    error: 'Something went wrong'
                })
            });


            // res.status(200).json(req.body);
        }
    }
}

module.exports = authController;