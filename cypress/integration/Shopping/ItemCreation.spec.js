describe('Create shopping items', function () {
	this.beforeAll(() => {
		cy.login()

	})
	this.beforeEach(() => {
		cy.visit('/shopping')
	})

	this.afterAll(() => {
		cy.logout()
	})

	this.afterEach(() => {
		cy.get('[data-test=btn-edit-list]').click()
		cy.get('[data-test=label-item-name]').should('not.be.empty')
		cy.get('[data-test=btn-delete-item]').click()
		cy.get('[data-test=btn-save-list]').click()
	})

	it('Creates a new item with unit', function () {
		cy.get('[data-test=create-item] [data-test=input-name]').type('Wein 10 l')
		cy.get('[data-test=btn-create-item]').click()

		//validate parsing
		cy.get('[data-test=label-item-name]').should('contain', 'Wein')
		cy.get('[data-test=label-quantity]').should('contain', '10 l')
	})

})
