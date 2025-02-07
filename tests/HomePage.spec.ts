import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';


test.describe('Home page functional tests', () => {
  test('Validate correct page title', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigateTo('');

    expect(await homePage.getTitle()).toBe('Restful-booker-platform demo');
  });

  test('Submit contact form and validate success message', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigateTo('');

    await homePage.fillContactForm(
      'Test Name',
      'testuser@test.com',
      '123456789000',
      'Test Subject',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'
    );

    await homePage.clickSubmitContactButton();
    const errorMessage = await homePage.getContactConfirmationText();
    expect(errorMessage).toContain("Thanks for getting in touch Test Name");

  });

  test.skip('Book a room for one night, checking in today', async ({ page }) => {
    
    const homePage = new HomePage(page);
    await homePage.navigateTo('');

    await homePage.clickBookFirstRoomButton();
    await homePage.fillBookingForm(
      'Booking',
      'User',
      'testuser@gmail.com',
      '01236549871'
    );

    const today = new Date();
    await homePage.setBookingDates(10, 13);

    await homePage.clickBookBookingButton();
    const bookingLabel = await homePage.getCalendarBookingLabel();
    await expect(bookingLabel).toBeVisible();
    await expect(bookingLabel).toHaveText("3 night(s) - £100");

    const bookingSuccessModal = await homePage.getBookingSuccessfulModal();
    await expect(bookingSuccessModal).toBeVisible();
    await expect(bookingSuccessModal).toHaveText(/Booking successful!/);

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    await expect(bookingSuccessModal).toHaveText(formattedDate);

    const dayTomorrow = String((today.getDate()) + 1).padStart(2, '0');
    const formattedDateTomorrow = `${year}-${month}-${dayTomorrow}`;

    await expect(bookingSuccessModal).toHaveText(formattedDateTomorrow);
  });
})

test.describe('Home page validation tests', () => {
  test('Submit contact form with blank fields throws validation errors', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigateTo('');

    await homePage.clickSubmitContactButton();

    const validationErrorBox = await homePage.getValidationErrorBoxText();

    const expectedErrors = [
      "Email may not be blank",
      "Message may not be blank",
      "Phone may not be blank",
      "Subject may not be blank",
      "Name may not be blank"
    ];

    for (const expected of expectedErrors) {
      expect(validationErrorBox).toContain(expected);
    }
  });

  test('Validation on contact form shows errors when incorrectly entered', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigateTo('');

    homePage.fillContactForm('', 'a', '123', 'xx', 'xxxx');
    await homePage.clickSubmitContactButton();

    const validationErrorBox = await homePage.getValidationErrorBoxText();

    const expectedErrors = [
      "Subject must be between 5 and 100 characters.",
      "Phone must be between 11 and 21 characters.",
      "Message must be between 20 and 2000 characters.",
      "must be a well-formed email address"
    ];

    for (const expected of expectedErrors) {
      expect(validationErrorBox).toContain(expected);
    }
  });

  test('Ensure validation error messages are correct on booking form', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigateTo('');

    homePage.clickBookFirstRoomButton();
    homePage.clickBookBookingButton();

    const validationErrorBox = await homePage.getValidationErrorBoxText();

    const expectedErrors = [
      "Firstname should not be blank",
      "Lastname should not be blank",
      "must not be empty", //email
      "must not be empty", //phone
      "must not be null" //calendar
    ];

    for (const expected of expectedErrors) {
      expect(validationErrorBox).toContain(expected);
    }

  });

  test('Validation on booking form shows errors when incorrectly entered', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigateTo('');

    homePage.clickBookFirstRoomButton();

    await homePage.fillBookingForm(
      'a',
      'a',
      'a',
      'a'
    );
    await homePage.clickBookBookingButton();

    const validationErrorBox = await homePage.getValidationErrorBoxText();

    const expectedErrors = [
      "size must be between 3 and 18",
      "size must be between 3 and 30",
      "size must be between 11 and 21",
      "must be a well-formed email address"
    ];

    for (const expected of expectedErrors) {
      expect(validationErrorBox).toContain(expected);
    }

  });
})
