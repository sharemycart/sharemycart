describe('Create shopping items', function () {
	this.beforeAll(() => {
		cy.login()
		cy.ensureCurrentSingleShoppingList()
	})

	this.beforeEach(() => {
		cy.visit('/shopping')
	})

	this.afterAll(() => {
		cy.logout()
	})

	it('Creates a new item with unit', function () {
		cy.createShoppingItem({ name: 'Wine 10 l' })
		//validate parsing
		cy.get('[data-test=label-item-name]').should('contain', 'Wine')
		cy.get('[data-test=label-quantity]').should('contain', '10 l')

		// delete the item added
		// TODO: The following creates a rendering issue - no clue why.
		// cy.get('[data-test=btn-edit-list]').click()
		// cy.deleteShoppingItem({ name: 'Wine' })
	})
})
