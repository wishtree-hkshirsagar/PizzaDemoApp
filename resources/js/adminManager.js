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
            this.id = options.id;
        },
        url: function(){
           if(this.id) {
                return '/v1/api/pizza/' + this.id
            } else {
                return '/v1/api/pizza'
            }
        },
        idAttribute: 'id'
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
        },

        getPizza: function(uniqueId){
            var pizza = new Entities.Pizza({
                id: uniqueId
            }); 
            var defer = $.Deferred();
            pizza.fetch({
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

     adminManager.reqres.setHandler('pizza:entity', function(uniqueId){
        return API.getPizza(uniqueId);
     });
});

// Router
adminManager.module('adminApp', function(adminApp, adminManager, Backbone, Marionette, $, _){

    adminManager.Router = Marionette.AppRouter.extend({
        appRoutes: {
            'home': 'homeView',
            'pizzas': 'pizzasView',
            'add/pizza': 'addNewPizzaView',
            'edit/pizza/:id': 'editPizzaView',
            'detail/pizza/:id': 'detailPizzaView'
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
        editPizzaView: function(uniqueId){
            adminManager.adminApp.entityController.controller.showEditPizza(uniqueId);
        },
        detailPizzaView: function(uniqueId){
            adminManager.adminApp.entityController.controller.showDetailPizza(uniqueId);
        }
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

    adminManager.vent.on('edit:pizza', function(uniqueId){
        adminManager.navigate('/edit/pizza/' + uniqueId);
        API.editPizzaView(uniqueId);
    })

    adminManager.vent.on('show:detailPizza', function(uniqueId){
        adminManager.navigate('/detail/pizza/' + uniqueId);
        API.detailPizzaView(uniqueId);
    })

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
                    $('.showDetailPizza').removeClass('hide');
                    $('.primaryLink').removeClass('active');
                    $('.primaryLink.home').addClass('active');
                    $('.add').addClass('hide');
                    $('.pageTitle').text('Home');
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
                    $('.editPizza').removeClass('hide');
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

                newPizzaView.$('.inputPrice').on('focus', function(){
                    newPizzaView.$('.inputFieldPrice').addClass('focus');
                    newPizzaView.$('.inputFieldPrice').removeClass('error');
                    newPizzaView.$('.priceError .formError').text('');
                });

                newPizzaView.$('.inputPrice').on('blur', function(){
                    newPizzaView.$('.inputFieldPrice').removeClass('focus');
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
        },

        showEditPizza: function(uniqueId){
            var fetchingPizza = adminManager.request('pizza:entity', uniqueId);

            $.when(fetchingPizza).done(function(pizza){
                var editPizzaView = new adminManager.adminApp.EntityViews.editPizzaView({
                    model: pizza
                });

                editPizzaView.on('show', function(){
                    $('.primaryLink').removeClass('active');
                    $('.primaryLink.pizza').addClass('active');
                    $('.pageTitle').text('Edit Pizza');

                    editPizzaView.$('#pizzaSize').val(pizza.get('size'));

                    editPizzaView.$('.inputName').on('focus', function(){
                        editPizzaView.$('.inputFieldName').addClass('focus');
                        editPizzaView.$('.inputFieldName').removeClass('error');
                        editPizzaView.$('.nameError .formError').text('');
                    });
    
                    editPizzaView.$('.inputName').on('blur', function(){
                        editPizzaView.$('.inputFieldName').removeClass('focus');
                    });
    
                    editPizzaView.$('.inputSize').on('focus', function(){
                        editPizzaView.$('.inputFieldSize').addClass('focus');
                        editPizzaView.$('.inputFieldSize').removeClass('error');
                        editPizzaView.$('.sizeError .formError').text('');
                    });
    
                    editPizzaView.$('.inputSize').on('blur', function(){
                        editPizzaView.$('.inputFieldSize').removeClass('focus');
                    });

                    editPizzaView.$('.inputPrice').on('focus', function(){
                        editPizzaView.$('.inputFieldPrice').addClass('focus');
                        editPizzaView.$('.inputFieldPrice').removeClass('error');
                        editPizzaView.$('.priceError .formError').text('');
                    });
    
                    editPizzaView.$('.inputPrice').on('blur', function(){
                        editPizzaView.$('.inputFieldPrice').removeClass('focus');
                    });

                    editPizzaView.$("#uploadFile").on('change',function(e) {
                   
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
                })

                editPizzaView.on('edit:pizza', function(value){
                    $.ajax({
                        url:'/v1/api/pizza/' + uniqueId,
                        type: 'PUT',
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
                                text: response.message,
                                type: "error",
                                icon: "error"
                             });
                        }
                    });
                });

                editPizzaView.on('delete:pizza', function(uniqueId){
                    swal({
                        title: "Are you sure?",
                        text: "You want to delete this pizza?",
                        icon: "warning",
                        buttons: [
                          'No',
                          'Yes'
                        ],
                        dangerMode: true,
                      }).then(function(isConfirm) {
                        if (isConfirm) {
                            $.ajax({
                            url: '/v1/api/pizza/' + uniqueId,
                            type: 'DELETE',
                            success: function(){
                                swal({
                                    title: "Success!",
                                    text: 'Pizza deleted successfully!',
                                    type: "success",
                                    icon: "success",
                                    timer: 2000,
                                    buttons: false
                                });
                                setTimeout(() => {
                                    location.assign('/home');
                                },2000)
                            },
                            error: function(response){
                        
                                swal({
                                    title: "Error!",
                                    text: response.message,
                                    type: "error",
                                    icon: "error"
                                });
                            }
                         });
                        }
                      })
                })

                adminManager.contentRegion.show(editPizzaView);
            });
        },
        
        showDetailPizza: function(uniqueId){
            console.log(uniqueId);

            var fetchingPizza = adminManager.request('pizza:entity', uniqueId);

            $.when(fetchingPizza).done(function(pizza){
                var detailPizzaView = new adminManager.adminApp.EntityViews.detailPizzaView({
                    model: pizza
                });

                detailPizzaView.on('show', function(){
                    $('.primaryLink').removeClass('active');
                    $('.primaryLink.home').addClass('active');
                    $('.pageTitle').text('Pizza Details');
                })

                adminManager.contentRegion.show(detailPizzaView);
            });
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
    
    EntityViews.editPizzaView = Marionette.ItemView.extend({
        template: 'editPizzaTemplate',
        initialize: function(){},
        events: {
            'click .savePizza': 'savePizza',
            'click .deletePizza': 'deletePizza'
        },
        savePizza: function(ev){
            ev.preventDefault();

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
            this.trigger('edit:pizza', value);
            
        },
        deletePizza: function(){
    
            this.trigger('delete:pizza', this.model.get('uniqueId'));
        }
    });

    EntityViews.detailPizzaView = Marionette.ItemView.extend({
        template: 'detailPizzaTemplate'
    });

    EntityViews.eachPizzaView = Marionette.ItemView.extend({
        tagName: 'span',
        className: 'eachItem',
        template: 'eachPizzaTemplate',
        initialize: function(){
            console.log(this.model);
            this.$el.attr('data-uniqueId', this.model.get('uniqueId'));
        },
        events: {
            'click .editPizza': 'editPizza',
            'click .showDetailPizza': 'showDetailPizza'
        },
        editPizza: function(ev){
            ev.preventDefault();
            adminManager.vent.trigger('edit:pizza', this.model.get('uniqueId'));
        },
        showDetailPizza: function(ev){
            ev.preventDefault();
            adminManager.vent.trigger('show:detailPizza', this.model.get('uniqueId'));
        }
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
