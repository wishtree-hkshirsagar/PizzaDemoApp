const User = require('../../models/user').User;
const Otp = require('../../models/otp').Otp;
const Email = require('../../config/mail');
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
        },
       async sendEmail(req, res){
        let data = await User.findOne({email: req.body.email});
        const responseType = {};
        if(data){
            let otpcode = Math.floor((Math.random()*10000)+1);
            console.log('otpcode', otpcode)
            let otpData = new Otp({
                email: req.body.email,
                otp: otpcode,
                expireIn: new Date().getTime() + 300*1000
            });

            Email.sendOtp(req.body.email, otpcode);
            responseType.message = `Otp has been sent to the ${req.body.email}`
            otpData.save(()=> {
                res.status(200).json(responseType);
            });
        }else {
            responseType.statusText = 'Error'
            responseType.message = 'Email ID does not exist'
            res.status(404).json(responseType);
        }
    },
        async updatePassword(req, res) {
            console.log('email', req.body.email);
            console.log('otp', req.body.otp);
            let data = await Otp.findOne({email: req.body.email, otp: req.body.otp});
            console.log(data);
            const responseType = {};
            if(data){
                let currentTime = new Date().getTime();
                let diff = data.expireIn - currentTime;
                if(diff < 0){
                    responseType.status = 'Error';
                    responseType.message = 'One Time Password Expired';
                    res.status(500).json(responseType);
                }else{
                    let user = await User.findOne({email: req.body.email})
                    const hashedPassword = await bcrypt.hash(req.body.password, 10);
                    user.password = hashedPassword;
                    user.save(() => {
                       Otp.deleteOne({email: req.body.email, otp: req.body.otp}).then(() => {
                           console.log('otp deleted');
                       }).catch(() => {
                            console.log('error deleting otp');
                       })
                       
                    });
                    responseType.status = 'Success';
                    responseType.message = 'Password Changed Successfully!';
                    res.status(200).json(responseType);
                }
            }else{
                console.log('error')
                responseType.status = 'Error';
                responseType.message = 'Invalid OTP';
                res.status(404).json(responseType);
            }
        }
    }
}

module.exports = authController;