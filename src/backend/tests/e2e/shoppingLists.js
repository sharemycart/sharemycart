require('should')
const supertest = require('supertest')

const request = supertest(process.env.SERVER_URL || 'http://localhost:8080')

async function createList(name = 'Baby Stuff') {
  const listResponse = await request.post('/shoppinglists')
    .send({
      name,
      type: 'shopping',
      isDefault: false,
      items: [{name: 'Pampers', amount: 2000, unit: 'pc'}]
    })
  listResponse.status.should.equal(201)
  return listResponse.body
}

describe('getting the shopping lists', () => {
  it('should return an array of objects', async () => {
    const result = await request.get('/shoppinglists')
    result.status.should.equal(200)
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

    it('should contain an item list', async () => {
      const result = await request.get('/shoppinglists')
      console.log(result.body[0])
      should(result.body[0].items).exists
      const items = result.body[0].items
      items.should.be.an.Array
      items.length.should.be.greaterThan(0)
      Object.keys(items[0]).should.containDeep(['id', 'name', 'amount', 'unit'])
    })
  })
})

describe('getting and posting lists', () => {
  it('should add the given list', async () => {
    const name = 'Baby Stuff #' + (+ new Date())
    const created = await createList(name)
    const result = await request.get(`/shoppinglists/${created.id}`)
    result.body.name.should.equal(name)
  })

  it('should report 404 if trying to get a non-existing list', async () => {
    const result = await request.get(`/shoppinglists/non-existing`)
    result.status.should.equal(404)
  })
})

describe('PUT /shoppinglists/{id}', () => {
  it('should change an existing list')

  it('should report 404 if the specified list was not found')
})

describe('DELETE /shoppinglists/{id}', () => {
  it('should remove the specified list')

  it('should report 404 if the specified list was not found')
})

describe('POST /shoppinglists/{id}/items', () => {
  it('should create a new entry in the items list')
})

describe('PUT /shoppinglists/{id}/items/{item_id}', () => {
  it('should update the specified item')

  it('should report 404 if the item cannot be found in the list')
})

describe('DELETE /shoppinglists/{id}/items/{item_id}', () => {
  it('should remove the specified item from the item list')

  it('should report 404 if the item cannot be found in the list')
})

describe('when adding needed items to a list', () => {
  it('should increase the amount of the specified item', async () => {
    const {id, items: [{itemId}]} = await createList()
    
    const needResponse = await request.post(`/shoppinglists/${id}/items/${itemId}/need`).send({amount: 500})
    needResponse.status.should.equal(201)

    const itemResponse = await request.get(`/shoppinglists/${id}`)
    itemResponse.body.items[0].amount.should.equal(2500)
  })

  it('should report 400 if the it in the path is not a valid uuid', async () => {
    const needResponse = await request.post(`/shoppinglists/abc/items/1/need`).send({amount: 500})
    needResponse.status.should.equal(400)
  })

  it('should report 404 if the item cannot be found in the list', async () => {
    const {id} = await createList()
    const needResponse = await request.post(`/shoppinglists/${id}/items/1/need`).send({amount: 500})
    needResponse.status.should.equal(404)
  })
})
