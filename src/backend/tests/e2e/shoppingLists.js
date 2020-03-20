require('should')
const supertest = require('supertest')

const request = supertest(process.env.SERVER_URL || 'http://localhost:4010')

describe('GET /shoppinglists', () => {
  it('should return an array of objects', async () => {
    const result = await request.get('/shoppinglists')
    result.body.should.be.Array
    result.body.length.should.be.greaterThan(0)
    result.body[0].should.be.an.Object
  })
})

describe('POST /shoppinglists', () => {
  
})

describe('GET /shoppinglists/{id}', () => {
  
})

describe('PUT /shoppinglists/{id}', () => {
  
})

describe('DELETE /shoppinglists/{id}', () => {
  
})

describe('POST /shoppinglists/{id}/items', () => {
  
})

describe('PUT /shoppinglists/{id}/items/{item_id}', () => {
  
})

describe('DELETE /shoppinglists/{id}/items/{item_id}', () => {
  
})

describe('POST /shoppinglists/{id}/items/{item_id}/need', () => {
  
})
