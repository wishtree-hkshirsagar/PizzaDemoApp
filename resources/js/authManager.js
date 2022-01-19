var authenticationManager = new Backbone.Marionette.Application();

authenticationManager.addRegions({
    contentRegion: '.mainContent'
});

authenticationManager.navigate = function(route, options){
    options || (options = {});
    Backbone.history.navigate(route, options);
};

authenticationManager.getCurrentRoute = function(){
    return Backbone.history.fragment;
};

authenticationManager.on('start', function(){

    if (Backbone.history) {
        Backbone.history.start({pushState: true});
    }

    $('.home').click(function(ev){
        console.log('home');
        ev.preventDefault();
        authenticationManager.vent.trigger('home:page');
    });

    $('.login').click(function(ev){
        console.log('login');
        ev.preventDefault();
        authenticationManager.vent.trigger('login:page');
    });

    $('.signup').click(function(ev){
        console.log('signup');
        ev.preventDefault();
        authenticationManager.vent.trigger('signup:page');
    });

    $('.resetPassword').click(function(ev){
        console.log('forgot');
        ev.preventDefault();
        authenticationManager.vent.trigger('forgot:page');
    });

});

// Router
authenticationManager.module('authenticationApp', function(authenticationApp, authenticationManager, backbone, marionette, $, _){
    authenticationApp.Router = marionette.AppRouter.extend({
        appRoutes: {
            '': 'homeView',
            'login': 'loginView',
            'register': 'registerView',
            'forgotPassword': 'forgotPasswordView'
        }
    });

    var API = {

        homeView: function(){
            console.log('home');
            authenticationManager.authenticationApp.entityController.controller.showHome();
        },
        loginView: function(){
            console.log('login');
            authenticationManager.authenticationApp.entityController.controller.showLogin();
        },
        registerView: function(){
            console.log('register');
            authenticationManager.authenticationApp.entityController.controller.showRegister();
        },
        forgotPasswordView: function(){
            console.log('forgot password');
            authenticationManager.authenticationApp.entityController.controller.showForgotPassword();
        }
    };

    authenticationManager.vent.on('home:page', function(){
        authenticationManager.navigate('/');
        API.homeView();
    });

    authenticationManager.vent.on('login:page', function(){
        authenticationManager.navigate('login');
        API.loginView();
    });

    authenticationManager.vent.on('signup:page', function(){
        authenticationManager.navigate('register');
        API.registerView();
    });

    authenticationManager.vent.on('forgot:page', function(){
        authenticationManager.navigate('forgotPassword');
        API.forgotPasswordView();
    });

    authenticationManager.addInitializer(function(){
        new authenticationApp.Router({ controller: API });
    });
});

// Controllers
authenticationManager.module('authenticationApp.entityController', function (entityController, authenticationManager, backbone, marionette, $, _) {
    entityController.controller = {

        showHome: function(){
            $('.mainContent').hide();
            $('.header').show();
            $('link[rel=stylesheet][href~="/css/auth.css"]').remove();
            let stylesheet = $('<link>', {
                rel: 'stylesheet',
                type: 'text/css',
                href: '/css/index.css'
            });
            stylesheet.appendTo('head');
        },

        showLogin: function() {
            $('.header').hide();
            $('.mainContent').show();
            $('link[rel=stylesheet][href~="/css/index.css"]').remove();
            let stylesheet = $('<link>', {
                rel: 'stylesheet',
                type: 'text/css',
                href: '/css/auth.css'
            });
            stylesheet.appendTo('head');
            console.log('login controller');
            var loginView = new authenticationManager.authenticationApp.entityViews.loginView();
            loginView.on('show', function(){

                $('.signup').click(function(ev){
                    console.log('signup');
                    ev.preventDefault();
                    authenticationManager.vent.trigger('signup:page');
                });

                $('.home').click(function(ev){
                    console.log('home');
                    ev.preventDefault();
                    authenticationManager.vent.trigger('home:page');
                });

                $('.resetPassword').click(function(ev){
                    console.log('forgot');
                    ev.preventDefault();
                    authenticationManager.vent.trigger('forgot:page');
                });
                
                loginView.$('#togglePassword').on('click', function(){
                    const type = $('.inputPassword').attr('type') === 'password' ? 'text' : 'password';
                    loginView.$('.inputPassword').attr('type', type);
                    if(type == 'password'){
                        loginView.$('.passwordIcon').css({'background-image': 'url(/icons/hidden.png)'});
                    } else if(type == 'text'){
                        loginView.$('.passwordIcon').css({'background-image': 'url(/icons/view.png)'})
                    }
                });
                
                loginView.$('.inputEmail').on('focus', function(){
                    loginView.$('.inputFieldEmail').addClass('focus');
                    loginView.$('.inputFieldEmail').removeClass('error');
                    loginView.$('.emailError .formError').text('');
                });

                loginView.$('.inputEmail').on('blur', function(){
                    loginView.$('.inputFieldEmail').removeClass('focus');
                });

                loginView.$('.inputPassword').on('focus', function(){
                    loginView.$('.inputFieldPassword').addClass('focus');
                    loginView.$('.inputFieldPassword').removeClass('error');
                    loginView.$('.passwordError .formError').text('');
                });
                
                loginView.$('.inputPassword').on('blur', function(){
                    loginView.$('.inputFieldPassword').removeClass('focus');
                });

            });

            authenticationManager.contentRegion.show(loginView);
        },

        showRegister: function() {
            $('.header').hide();
            $('.mainContent').show();
            $('link[rel=stylesheet][href~="/css/index.css"]').remove();
            let stylesheet = $('<link>', {
                rel: 'stylesheet',
                type: 'text/css',
                href: '/css/auth.css'
            });
            stylesheet.appendTo('head');
            console.log('register controller');
            var registerView = new authenticationManager.authenticationApp.entityViews.registerView();
            registerView.on('show', function(){

                $('.login').click(function(ev){
                    console.log('login');
                    ev.preventDefault();
                    authenticationManager.vent.trigger('login:page');
                });

                $('.home').click(function(ev){
                    console.log('home');
                    ev.preventDefault();
                    authenticationManager.vent.trigger('home:page');
                });

                registerView.$('#togglePassword').on('click', function(){
                    const type = $('.inputPassword').attr('type') === 'password' ? 'text' : 'password';
                    registerView.$('.inputPassword').attr('type', type);
                    if(type == 'password'){
                        registerView.$('.passwordIcon').css({'background-image': 'url(/icons/hidden.png)'});
                    } else if(type == 'text'){
                        registerView.$('.passwordIcon').css({'background-image': 'url(/icons/view.png)'})
                    }
                });

                registerView.$('.inputName').on('focus', function(){
                    registerView.$('.inputFieldName').addClass('focus');
                    registerView.$('.inputFieldName').removeClass('error');
                    registerView.$('.nameError .formError').text('');
                });

                registerView.$('.inputName').on('blur', function(){
                    registerView.$('.inputFieldName').removeClass('focus');
                });

                registerView.$('.inputEmail').on('focus', function(){
                    registerView.$('.inputFieldEmail').addClass('focus');
                    registerView.$('.inputFieldEmail').removeClass('error');
                    registerView.$('.emailError .formError').text('');
                });

                registerView.$('.inputEmail').on('blur', function(){
                    registerView.$('.inputFieldEmail').removeClass('focus');
                });

                registerView.$('.inputContact').on('focus', function(){
                    registerView.$('.inputFieldContact').addClass('focus');
                    registerView.$('.inputFieldContact').removeClass('error');
                    registerView.$('.contactError .formError').text('');
                });

                registerView.$('.inputContact').on('blur', function(){
                    registerView.$('.inputFieldContact').removeClass('focus');
                });

                registerView.$('.inputPassword').on('focus', function(){
                    registerView.$('.inputFieldPassword').addClass('focus');
                    registerView.$('.inputFieldPassword').removeClass('error');
                    registerView.$('.passwordError .formError').text('');
                });

                registerView.$('.inputPassword').on('blur', function(){
                    registerView.$('.inputFieldPassword').removeClass('focus');
                });

                registerView.$('.inputConfirmPassword').on('focus', function(){
                    registerView.$('.inputFieldConfirmPassword').addClass('focus');
                    registerView.$('.inputFieldConfirmPassword').removeClass('error');
                    registerView.$('.confirmPasswordError .formError').text('');
                });

                registerView.$('.inputConfirmPassword').on('blur', function(){
                    registerView.$('.inputFieldConfirmPassword').removeClass('focus');
                });
            });
            authenticationManager.contentRegion.show(registerView);
        },
        showForgotPassword: function(){
            console.log('forgot password controller');
            var forgotPasswordView = new authenticationManager.authenticationApp.entityViews.forgotPasswordView();
            forgotPasswordView.on('show', function(){

                $('.login').click(function(ev){
                    console.log('login');
                    ev.preventDefault();
                    authenticationManager.vent.trigger('login:page');
                });

                $('.home').click(function(ev){
                    console.log('home');
                    ev.preventDefault();
                    authenticationManager.vent.trigger('home:page');
                });

                forgotPasswordView.$('#togglePassword').on('click', function(){
                    const type = $('.inputPassword').attr('type') === 'password' ? 'text' : 'password';
                    forgotPasswordView.$('.inputPassword').attr('type', type);
                    if(type == 'password'){
                        forgotPasswordView.$('.passwordIcon').css({'background-image': 'url(/icons/hidden.png)'});
                    } else if(type == 'text'){
                        forgotPasswordView.$('.passwordIcon').css({'background-image': 'url(/icons/view.png)'})
                    }
                });

                forgotPasswordView.$('.inputEmail').on('focus', function(){
                    forgotPasswordView.$('.inputFieldEmail').addClass('focus');
                    forgotPasswordView.$('.inputFieldEmail').removeClass('error');
                    forgotPasswordView.$('.emailError .formError').text('');
                });

                forgotPasswordView.$('.inputEmail').on('blur', function(){
                    forgotPasswordView.$('.inputFieldEmail').removeClass('focus');
                });

                forgotPasswordView.$('.inputOtp').on('focus', function(){
                    forgotPasswordView.$('.inputFieldOtp').addClass('focus');
                    forgotPasswordView.$('.inputFieldOtp').removeClass('error');
                    forgotPasswordView.$('.otpError .formError').text('');
                });

                forgotPasswordView.$('.inputOtp').on('blur', function(){
                    forgotPasswordView.$('.inputFieldOtp').removeClass('focus');
                });

                forgotPasswordView.$('.inputPassword').on('focus', function(){
                    forgotPasswordView.$('.inputFieldPassword').addClass('focus');
                    forgotPasswordView.$('.inputFieldPassword').removeClass('error');
                    forgotPasswordView.$('.passwordError .formError').text('');
                });

                forgotPasswordView.$('.inputPassword').on('blur', function(){
                    forgotPasswordView.$('.inputFieldPassword').removeClass('focus');
                });

                forgotPasswordView.$('.inputConfirmPassword').on('focus', function(){
                    forgotPasswordView.$('.inputFieldConfirmPassword').addClass('focus');
                    forgotPasswordView.$('.inputFieldConfirmPassword').removeClass('error');
                    forgotPasswordView.$('.confirmPasswordError .formError').text('');
                });

                forgotPasswordView.$('.inputConfirmPassword').on('blur', function(){
                    forgotPasswordView.$('.inputFieldConfirmPassword').removeClass('focus');
                });
                let email = null;
                forgotPasswordView.$('.btnForgot').on('click', function(ev) {
                    console.log('btnForgot');
                    ev.preventDefault();
                    if(!$('.inputEmail').val()){
                        $('.inputFieldEmail').addClass('error');
                        $('.emailError .formError').text('Please enter an email address').css({'margin-left': '-135px'});
                        return;
                    }

                    let emailRegex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                    email = $('.inputEmail').val();
                    if(!emailRegex.test(email)){
                        $('.inputFieldEmail').addClass('error');
                        $('.emailError .formError').text('Please enter a valid email address').css({'margin-left': '-105px'});
                        return;
                    }

                    let value = {
                        email: $('.inputEmail').val()
                    }

                    $.ajax({
                        url: '/v1/api/sendEmail',
                        type: 'POST',
                        contentType: 'application/json',
                        dataType: 'json',
                        data: JSON.stringify(value),
                        success: function(){
                            swal({
                                title: "Success!",
                                text: `Otp has been sent to ${$('.inputEmail').val()}`,
                                type: "success",
                                icon: "success"
                             });
                           $('.otpForm').addClass('hide');
                           $('.resetForm').removeClass('hide');
                        }, 
                        error: function(response){
                            console.log(response)
                            $('.inputFieldEmail').addClass('error');
                            $('.inputFieldPassword').addClass('error');
        
                            swal({
                                title: "Error!",
                                text: response.responseJSON.message,
                                type: "error",
                                icon: "error"
                             });
                            
                        }
                    })
                });

                forgotPasswordView.$('.btnReset').on('click', function(ev) {
                    ev.preventDefault();
            
                    if(!$('.inputOtp').val() && !$('.inputPassword').val() && !$('.inputConfirmPassword').val()){
                        
                        $('.inputFieldOtp').addClass('error');
                        $('.otpError .formError').text('Please enter otp').css({'margin-left': '-186px'});
                        $('.inputFieldPassword').addClass('error');
                        $('.passwordError .formError').text('Please enter a password').css({'margin-left': '-175px'});
                        $('.inputFieldConfirmPassword').addClass('error');
                        $('.confirmPasswordError .formError').text('Confirm password can not be empty').css({'margin-left': '-85px'});
                        return;
                    }

                    if(!$('.inputOtp').val()){
                        
                        $('.inputFieldOtp').addClass('error');
                        $('.otpError .formError').text('Please enter otp').css({'margin-left': '-186px'});
                        return;
                    }

                    let otpRegex = /^([0-9]{4})+$/;
                    let otp = $('.inputOtp').val();
                    if(!otpRegex.test(otp)){
                        $('.otpError .formError').text('OTP must be of 4 digits:').show();
                        $('.inputFieldOtp').addClass('error');
                        return;
                    }

                    if(!$('.inputPassword').val()){
                        $('.inputFieldPassword').addClass('error');
                        $('.passwordError .formError').text('Please enter a password').css({'margin-left': '-175px'});
                        return;
                    }
                    
                    if(!$('.inputConfirmPassword').val()){
                        $('.inputFieldConfirmPassword').addClass('error');
                        $('.confirmPasswordError .formError').text('Confirm password can not be empty').css({'margin-left': '-85px'});
                        return;
                    }

                    let confirmPassword = $('.inputConfirmPassword').val();
                    let password = $('.inputPassword').val();
                    if(confirmPassword != password){
                        $('.inputFieldConfirmPassword').addClass('error');
                        $('.confirmPasswordError .formError').text('Password and Confirm Password do not match');
                        return;
                    }

                    let value = {
                        email: email,
                        otp: $('.inputOtp').val(),
                        password: $('.inputPassword').val()
                    }

                    $.ajax({
                        url: '/v1/api/updatePassword',
                        type: 'POST',
                        contentType: 'application/json',
                        dataType: 'json',
                        data: JSON.stringify(value),
                        success: function(){
                            swal({
                                title: "Success!",
                                text: "Password has been updated successfully",
                                type: "success",
                                icon: "success"
                             });
                        }, 
                        error: function(response){
                            console.log(response)
                            $('.inputFieldEmail').addClass('error');
                            $('.inputFieldPassword').addClass('error');
        
                            swal({
                                title: "Error!",
                                text: response.responseJSON.message,
                                type: "error",
                                icon: "error"
                             });
                            
                        }
                    })


                });
            });

            
            authenticationManager.contentRegion.show(forgotPasswordView);
        }
    };
});

// Views
authenticationManager.module('authenticationApp.entityViews', function (entityViews, authenticationManager, backbone, marionette, $, _) {

    entityViews.loginView = marionette.ItemView.extend({
        template: 'loginTemplate',
        events: {
            'click .btnLogin': 'submit'
        },
        submit: function(ev) {
            ev.preventDefault();

            if(!this.$('.inputEmail').val() && !this.$('.inputPassword').val()){
                this.$('.inputFieldEmail').addClass('error');
                this.$('.emailError .formError').text('Please enter an email address').css({'margin-left': '-135px'});
                this.$('.inputFieldPassword').addClass('error');
                this.$('.passwordError .formError').text('Please enter a password').css({'margin-left': '-180px'});
                return;
            }
            if(!this.$('.inputEmail').val()){
                this.$('.inputFieldEmail').addClass('error');
                this.$('.emailError .formError').text('Please enter an email address').css({'margin-left': '-135px'});
                return;
            }
            if(!this.$('.inputPassword').val()){
                this.$('.inputFieldPassword').addClass('error');
                this.$('.passwordError .formError').text('Please enter a password').css({'margin-left': '-180px'});
                return;
            }


            if(this.$('.inputPassword').val().length < 8){
                this.$('.inputFieldPassword').addClass('error');
                this.$('.passwordError .formError').text('Password should be of minimum eight characters long').css({'margin-left': '58px'});
                return;
            }

            let emailRegex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            let email = this.$('.inputEmail').val();
            if(!emailRegex.test(email)){
                this.$('.inputFieldEmail').addClass('error');
                this.$('.emailError .formError').text('Please enter a valid email address').css({'margin-left': '-105px'});
                return;
            }
            let value = {
                email: this.$('.inputEmail').val(),
                password: this.$('.inputPassword').val()
            }

            $.ajax({
                url: '/v1/api/login',
                type: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify(value),
                success: function(){
                    swal({
                        title: "Success!",
                        text: 'Logged in successfully',
                        type: "success",
                        icon: "success",
                        timer: 2000,
                        buttons: false
                     });
                     setTimeout(() => {
                        location.assign('/');
                     },2000)
                   
                }, 
                error: function(response){
                   
                    $('.inputFieldEmail').addClass('error');
                    $('.inputFieldPassword').addClass('error');

                    swal({
                        title: "Error!",
                        text: response.responseJSON.error,
                        type: "error",
                        icon: "error"
                     });
                    
                }
            })
        }
    });

    entityViews.registerView = marionette.ItemView.extend({
        template: 'registerTemplate',
        events: {
            'click .btnRegister': 'submit'
        },
        submit: function(ev){
            console.log('submit');
            ev.preventDefault();

            if(!this.$('.inputName').val() && !this.$('.inputEmail').val() && !this.$('.inputContact').val() && !this.$('.inputPassword').val() && !this.$('.inputConfirmPassword').val()){
                this.$('.inputFieldName').addClass('error');
                this.$('.nameError .formError').text('Please enter your name').css({'margin-left': '-185px'});
                this.$('.inputFieldEmail').addClass('error');
                this.$('.emailError .formError').text('Please enter an email address').css({'margin-left': '-135px'});
                this.$('.inputFieldContact').addClass('error');
                this.$('.contactError .formError').text('Please enter your contact number').css({'margin-left': '-105px'});
                this.$('.inputFieldPassword').addClass('error');
                this.$('.passwordError .formError').text('Please enter a password').css({'margin-left': '-175px'});
                this.$('.inputFieldConfirmPassword').addClass('error');
                this.$('.confirmPasswordError .formError').text('Confirm password can not be empty').css({'margin-left': '-85px'});
                return;
            }

            if(!this.$('.inputName').val()){
                this.$('.inputFieldName').addClass('error');
                this.$('.nameError .formError').text('Please enter your name').css({'margin-left': '-185px'});
                return;
            }

            if(!this.$('.inputEmail').val()){
                this.$('.inputFieldEmail').addClass('error');
                this.$('.emailError .formError').text('Please enter an email address').css({'margin-left': '-135px'});
                return;
            }

            if(!this.$('.inputContact').val()){
                this.$('.inputFieldContact').addClass('error');
                this.$('.contactError .formError').text('Please enter your contact number').css({'margin-left': '-105px'});
                return;
            }

            if(!this.$('.inputPassword').val()){
                this.$('.inputFieldPassword').addClass('error');
                this.$('.passwordError .formError').text('Please enter a password').css({'margin-left': '-175px'});
                return;
            }

            if(!this.$('.inputConfirmPassword').val()){
                this.$('.inputFieldConfirmPassword').addClass('error');
                this.$('.confirmPasswordError .formError').text('Confirm password can not be empty').css({'margin-left': '-85px'});
                return;
            }

            if(this.$('.inputPassword').val().length < 8){
                this.$('.inputFieldPassword').addClass('error');
                this.$('.passwordError .formError').text('Password should be of minimum eight characters long').css({'margin-left': '58px'});
                return;
            }

            let emailRegex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            let email = this.$('.inputEmail').val();
            if(!emailRegex.test(email)){
                this.$('.inputFieldEmail').addClass('error');
                this.$('.emailError .formError').text('Please enter a valid email address').css({'margin-left': '-105px'});
                return;
            }

            let contactNumberRegex = /^[7-9]{1}[0-9]{9}$/;
            let contact = this.$('.inputContact').val();
            if(!contactNumberRegex.test(contact)){
                this.$('.inputFieldContact').addClass('error');
                this.$('.contactError .formError').text('Please enter a valid contact number').css({'margin-left': '-82px'});
                return;
            }

            let confirmPassword = this.$('.inputConfirmPassword').val();
            let password = this.$('.inputPassword').val();
            if(confirmPassword != password){
                this.$('.inputFieldConfirmPassword').addClass('error');
                this.$('.confirmPasswordError .formError').text('Password and Confirm Password do not match');
                return;
            }

            let value = {
                name: this.$('.inputName').val(),
                email: this.$('.inputEmail').val(),
                contact: this.$('.inputContact').val(),
                password: this.$('.inputPassword').val()
            }

            $.ajax({
                url: '/v1/api/register',
                type: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify(value),
                success: function(){
                    swal({
                        title: "Success!",
                        text: 'Registration successful',
                        type: "success",
                        icon: "success",
                        timer: 2000,
                        buttons: false
                     });
                     setTimeout(() => {
                        location.assign('/login');
                     },2000)
                    
                },
                error: function(response){
                    swal({
                        title: "Error!",
                        text: response.responseJSON.error,
                        type: "error",
                        icon: "error"
                     });
                }
            })
        }
    });

    entityViews.forgotPasswordView = marionette.ItemView.extend({
        template: 'forgotPasswordTemplate',
        events: {}
    });
});