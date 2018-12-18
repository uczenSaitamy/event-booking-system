const bookshelf = require('../config/bookshelf');

const Event = bookshelf.Model.extend({
    tableName: 'events'
});

Event.create = (event) => {
    return new Event ({
        id: event.id,
        title: event.title,
        body: event.body,
        address_id: event.address_id,
        date: event.date
    }).save(null, {method: 'insert'});
}

module.exports = Event;