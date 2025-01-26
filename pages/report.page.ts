import { BasePage } from './base.page';
import { expect, Locator, Page } from '@playwright/test';

export class ReportPage extends BasePage {
    private firstNameField: Locator;
    private lastNameField: Locator;
    private roomDropdown: Locator;
    private paidDropdown: Locator;
    private checkinDate: Locator;
    private checkoutDate: Locator;
    private bookButton: Locator;
    private calendarBooking: Locator;

    constructor(page: Page) {
        super(page);

        this.firstNameField = page.locator('[name^="firstname"]')
        this.lastNameField = page.locator('[name^="lastname"]')
        this.roomDropdown = page.locator('#roomid')
        this.paidDropdown = page.locator('#depositpaid')
        this.checkinDate = page.locator('p:has(span:has-text("Checkin"))')
        this.checkoutDate = page.locator('p:has(span:has-text("Checkout"))')
        this.bookButton = page.locator('button.btn.btn-outline-primary.float-right.book-room')
        this.calendarBooking = page.locator('.rbc-calendar .rbc-event-content');
    }

    async fillBookingModal(name: string, lastName: string, roomName: string, depositPaid: boolean) {
        await this.firstNameField.fill(name);
        await this.lastNameField.fill(lastName);
        await this.roomDropdown.selectText(roomName);
        await this.paidDropdown.selectOption(depositPaid);
    }

    async getCheckinDate(): Promise<string | null> {
        return await this.checkinDate.textContent();
    }

    async getCheckoutDate(): Promise<string | null> {
        return await this.checkoutDate.textContent();
    }

    async clickBookButton() {
        await this.bookButton.click();
    }

    async hasBookingBeenMade(name: string, room: string): Promise<boolean> {
        for (let i = 0; i < await this.calendarBooking.count(); i++) {
            const row = await this.calendarBooking.nth(i).textContent();
            if (row.contains(name) && name.contains(room)) {
                return true;
            }
        }
        return false;
    }
}