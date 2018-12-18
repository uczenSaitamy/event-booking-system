const bookshelf = require('../config/bookshelf');

const Order = bookshelf.Model.extend({
    tableName: 'orders'
});

Order.create = (order) => {
    return new Order ({
        id: order.id,
        user_id: order.user_id,
        event_id: order.event_id,
        ticket_quantity: order.ticket_quantity
    }).save();
}

module.exports = Order;