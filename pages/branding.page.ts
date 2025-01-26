import { BasePage } from './base.page';
import { expect, Locator, Page } from '@playwright/test';

export class BrandingPage extends BasePage {

    private brandingField: Locator;
    private submitButton: Locator;

    constructor(page: Page) {
        super(page);

        this.brandingField = page.locator('#contactName')
        this.submitButton = page.locator('#updateBranding')
    }

    async updateContactField(name: string) {
        await this.brandingField.waitFor({ state: 'visible' });
        await this.brandingField.fill(name);
    }

    async clickSubmitButton() {
        await this.submitButton.click();
    }
}