import LoginPage from '../support/pageObjects/LoginPage';

describe('OrangeHRM Login Feature - With POM', () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
  });

  it('TC01 - Login dengan username dan password valid', () => {
    loginPage.login('Admin', 'admin123');
    loginPage.verifyDashboard();
  });

  it('TC02 - Login menggunakan tombol Enter di keyboard', () => {
    cy.get(loginPage.usernameField).type('Admin');
    cy.get(loginPage.passwordField).type('admin123{enter}');
    cy.url().should('include', '/dashboard/index');
  });

  it('TC03 - Tidak bisa login dengan password salah', () => {
    loginPage.login('Admin', 'salah123');
    loginPage.verifyErrorMessage('Invalid credentials');
  });

  it('TC04 - Tidak bisa login dengan username kosong', () => {
    loginPage.login('', 'admin123');
    loginPage.verifyRequiredMessage();
  });

  it('TC05 - Tidak bisa login dengan password kosong', () => {
    loginPage.login('Admin', '');
    loginPage.verifyRequiredMessage();
  });

  it('TC06 - Tidak bisa login dengan username dan password kosong', () => {
    loginPage.login('', '');
    loginPage.verifyRequiredMessage();
  });

  it('TC07 - Username case-sensitive (ADMIN% vs Admin)', () => {
    loginPage.login('ADMIN%', 'admin123');
    cy.wait(1000)
    loginPage.verifyErrorMessage('Invalid credentials');
  });

  it('TC08 - Password case-sensitive (Admin123 vs admin123)', () => {
    loginPage.login('Admin', 'Admin123');
    loginPage.verifyErrorMessage('Invalid credentials');
  });

  it('TC09 - Menampilkan nama pengguna setelah login berhasil', () => {
    loginPage.login('Admin', 'admin123');
    cy.wait(1000)
    loginPage.verifyDashboard();
    loginPage.verifyProfileName('manda user'); 
  });

  it('TC10 - Tetap login setelah refresh halaman dashboard', () => {
    loginPage.login('Admin', 'admin123');
    cy.url().should('include', '/dashboard/index');
    cy.reload();
    cy.url().should('include', '/dashboard/index');
  });
});

