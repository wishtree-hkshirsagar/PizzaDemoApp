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
            'pizzas': 'pizzasView'
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
    };

    adminManager.vent.on('home:page', function(){
        adminManager.navigate('/home');
        API.homeView();
    });

    adminManager.vent.on('pizza:getAll', function(){
        adminManager.navigate('/pizzas');
        API.pizzasView();
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
                    $('.add').addClass('hide');
                    $('.pageTitle').text('Pizzas');
                });

                adminManager.contentRegion.show(pizzasView);
            });
        }
    }
});


// Views
adminManager.module('adminApp.EntityViews', function (EntityViews, adminManager, Backbone, Marionette, $, _) {

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
