const bookshelf = require('../config/bookshelf');

const Ticket = bookshelf.Model.extend({
    tableName: 'tickets'
});

Ticket.create = (ticket) => {
    return new Ticket ({
        id: ticket.id,
        event_id: ticket.event_id,
        quantity: ticket.quantity
    }).save(null, {method: 'insert'});
}

module.exports = Ticket;