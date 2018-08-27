/* eslint-disable */
const request = require('supertest')
const {
  expect,
  should,
 } = require('chai')

const App = require('../server')

describe('App test', () => {
  describe(`Verificarne l'effettivo avvio`, () => {
    it(`Avviarsi con express e rispondere all'hello di test`, (done) => {
      request(App).get('/test')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res.body.hello).to.be.equal('hello')
          done()
        })
    })
  })
})
