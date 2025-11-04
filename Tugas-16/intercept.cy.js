describe('OrangeHRM Dashboard & Menu Intercept Tests', () => {

  const baseUrl = 'https://opensource-demo.orangehrmlive.com';

  beforeEach(() => {
    cy.visit(`${baseUrl}/web/index.php/auth/login`);
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });

  it('TC01 - Dashboard load employee data', () => {
    cy.intercept('GET', '**/api/v2/dashboard/employees/**').as('getEmployees');
    cy.visit(`${baseUrl}/web/index.php/dashboard/index`);
    cy.wait('@getEmployees').its('response.statusCode').should('eq', 200);
  });

  it('TC02 - Klik menu My Info', () => {
    cy.intercept('GET', '**/api/v2/pim/employees/**').as('getMyInfo');
    cy.get('span').contains('My Info').click();
    cy.wait('@getMyInfo', { timeout: 10000 }).its('response.statusCode').should('eq', 200);
    cy.get('h6').should('contain', 'Personal Details');
  });

  it('TC03 - Klik menu PIM', () => {
    cy.intercept('GET', '**/api/v2/pim/employees*').as('getEmployeesList');
    cy.get('span').contains('PIM').click();
    cy.wait('@getEmployeesList').its('response.statusCode').should('eq', 200);
    cy.get('h6').should('contain', 'PIM');
  });

 it('TC04 - Klik menu Time', () => {
    cy.intercept('GET', '**/api/v2/time/employees/timesheets/list**').as('getTimesheets');
    cy.get('span.oxd-main-menu-item--name').contains('Time').click();
    cy.wait('@getTimesheets', { timeout: 20000 })
      .its('response.statusCode')
      .should('eq', 200);
  });

  it('TC05 - Tambah employee baru', () => {
    cy.get('span').contains('PIM').click();
    cy.intercept('POST', '**/api/v2/pim/employees').as('postEmployee');
    cy.contains('Add').click();

    cy.get('input[name="firstName"]').type('Test');
    cy.get('input[name="lastName"]').type('Employee');
    cy.get('button[type="submit"]').click();

    cy.wait('@postEmployee').its('response.statusCode').should('eq', 200);
  });

});
