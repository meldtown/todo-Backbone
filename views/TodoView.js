app = app || {};

app.TodoView = Backbone.View.extend({
  tagName: 'li',
  className: 'todo-item',
  events: {
    'change input[type=checkbox]': 'toggle',
    'input input[type=text]': 'updateText',
    'click .edit': 'edit',
    'click .cancel': 'cancel'
  },
  template: _.template($('#todo').html()),
  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
    this.isEdit = false;
  },
  render: function () {
    const data = {
      ...this.model.attributes,
      isEdit: this.isEdit
    }
    this.$el.html(this.template(data));
    return this;
  },
  updateText: function() {
    const input = $('input[type=text]');
    const text = input.val().trim();
    const disabled = !text || text === this.model.get('text').trim();
    $('.save').attr('disabled', disabled);
  },
  toggle: function () {
    const data = this.model.attributes;
    const completed = !this.model.get('completed');
    const payload = {...data, completed}
    this.model.save(payload, {wait: true});
  },
  edit: function () {
    this.isEdit = true;
    this.render();
    this.updateText();
  },
  cancel: function () {
    this.isEdit = false;
    this.render();
  }
});