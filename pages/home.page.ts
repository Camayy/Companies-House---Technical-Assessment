import { BasePage } from './base.page';
import { expect, Locator, Page } from '@playwright/test';

export class HomePage extends BasePage {

  private nameField: Locator;
  private emailField: Locator;
  private phoneField: Locator;
  private subjectField: Locator;
  private messageField: Locator;
  private submitContactButton: Locator;
  private alertSuccess: Locator;
  private alertError: Locator;
  private contactRow: Locator;
  private roomSection: Locator;
  private roomCount: Locator;
  private bookingFirstName: Locator;
  private bookingLastName: Locator;
  private bookingEmail: Locator;
  private bookingPhoneNumber: Locator;
  private bookThisRoomButton: Locator;
  private bookingMonthTable: Locator;
  private bookRoomButton: Locator;
  private bookingSuccessfulModal: Locator;
  private calendarBookingLabel: Locator;
  private dataValidationError: Locator;
  private hotelDetailsHeaders: Locator;

  constructor(page: Page) {
    super(page);

    this.nameField = page.locator('#name');
    this.emailField = page.locator('#email');
    this.phoneField = page.locator('#phone');
    this.subjectField = page.locator('#subject');
    this.messageField = page.locator('#description');
    this.submitContactButton = page.locator('#submitContact');
    this.alertSuccess = page.locator('.alert-success');
    this.alertError = page.locator('.alert-danger');
    this.contactRow = page.locator('div.row.contact > div.col-sm-5');
    this.roomSection = page.locator('.row.room');
    this.roomCount = page.locator('.room-info');
    this.bookingFirstName = page.locator('.room-firstname');
    this.bookingLastName = page.locator('.room-lastname');
    this.bookingEmail = page.locator('.room-email')
    this.bookingPhoneNumber = page.locator('.room-phone');
    this.bookThisRoomButton = page.locator('.hotel-room-info .btn');
    this.bookingMonthTable = page.locator('rbc-month-view');
    this.bookRoomButton = page.locator('//button[contains(@class, "btn-outline-primary") and text()="Book"]');
    this.bookingSuccessfulModal = page.locator('.ReactModal__Content.ReactModal__Content--after-open.confirmation-modal');
    this.calendarBookingLabel = page.locator('rbc-event-content');
    this.dataValidationError = page.locator('.alert.alert-danger');
    this.hotelDetailsHeaders = page.locator('div.col-sm-5 p');
  }

  async clickSubmitContactButton() {
    await this.submitContactButton.click();
  }

  async getSuccessMessage(): Promise<string | null> {
    return this.alertSuccess.textContent();
  }

  async fillContactForm(name: string, email: string, phone: string, subject: string, description: string) {
    await this.nameField.fill(name);
    await this.emailField.fill(email);
    await this.phoneField.fill(phone);
    await this.subjectField.fill(subject);
    await this.messageField.fill(description);
  }

  async isErrorMessageVisible(): Promise<boolean> {
    return this.alertError.isVisible();
  }

  async getContactConfirmationText(): Promise<string | null> {
    //wait for DOM to update
    await this.waitForLocatorToBeHidden(this.nameField);
    return this.contactRow.nth(0).textContent();
  }

  async isRoomSectionVisible(): Promise<boolean> {
    return this.roomSection.isVisible();
  }

  async getRooms(): Promise<Locator> {
    return this.roomCount;
  }

  async fillBookingForm(firstName: string, lastName: string, email: string, phone: string,) {
    await this.bookingFirstName.fill(firstName);
    await this.bookingLastName.fill(lastName);
    await this.bookingEmail.fill(email);
    await this.bookingPhoneNumber.fill(phone);
  }

  async clickBookFirstRoomButton() {
    await this.bookThisRoomButton.nth(0).click();
  }

  async clickBookBookingButton() {
    await this.page.waitForTimeout(1000);
    await this.bookRoomButton.click();
  }

  async getBookingSuccessfulModal(): Promise<Locator> {
    return this.bookingSuccessfulModal;
  }

  async getCalendarBookingLabel(): Promise<Locator> {
    return this.calendarBookingLabel;
  }

  async getValidationErrorBoxText(): Promise<string | null> {
    return this.dataValidationError.textContent();
  }

  async getHotelName(): Promise<string | null> {
    const hotelName = await this.hotelDetailsHeaders.first().textContent();
    return hotelName?.trim();
  }
}