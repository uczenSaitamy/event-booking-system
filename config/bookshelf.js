const knex = require('knex')(require('./database'));
const bookshelf = require('bookshelf')(knex);

module.exports = bookshelf;