const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const db = require('../../helpers/db')
const contacts = require('../../../src/models/contacts')

chai.use(chaiAsPromised)

const expect = chai.expect

beforeEach(() => {
  return db.truncateContacts()
    .then(() => console.log('Testing: Contacts table has been truncated.'))
})

context('Contacts Database Functions', () => {
  describe('create()', () => {
    it('Adds new users to the database', () => {
      return contacts.create({first_name: 'Baloney', last_name: 'McGee'})
        .then(contact =>
          expect(contact[0]).to.eql({first_name: 'Baloney', last_name: 'McGee', id: 1})
        )
    })
    it('Throws an error if input is not an object', () => {
      return expect(contacts.create('Baloney McGee')).to.eventually.be.rejected
    })
  })

  describe('findAll()', () => {
    it('Should return an empty array when the database has no contacts', function () {
      return contacts.findAll()
        .then(allContacts => {
          expect(allContacts).to.eql([])
        });
    });

    it('Should return all contacts from the database', () => {
      return db.seedContacts()
        .then(() => {
          return contacts.findAll()
            .then(allContacts => {
              expect(allContacts).to.eql([
                { id: 1, first_name: 'Jared', last_name: 'Grippe' },
                { id: 2, first_name: 'Tanner', last_name: 'Welsh' },
                { id: 3, first_name: 'NeEddra', last_name: 'James' },
              ])
            })
        })
    })
  })

  describe('findById()', () => {
    it('Returns undefined if given an ID that does not exist', () => {
      return contacts.findById(7)
        .then(contact => {
          expect(contact).to.be.undefined
        })
    })
    it('Returns the expected user when given the ID', () => {
      return db.seedContacts()
        .then(() => {
          contacts.findById(2)
            .then(contact => {
              expect(contact).to.eql({ id: 2, first_name: 'Tanner', last_name: 'Welsh' })
            })
        })
    })

    it('Returns an error if not given proper input', () => {
      return expect(contacts.findById('Whatever')).to.eventually.be.rejected
    })
  })

  describe('destroy()', () => {
    let lengthBeforeDestroy = 0
    it('Deletes a contact from the database', () => {
      return db.seedContacts()
        .then(() => {
          return contacts.findAll()
            .then(contacts => {
              lengthBeforeDestroy = contacts.length
            })
            .then(() => {
              return contacts.destroy(2)
                .then(() => {
                  return contacts.findAll()
                    .then(newContacts => {
                      return expect(newContacts.length).to.eql(lengthBeforeDestroy - 1)
                    })
                })
            })
        })
    })
    it('Returns an error if not given proper input', () => {
      return expect(contacts.destroy('Banana')).to.eventually.be.rejected
    })
  })

  describe('search()', () => {
    it('Finds all contacts matching the given search term', () => {
      return db.seedContacts()
        .then(() => {
          return contacts.search('Nee')
            .then(result => {
              return expect(result).to.eql([{id: 3, first_name: "NeEddra", last_name: "James"}])
            })
        })
    })
  })

})
