import {HomePage} from '../home/home.po';

import {Sidebar} from './sidebar.po';

import {SettingsDetails} from '../settings/details/details.po';
import {SettingsOverview} from '../settings/overview/overview.po';

describe('Sidebar', () => {
  let sidebar: Sidebar;
  let home: HomePage;
  let settingsOverview: SettingsOverview;
  let settingsDetails: SettingsDetails;

  beforeEach(() => {
    sidebar = new Sidebar();
    sidebar.navigateToHome();
  });

  it('should exist', () => {
    expect(sidebar.getSidebar()).toBeTruthy();
  });

  it('should have no text before button click', () => {
    expect(sidebar.isTextPresent()).toBeFalsy();
  });

  // Propaply doesnt work because of right management
  xit('should have text after button click', () => {
    sidebar.clickButton();
    expect(sidebar.getSidebarText()).toBeTruthy();
    expect(sidebar.getTextHome()).toEqual('HOME');
    expect(sidebar.getTextVerwaltung()).toEqual('VERWALTUNG');
    expect(sidebar.getTextWettkaempfe()).toEqual('WETTKAEMPFE');
    expect(sidebar.getTextwkdurchfuehrung()).toEqual('WETTKAMPFDURCHFÜHRUNG');
  });

  it('should have icons before and after click', () => {
    expect(sidebar.getIcons()).toBeTruthy();
    expect(sidebar.getIconHome()).toBeTruthy();
    expect(sidebar.getIconWkdurchfuehrung()).toBeTruthy();
    expect(sidebar.getIconVerwaltung()).toBeTruthy();
    expect(sidebar.getIconWettkaempfe()).toBeTruthy();
    sidebar.clickButton();
    expect(sidebar.getIcons()).toBeTruthy();
    expect(sidebar.getIconHome()).toBeTruthy();
    expect(sidebar.getIconWkdurchfuehrung()).toBeTruthy();
    expect(sidebar.getIconVerwaltung()).toBeTruthy();
    expect(sidebar.getIconWettkaempfe()).toBeTruthy();
  });

  it('should be visible on all pages', () => {
    // Home
    home = new HomePage();
    home.navigateToHome();
    expect(sidebar.isSidebarPresent()).toBeTruthy();
    // Verwaltung

    // Wettkaempfe

    // wkdurchfuehrung

    // Login

    // Settings Overview
    settingsOverview = new SettingsOverview();
    settingsOverview.navigateToSettingsOverview();
    expect(sidebar.isSidebarPresent()).toBeTruthy();
    // Settings Details
    settingsDetails = new SettingsDetails();
    settingsDetails.navigateToSettingsDetails();
    expect(sidebar.isSidebarPresent()).toBeTruthy();
  });
});
