import { BasePage } from './base.page';
import { expect, Locator, Page } from '@playwright/test';

export class RoomPage extends BasePage {

    private editButton: Locator;
    private roomNameHeader: Locator;
    private bookingRows: Locator;
    private updateButton: Locator;
    private roomNameField: Locator;
    private editLastNameField: Locator;
    private confirmBoookingEditButton: Locator;
    private editedBookingRow: Locator;

    constructor(page: Page) {
        super(page);

        this.editButton = page.locator('button.btn.btn-outline-primary.float-right');
        this.roomNameHeader = page.locator('.room-details h2');
        this.bookingRows = page.locator('.detail.booking-1');
        this.updateButton = page.locator('#update');
        this.roomNameField = page.locator('#roomName');
        this.editLastNameField = page.locator('[name^="lastname"]');
        this.confirmBoookingEditButton = page.locator('span.confirmBookingEdit');
        this.editedBookingRow = page.locator('');
    }

    async clickEditButton() {
        await this.editButton.click();
    }

    async getRoomName(): Promise<string | null> {
        const header = await this.roomNameHeader.textContent();
        const roomName = header.split('Room: ')[1];
        return roomName;
    }

    async fillRoomNameField(name: string) {
        await this.roomNameField.fill(name);
    }

    async clickUpdateButton() {
        await this.updateButton.click();
    }

    //could be expanded for multiple names/checkin date
    async clickEditRoomBookingByLastName(name: string) {
        await this.page.waitForTimeout(1000);
        const count = await this.bookingRows.count();

        for (let i = 0; i < count; i++) {
            const row = await this.bookingRows.nth(i);
            this.editedBookingRow = row;
            const nameFromRow = await row.locator('.col-sm-2').nth(1).textContent();

            if (name === nameFromRow?.trim()) {
                const editButton = await row.locator('.fa.fa-pencil.bookingEdit');
                await editButton.click();
                break;
            }
        }
    }

    async updateLastNameField(name: string) {
        await this.editLastNameField.fill(name);
    }

    async clickConfirmBookingEditButton() {
        await this.confirmBoookingEditButton.click();
    }

    async getBookingRowLastName(): Promise<string | null> {
        await this.page.waitForTimeout(500);

        const nameFromRow = this.editedBookingRow.locator('.col-sm-2').nth(1).textContent();

        return nameFromRow;
    }
}