const firebaseService = require('./firebaseService')

it('retrieve list with ID', async () => {
    const item = await firebaseService.findItemById()
})
