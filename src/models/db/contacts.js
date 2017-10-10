const db = require('./db')

const create = function(contact){
  return db.query(`
    INSERT INTO
      contacts (first_name, last_name)
    VALUES
      ($1::text, $2::text)
    RETURNING
      *
    `,
    [
      contact.first_name,
      contact.last_name,
    ])
    .catch(error => {
      console.error({message: 'Error occurred while executing contacts.create',
                     arguments: arguments});
      throw error
    });
}

const findAll = function(){
  return db.query(`
    SELECT
      *
    FROM
      contacts
    `, [])
    .catch(error => {
      console.error({message: 'Error occurred while executing contacts.findAll',
                     arguments: arguments});
      throw error});
}

const findById = function(contactId){
  return db.any(`
    SELECT * FROM contacts WHERE id=$1::int LIMIT 1
    `,
    [contactId])
    .then( contacts => contacts[0])
    .catch(error => {
      console.error({message: 'Error occurred while executing contacts.findById',
                     arguments: arguments});
      throw error});
}

const destroy = function(contactId){
  return db.query(`
    DELETE FROM
      contacts
    WHERE
      id=$1::int
    `,
    [contactId])
    .catch(error => {
      console.error({message: 'Error occurred while executing contacts.destroy',
                     arguments: arguments});
      throw error});
}

const search = function(searchQuery){
  return db.query(`
    SELECT
      *
    FROM
      contacts
    WHERE
      lower(first_name || ' ' || last_name) LIKE $1::text
    `,
    [`%${searchQuery.toLowerCase().replace(/\s+/,'%')}%`])
    .catch(error => {
      console.error({message: 'Error occurred while executing contacts.search',
                     arguments: arguments});
      throw error});
}

module.exports = {
  create,
  findById,
  findAll,
  destroy,
  search
}
