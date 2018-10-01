app = app || {};

app.TodoView = Backbone.View.extend({
  tagName: 'li',
  className: 'todo-item',
  events: {
    'change input[type=checkbox]': 'toggle'
  },
  template: _.template($('#todo').html()),
  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
  },
  render: function() {
    const html = this.template(this.model.attributes);
    this.$el.html(html);
    return this;
  },
  toggle: function () {
    const data = this.model.attributes;
    const completed = !this.model.get('completed');
    const payload = {...data, completed}
    this.model.save(payload, {wait: true});
  }
});