import { BasePage } from './base.page';
import { expect, Locator, Page } from '@playwright/test';

export class AdminPage extends BasePage {

    private usernameField: Locator;
    private passwordField: Locator;
    private loginButton: Locator;

    constructor(page: Page) {
        super(page);

        this.usernameField = page.locator('#username');
        this.passwordField = page.locator('#password');
        this.loginButton = page.locator('#doLogin');
    }

    async enterUsername() {
        await this.usernameField.fill("admin");
    }

    async enterPassword() {
        await this.passwordField.fill("password");
    }

    async clickLoginButton() {
        await this.loginButton.click();
    }

    async loginAsAdmin() {
        //sometimes login button doesn't show if this button is visible
        const letMeHackButton = await this.page.locator('button.btn.btn-primary:has-text("Let me hack!")').first();
        await letMeHackButton.click();
        await letMeHackButton.waitFor({ state: 'detached' });

        //some tests require this as well as waiting for the letmehack button to be not
        await this.page.waitForTimeout(500);

        await this.enterUsername();
        await this.enterPassword();
        await this.loginButton.click();
    }
}