import { Locator, Page } from '@playwright/test';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(url: string) {
    await this.page.goto(url);
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async waitForLocatorToBeHidden(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'hidden' });
  }

  async highlightElement(locator: Locator) {
    await this.page.evaluate((el) => {
      el.style.border = '2px solid red';
      el.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
    }, await locator.elementHandle());
  }

  async setBookingDates(fromDate: number, toDate: number) {

    const fromTile = this.page.locator('.rbc-day-bg:not(.rbc-off-range-bg)').nth(fromDate - 1);
    const toTile = this.page.locator('.rbc-day-bg:not(.rbc-off-range-bg)').nth(toDate - 1);

    const fromBox = await fromTile.boundingBox();
    const toBox = await toTile.boundingBox();

    await this.page.mouse.move(fromBox.x + fromBox.width / 2, fromBox.y + fromBox.height / 2); 
    await this.page.mouse.down(); 
    await this.page.mouse.move(toBox.x + toBox.width / 2, toBox.y + toBox.height / 2); 
    await this.page.mouse.up(); 
  
    await fromTile.hover();
    await this.page.waitForTimeout(100)
    await fromTile.click();
    await fromTile.dragTo(toTile);
    await this.page.mouse.up();

    await fromTile.dragTo(toTile);
    
    this.highlightElement(fromTile);
    this.highlightElement(toTile);
  }
}