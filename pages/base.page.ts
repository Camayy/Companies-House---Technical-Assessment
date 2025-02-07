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

    /* await this.page.evaluate(({ fromSelector, toSelector }) => {
      const fireMouseEvent = (type, element, clientX, clientY) => {
        const event = new MouseEvent(type, {
          bubbles: true,
          cancelable: true,
          clientX,
          clientY,
        });
        element.dispatchEvent(event);
      };

      const fromElement = document.querySelector(fromSelector);
      const toElement = document.querySelector(toSelector);

      if (!fromElement || !toElement) throw new Error('Unable to find tiles');

      const fromRect = fromElement.getBoundingClientRect();
      const toRect = toElement.getBoundingClientRect();

      fireMouseEvent('mousedown', fromElement, fromRect.x + fromRect.width / 2, fromRect.y + fromRect.height / 2);
      fireMouseEvent('mousemove', fromElement, fromRect.x + fromRect.width / 2, fromRect.y + fromRect.height / 2);

      fireMouseEvent('mousemove', toElement, toRect.x + toRect.width / 2, toRect.y + toRect.height / 2);

      fireMouseEvent('mouseup', toElement, toRect.x + toRect.width / 2, toRect.y + toRect.height / 2);
    }, { fromSelector: `.rbc-day-bg:not(.rbc-off-range-bg):nth-child(${fromDate})`, toSelector: `.rbc-day-bg:not(.rbc-off-range-bg):nth-child(${toDate})` });


    const fromTileBoundingBox = await fromDay.boundingBox();
    const toTileBoundingBox = await toDay.boundingBox();
 */
    /* if (fromTileBoundingBox && toTileBoundingBox) {
      // Drag using mouse actions
      await this.page.mouse.move(
        fromTileBoundingBox.x + fromTileBoundingBox.width / 2,
        fromTileBoundingBox.y + fromTileBoundingBox.height / 2
      );
      await this.page.mouse.down();

      await this.page.mouse.move(
        toTileBoundingBox.x + toTileBoundingBox.width / 2,
        toTileBoundingBox.y + toTileBoundingBox.height / 2
      );
      //await this.page.mouse.up();

      await this.page.mouse.move(
        fromTileBoundingBox.x + fromTileBoundingBox.width / 2,
        fromTileBoundingBox.y + fromTileBoundingBox.height / 2
      );
      await this.page.mouse.up();
    } */

   /*  await fromDay.hover();
    await fromDay.dragTo(toDay);

    try {
      await fromTile.hover();
    } catch (error) {
      console.error(error);
    } */

    await fromTile.hover();
    await this.page.waitForTimeout(100)
    await fromTile.click();
    await fromTile.dragTo(toTile);
    await this.page.mouse.up();
  }
}