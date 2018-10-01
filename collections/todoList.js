const url = 'http://localhost:3003/todos';
app = app || {};

app.TodoList = Backbone.Collection.extend({
  model: app.Todo,
  url
});