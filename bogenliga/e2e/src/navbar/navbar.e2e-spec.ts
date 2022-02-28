import {HomePage} from '../home/home.po';

import {Navbar} from './navbar.po';

import {SettingsOverview} from '../settings/overview/overview.po';

import {SettingsDetails} from '../settings/details/details.po';

describe('Navbar', () => {
  let navbar: Navbar;
  let home: HomePage;
  let settingsOverview: SettingsOverview;
  let settingsDetails: SettingsDetails;

  beforeEach(() => {
    navbar = new Navbar();
    navbar.navigateToHome();
  });

  it('should exist', () => {
    expect(navbar.getNavbar()).toBeTruthy();
  });

  it('Toggle should exist', () => {
    expect(navbar.getToggle).toBeTruthy();
  });

  it('Logo should exist', () => {
    expect(navbar.getLogo()).toBeTruthy();
  });

  it('Title should exist', () => {
    expect(navbar.getTitel()).toBeTruthy();
  });

  it('Login should exist', () => {
    expect(navbar.getLogin()).toBeTruthy();
  });

  it('should be visible on all pages', () => {
    // Home
    home = new HomePage();
    home.navigateToHome();
    expect(navbar.isNavbarPresent()).toBeTruthy();
    // Verwaltung

    // Wettkaempfe

    // wkdurchfuehrung

    // Login

    // Settings Overview
    settingsOverview = new SettingsOverview();
    settingsOverview.navigateToSettingsOverview();
    expect(navbar.isNavbarPresent()).toBeTruthy();
    // Settings Details
    settingsDetails = new SettingsDetails();
    settingsDetails.navigateToSettingsDetails();
    expect(navbar.isNavbarPresent()).toBeTruthy();
  });
});
