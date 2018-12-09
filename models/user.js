const bookshelf = require('../config/bookshelf');

const User = bookshelf.Model.extend({
    tableName: 'users'
});

User.create = (user) => {
    return new User ({
        email: user.email,
        password: user.password,
        roles_id: 1,
        name: user.name,
        address_id: 1,
        token: user.token,
        created_at: user.created_at,
        updated_at: user.updated_at
    }).save();
}

module.exports = User;