app = app || {};

app.Todo = Backbone.Model.extend({
  defaults: {
    text: '',
    completed: false
  }
});