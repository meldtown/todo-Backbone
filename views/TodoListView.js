app = app || {};

app.TodoListView = Backbone.View.extend({
  el: '#root',
  template: _.template($('#todo-list').html()),
  events: {
    'submit form': 'addTodo',
    'input .added-todo': 'validateAddedTodo'
  },
  initialize: function () {
    this.todos = new app.TodoList();
    this.listenTo(this.todos, 'add', this.renderTodo);
    this.listenTo(this.todos, 'reset update', this.render);
    this.todos.fetch({reset: true});
    this.render();
  },
  addTodo: function (e) {
    e.preventDefault();
    const input = $('.added-todo');
    const text = input.val().trim();
    const payload = {text, completed: false};
    this.todos.create(payload,
      {
        wait: true,
        success: function () {
          input.val('');
        },
        context: this
      })
  },
  validateAddedTodo: function () {
    const val = $('.added-todo').val().trim();
    $('.add-todo').attr('disabled', !val);
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
    const elem = $('.add-todo');
    elem.attr('disabled', 'true');
  },
  renderTodo: function (model) {
    const todoView = new app.TodoView({model});
    this.$('.todo-list').append(todoView.render().el);
  }
})