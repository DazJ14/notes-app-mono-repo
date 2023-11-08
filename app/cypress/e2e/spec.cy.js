describe('My First Test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3001/')
    
    cy.request('POST' , 'http://localhost:3000/api/testing/reset')

    const user = {
      name: 'Diego',
      username: 'DazJ_test',
      password: 'testingpassword'
    }

    cy.request('POST', 'http://localhost:3000/api/users', user)
  })
  it('frontpage can be opened', () => {
    cy.contains('Note')
  })

  it('login form can be opened', () => {
    cy.contains('SHOW LOGIN').click()
  })

  it('user can login', () => {
    cy.contains('SHOW LOGIN').click()
    cy.get('[name="Username"]').type('DazJ_test')
    cy.get('[name="Password"]').type('testingpassword')
    cy.get('#form-login-button').click()
    cy.contains('Create a new note')
  })

  it('login fails with wrong password', () => {
    cy.contains('SHOW LOGIN').click()
    cy.get('[name="Username"]').type('DazJ_test')
    cy.get('[name="Password"]').type('testingpasswordwrong')
    cy.get('#form-login-button').click()

    cy.get('.error').should('contain', 'Wrong credentials')
  });
  

  describe('when logged in', () => {
    beforeEach(() => {
      cy.login({ username: 'DazJ_test', password: 'testingpassword'})
    })
    it('a new note can be created', () => {
      const noteContent = 'a note created by cypress'
      cy.contains('New Note').click()
      cy.get('input').type(noteContent)
      cy.contains('save').click()
      cy.contains(noteContent)
    });

    describe('and a note exists', () => {
      beforeEach(() => {
        cy.createNote({content: 'This is the first note', important: false})
        cy.createNote({content: 'This is the second note', important: false})
        cy.createNote({content: 'This is the third note', important: false})
      })

      it('it can be made important', () => {
        cy.contains('This is the second note').as('theNote')

        cy.get('@theNote').contains('make important').click()
        cy.get('@theNote').contains('make not important').click()
      });
      
    });
    
  });
  
})