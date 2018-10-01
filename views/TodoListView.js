app = app || {};

app.TodoListView = Backbone.View.extend({
  el: '#root',
  template: _.template($('#todo-list').html()),
  initialize: function () {
    this.todos = new app.TodoList();
    this.listenTo(this.todos, 'add', this.renderTodo);
    this.listenTo(this.todos, 'reset update', this.render);
    this.todos.fetch({reset: true});
    this.render();
  },
  render: function () {
    const todos = this.todos.models;
    const data = {
      todos,
      totalCount: todos.length

    }
    this.$el.html(this.template(data));
    this.todos.each(function (todo) {
      this.renderTodo(todo)
    }, this);
  },
  renderTodo: function (model) {
    const todoView = new app.TodoView({model});
    this.$('.todo-list').append(todoView.render().el);
  }
})