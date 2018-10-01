app = app || {};

app.TodoListView = Backbone.View.extend({
  el: '#root',
  template: _.template($('#todo-list').html()),
  events: {
    'submit form': 'addTodo',
    'input .added-todo': 'validateAddedTodo',
    'change select#filter': 'updateFilter'
  },
  initialize: function () {
    this.todos = this.filteredTodos = new app.TodoList();
    this.listenTo(this.todos, 'add', this.renderTodo);
    this.listenTo(this.todos, 'reset update', this.render);
    this.listenTo(this.todos, 'update change:completed', this.updateFilteredTodos);
    this.todos.fetch({reset: true});
    this.filters = ['All', 'Completed', 'Active'];
    this.currentFilter = 'All';

    this.render();
  },
  updateFilter: function(e) {
    const filter = $(e.target).val();
    this.currentFilter = filter;
    this.updateFilteredTodos();
  },
  updateFilteredTodos: function() {
    const todos = this.todos.models;
    switch (this.currentFilter) {
      case 'Completed':
        this.filteredTodos = todos.filter(todo => todo.get('completed'));
        break;
      case 'Active':
        this.filteredTodos = todos.filter(todo => !todo.get('completed'));
        break;
      default:
        this.filteredTodos = todos;
    }
    this.render();
    this.$('select#filter').val(this.currentFilter);
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
      totalCount: todos.length,
      filters: this.filters,
      currentFilter: this.currentFilter
    }
    const tpl = this.template(data)
    this.$el.html(tpl);
    this.filteredTodos.forEach(function (todo) {
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