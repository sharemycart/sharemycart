require('should')
const supertest = require('supertest')

const request = supertest(process.env.SERVER_URL || 'http://localhost:8080')

function createListName() {
  return 'Baby Stuff #' + (+ new Date())
}

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
    const name = createListName()
    const created = await createList(name)
    const result = await request.get(`/shoppinglists/${created.id}`)
    result.body.name.should.equal(name)
  })

  it('should report 404 if trying to get a non-existing list', async () => {
    const result = await request.get(`/shoppinglists/non-existing`)
    result.status.should.equal(404)
  })
})

describe('Change shopping lists', () => {
  it('should change an existing list', async () => {
    const name = createListName()
    const created = await createList(name)

    const changedName = name + ' - changed'
    const result = await request.put(`/shoppinglists/${created.id}`).send({name: changedName})
    result.status.should.equal(200)
    result.body.name.should.equal(changedName)

    const result2 = await request.get(`/shoppinglists/${created.id}`)
    result2.status.should.equal(200)
    result2.body.name.should.equal(changedName)
  })

  it('should report 404 if the specified list was not found', async () => {
    const result = await request.put(`/shoppinglists/non-existing`).send({name: 'changed name'})
    result.status.should.equal(404)
  })
})

describe('DELETE /shoppinglists/{id}', () => {
  it('should remove the specified list', async () => {
    const name = createListName()
    const created = await createList(name)

    await request.delete(`/shoppinglists/${created.id}`)

    const result2 = await request.get(`/shoppinglists/${created.id}`)
    result2.status.should.equal(404)
  })

  it('should report 404 if the specified list was not found', async () => {
    const result = await request.delete(`/shoppinglists/non-existing`)
    result.status.should.equal(404)
  })
})

describe('Adding items to a list', () => {
  it('should make the new item be in the list', async () => {
    const {id} = await createList(createListName())
    const result = await request.post(`/shoppinglists/${id}/items`)
      .send({name: 'Soother', amount: 2, unit: 'pc'})
    result.status.should.equal(201)
    result.items.length.should.equal(2)
    result.items.some(item => item.name === 'Soother').should.be.true
  })
})

describe('changing an item', () => {
  it('should update the specified item', async () => {
    const {id, items: [{itemId}]} = await createList(createListName())

    const result = await request.put(`/shoppinglists/${id}/items/${itemId}`)
      .send({name: 'Soother', amount: 3, unit: 'pc'})
    result.status.should.equal(200)

    const result2 = await request.get(`/shoppinglists/${created.id}`)
    result2.items[0].name.should.equal('Soother')
    result2.items[0].amount.should.equal(3)
  })

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
