const bookshelf = require('../config/bookshelf');

const Role = bookshelf.Model.extend({
    tableName: 'roles'
});

module.exports = Role;