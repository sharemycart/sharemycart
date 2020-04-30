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

	it('Creates a new item with unit via parsing', function () {
		cy.createShoppingItemParsingName({ name: 'Wine 10 l' })
		//validate parsing
		cy.get('[data-test=label-item-name]').contains('Wine')
		cy.get('[data-test=label-quantity]').should('contain', '10 l')

		// delete the item added
		// TODO: The following creates a rendering issue - no clue why.
		// cy.get('[data-test=btn-edit-list]').click()
		// cy.deleteShoppingItem({ name: 'Wine' })
	})

	it('Creates a new item with unit by selecting unit & quantity', function () {
		cy.createShoppingItemStructured({ name: 'Beer', quantity: 20, unit: 'l' })
		//validate parsing
		cy.get('[data-test=label-item-name]').contains('Beer')
		cy.get('[data-test=label-quantity]').should('contain', '20 l')

		// delete the item added
		// TODO: The following creates a rendering issue - no clue why.
		// cy.get('[data-test=btn-edit-list]').click()
		// cy.deleteShoppingItem({ name: 'Wine' })
	})
})
