const chai = require('chai')
const expect = chai.expect
const Ticket = require('../app/Ticket').Ticket

const invalidTicketId = ' '
const invalidSeatNumber = -1

const validTicketId = 'T1'
const validSeatNumber = 1

const validTicketObject = {
  id: validTicketId,
  seat: validSeatNumber,
  boarded: false
}

const invalidTicketObject = {
  id_X: validTicketId,
  seat: validSeatNumber,
  boarded: false
}

describe('Ticket', () => {

  describe('initialization', () => {

    it ('initializes correctly', () => {
      //act
      const ticket = new Ticket(validTicketId, validSeatNumber)

      //assert
      expect(ticket.id).to.equal(validTicketId)
      expect(ticket.seat).to.equal(validSeatNumber)
      expect(ticket.boarded).to.equal(false)
    }),

    it('throws error for invalid id', () => {
      expect(() => {new Ticket(invalidTicketId, validSeatNumber)}).throws('Invalid id')
    }),

    it('throws error for invalid seat', () => {
      expect(() => {new Ticket(validTicketId, invalidSeatNumber)}).throws('Invalid seat')
    })

  }),

  describe ('boarded', () => {

    it ('changes value correctly', () => {
      //arrange
      const ticket = new Ticket(validTicketId, validSeatNumber)
      expect(ticket.boarded).to.equal(false)

      //act
      ticket.boarded = true

      //assert
      expect(ticket.boarded).to.equal(true)
    })

  }),

  describe('toObject', () => {

    it('creates object correctly', () => {
      //arange
      const ticket = new Ticket(validTicketId, validSeatNumber)

      //act
      const object = ticket.toObject()

      //assert
      expect(object).to.deep.equal(validTicketObject)
    }) 

  }),

  describe('fromObject', () => {

    it('creates ticket correctly', () => {
      //act
      const ticket = Ticket.fromObject(validTicketObject)

      //assert
      expect(ticket.id).to.equal(validTicketObject.id)
      expect(ticket.seat).to.equal(validTicketObject.seat)
      expect(ticket.boarded).to.equal(validTicketObject.boarded)
    }),

    it('throws error for invalid ticket object', () => {
      expect(() => {Ticket.fromObject(invalidTicketObject)}).throws('Invalid object')
    })

  })

}) 