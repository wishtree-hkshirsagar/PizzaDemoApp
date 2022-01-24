var adminManager = new Backbone.Marionette.Application();

adminManager.addRegions({
    contentRegion: '.mainContent'
});

adminManager.navigate = function(route, options){
    options || (options = {});
    Backbone.history.navigate(route, options);
};

adminManager.getCurrentRoute = function(){
    return Backbone.history.fragment;
};

adminManager.on('start', function(){
    
    if (Backbone.history) {
        Backbone.history.start({pushState: true});
    }

    $('.home').click(function(ev){
        ev.preventDefault();
        adminManager.vent.trigger('home:page')
    })

    $('.pizza').click(function(ev){
        console.log('pizzas');
        ev.preventDefault();
        adminManager.vent.trigger('pizza:getAll')
    })
    
});

adminManager.module('Entities', function (Entities, adminManager, Backbone, Marionette, $, _) {
    
    Entities.Pizza = Backbone.Model.extend({
        initialize: function(options){
            this._action = options._action;
            this._id = options._id;
        },
        url: function(){
            if(this._action == "update"){
                console.log('update')
                return '/v1/api/pizza/' + this._id;
            } else if(this._id) {
                console.log(this._id)
                return '/v1/api/pizza/' + this._id
            } else {
                return '/v1/api/pizza'
            }
        },
        idAttribute: '_id'
    });


    Entities.PizzaCollection = Backbone.Collection.extend({
        url: function(){
            console.log('PizzaCollection');
            return '/v1/api/pizza'
        },
        model: Entities.Pizza
    });

    var API = {

        getAllPizzas: function(){
            var pizzas = new Entities.PizzaCollection([],{});
            var defer = $.Deferred();
            pizzas.fetch({
                success: function(data){
                    defer.resolve(data);
                }
            });
            return defer.promise();
        }
    }


      //Request Response Callbacks
      adminManager.reqres.setHandler('pizza:getAll', function(){
        return API.getAllPizzas();
    });
});

// Router
adminManager.module('adminApp', function(adminApp, adminManager, Backbone, Marionette, $, _){

    adminManager.Router = Marionette.AppRouter.extend({
        appRoutes: {
            'home': 'homeView',
            'pizzas': 'pizzasView',
            'add/pizza': 'addNewPizzaView',
        }
    });

    var API = {
        homeView: function(){
            console.log('home view');
            adminManager.adminApp.entityController.controller.showHome();
        },
        pizzasView: function(){
            adminManager.adminApp.entityController.controller.showPizzas();
        },
        addNewPizzaView: function(){
            adminManager.adminApp.entityController.controller.showNewPizza();
        },
    };

    adminManager.vent.on('home:page', function(){
        adminManager.navigate('/home');
        API.homeView();
    });

    adminManager.vent.on('pizza:getAll', function(){
        adminManager.navigate('/pizzas');
        API.pizzasView();
    });

    adminManager.vent.on('newPizzaPage:show', function(){
        adminManager.navigate('/add/pizza');
        API.addNewPizzaView();
    });

    adminManager.addInitializer(function(){
        new adminManager.Router({ controller: API });
    });
});

//Controller
adminManager.module('adminApp.entityController', function (entityController, adminManager, Backbone, Marionette, $, _) {

    entityController.controller = {

        showHome: function(){
            console.log('showHome');
            var fetchingPizzas = adminManager.request('pizza:getAll');
            $.when(fetchingPizzas).done(function(pizzas){
              var pizzasView = new adminManager.adminApp.EntityViews.pizzasView({
                    collection: pizzas
                });
                console.log(pizzas);
                pizzasView.on('show', function(){
                    $('.primaryLink').removeClass('active');
                    $('.primaryLink.home').addClass('active');
                    $('.add').addClass('hide');
                    $('.pageTitle').text('Pizzas');
                });

                adminManager.contentRegion.show(pizzasView);
            });
        },

        showPizzas: function(){

            var fetchingPizzas = adminManager.request('pizza:getAll');
            $.when(fetchingPizzas).done(function(pizzas){
              var pizzasView = new adminManager.adminApp.EntityViews.pizzasView({
                    collection: pizzas
                });
                pizzasView.on('show', function(){
                    $('.primaryLink').removeClass('active');
                    $('.primaryLink.pizza').addClass('active');
                    $('.add').removeClass('hide');
                    $('.add').addClass('addPizza');
                    $('.pageTitle').text('Pizzas');
                    $('.addPizza').click(function(ev){
                        ev.preventDefault();
                        adminManager.vent.trigger('newPizzaPage:show');
                    });
                });

                adminManager.contentRegion.show(pizzasView);
            });
        },
        showNewPizza: function(){
            var newPizzaView = new adminManager.adminApp.EntityViews.newPizzaView();

            newPizzaView.on('show', function(){
                $('.primaryLink').removeClass('active');
                $('.primaryLink.pizza').addClass('active');
                $('.pageTitle').text('Add New Pizza');

                newPizzaView.$('.savePizza').addClass('disableBtn');

                newPizzaView.$('.inputName').on('focus', function(){
                    newPizzaView.$('.inputFieldName').addClass('focus');
                    newPizzaView.$('.inputFieldName').removeClass('error');
                    newPizzaView.$('.nameError .formError').text('');
                });

                newPizzaView.$('.inputName').on('blur', function(){
                    newPizzaView.$('.inputFieldName').removeClass('focus');
                });

                newPizzaView.$('.inputSize').on('focus', function(){
                    newPizzaView.$('.inputFieldSize').addClass('focus');
                    newPizzaView.$('.inputFieldSize').removeClass('error');
                    newPizzaView.$('.sizeError .formError').text('');
                });

                newPizzaView.$('.inputSize').on('blur', function(){
                    newPizzaView.$('.inputFieldSize').removeClass('focus');
                });

                newPizzaView.$("#uploadFile").on('change',function(e) {
                   
                    e.preventDefault();
                    var data = new FormData($('#uploadForm')[0]);
                    $.ajax({
                        url:'/v1/api/upload',
                        type: 'POST',
                        contentType: false,
                        processData: false,
                        cache: false,
                        data: data,
                        success: function(response){
                            newPizzaView.$('.savePizza').removeClass('disableBtn');
                            swal({
                                title: "Success!",
                                text: response.message,
                                type: "success",
                                icon: "success"
                             });
                        },
                        error: function (response) {
                            swal({
                                title: "Error!",
                                text: response.responseJSON.message,
                                type: "error",
                                icon: "error"
                             });
                        }
                    });
                });
            });

           

            newPizzaView.on('save:pizza', function(value){
                console.log(value);
                $.ajax({
                    url:'/v1/api/pizza',
                    type: 'POST',
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify(value),
                    success: function(response){

                        swal({
                            title: "Success!",
                            text: response.message,
                            type: "success",
                            icon: "success",
                            timer: 2000,
                            buttons: false
                         });
                         setTimeout(() => {
                            location.assign('/home');
                         },2000)
                    },
                    error: function (response) {

                        swal({
                            title: "Error!",
                            text: response.responseJSON.message,
                            type: "error",
                            icon: "error"
                         });
                    }
                });

            })

            adminManager.contentRegion.show(newPizzaView);
        }
    }
});


// Views
adminManager.module('adminApp.EntityViews', function (EntityViews, adminManager, Backbone, Marionette, $, _) {

    EntityViews.newPizzaView = Marionette.ItemView.extend({
        template: 'newPizzaTemplate',
        events: {
            'click .savePizza': 'savePizza'
        },
        savePizza: function(ev){
            ev.preventDefault();
            console.log('save pizza');

            if(!this.$('.inputName').val() || !this.$('.inputSize').val() || !this.$('.inputPrice').val()){
                this.$('.inputFieldName').addClass('error');
                this.$('.nameError .formError').text('Please enter pizza name').css({'margin-left': '-182px'});
                this.$('.inputFieldSize').addClass('error');
                this.$('.sizeError .formError').text('Please select pizza size').css({'margin-left': '-192px'});
                this.$('.inputFieldPrice').addClass('error');
                this.$('.priceError .formError').text('Please enter pizza price').css({'margin-left': '-192px'});
                return;
            }

            if(!this.$('.inputName').val()){
                this.$('.inputFieldName').addClass('error');
                this.$('.nameError .formError').text('Please enter pizza name').css({'margin-left': '-182px'});
                return;
            }

            if(!this.$('.inputSize').val()){
                this.$('.inputFieldSize').addClass('error');
                this.$('.sizeError .formError').text('Please select pizza size').css({'margin-left': '-192px'});
                return;
            }

            if(!this.$('.inputPrice').val()){
                this.$('.inputFieldPrice').addClass('error');
                this.$('.priceError .formError').text('Please enter pizza price').css({'margin-left': '-192px'});
                return;
            }

            var value = {
                title: this.$('.inputName').val().trim(),
                size: this.$('.inputSize').val(),
                price: parseInt(this.$('.inputPrice').val())
            }
            console.log(value);
            this.trigger('save:pizza', value);
        }
    });

    EntityViews.eachPizzaView = Marionette.ItemView.extend({
        tagName: 'span',
        className: 'eachItem',
        template: 'eachPizzaTemplate',
        initialize: function(){}
    });

    EntityViews.emptyView = Marionette.ItemView.extend({
        tagName: 'div',
        className: 'emptyItems',
        template: 'emptyTemplate'
    });


    EntityViews.pizzasView = Marionette.CollectionView.extend({
        className: 'allPizzas contentArea',
        childView: EntityViews.eachPizzaView,
        emptyView: EntityViews.emptyView
    });
});
