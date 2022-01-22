var superAdminManager = new Backbone.Marionette.Application();

superAdminManager.addRegions({
    contentRegion: '.mainContent',
    overlayRegion: '.overlayContent'
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

    $('.home').click(function(ev){
        ev.preventDefault();
        superAdminManager.vent.trigger('home:page')
    })

    $('.outlets').click(function(ev){
        // console.log('outlets');
        ev.preventDefault();
        superAdminManager.vent.trigger('outlets:all')
    })
    
});

//Models and Collections of the application
superAdminManager.module('Entities', function (Entities, superAdminManager, Backbone, Marionette, $, _) {
        Entities.Outlet = Backbone.Model.extend({
            initialize: function(options){
                this.action = options.action;
                this.id = options.id;
            },
            url: function(){
                if(this._action == "update"){
                    // console.log('update')
                    return '/v1/api/outlet/' + this.id;
                } else if(this.id) {
                    // console.log(this.id)
                    return '/v1/api/outlet/' + this.id
                } else {
                    return '/v1/api/outlet'
                }
            },
            idAttribute: '_id'
        });

        Entities.OutletCollection = Backbone.Collection.extend({
            initialize: function(models, options){
                // console.log(options);
                this.action = options.action
               
                return;
            },
            url: function(){
                if(this.action === "active"){
                    // console.log('OutletCollection');
                    return '/v1/api/active/outlet'
                }else {
                    return '/v1/api/outlet'
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

            getAllOutlets: function(){
                var outlet = new Entities.OutletCollection([],{});
                var defer = $.Deferred();
                outlet.fetch({
                    success: function(data){
                        defer.resolve(data);
                    }
                });
                return defer.promise();
            },

            getOutlet: function(uniqueId){
                var outlet = new Entities.Outlet({
                    id: uniqueId
                });
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
         superAdminManager.reqres.setHandler('outlet:getAllActive', function(action){
            //  console.log(action);
            return API.getActiveOutlets(action);
        });

        superAdminManager.reqres.setHandler('outlet:getAll', function(){
           return API.getAllOutlets();
       });

       superAdminManager.reqres.setHandler('outlet:entity', function(uniqueId){
          return API.getOutlet(uniqueId);
       });
       
});

// Router
superAdminManager.module('superAdminApp', function(superAdminApp, superAdminManager, Backbone, Marionette, $, _){
    superAdminApp.Router = Marionette.AppRouter.extend({
        appRoutes: {
            'home': 'homeView',
            'outlets': 'outletsView',
            'add/outlet': 'addNewOutletView',
            'edit/outlet/:id': 'editOutletView'
        }
    });

    var API = {

        homeView: function(){
            // console.log('home');
            superAdminManager.superAdminApp.entityController.controller.showHome();
        },
        outletsView: function(){
            // console.log('outlets');
            superAdminManager.superAdminApp.entityController.controller.showOutlets();
        },
        addNewOutletView: function(){
            // console.log('add new outlet');
            superAdminManager.superAdminApp.entityController.controller.showNewOutlet();
        },
        editOutletView: function(uniqueId){
            superAdminManager.superAdminApp.entityController.controller.showEditOutlet(uniqueId);
        }
    };

    superAdminManager.vent.on('home:page', function(){
        superAdminManager.navigate('/home');
        API.homeView();
    });

    superAdminManager.vent.on('outlets:all', function(){
        superAdminManager.navigate('/outlets');
        API.outletsView();
    });

    superAdminManager.vent.on('newOutletPage:show', function(){
        superAdminManager.navigate('/add/outlet');
        API.addNewOutletView();
    });

    superAdminManager.vent.on('edit:outlet', function(uniqueId){
        console.log(uniqueId);
        superAdminManager.navigate('/edit/outlet/' + uniqueId);
        API.editOutletView(uniqueId);
    });

    superAdminManager.addInitializer(function(){
        new superAdminApp.Router({ controller: API });
    });
});

//Controller
superAdminManager.module('superAdminApp.entityController', function (entityController, superAdminManager, Backbone, Marionette, $, _) {
    entityController.controller = {

        showHome: function(){
            
            var fetchingActiveOutlets = superAdminManager.request('outlet:getAllActive', 'active');
            $.when(fetchingActiveOutlets).done(function(outlets){
              var outletsView = new superAdminManager.superAdminApp.EntityViews.outletsView({
                    collection: outlets
                });
               
                outletsView.on('show', function(){
                    $('.primaryLink').removeClass('active');
                    $('.primaryLink.home').addClass('active');
                    $('.add').addClass('hide');
                    $('.pageTitle').text('Home');
                });
                superAdminManager.contentRegion.show(outletsView);
            });
        },

        showOutlets: function(){

            var fetchingOutlets = superAdminManager.request('outlet:getAll');
            $.when(fetchingOutlets).done(function(outlets){
                var outletsView = new superAdminManager.superAdminApp.EntityViews.outletsView({
                      collection: outlets
                  });
                
                  outletsView.on('show', function(){
                      $('.editOutlet').removeClass('hide');
                      $('.primaryLink').removeClass('active');
                      $('.primaryLink.outlets').addClass('active');
                      $('.pageTitle').text('Outlets');
                      $('.add').removeClass('hide');
                      $('.add').addClass('addOutlet');
                      $('.addOutlet').click(function(ev){
                      ev.preventDefault();
                      superAdminManager.vent.trigger('newOutletPage:show');
                    })
                  });
                  superAdminManager.contentRegion.show(outletsView);
              });
        },

        showNewOutlet: function(){
           
            var newOutletView = new superAdminManager.superAdminApp.EntityViews.newOutletView();
            newOutletView.on('show', function(){
                $('.primaryLink').removeClass('active');
                $('.primaryLink.outlets').addClass('active');
                $('.pageTitle').text('Add New Outlet');
            });

            newOutletView.on('save:outlet', function(value){
               
                $.ajax({
                    url: '/v1/api/outlet',
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
                     error: function(response){
                       
                         swal({
                             title: "Error!",
                             text: response.responseJSON.message,
                             type: "error",
                             icon: "error"
                          });
                     }
                });
            })
            superAdminManager.contentRegion.show(newOutletView);

            
        },
        showEditOutlet: function(uniqueId){
            
            var fetchingOutlet = superAdminManager.request('outlet:entity', uniqueId);

            $.when(fetchingOutlet).done(function(outlet){
                var editOutletView = new superAdminManager.superAdminApp.EntityViews.editOutletView({
                    model: outlet
                });

                editOutletView.on('show', function(){
                    $('.primaryLink').removeClass('active');
                    $('.primaryLink.outlets').addClass('active');
                    $('.pageTitle').text('Edit Outlet');

                    if(outlet.get('outletStatus') === false){
                        editOutletView.$('#outletStatus option[value="false"]').attr("selected", "selected");
                    } else {
                        editOutletView.$('#outletStatus option[value="true"]').attr("selected", "selected");
                    }
                });

                    editOutletView.on('edit:outlet', function(value){
                        console.log(value);

                        $.ajax({
                        url: '/v1/api/outlet/' + uniqueId,
                        type: 'PUT',
                        contentType: 'application/json',
                        dataType: 'json',
                        data: JSON.stringify(value),
                        success: function(response){
                            console.log(response);
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
                        error: function(response){
                        
                            swal({
                                title: "Error!",
                                text: response.responseJSON.message,
                                type: "error",
                                icon: "error"
                            });
                        }
                    });
                });


                editOutletView.on('delete:outlet', function(uniqueId){
                    console.log(uniqueId);
                    swal({
                        title: "Are you sure?",
                        text: "You want to delete this outlet?",
                        icon: "warning",
                        buttons: [
                          'No',
                          'Yes'
                        ],
                        dangerMode: true,
                      }).then(function(isConfirm) {
                        if (isConfirm) {
                            $.ajax({
                            url: '/v1/api/outlet/' + uniqueId,
                            type: 'DELETE',
                            success: function(){
                                swal({
                                    title: "Success!",
                                    text: 'Outlet deleted successfully!',
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
                                    text: response.responseJSON.message,
                                    type: "error",
                                    icon: "error"
                                });
                            }
                         });
                        }
                      })
                })
                superAdminManager.contentRegion.show(editOutletView);
            });
        }
    }
});


// Views
superAdminManager.module('superAdminApp.EntityViews', function (EntityViews, superAdminManager, Backbone, Marionette, $, _) {

    EntityViews.newOutletView = Marionette.ItemView.extend({
        template: 'newOutletTemplate',
        initialize: function(){
            
            $.ajax({
                url: '/v1/api/owner',
                type: 'GET',
                dataType: 'json',
                success: function(response){

                    let users = {};
                    let ownerId = [];
                    let ownerName = [];

                    response.forEach(e => {
                        ownerId.push(e._id);
                        ownerName.push(e.name)
                    })
                    
                    for (let i = 0; i < ownerId.length; i++) {
                        users[ownerId[i]] = ownerName[i];
                    }
                    
                    
                    $("#outletOwner").empty();
                    let list = $("#outletOwner");
                    $.each(users, function(index, item) {
                    list.append(new Option(item, index));
                    });
                }
            })
        }, events: {
            'click .saveOutlet': 'saveOutlet'
        },
        saveOutlet: function(ev){
            ev.preventDefault();

            if(!this.$('.inputName').val() || !this.$('.inputAddress').val() || !this.$('.inputOwner').val()){
                this.$('.inputFieldName').addClass('error');
                this.$('.nameError .formError').text('Please enter an outlet name').css({'margin-left': '-135px'});

                this.$('.inputFieldAddress').addClass('error');
                this.$('.addressError .formError').text('Please enter outlet address').css({'margin-left': '-135px'});

                this.$('.inputFieldOwner').addClass('error');
                this.$('.ownerError .formError').text('Please select an outlet owner').css({'margin-left': '-135px'});
            }

            if(!this.$('.inputName').val()){
                this.$('.inputFieldName').addClass('error');
                this.$('.nameError .formError').text('Please enter an outlet name').css({'margin-left': '-135px'});
                return;
            }

            if(!this.$('.inputAddress').val()){
                this.$('.inputFieldAddress').addClass('error');
                this.$('.addressError .formError').text('Please enter outlet address').css({'margin-left': '-135px'});
                return;
            }

            if(!this.$('.inputOwner').val()){
                this.$('.inputFieldOwner').addClass('error');
                this.$('.ownerError .formError').text('Please select an outlet owner').css({'margin-left': '-135px'});
                return;
            }

            let nameRegex = /^[A-Za-z0-9\s]*$/;
            let name = this.$('.inputName').val();
            if(!nameRegex.test(name)){
                this.$('.inputFieldName').addClass('error');
                this.$('.nameError .formError').text('Only alphabets and numbers are allowed').css({'margin-left': '-44px'});
                return;
            }
            let value = {
                name: this.$('.inputName').val(),
                address: this.$('.inputAddress').val(),
                ownerId: this.$('.inputOwner').val()
            }

            this.trigger('save:outlet', value);
        }
    });

    EntityViews.editOutletView = Marionette.ItemView.extend({
        template: 'editOutletTemplate',
        initialize: function(){
            console.log(this.model);
            let owner = this.model.get('ownerId');
            console.log(owner)
            $.ajax({
                url: '/v1/api/owner',
                type: 'GET',
                dataType: 'json',
                success: function(response){

                    let users = {};
                    let ownerId = [];
                    let ownerName = [];

                    response.forEach(e => {
                        ownerId.push(e._id);
                        ownerName.push(e.name);
                    
                    
                    for (let i = 0; i < ownerId.length; i++) {
                        users[ownerId[i]] = ownerName[i];
                    }
                    console.log(users);
                    
                    $("#outletOwner").empty();
                    let list = $("#outletOwner");
                    $.each(users, function(index, item) {
                       if(owner != index){
                        list.append(new Option(item, index));
                       }else{
                        list.append(new Option(item, index, true, true));
                       }
                    });
                })
            }
        })
    },
        events: {
            'click .saveOutlet': 'saveOutlet',
            'click .deleteOutlet': 'deleteOutlet'
        },
        saveOutlet: function(ev){
            ev.preventDefault();
            if(!this.$('.inputName').val() || !this.$('.inputAddress').val() || !this.$('.inputOwner').val() || !this.$('.inputStatus').val()){
                this.$('.inputFieldName').addClass('error');
                this.$('.nameError .formError').text('Please enter an outlet name').css({'margin-left': '-135px'});

                this.$('.inputFieldAddress').addClass('error');
                this.$('.addressError .formError').text('Please enter outlet address').css({'margin-left': '-135px'});

                this.$('.inputFieldOwner').addClass('error');
                this.$('.ownerError .formError').text('Please select an outlet owner').css({'margin-left': '-135px'});
            }

            if(!this.$('.inputName').val()){
                this.$('.inputFieldName').addClass('error');
                this.$('.nameError .formError').text('Please enter an outlet name').css({'margin-left': '-135px'});
                return;
            }

            if(!this.$('.inputAddress').val()){
                this.$('.inputFieldAddress').addClass('error');
                this.$('.addressError .formError').text('Please enter outlet address').css({'margin-left': '-135px'});
                return;
            }

            if(!this.$('.inputStatus').val()){
                this.$('.inputFieldStatus').addClass('error');
                this.$('.statusError .formError').text('Please select an outlet status').css({'margin-left': '-135px'});
                return;
            }

            if(!this.$('.inputOwner').val()){
                this.$('.inputFieldOwner').addClass('error');
                this.$('.ownerError .formError').text('Please select an outlet owner').css({'margin-left': '-135px'});
                return;
            }

            let nameRegex = /^[A-Za-z0-9\s]*$/;
            let name = this.$('.inputName').val();
            if(!nameRegex.test(name)){
                this.$('.inputFieldName').addClass('error');
                this.$('.nameError .formError').text('Only alphabets and numbers are allowed').css({'margin-left': '-44px'});
                return;
            }
            let value = {
                name: this.$('.inputName').val(),
                address: this.$('.inputAddress').val(),
                outletStatus: this.$('.inputStatus').val(),
                ownerId: this.$('.inputOwner').val()
            }

            this.trigger('edit:outlet', value);

        },
        deleteOutlet: function(){
    
            this.trigger('delete:outlet', this.model.get('uniqueId'));
        }
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
            'click .editOutlet': 'editOutlet' 
        },
        editOutlet: function(){
            superAdminManager.vent.trigger('edit:outlet', this.model.get('uniqueId'));
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