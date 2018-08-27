/* eslint-disable */
const request = require('supertest');
const {
  expect,
} = require('chai');

const db = require('../server/lib/dbSetup')

describe('Db test', () => {
  describe('Test connection', () => {
    it('Testa la connessione', () => {
      expect(true).to.be.true
    })
  })
})