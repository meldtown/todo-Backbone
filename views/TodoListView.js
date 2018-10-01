app = app || {};

app.TodoListView = Backbone.View.extend({
  el: '#todoList',
  initialize: function () {
    this.todos = new app.TodoList();
    this.listenTo(this.todos, 'add', this.renderTodo);
    this.listenTo(this.todos, 'reset', this.render);
    this.todos.fetch({reset: true});
    this.render();
  },
  render: function () {
    this.todos.each(function (todo) {
      this.renderTodo(todo)
    }, this);
  },
  renderTodo: function (model) {
    const todoView = new app.TodoView({model});
    this.$('ul').append(todoView.render().el)
  }
})