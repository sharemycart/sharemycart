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

  describe('returned shopping lists', () => {
    it('should have a name', async () => {
      const result = await request.get('/shoppinglists')
      should(result.body[0].name).exists
    })

    it('should have a type', async () => {
      const result = await request.get('/shoppinglists')
      should(result.body[0].type).exists
    })

    // it('should contain an item list', async () => {
    //   const result = await request.get('/shoppinglists')
    //   console.log(result.body[0])
    //   should(result.body[0].items).exists
    //   const items = result.body[0].items
    //   items.should.be.an.Array
    //   items.length.should.be.greaterThan(0)
    //   Object.keys(items[0]).should.deepEqual(['id', 'name', 'amount', 'unit'])
    // })
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
