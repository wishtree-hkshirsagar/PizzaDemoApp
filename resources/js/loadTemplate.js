
(function(Handlebars, Backbone){
    var Marionette = Backbone.Marionette;
    Marionette.Handlebars = {
        path: '/templates/',
        extension: '.handlebars'
    };
    Marionette.TemplateCache.prototype.load = function(){
        if (this.compiledTemplate) {
            return this.compiledTemplate;
        }

        if (Handlebars.templates && Handlebars.templates[this.templateId]) {
            this.compiledTemplate = Handlebars.templates[this.templateId];
        }
       
        else {
            var template = this.loadTemplate(this.templateId);
            this.compiledTemplate = this.compileTemplate(template);
        }
        return this.compiledTemplate;
    };
    Marionette.TemplateCache.prototype.loadTemplate = function(templateId){
        var template, templateUrl;
       
        try {
            template = Backbone.$('#'+templateId).html();
        }
        catch(e) {}

        if (!template || template.length === 0) {
            templateUrl = Marionette.Handlebars.path + templateId + Marionette.Handlebars.extension;
            Backbone.$.ajax({
                url: templateUrl,
                success: function(data){
                    template = data;
                },
                async: false
            });
            if (!template || template.length === 0) {
                throw "TemplateNotFound - Could not find template:'" + templateUrl + "'";
            }
        }
        return template;
    };
    Marionette.TemplateCache.prototype.compileTemplate = function(rawTemplate){
        return Handlebars.compile(rawTemplate);
    };
}(Handlebars, Backbone));