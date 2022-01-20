var superAdminManager = new Backbone.Marionette.Application();

superAdminManager.addRegions({
    contentRegion: '.mainContent'
});

superAdminManager.navigate = function(route, options){
    options || (options = {});
    Backbone.history.navigate(route, options);
};

superAdminManager.getCurrentRoute = function(){
    return Backbone.history.fragment;
};

superAdminManager.on('start', function(){
    
    if (Backbone.history) {
        Backbone.history.start({pushState: true});
    }
});

//Models and Collections of the application
superAdminManager.module('Entities', function (Entities, superAdminManager, Backbone, Marionette, $, _) {
        Entities.Outlet = Backbone.Model.extend({
            initialize: function(options){
                this._action = options._action;
                this.id = options._id;
            },
            url: function(){
                if(this._action == "update"){
                    console.log('update')
                    return '/v1/api/outlet/' + this.id;
                } else if(this.id) {
                    console.log(this.id)
                    return '/v1/api/outlet/' + this.id
                } else {
                    return '/v1/api/outlet'
                }
            },
            idAttribute: '_id'
        });

        Entities.OutletCollection = Backbone.Collection.extend({
            url: function(){
                console.log('OutletCollection');
                return '/v1/api/outlet'
            },
            model: Entities.Outlet
        });


        var API = {
            getOutlets: function(){
                console.log('getOutlets API')
                var outlet = new Entities.OutletCollection([],{});
                var defer = $.Deferred();
                outlet.fetch({
                    success: function(data){
                        defer.resolve(data);
                    }
                });
                return defer.promise();
            }
        };

         //Request Response Callbacks
         superAdminManager.reqres.setHandler('outlet:getAll', function(){
            return API.getOutlets();
        });
});

// Router
superAdminManager.module('superAdminApp', function(superAdminApp, superAdminManager, Backbone, Marionette, $, _){
    superAdminApp.Router = Marionette.AppRouter.extend({
        appRoutes: {
            'home': 'homeView',
        }
    });

    var API = {

        homeView: function(){
            console.log('home');
            superAdminManager.superAdminApp.entityController.controller.showHome();
        }
    };

    superAdminManager.addInitializer(function(){
        new superAdminApp.Router({ controller: API });
    });
});

//Controller
superAdminManager.module('superAdminApp.entityController', function (entityController, superAdminManager, Backbone, Marionette, $, _) {
    entityController.controller = {

        showHome: function(){
            
            console.log('home controller');
            var fetchingOutlets = superAdminManager.request('outlet:getAll');
            $.when(fetchingOutlets).done(function(outlets){
              var outletsView = new superAdminManager.superAdminApp.EntityViews.outletsView({
                    collection: outlets
                });
                console.log(outlets);
                outletsView.on('show', function(){
                    $('.primaryLink.home').addClass('active');
                    $('.pageTitle').text('Home')
                });
                superAdminManager.contentRegion.show(outletsView);
            });
        },
    }
});


// Views
superAdminManager.module('superAdminApp.EntityViews', function (EntityViews, superAdminManager, Backbone, Marionette, $, _) {

    EntityViews.eachOutletView = Marionette.ItemView.extend({
        tagName: 'a',
        className: 'eachItem',
        template: 'eachOutletTemplate',
        initialize: function(){
            console.log('model', this.model)
        }
    });

     EntityViews.emptyView = Marionette.ItemView.extend({
        tagName: 'div',
        className: 'emptyItems',
        template: 'emptyTemplate'
    });

    EntityViews.outletsView = Marionette.CollectionView.extend({
        className: 'allOutlets contentArea',
        childView: EntityViews.eachOutletView,
        emptyView: EntityViews.emptyView
    });

   
});