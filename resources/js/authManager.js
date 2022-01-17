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
});

// Router
authenticationManager.module('authenticationApp', function(authenticationApp, authenticationManager, backbone, marionette, $, _){
    authenticationApp.Router = marionette.AppRouter.extend({
        appRoutes: {
            'login': 'loginView',
            'register': 'registerView',
            'forgotPassword': 'forgotPasswordView'
        }
    });

    var API = {

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
        }
    };

    authenticationManager.addInitializer(function(){
        new authenticationApp.Router({ controller: API });
    });
});

// Controllers
authenticationManager.module('authenticationApp.entityController', function (entityController, authenticationManager, backbone, marionette, $, _) {
    entityController.controller = {

        showLogin: function() {
            console.log('login controller');
            var loginView = new authenticationManager.authenticationApp.entityViews.loginView();
            loginView.on('show', function(){ 
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
            console.log('register controller');
            var registerView = new authenticationManager.authenticationApp.entityViews.registerView();
            registerView.on('show', function(){

                registerView.$('#togglePassword').on('click', function(){
                    const type = $('.inputPassword').attr('type') === 'password' ? 'text' : 'password';
                    registerView.$('.inputPassword').attr('type', type);
                    this.classList.toggle("bi-eye");
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
});