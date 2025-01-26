import { BasePage } from './base.page';
import { expect, Locator, Page } from '@playwright/test';

export class MessagePage extends BasePage {

    private messagesContainer: Locator;

    constructor(page: Page) {
        super(page);

        this.messagesContainer = page.locator('.messages');
    }

    async hasMessageBeenRecievedFromUser(name: string, subject: string) {
        const messages = await this.page.locator('.messages .row.detail');
        await messages.nth(0).waitFor({ state: 'visible' });
        const count = await messages.count();

        for (let i = 0; i < count; i++) {
            const messageRow = messages.nth(i);
            const messageName = await messageRow.locator(`[data-testid*='message${i}']`).textContent();
            const messageDescription = await messageRow.locator('[data-testid*="messageDescription"]').textContent();

            console.log("ASDF1: " + name);
            console.log("ASDF2: " + messageName);
            console.log("ASDF3: " + subject);
            console.log("ASDF4: " + messageDescription);

            if (name === messageName?.trim() && subject === messageDescription?.trim()) {
                return true;
            }
        }
        return false;
    }
}