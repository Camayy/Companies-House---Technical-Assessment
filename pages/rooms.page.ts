import { BasePage } from './base.page';
import { expect, Locator, Page } from '@playwright/test';

export class RoomsPage extends BasePage {

    private roomNameField: Locator;
    private roomTypeDropdown: Locator;
    private accessibleDropdown: Locator;
    private roomPriceField: Locator;
    private wifiCheckbox: Locator;
    private tvCheckbox: Locator;
    private radioCheckbox: Locator;
    private refreshmentsCheckbox: Locator;
    private safeCheckbox: Locator;
    private viewsCheckbox: Locator;
    private createRoomButton: Locator;
    private roomRows: Locator;

    constructor(page: Page) {
        super(page);

        this.roomNameField = page.locator('#roomName');
        this.roomTypeDropdown = page.locator('#type');
        this.accessibleDropdown = page.locator('#accessible');
        this.roomPriceField = page.locator('#roomPrice');
        this.wifiCheckbox = page.locator('#wifiCheckbox');
        this.tvCheckbox = page.locator('#tvCheckbox');
        this.radioCheckbox = page.locator('#radioCheckbox');
        this.refreshmentsCheckbox = page.locator('#refreshCheckbox');
        this.safeCheckbox = page.locator('#safeCheckbox');
        this.viewsCheckbox = page.locator('#viewsCheckbox');
        this.createRoomButton = page.locator('#createRoom');
        this.roomRows = page.locator('[data-testid="roomlisting"]');
    }

    async setRoomName(name: string) {
        await this.roomNameField.fill(name);
    }

    async selectRoomTypeDropdownOption(type: string) {
        await this.roomTypeDropdown.selectOption({ value: type });
    }

    async selectAccessibleDropdownOption(type: string) {
        await this.accessibleDropdown.selectOption({ value: type });
    }

    async setRoomPrice(value: string) {
        await this.roomPriceField.fill(value);
    }

    async selectWifiCheckbox() {
        await this.wifiCheckbox.check();
    }

    async selectTVCheckbox() {
        await this.tvCheckbox.check();
    }

    async selectRadioCheckbox() {
        await this.radioCheckbox.check();
    }

    async selectRefreshmentsCheckbox() {
        await this.refreshmentsCheckbox.check();
    }

    async selectSafeCheckbox() {
        await this.safeCheckbox.check();
    }

    async selectViewsCheckbox() {
        await this.viewsCheckbox.check();
    }

    async clickCreateRoomButton() {

        await this.createRoomButton.click();
    }

    async getLatestRoomBooking() {
        //i don't like using sleeps but the page doesn't seem to load fast enough
        await this.page.waitForTimeout(500);
        const rowCount = await this.roomRows.count();
        const lastRow = this.roomRows.nth(rowCount - 1);

        const roomName = await lastRow.locator('p[id^="roomName"]').textContent();
        const roomType = await lastRow.locator('p[id^="type"]').textContent();
        const roomAccessible = await lastRow.locator('p[id^="accessible"]').textContent();
        const roomPrice = await lastRow.locator('p[id^="roomPrice"]').textContent();
        const roomDetails = await lastRow.locator('p[id^="details"]').textContent();

        return {
            roomName: roomName?.trim(),
            roomType: roomType?.trim(),
            roomAccessible: roomAccessible?.trim(),
            roomPrice: roomPrice?.trim(),
            roomDetails: roomDetails?.trim(),
        };
    }

    async removeRoom(expectedRoomName: string) {

        const rowCount = await this.roomRows.count();
        for (let i = 0; i < rowCount; i++) {
            const row = this.roomRows.nth(i);
            const roomName = await row.locator('p[id^="roomName"]').textContent();
            const deleteButton = await row.locator('div:last-child .roomDelete');

            if (expectedRoomName === roomName?.trim()) {
                await deleteButton.click();
                await deleteButton.waitFor({ state: 'detached' });
                break;
            }
        }
    }

    async doesRoomExist(expectedRoomName: string): Promise<boolean> {
        //test runs faster than page loads - could add a parameter to know whether element is being removed/added and check for that
        await this.page.waitForTimeout(1000);
        const rowCount = await this.roomRows.count();
        for (let i = 0; i < rowCount; i++) {
            const row = this.roomRows.nth(i);
            const roomName = await row.locator('p[id^="roomName"]').textContent();

            if (expectedRoomName === roomName?.trim()) {
                return true;
            }
        }
        return false;
    }

    async viewRoomByName(name: string) {
        const rowCount = await this.roomRows.count();
        await this.page.wait
        for (let i = 0; i < rowCount; i++) {
            const row = this.roomRows.nth(i);
            const roomName = await row.locator('p[id^="roomName"]').textContent();

            if (name === roomName?.trim()) {
                await row.click();
                break;
            }
        }
    }
}