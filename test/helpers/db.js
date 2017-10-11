process.env.DATABASE_URL = 'postgres://localhost:5432/contacts_test'
const db = require('../../src/models/db/db')

const truncateContacts = () => {
  return db.query('TRUNCATE contacts RESTART IDENTITY')
}

const seedContacts = () => {
  return db.query(`INSERT INTO contacts VALUES
    ('Jared', 'Grippe'), ('Tanner', 'Welsh'), ('NeEddra', 'James')`)
}

module.exports = {
  db,
  truncateContacts
}
