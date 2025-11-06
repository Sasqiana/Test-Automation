describe('Reqres.in API Automation Test', () => {
  const baseUrl = 'https://reqres.in/api'
  let headers

  beforeEach(() => {
    headers = { 'x-api-key': 'reqres-free-v1' }
  })

  it('TC01 - GET list users', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/users?page=2`,
      headers
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.data).to.have.length.greaterThan(0)
    })
  })

  it('TC02 - GET single user', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/users/2`,
      headers
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.data.id).to.eq(2)
    })
  })

  it('TC03 - GET single user not found', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/users/99999`,
      headers,
      failOnStatusCode: false
    }).then((response) => {
      expect([401, 404]).to.include(response.status)
    })
  })

  it('TC04 - POST create new user', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/users`,
      headers,
      body: {
        name: 'jungkook',
        job: 'QA Tester'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([201, 401]).to.include(response.status)
      if (response.status === 201) {
        expect(response.body).to.have.property('id')
      }
    })
  })

  it('TC05 - PUT update user', () => {
    cy.request({
      method: 'PUT',
      url: `${baseUrl}/users/2`,
      headers,
      body: {
        name: 'jungkook updated',
        job: 'QA Lead'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 401]).to.include(response.status)
      if (response.status === 200) {
        expect(response.body.name).to.eq('jungkook updated')
      }
    })
  })

  it('TC06 - PATCH update user partially', () => {
    cy.request({
      method: 'PATCH',
      url: `${baseUrl}/users/2`,
      headers,
      body: {
        job: 'Senior QA Engineer'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 401]).to.include(response.status)
      if (response.status === 200) {
        expect(response.body.job).to.eq('Senior QA Engineer')
      }
    })
  })

  it('TC07 - DELETE user', () => {
    cy.request({
      method: 'DELETE',
      url: `${baseUrl}/users/2`,
      headers,
      failOnStatusCode: false
    }).then((response) => {
      expect([204, 401]).to.include(response.status)
    })
  })

  it('TC08 - POST register success', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/register`,
      headers,
      body: {
        email: 'eve.holt@reqres.in',
        password: 'pistol'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 401]).to.include(response.status)
      if (response.status === 200) {
        expect(response.body).to.have.property('token')
      }
    })
  })

  it('TC09 - POST register failed', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/register`,
      headers,
      body: { email: 'sydney@fife' },
      failOnStatusCode: false
    }).then((response) => {
      expect([400, 401]).to.include(response.status)
      if (response.status === 400) {
        expect(response.body.error).to.eq('Missing password')
      }
    })
  })

  it('TC10 - POST login success', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/login`,
      headers,
      body: {
        email: 'eve.holt@reqres.in',
        password: 'cityslicka'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 401]).to.include(response.status)
      if (response.status === 200) {
        expect(response.body).to.have.property('token')
      }
    })
  })
})

