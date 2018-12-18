const bookshelf = require('../config/bookshelf');

const Address = bookshelf.Model.extend({
    tableName: 'address'
});

Address.create = (address) => {
    return new Address ({
        id: address.id,
        addressline1: address.addressline1,
        addressline2: address.addressline2,
        sity: address.sity,
        state: address.state,
        postal_code: address.postal_code
    }).save();
}

module.exports = Address;