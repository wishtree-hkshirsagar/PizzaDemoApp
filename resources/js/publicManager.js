var publicManager = new Backbone.Marionette.Application();

var counter = 0;

publicManager.addRegions({
    contentRegion: '.mainContent'
});

publicManager.navigate = function(route, options){
    options || (options = {});
    Backbone.history.navigate(route, options);
};

publicManager.getCurrentRoute = function(){
    return Backbone.history.fragment;
};

publicManager.on('start', function(){
    
    if (Backbone.history) {
        Backbone.history.start({pushState: true});
    }
    
});

publicManager.module('Entities', function (Entities, publicManager, Backbone, Marionette, $, _) {

    Entities.Outlet = Backbone.Model.extend({
        initialize: function(options){
            this.action = options.action;
            this.id = options.id;
        },
        url: function(){
            if(this.id) {
                return '/v1/api/public/outlet/' + this.id
            } else {
                return '/v1/api/public/outlet'
            }
        },
        idAttribute: 'id'
    });

    Entities.Pizza = Backbone.Model.extend({
        initialize: function(options){
            this.id = options.id;
        },
        url: function(){
           if(this.id) {
                return '/v1/api/public/pizza/' + this.id
            } else {
                return '/v1/api/public/pizza'
            }
        },
        idAttribute: 'id'
    });

    Entities.PizzaCollection = Backbone.Collection.extend({
        initialize: function(models, options){
            this.id = options.uniqueId
        },
        url: function(){
            return '/v1/api/public/outlet/' + this.id;
        },
        model: Entities.Pizza
    });

    Entities.OutletCollection = Backbone.Collection.extend({
        initialize: function(models, options){
            this.action = options.action
        },
        url: function(){
            if(this.action === "active"){
                // console.log('OutletCollection');
                return '/v1/api/public/outlet'
            }else {
                return '/v1/api/public/outlet'
            }
        },
        model: Entities.Outlet
    });

    var API = {

        getActiveOutlets: function(action){
            // console.log('getOutlets API')
            // console.log(action);
            var outlet = new Entities.OutletCollection([],{
                action: action
            });
            var defer = $.Deferred();
            outlet.fetch({
                success: function(data){
                    defer.resolve(data);
                }
            });
            return defer.promise();
        },

        getAllPizzas: function(uniqueId){
            console.log('getAllPizzas');
            var pizzas = new Entities.PizzaCollection([],{
                uniqueId: uniqueId
            });
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
      publicManager.reqres.setHandler('outlet:getAllActive', function(action){
        return API.getActiveOutlets(action);
    });

      publicManager.reqres.setHandler('outlet:getAllPizzas', function(uniqueId){
        return API.getAllPizzas(uniqueId);
    });

    publicManager.reqres.setHandler('pizza:entity', function(uniqueId){
        return API.getPizza(uniqueId);
     });
});

// Router
publicManager.module('publicApp', function(publicApp, publicManager, Backbone, Marionette, $, _){

    publicManager.Router = Marionette.AppRouter.extend({
        appRoutes: {
            'public/outlets': 'publicOutletsView',
            'public/pizzas/:id': 'publicPizzasView',
            'public/detail/pizza/:id': 'detailPizzaView'
        }
    });

    var API = {

        publicOutletsView: function(){
            console.log('publicOutletsView');
            publicManager.publicApp.entityController.controller.publicOutletsView();
        },

        publicPizzasView: function(uniqueId){
            console.log('publicPizzasView', uniqueId);
            publicManager.publicApp.entityController.controller.publicPizzasView(uniqueId);
        },

        detailPizzaView: function(uniqueId){
            publicManager.publicApp.entityController.controller.showDetailPizza(uniqueId);
        }
    };

    publicManager.vent.on('publicOutlets:page', function(){
        publicManager.navigate('/public/outlets');
        API.publicOutletsView();
    });

    publicManager.vent.on('publicPizza:page', function(uniqueId){
        console.log(uniqueId);
        publicManager.navigate('/public/pizzas/' + uniqueId);
        API.publicPizzasView(uniqueId);
    });

    publicManager.vent.on('show:detailPizza', function(uniqueId){
        publicManager.navigate('/public/detail/pizza/' + uniqueId);
        API.detailPizzaView(uniqueId);
    })

    publicManager.addInitializer(function(){
        new publicManager.Router({ controller: API });
    });
});

//Controller
publicManager.module('publicApp.entityController', function (entityController, publicManager, Backbone, Marionette, $, _) {

    entityController.controller = {


        publicOutletsView: function(){
            console.log('public outlets view');
            var fetchingActiveOutlets = publicManager.request('outlet:getAllActive', 'active');
            $.when(fetchingActiveOutlets).done(function(outlets){
                var outletsView = new publicManager.publicApp.EntityViews.outletsView({
                      collection: outlets
                  });
                 
                  outletsView.on('show', function(){
                      $('.outletAddress').removeClass('hide');
                      $('.showOutletPizza').removeClass('hide');
                      $('.primaryLink').removeClass('active');
                      $('.primaryLink.home').addClass('active');
                      $('.add').addClass('hide');
                      $('.pageTitle').text('Active Outlets');
                  });
                  publicManager.contentRegion.show(outletsView);
              });



        },

        publicPizzasView: function(uniqueId){
            console.log(uniqueId);
            var fetchingOutletPizzas = publicManager.request('outlet:getAllPizzas', uniqueId);
            $.when(fetchingOutletPizzas).done(function(pizzas){
                var pizzasView = new publicManager.publicApp.EntityViews.pizzasView({
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
  
                  publicManager.contentRegion.show(pizzasView);
              });
        },

        showDetailPizza: function(uniqueId){

            var fetchingPizza = publicManager.request('pizza:entity', uniqueId);

            $.when(fetchingPizza).done(function(pizza){
                var detailPizzaView = new publicManager.publicApp.EntityViews.detailPizzaView({
                    model: pizza
                });

                detailPizzaView.on('show', function(){
                    $('.primaryLink').removeClass('active');
                    $('.primaryLink.home').addClass('active');
                    $('.pageTitle').text('Pizza Details');
                    $('.addToCart').removeClass('hide');
                })

                publicManager.contentRegion.show(detailPizzaView);
            });
        }
    }
});

// Views
publicManager.module('publicApp.EntityViews', function (EntityViews, publicManager, Backbone, Marionette, $, _) {


    EntityViews.detailPizzaView = Marionette.ItemView.extend({
        template: 'detailPizzaTemplate',
        initialize: function(){
            $.ajax({
                url: '/v1/api/itemCount',
                type: 'GET',
                contentType: 'application/json',
                dataType: 'json',
                success: function(response){
                    console.log(response);
                },
                error: function(response){
                    console.log(response);
                }
            });
        },
        events: {
            'click .addQty': 'addPizza',
            'click .removeQty': 'removePizza'
        },
        addPizza: function(ev){

            ev.preventDefault();
            counter = counter + 1;
            $('.cartQty').text(counter);
            console.log(this.model);
            $.ajax({
                url: '/v1/api/cart',
                type: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    uniqueId: this.model.get('uniqueId'),
                    title: this.model.get('title'),
                    size: this.model.get('size'),
                    price: this.model.get('price'),
                    image: this.model.get('image')
                }),
                success: function(response){
                    console.log(response);
                },
                error: function(response){
                    console.log(response);
                }
            });

        },
        removePizza: function(){

            if(counter > 0){
                counter = counter - 1;
                $('.cartQty').text(counter);
                $.ajax({
                    url: '/v1/api/cart',
                    type: 'PUT',
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify({
                        uniqueId: this.model.get('uniqueId')
                    }),
                    success: function(response){
                        console.log(response);
                    },
                    error: function(response){
                        console.log(response);
                    }
                })
            }
            
           
        }
    });

    EntityViews.eachPizzaView = Marionette.ItemView.extend({
        tagName: 'span',
        className: 'eachItem',
        template: 'eachPizzaTemplate',
        initialize: function(){
            console.log(this.model);
        },
        events: {
            'click .showDetailPizza': 'showDetailPizza'
        },
        showDetailPizza: function(ev){
            ev.preventDefault();
            publicManager.vent.trigger('show:detailPizza', this.model.get('uniqueId'));
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

    EntityViews.eachOutletView = Marionette.ItemView.extend({
        tagName: 'span',
        className: 'eachItem',
        template: 'eachOutletTemplate',
        initialize: function(){
            console.log(this.model);
            this.$el.attr('data-uniqueId', this.model.get('uniqueId'));
        },
        events: {
            'click .showOutletPizza': 'showOutletPizza'
        },
        showOutletPizza: function(ev){
            console.log(this.model.get('uniqueId'));
            publicManager.vent.trigger('publicPizza:page', this.model.get('uniqueId'));
        }
    });

    EntityViews.outletsView = Marionette.CollectionView.extend({
        className: 'allOutlets contentArea',
        childView: EntityViews.eachOutletView,
        emptyView: EntityViews.emptyView
    });

});