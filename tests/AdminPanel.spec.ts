import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { AdminPage } from '../pages/adminLogin.page';
import { RoomsPage } from '../pages/rooms.page';
import { BrandingPage } from '../pages/branding.page';
import { MessagePage } from '../pages/messages.page';
import { ReportPage } from '../pages/report.page';
import { RoomPage } from '../pages/room.page';

test.describe('Admin panel functional tests', () => {
  test('Create a new room via admin panel and verify it is created correctly', async ({ page }) => {
    const adminPage = new AdminPage(page);
    const roomsPage = new RoomsPage(page);
    await adminPage.navigateTo('/#/admin');

    await adminPage.loginAsAdmin();

    const roomName = 'abc';
    const accessible = 'true';
    const roomType = 'Double';
    const roomPrice = '35';
    const roomDetails = 'Radio, Safe';

    await roomsPage.setRoomName(roomName);
    await roomsPage.selectAccessibleDropdownOption(accessible);
    await roomsPage.selectRoomTypeDropdownOption(roomType);
    await roomsPage.setRoomPrice(roomPrice);
    await roomsPage.selectRadioCheckbox();
    await roomsPage.selectSafeCheckbox();

    await roomsPage.clickCreateRoomButton();

    const expectedRoomDetails = {
      roomName: roomName,
      roomType: roomType,
      roomAccessible: accessible,
      roomPrice: roomPrice,
      roomDetails: roomDetails,

    };

    const actualRoomDetails = await roomsPage.getLatestRoomBooking();
    const detailsComparison = (JSON.stringify(expectedRoomDetails) === JSON.stringify(actualRoomDetails));
    expect(await detailsComparison).toBe(true);

  });

  test('Remove a room', async ({ page }) => {
    const adminPage = new AdminPage(page);
    const roomsPage = new RoomsPage(page);
    await adminPage.navigateTo('/#/admin');

    await adminPage.loginAsAdmin();

    const roomName = 'myroom';
    await roomsPage.setRoomName(roomName);
    await roomsPage.selectRoomTypeDropdownOption('Double');
    await roomsPage.selectAccessibleDropdownOption('true');
    await roomsPage.setRoomPrice('999');
    await roomsPage.clickCreateRoomButton();

    expect(await roomsPage.doesRoomExist(roomName)).toBe(true);

    await roomsPage.removeRoom(roomName);

    expect(await roomsPage.doesRoomExist(roomName)).toBe(false);
  });

  test('Check admmin recieves a contact notification', async ({ page }) => {
    const messagesPage = new MessagePage(page);
    const homePage = new HomePage(page);
    const adminPage = new AdminPage(page);

    await homePage.navigateTo('/');
    const name = 'Hopefully Unique';
    const subject = 'Test subject';

    await homePage.fillContactForm(
      name,
      'testuser@test.com',
      '123456789000',
      subject,
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'
    );
    await homePage.clickSubmitContactButton();
    await adminPage.navigateTo('/#/admin/messages');

    await adminPage.loginAsAdmin();

    expect(await messagesPage.hasMessageBeenRecievedFromUser(name, subject)).toBe(true);
  });

  test('Booking a room via the admin panel', async ({ page }) => {
    const adminPage = new AdminPage(page);
    const reportPage = new ReportPage(page);

    await adminPage.navigateTo('/#/admin/report');
    await adminPage.loginAsAdmin();

    await reportPage.setBookingDates(14, 17);
    await reportPage.fillBookingModal("test", "name", "666", true);
    expect(await reportPage.hasBookingBeenMade("")).toBe(true);
  });

  test('Edit site details and verify changes have been made', async ({ page }) => {
    const adminPage = new AdminPage(page);
    const brandingPage = new BrandingPage(page);
    const homePage = new HomePage(page);

    await adminPage.navigateTo('/#/admin/branding');

    await adminPage.loginAsAdmin();

    const hotelName = "Testbranding";
    await brandingPage.updateContactField(hotelName);
    await brandingPage.clickSubmitButton();

    await homePage.navigateTo("/");

    expect(await homePage.getHotelName()).toBe(hotelName);
  });

  test('View and Edit room details', async ({ page }) => {
    const adminPage = new AdminPage(page);
    const roomsPage = new RoomsPage(page);
    const roomPage = new RoomPage(page);

    await roomsPage.navigateTo('/#/admin');
    await adminPage.loginAsAdmin();

    const roomName = 'editroom';
    const accessible = 'true';
    const roomType = 'Double';
    const roomPrice = '35';

    await roomsPage.setRoomName(roomName);
    await roomsPage.selectAccessibleDropdownOption(accessible);
    await roomsPage.selectRoomTypeDropdownOption(roomType);
    await roomsPage.setRoomPrice(roomPrice);
    await roomsPage.selectRadioCheckbox();
    await roomsPage.selectTVCheckbox

    await roomsPage.clickCreateRoomButton();
    await roomsPage.viewRoomByName(roomName);

    const oldRoomName = await roomPage.getRoomName();
    await roomPage.clickEditButton();
    await roomPage.fillRoomNameField("new room 123");
    await roomPage.clickUpdateButton();

    const newRoomNameActual = await roomPage.getRoomName();

    expect(oldRoomName).toBe(newRoomNameActual);
  });

  test('Edit and remove booking from a room', async ({ page }) => {
    const adminPage = new AdminPage(page);
    const roomsPage = new RoomsPage(page);
    const roomPage = new RoomPage(page);

    await roomsPage.navigateTo('/#/admin');
    await adminPage.loginAsAdmin();
    await roomsPage.viewRoomByName('101');

    await roomPage.clickEditRoomBookingByLastName("Dean");
    const newLastName = "testlastname";
    await roomPage.updateLastNameField(newLastName);
    await roomPage.clickConfirmBookingEditButton();

    expect(await roomPage.getBookingRowLastName()).toBe(newLastName);
  });

});
