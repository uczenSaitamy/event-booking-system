const bookshelf = require('../config/bookshelf');

const User = bookshelf.Model.extend({
    tableName: 'users'
});

User.create = (user) => {
    return new User ({
        email: user.email,
        password: user.password,
        roles_id: user.roles_id,
        name: user.name,
        address_id: user.address_id,
        token: user.token,
        created_at: user.created_at,
        updated_at: user.updated_at
    }).save();
}

module.exports = User;