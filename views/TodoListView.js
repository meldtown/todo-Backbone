app = app || {};

app.TodoListView = Backbone.View.extend({
  el: '#root',
  template: _.template($('#todo-list').html()),
  events: {
    'submit form': 'addTodo',
    'input .added-todo': 'validateAddedTodo',
    'change select#filter': 'updateFilter',
    'change select#sort': 'updateSortOption',
  },
  initialize: function () {
    this.todos = this.filteredTodos = this.filteredAndSortedTodos = new app.TodoList();
    this.listenTo(this.todos, 'add', this.renderTodo);
    this.listenTo(this.todos, 'reset update', this.render);
    this.listenTo(this.todos, 'update change:completed', this.updateFilteredTodos);
    this.todos.fetch({reset: true});
    this.filters = ['All', 'Completed', 'Active'];
    this.sortOptions = ['None', 'Asc', 'Desc'];
    this.currentFilter = 'All';
    this.currentSortOption = 'None';

    this.render();
  },
  setSelectValues: function() {
    this.$('select#filter').val(this.currentFilter);
    this.$('select#sort').val(this.currentSortOption);
  },
  updateSortOption: function (e) {
    const sortOption = $(e.target).val();
    this.currentSortOption = sortOption;
    this.updateFilteredAndSortedTodos();
  },
  updateFilteredAndSortedTodos: function () {
    const filteredTodos = this.filteredTodos.models || this.filteredTodos;
    const todos = [...filteredTodos];
    const sortOption = this.currentSortOption;
    const sortedByAscTodos = todos.sort((a, b) => {
      const prev = a.get('text').toLowerCase();
      const next = b.get('text').toLowerCase();
      return next > prev ? -1 : 1;
    });
    switch (sortOption) {
      case 'Asc':
        this.filteredAndSortedTodos = sortedByAscTodos;
        break;
      case 'Desc':
        this.filteredAndSortedTodos = sortedByAscTodos.reverse();
        break;
      default:
        this.filteredAndSortedTodos = filteredTodos;
    }
    this.render();
    this.setSelectValues();
  },
  updateFilter: function (e) {
    const filter = $(e.target).val();
    this.currentFilter = filter;
    this.updateFilteredTodos();
  },
  updateFilteredTodos: function () {
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
    this.updateFilteredAndSortedTodos();
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
      sortOptions: this.sortOptions,
      currentFilter: this.currentFilter,
      currentSortOption: this.currentSortOption
    }
    const tpl = this.template(data)
    this.$el.html(tpl);
    this.filteredAndSortedTodos.forEach(function (todo) {
      this.renderTodo(todo)
    }, this);
    const elem = $('.add-todo');
    elem.attr('disabled', 'true');
    this.setSelectValues();
  },
  renderTodo: function (model) {
    const todoView = new app.TodoView({model});
    this.$('.todo-list').append(todoView.render().el);
  }
})