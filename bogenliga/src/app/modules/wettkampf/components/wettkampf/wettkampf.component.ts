import {Component, OnInit} from '@angular/core';
import {WETTKAMPF_CONFIG} from './wettkampf.config';
import {CommonComponentDirective, toTableRows} from '@shared/components';
import {BogenligaResponse, UriBuilder} from '@shared/data-provider';
import {TableRow} from '@shared/components/tables/types/table-row.class';
import {WETTKAMPF_TABLE_CONFIG} from './wettkampergebnis/tabelle.config';
import {WETTKAMPF_TABLE_EINZEL_CONFIG} from './wettkampergebnis/tabelle.einzel.config';
import {
  WETTKAMPF_TABLE_EINZELGESAMT_CONFIG
} from '@wettkampf/components/wettkampf/wettkampergebnis/tabelle.einzelGesamt.config';
import {WettkampfErgebnisService} from '@wettkampf/services/wettkampf-ergebnis.service';
import {DsbMannschaftDataProviderService} from '@verwaltung/services/dsb-mannschaft-data-provider.service';
import {DsbMannschaftDO} from '@verwaltung/types/dsb-mannschaft-do.class';
import {MatchDataProviderService} from '@wettkampf/services/match-data-provider.service';
import {WettkampfDataProviderService} from '@verwaltung/services/wettkampf-data-provider.service';
import {PasseDataProviderService} from '@wettkampf/services/passe-data-provider.service';
import {VeranstaltungDataProviderService} from '@verwaltung/services/veranstaltung-data-provider.service';
import {VereinDataProviderService} from '@verwaltung/services/verein-data-provider.service';
import {SchuetzenstatistikDataProviderService} from '@wettkampf/services/schuetzenstatistik-data-provider-service';
import {WettkampfDO} from '@verwaltung/types/wettkampf-do.class';
import {PasseDoClass} from '@verwaltung/types/passe-do-class';
import {VeranstaltungDO} from '@verwaltung/types/veranstaltung-do.class';
import {VereinDO} from '@verwaltung/types/verein-do.class';
import {MatchDO} from '@verwaltung/types/match-do.class';
import {CurrentUserService, NotificationService, OnOfflineService} from '@shared/services';
import {MannschaftsMitgliedDO} from '@verwaltung/types/mannschaftsmitglied-do.class';
import {environment} from '@environment';
import {SchuetzenstatistikDO} from '@verwaltung/types/schuetzenstatistik-do.class';
import {SessionHandling} from '@shared/event-handling';
import {ActionButtonColors} from '@shared/components/buttons/button/actionbuttoncolors';
import {WETTKAMPF_TABLE_MATCH_CONFIG} from '@wettkampf/components/wettkampf/wettkampergebnis/tabelle.siebenmatch.config';
import {WETTKAMPF_TABLE_ALLELIGENPROSAISON_CONFIG} from '@wettkampf/components/wettkampf/wettkampergebnis/tabelle.pfeilschnittalleligenprosaison.config';
import {WETTKAMPF_TABLE_WETTKAMPFTAGE_CONFIG} from '@wettkampf/components/wettkampf/wettkampergebnis/tabelle.wettkampftage.config';
import {SchuetzenstatistikMatchDataProviderService} from '@wettkampf/services/schuetzenstatistikmatch-data-provider-service';
import {SchuetzenstatistikMatchDO} from '@verwaltung/types/schuetzenstatistikmatch-do.class';

import {SchuetzenstatistikWettkampftageDO} from '@verwaltung/types/schuetzenstatistikwettkampftage-do.class';
import {
  SchuetzenstatistikwettkampftageDataProviderService
} from '@wettkampf/services/schuetzenstatistikwettkampftage-data-provider-service';
import {SportjahrVeranstaltungDO} from '@verwaltung/types/sportjahr-veranstaltung-do';
import {DecimalPipe} from '@angular/common';
import {LigatabelleDataProviderService} from '../../../ligatabelle/services/ligatabelle-data-provider.service';
import {LigatabelleErgebnisDO} from '../../../ligatabelle/types/ligatabelle-ergebnis-do.class';
import {MannschaftTabellenverlaufSportjahre} from '@verwaltung/types/mannschaftstatistiksportjahre-do.class';
import {SchuetzenstatistikMatchDTO} from '@verwaltung/types/datatransfer/schuetzenstatistikmatch-dto.class';
import {
  WETTKAMPF_TABLE_SECHS_MATCHES_CONFIG
} from '@wettkampf/components/wettkampf/wettkampergebnis/tabelle.sechsmatch.config';
import {
  WETTKAMPF_TABLE_FUENF_MATCHES_CONFIG
} from '@wettkampf/components/wettkampf/wettkampergebnis/tabelle.fuenfmatch.config';

interface Wettkampftag {
  id: string;
  name: string;
}

@Component({
  selector:    'bla-mannschaft',
  templateUrl: './wettkampf.component.html',
  styleUrls:   ['./wettkampf.component.scss'],
  providers: [DecimalPipe]
})

export class WettkampfComponent extends CommonComponentDirective implements OnInit {

  public show = false;
  public currentConfig = WETTKAMPF_TABLE_EINZELGESAMT_CONFIG;
  public config = WETTKAMPF_CONFIG;
  public config_table = WETTKAMPF_TABLE_CONFIG;
  public config_einzel_table = WETTKAMPF_TABLE_EINZEL_CONFIG;
  public config_einzelGesamt_table = WETTKAMPF_TABLE_EINZELGESAMT_CONFIG;
  public config_schuetzenstatistikMatch_table = WETTKAMPF_TABLE_MATCH_CONFIG;
  public config_schuetzenstatistikWettkampftage_table = WETTKAMPF_TABLE_WETTKAMPFTAGE_CONFIG;
  public jahre: Array<SportjahrVeranstaltungDO> = [];
  public config_alleligen_table = WETTKAMPF_TABLE_ALLELIGENPROSAISON_CONFIG;
  public currentJahr: number;
  public vereine: Array<VereinDO> = [];
  public mannschaften: Array<DsbMannschaftDO> = [];
  public veranstaltungen: Array<VeranstaltungDO> = [];
  public currentVeranstaltung: VeranstaltungDO = new VeranstaltungDO();
  public currentMannschaft: DsbMannschaftDO = new DsbMannschaftDO();
  public currentVerein: VereinDO = new VereinDO();
  // properties required the mannschafttabellenverlauf over the sporjahre
  private filteredVeranstaltungenOfLiga: VeranstaltungDO[];
  public mannschafttabellenverlaufConfig = WETTKAMPF_TABLE_EINZEL_CONFIG;
  private mannschaftTabellenverlaufSportjahre = new MannschaftTabellenverlaufSportjahre();
  public multipleSelections = true;
  // Because we have several match tables, we need an array of arrays for the several Rows in each Table
  public rows: Array<TableRow[]> = new Array<TableRow[]>();
  public areVeranstaltungenLoading = true;
  public loadingData = false;
  public currentStatistikTitle = 'MANNSCHAFTEN.SCHUETZEN_STATISTIK.TITEL';
  public matches: Array<MatchDO[]> = [];
  public wettkaempfe: Array<WettkampfDO> = [];
  private passen: Array<PasseDoClass[]> = [];
  public mannschaftsmitglieder: Array<MannschaftsMitgliedDO> = [];
  public ActionButtonColors = ActionButtonColors;
  public selectedWettkampfTag: Wettkampftag;
  public wettkampftage: Array<Wettkampftag> = [];
  private sessionHandling: SessionHandling;

  public selectedStatistik = 'gesamtstatistik';
  public selectedMannschaftStatistik = 'aktuelle_mannschaft';

  public schuetzenStatistikActive = false;
  public mannschaftStatistikActive = false;
  public alleTage: Array<Wettkampftag> = [
    {id: 'Table1', name: 'MANNSCHAFTEN.DROPDOWNWETTKAMPFTAGE.OPTION1.LABEL'},
    {id: 'Table2', name: 'MANNSCHAFTEN.DROPDOWNWETTKAMPFTAGE.OPTION2.LABEL'},
    {id: 'Table3', name: 'MANNSCHAFTEN.DROPDOWNWETTKAMPFTAGE.OPTION3.LABEL'},
    {id: 'Table4', name: 'MANNSCHAFTEN.DROPDOWNWETTKAMPFTAGE.OPTION4.LABEL'}
  ];

  /**
   * Enthält alle Veranstaltungen aus dem ausgewählten Sportjahr
   * {@link this.filterVeranstaltungenBySportjahr}
   */

  popup: boolean;

  // Die Werte des Array's entspricht dem Inhalt von allen 4 Wettkampftagen. false = leere Tabelle, true = Tabelle mit Inhalt
  isTableFilled: Array<boolean> = [false, false, false, false];

  constructor(
    private veranstaltungsDataProvider: VeranstaltungDataProviderService,
    private vereinDataProvider: VereinDataProviderService,
    private wettkampfDataProviderService: WettkampfDataProviderService,
    private matchDataProviderService: MatchDataProviderService,
    private passeDataProviderService: PasseDataProviderService,
    private wettkampfErgebnisService: WettkampfErgebnisService,
    private mannschaftDataProvider: DsbMannschaftDataProviderService,
    private schuetzenstatistikDataProvider: SchuetzenstatistikDataProviderService,
    private schuetzenstatistikMatchDataProvider: SchuetzenstatistikMatchDataProviderService,
    private schuetzenstatistikWettkampftageDataProvider: SchuetzenstatistikwettkampftageDataProviderService,
    private ligaTabelleDataProvider: LigatabelleDataProviderService,
    private currentUserService: CurrentUserService,
    private onOfflineService: OnOfflineService) {
    super();
    this.sessionHandling = new SessionHandling(this.currentUserService, this.onOfflineService);
  }

  /**
   * Gets the value from path if Wettkampfergebnisse page is called. Starts after than loading of all Veranstaltungen
   * @see this.loadVeranstaltungen
   */
  ngOnInit() {
    this.init();
  }

  async init() {
    await this.loadJahre();
    this.loadVeranstaltungen(this.currentJahr);
    this.selectedWettkampfTag =  this.alleTage[0];
  }

  /** When a MouseOver-Event is triggered, it will call this inMouseOver-function.
   *  This function calls the checkSessionExpired-function in the sessionHandling class and get a boolean value back.
   *  If the boolean value is true, then the page will be reloaded and due to the expired session, the user will
   *  be logged out automatically.
   */
  public onMouseOver(event: any) {
    const isExpired = this.sessionHandling.checkSessionExpired();
    if (isExpired) {
      window.location.reload();
    }
  }

  /**
   * Loads the currently selected verein
   * @param vereinId | loads the verein with this Id
   */
  public async loadVerein(vereinId: number) {
    await this.vereinDataProvider.findById(vereinId)
              .then((response: BogenligaResponse<VereinDO>) => this.handleLoadVerein(response))
              .catch(() => this.handleLoadVerein(null));
    // document.getElementById('vereinsinformationen').classList.remove('hidden');
  }

  /**
   * Sets the currently selected verein to the response
   * @param response | sets the current verein to the response
   */
  public handleLoadVerein(response: BogenligaResponse<VereinDO>) {
    this.currentVerein = response.payload;
  }

  public async loadAllErgebnisse(selectedMannschaft: DsbMannschaftDO) {
    this.loadingData = true;
    await this.loadErgebnisse(selectedMannschaft);
    this.loadingData = false;
  }

  public async loadErgebnisForMannschaft(selectedMannschaft: DsbMannschaftDO) {
    this.loadingData = true;
    await this.loadErgebnisse(selectedMannschaft);
    this.loadingData = false;
  }

  /**
   * At first the selected rows throw rowNumber will be hidden depending on what statistic will be loaded.
   * Based on the IDs of the rows using for-loop the appropriate match-days will be loaded.
   * Depending on the row number the table config_table will be loaded.
   * Create Results for a Match encounter from a single Wettkampf and push it to this.rows. Rows is used to get the
   * values in the correct table in wettkampf.component.html
   * @param selectedMannschaft | Is this.currentMannschaft or undefined.
   * If this.currentMannschaft all match encounters from one team get created, else from all.
   * At the end the button for printing will be hidden so that its only available for 'Einzelstatistik'.
   */
  public async loadErgebnisse(selectedMannschaft: DsbMannschaftDO) {

    if (selectedMannschaft === undefined) {
      this.showUebersichtsButtons();
    } else {
      this.hideUebersichtsButtons();
    }
    this.clearAllStatistikTables();
    for (let i = 0; i < 4; i++) {
      let rowNumber = 'row';
      rowNumber += i;
      document.getElementById(rowNumber).classList.remove('hidden');
      rowNumber += '1';
      document.getElementById(rowNumber).classList.add('hidden');
    }
    for (let i = 0; i <= 4; i++) {
      let tableNumber = 'Table';
      tableNumber += i;
      if (i === 0) {
        document.getElementById(tableNumber).classList.add('hidden');
      } else {
        document.getElementById(tableNumber).classList.remove('hidden');
      }
    }
    this.rows = [];
    for (let i = 0; i < this.wettkaempfe.length; i++) {
      this.rows.push(toTableRows(this.wettkampfErgebnisService.createErgebnisse(this.currentJahr, selectedMannschaft,
        this.mannschaften, this.currentVeranstaltung, this.matches[i], this.passen[i])));
    }
    // This loop saves that the table is either empty or not. If table empty -> don't show on frontend
    for (let i = 0; i < this.rows.length; i++) {
      if (this.rows[i].length > 0) {
        this.isTableFilled[i] = true;
      }
    }
  }

  selectSchuetzenstatistikConfig(chosenTable) {
    if (chosenTable === 0) {
      return this.config_schuetzenstatistikWettkampftage_table;
    } else if (chosenTable === 1) {
      return this.config_schuetzenstatistikMatch_table;
    } else if (chosenTable === 2) {
      return this.config_einzel_table;
    } else if (chosenTable === 3) {
      return this.config_einzelGesamt_table;
    }
    return this.currentConfig;
  }

  /* loadEinzelstatistik
  Die ersten beiden for-Schleifen dienen dazu die jeweilige Reihe/Tabelle entweder zu verstecken oder anzuzeigen.
  Desweiteren wird hier die Tabelle befüllt für die Einzelstatistik der Schützen (die zugehörigen Methoden sind in wettkampf-ereignis-service.ts zu finden)
  Am Ende wird der Button zum drucken der 'Einzelstatistik' eingeblendet da er hierfür relevant ist.
   */
  public async loadEinzelstatistik(selectedMannschaft: DsbMannschaftDO) {
    this.hideUebersichtsButtons();
    this.wettkampftage = this.alleTage.slice(0, this.wettkaempfe.length);
    this.selectedWettkampfTag = this.alleTage[0];
    if (selectedMannschaft !== undefined && selectedMannschaft !== null) {
      await this.clearAllStatistikTables();
     /* for (let i = 0; i < 4; i++) {
        document.getElementById('row' + i + '1').classList.remove('hidden');
        document.getElementById('Table' + (i + 1)).classList.remove('hiddens');
      }
      */
      this.loadingData = true;
      this.currentConfig = WETTKAMPF_TABLE_EINZEL_CONFIG;
      document.getElementById('Table0').classList.remove('hidden');
      document.getElementById('row00').classList.remove('hidden');
      this.rows = [];
      await this.loadSchuetzenstatistiken(selectedMannschaft.vereinId, 0);
      // This loop saves that the table is either empty or not. If table empty -> don't show on frontend
      for (let i = 0; i < this.rows.length; i++) {
        if (this.rows[i].length > 0) {
          this.isTableFilled[i] = true;
        }
      }
    }
    this.loadingData = false;
  }

  private async loadSchuetzenstatistikMatch(selectedMannschaft: DsbMannschaftDO) {
    this.hideUebersichtsButtons();
    this.loadingData = true;
    this.wettkampftage = this.alleTage.slice(0, this.wettkaempfe.length);
    this.selectedWettkampfTag = this.alleTage[0];
    if (selectedMannschaft !== undefined && selectedMannschaft !== null) {
      await this.clearAllStatistikTables();
      this.rows = [];
      // make first wettkampftag row visible
      this.currentConfig = WETTKAMPF_TABLE_MATCH_CONFIG;
      document.getElementById('Table0').classList.remove('hidden');
      document.getElementById('row00').classList.remove('hidden');
      await this.loadSchuetzenstatistikenMatch(selectedMannschaft.vereinId, 0);
      if (this.loadingData) {
        // this decides whether a wettkampf had 5, 6 or 7 matches, depending on the count the configuration will be adjusted
        if (this.rows.some((wettkampftag) => wettkampftag.some((wettkampf) => {
          const statistics = wettkampf.payload as SchuetzenstatistikMatchDTO;
          return statistics.match7 !== null;
        }))) {
          this.currentConfig = WETTKAMPF_TABLE_MATCH_CONFIG;
        } else if (this.rows.some((wettkampftag) => wettkampftag.some((wettkampf) => {
          const statistics = wettkampf.payload as SchuetzenstatistikMatchDTO;
          return statistics.match6 !== null;
        }))) {
          this.currentConfig = WETTKAMPF_TABLE_SECHS_MATCHES_CONFIG;
        } else {
          this.currentConfig = WETTKAMPF_TABLE_FUENF_MATCHES_CONFIG;
        }

        // This loop saves that the table is either empty or not. If table empty -> don't show on frontend
        for (let i = 0; i < this.rows.length; i++) {
          if (this.rows[i].length > 0) {
            this.isTableFilled[i] = true;
           }
          }
      } else {
        this.rows = [];
      }
    }
    this.loadingData = false;
  }

  public async loadSchuetzenstatistikWettkampftage(selectedMannschaft: DsbMannschaftDO) {
    this.hideUebersichtsButtons();
    if (selectedMannschaft !== undefined && selectedMannschaft !== null) {
      await this.clearAllStatistikTables();
      this.rows = [];
      await this.schuetzenstatistikWettkampftageDataProvider.getSchuetzenstatistikWettkampftageVeranstaltung(selectedMannschaft.vereinId, this.currentVeranstaltung.id)
                .then((response: BogenligaResponse<SchuetzenstatistikWettkampftageDO[]>) => this.handleLoadSchuetzenstatistikWettkampftageSuccess(response.payload));
      this.currentConfig = WETTKAMPF_TABLE_WETTKAMPFTAGE_CONFIG;
      document.getElementById('Table0').classList.remove('hidden');
      document.getElementById('row00').classList.remove('hidden');
      // This loop saves that the table is either empty or not. If table empty -> don't show on frontend
      for (let i = 0; i < this.rows.length; i++) {
        if (this.rows[i].length > 0) {
          this.isTableFilled[i] = true;
        }
      }
    }
    this.loadingData = false;
  }

  /**
   * Die ersten beiden for-Schleifen dienen dazu die jeweilige Reihe/Tabelle entweder zu verstecken oder anzuzeigen.
   * Desweiteren wird hier die Tabelle befüllt für die Gesamtstatistik der Schützen (die zugehörigen Methoden sind in
   * wettkampf-ergebnis-service.ts zu finden) Am Ende wird der Button zum drucken der 'Einzelstatistik' eingeblendet da
   * er hierfür relevant ist.
   */
  public async loadGesamtstatistik(selectedMannschaft: DsbMannschaftDO) {
    this.hideUebersichtsButtons();
    if (selectedMannschaft !== undefined && selectedMannschaft !== null) {
      await this.clearAllStatistikTables();
      this.rows = [];
      await this.schuetzenstatistikDataProvider.getSchuetzenstatistikVeranstaltung(selectedMannschaft.vereinId, this.currentVeranstaltung.id)
                .then((response: BogenligaResponse<SchuetzenstatistikDO[]>) => this.handleLoadSchuetzenstatistikSuccess(response.payload));
      document.getElementById('Table0').classList.remove('hidden');
      document.getElementById('row00').classList.remove('hidden');
      document.getElementById('einzeldruckButton').classList.add('hidden');
      document.getElementById('gesamtdruckButton').classList.remove('hidden');

      // This loop saves that the table is either empty or not. If table empty -> don't show on frontend
      for (let i = 0; i < this.rows.length; i++) {
        if (this.rows[i].length > 0) {
          this.isTableFilled[i] = true;
        }
      }
    }
    this.loadingData = false;
  }

  public async loadAlleLigenProSaisonStatistik(selectedMannschaft: DsbMannschaftDO) {
    this.hideUebersichtsButtons();
    if (selectedMannschaft !== undefined && selectedMannschaft !== null) {
      await this.clearAllStatistikTables();
      this.rows = [];
      await this.schuetzenstatistikWettkampftageDataProvider.getSchuetzenstatistikAlleLigen(this.currentJahr, selectedMannschaft.vereinId)
                .then((response: BogenligaResponse<SchuetzenstatistikWettkampftageDO[]>) => this.handleLoadSchuetzenstatistikAlleLigenSuccess(response.payload));
      this.currentConfig = WETTKAMPF_TABLE_ALLELIGENPROSAISON_CONFIG;
      document.getElementById('Table0').classList.remove('hidden');
      document.getElementById('row00').classList.remove('hidden');
      // This loop saves that the table is either empty or not. If table empty -> don't show on frontend
      for (let i = 0; i < this.rows.length; i++) {
        if (this.rows[i].length > 0) {
          this.isTableFilled[i] = true;
        }
      }
    }
    this.loadingData = false;
  }

  private async loadSchuetzenstatistiken(vereinId, index) {
    await this.loadSchuetzenstatistikEinzel(vereinId, this.wettkaempfe[index].id)
              .then((response: BogenligaResponse<SchuetzenstatistikDO[]>) => this.handleLoadSchuetzenstatistikSuccess(response.payload));
    if (index < this.wettkaempfe.length - 1) {
      index += 1;
      return this.loadSchuetzenstatistiken(vereinId, index);
    }
  }

  private async loadSchuetzenstatistikenMatch(vereinId, index) {
    await this.loadSchuetzenstatistikMatchData(vereinId, this.wettkaempfe[index].id)
              .then((response: BogenligaResponse<SchuetzenstatistikMatchDO[]>) => this.handleLoadSchuetzenstatistikMatchSuccess(response.payload))
              .catch((response: BogenligaResponse<SchuetzenstatistikMatchDO[]>) => this.handleLoadSchuetzenstatistikMatchFailure(response.payload));
    if (index < this.wettkaempfe.length - 1 && this.loadingData) {
      index += 1;
      return this.loadSchuetzenstatistikenMatch(vereinId, index);
    }
  }
  private handleLoadSchuetzenstatistikMatchFailure(payload) {
    this.loadingData = false;
  }
  private async loadSchuetzenstatistikenWettkampftage(vereinId, index) {
    await this.loadSchuetzenstatistikWettkampftageData(vereinId, this.currentVeranstaltung.id)
              .then((response: BogenligaResponse<SchuetzenstatistikWettkampftageDO[]>) => this.handleLoadSchuetzenstatistikWettkampftageSuccess(response.payload));

  }
  private async loadSchuetzenstatistikWettkampftageData(vereinId, veranstaltungId) {
    return this.schuetzenstatistikWettkampftageDataProvider.getSchuetzenstatistikWettkampftageVeranstaltung(vereinId, veranstaltungId);

  }


  private async loadSchuetzenstatistikMatchData(vereinId, wettkampfId) {
    return this.schuetzenstatistikMatchDataProvider.getSchuetzenstatistikMatchWettkampf(vereinId, wettkampfId);
  }

  private async loadSchuetzenstatistikEinzel(vereinId, wettkampfId) {
    return this.schuetzenstatistikDataProvider.getSchuetzenstatistikWettkampf(vereinId, wettkampfId);
  }

  /**
   * Formats the Schuetzenstatistiken (=> German browser settings => 9,25 instead of 9.25
   * In addition is transforming 'schuetzeSatz1-5' into a more readable format
   */
  private formatStatistik(statistikRow: TableRow[]): TableRow[] {
    statistikRow.forEach((row) => {
      for (const columnKey in row.payload ) {
        // formats numbers into country-dependent format
        if (typeof row.payload[columnKey] === 'number' && row.payload[columnKey] != null) {
          row.payload[columnKey] = row.payload[columnKey].toLocaleString();
          // transforms saetze into a more readable format
        } else if (columnKey.startsWith('schuetzeSatz') && row.payload[columnKey] != null) {
          row.payload[columnKey] = row.payload[columnKey].replace(',', ' | ');
        }
      }
    });
    return statistikRow;
  }
  private handleLoadSchuetzenstatistikSuccess(payload) {
    if (payload.length > 0) {
      const formattedRows = this.formatStatistik(toTableRows(payload));
      this.rows.push(formattedRows);
    }
  }

  private handleLoadSchuetzenstatistikMatchSuccess(payload) {
    if (payload.length > 0) {
      const formattedRows = this.formatStatistik(toTableRows(payload));
      this.rows.push(formattedRows);
    }
  }

  private handleLoadSchuetzenstatistikWettkampftageSuccess(payload) {
    if (payload.length > 0) {
      const formattedRows = this.formatStatistik(toTableRows(payload));
      this.rows.push(formattedRows);
    }
  }

  private handleLoadSchuetzenstatistikAlleLigenSuccess(payload) {
    if (payload.length > 0) {
      console.log(payload);
      this.rows.push(toTableRows(payload));
    }
  }

  /* loadPopup
   ich werde in html aufgerufen,
   wenn ein Popup erscheinen soll das aufmerksam macht, dass die Mannschaft noch nicht ausgewählt wurde.
   Es werden die funktionen loadGesamtstatistik und loadEinzelstatistik im zusammenhang mit der variable gesamt aufgerufen,
   sofern diese in dem jeweiligen Button auf true oder false gesetzt ist.
   */


  /**
   * Get the data from the currently selected Veranstaltung. Starts the loading chain for all Wettkaempfe
   * @see this.loadWettkaempfe
   * @param $event
   */
  public async onSelect(): Promise<void> {
    this.loadingData = true;
    this.clear();
    document.getElementById('selectWettkampftag').classList.add('hidden');
    await this.loadMannschaften(this.currentVeranstaltung.id);
    await this.loadWettkaempfe(this.currentVeranstaltung.id);

    this.currentStatistikTitle = 'MANNSCHAFTEN.SCHUETZEN_STATISTIK.TITEL';

    // Lädt je nach dem welche Statistik ausgewählt ist die jeweilige Statistik neu beim Mannschaftswechsel
    if (this.mannschaftStatistikActive) {
      this.selectedMannschaftStatistik = 'aktuelle_mannschaft';
      await this.loadErgebnisse(this.currentMannschaft);
    } else if (this.schuetzenStatistikActive) {
      this.selectedStatistik = 'gesamtstatistik';
      await this.loadGesamtstatistik(this.currentMannschaft);
    }
    this.loadingData = false;
  }

  private clear() {
    this.matches = [];
    this.passen = [];
    this.wettkaempfe = [];
    this.rows = [];
  }

  // backend-calls to get data from DB
  public async loadVeranstaltungen(sportjahr) {
    console.log(sportjahr);
    this.loadingData = true;
    await this.veranstaltungsDataProvider.findBySportjahrDestinct(sportjahr)
              .then((response: BogenligaResponse<VeranstaltungDO[]>) => this.handleSuccessLoadVeranstaltungen(response))
              .catch(() => this.veranstaltungen = []);

  }

  /**
   * Erzeugt ein Array aus Veranstaltungen, welche im aktuell ausgewählten Sportjahr stattinden.
   * Dieses Array ({@link this.veranstaltungBySportjahr}) wird in der {@link wettkampf.component.html}
   * demensprechend in das Dropdown für Veranstaltungen geladen.
   */
  public async filterVeranstaltungenBySportjahr() {
    this.loadingData = true;

    this.loadVeranstaltungen(this.currentJahr);


    this.loadingData = false;
  }


  async handleSuccessLoadVeranstaltungen(response: BogenligaResponse<VeranstaltungDO[]>) {
    this.veranstaltungen = response.payload;
    this.currentVeranstaltung = this.veranstaltungen[0];
    this.areVeranstaltungenLoading = false;

    await this.loadMannschaften(this.currentVeranstaltung.id);
    await this.loadWettkaempfe(this.currentVeranstaltung.id);

    if (this.mannschaftStatistikActive) {
      this.selectedMannschaftStatistik = 'aktuelle_mannschaft';
      await this.loadErgebnisse(this.currentMannschaft);
    } else if (this.schuetzenStatistikActive) {
      this.selectedStatistik = 'gesamtstatistik';
      await this.loadGesamtstatistik(this.currentMannschaft);
    }

    await this.showStatistikOptions();
  }

  public async loadMannschaften(veranstaltungsId: number) {
    await this.mannschaftDataProvider.findAllByVeranstaltungsId(veranstaltungsId)
      .then((response: BogenligaResponse<DsbMannschaftDO[]>) => {
        this.handleSuccessLoadMannschaft(response);
      })
      .catch(() => this.mannschaften === []);
  }

  public handleSuccessLoadMannschaft(response: BogenligaResponse<DsbMannschaftDO[]>) {
    this.mannschaften = response.payload;
    this.currentMannschaft = this.mannschaften[0];
    this.loadVerein(this.currentMannschaft.vereinId);
  }

  public async loadJahre() {
    const responseJahre = await this.veranstaltungsDataProvider.findAllSportyearDestinct();
    this.jahre = responseJahre.payload;
    this.currentJahr = this.jahre[0].sportjahr;
  }

  public async loadWettkaempfe(veranstaltungsId: number) {
    await this.wettkampfDataProviderService.findAllByVeranstaltungId(veranstaltungsId)
              .then((response: BogenligaResponse<WettkampfDO[]>) => this.handleLoadWettkaempfe(response.payload))
              .catch(() => this.handleLoadWettkaempfe([]));
  }

  public async loadWettkaempfeByCurrentMannschaft() {
    await this.wettkampfDataProviderService.findAllWettkaempfeByMannschaftsId(this.currentMannschaft.id)
              .then((response: BogenligaResponse<WettkampfDO[]>) => this.handleLoadWettkaempfe(response.payload))
              .catch(() => this.handleLoadWettkaempfe([]));
  }

  /**
   * Load all matches and passen for all wettkaempfe. The index variable is used to make sure the loaded
   * WettkampfErgebnisse are put in correct order into this.rows
   * @param wettkaempfe the amount of wettkaempfe of one Veranstaltung
   */
  public async handleLoadWettkaempfe(wettkaempfe: WettkampfDO[]) {
    this.wettkaempfe = wettkaempfe;
    for (let index = 0; index < this.wettkaempfe.length; index++) {
      await this.loadMatches(this.wettkaempfe[index].id, index);
    }
  }

  public async loadMatches(wettkampfId: number, index: number) {
    await this.matchDataProviderService.findByWettkampfId(wettkampfId)
              .then((response: BogenligaResponse<MatchDO[]>) => this.handleSuccessLoadMatches(response.payload, wettkampfId, index))
              .catch(() => this.handleSuccessLoadMatches([], wettkampfId, index));
  }


  public async handleSuccessLoadMatches(matches: MatchDO[], wettkampfId: number, index: number) {
    this.matches[index] = matches;
    await this.loadPassen(wettkampfId, matches, index);
  }

  public async loadPassen(wettkampfId: number, matches: MatchDO[], index: number) {
    await this.passeDataProviderService.findByWettkampfId(wettkampfId)
              .then((response: BogenligaResponse<PasseDoClass[]>) => this.handleSuccessLoadPassen(response.payload, matches, index))
              .catch(() => this.handleSuccessLoadPassen([], matches, index));
  }

  public handleSuccessLoadPassen(passen: PasseDoClass[], matches, index: number) {
    this.passen[index] = passen;
    // Insert the new generated WettkampfErgebnis[] into index from this.rows. This is necessary because the backend
    // loading times are different and would cause a wrong order if we would just load then step by step.
    this.rows[index] = toTableRows(this.wettkampfErgebnisService.createErgebnisse(this.currentJahr, undefined,
      this.mannschaften, this.currentVeranstaltung, matches, passen));
  }

  // method to change the name to a default, in case if there isn't a Team to for currentMannschaft
  public getTitle(): string {
    let placeholder = ' ';
    if (this.currentMannschaft !== undefined) {
      placeholder = this.currentMannschaft.name;
    }
    return placeholder;
  }

  public onButtonDownloadUebersicht(path: string): string {
    return new UriBuilder()
      .fromPath(environment.backendBaseUrl)
      .path('v1/download')
      .path(path + '&veranstaltungsid=' + this.currentVeranstaltung.id)
      .build();
  }

  private hideUebersichtsButtons(): void {
    document.getElementById('TagesuebersichtButton').classList.add('hidden');
    document.getElementById('TagesuebersichtButton2').classList.add('hidden');
    document.getElementById('TagesuebersichtButton3').classList.add('hidden');
    document.getElementById('TagesuebersichtButton4').classList.add('hidden');
  }
  public showUebersichtsButtons(): void {
    document.getElementById('TagesuebersichtButton').classList.remove('hidden');
    document.getElementById('TagesuebersichtButton2').classList.remove('hidden');
    document.getElementById('TagesuebersichtButton3').classList.remove('hidden');
    document.getElementById('TagesuebersichtButton4').classList.remove('hidden');
  }

  public onButtonDownload(path: string): string {
    return new UriBuilder()
      .fromPath(environment.backendBaseUrl)
      .path('v1/download')
      .path(path)
      .path('?veranstaltungsid=' + this.currentVeranstaltung.id + '&manschaftsid=' + this.getMannschaftsID() + '&jahr=' + this.currentJahr)
      .build();
  }

  public getMannschaftsID(): number {
    if (this.currentMannschaft !== undefined) {
      return this.currentMannschaft.id;
    } else {
      return -1;
    }
  }

  public async onSelectVerein() {
    this.loadingData = true;
    await this.loadVerein(this.currentMannschaft.vereinId);
    document.getElementById('selectWettkampftag').classList.add('hidden');
    // Lädt je nach dem welche Statistik ausgewählt ist die jeweilige Statistik neu beim Mannschaftswechsel
    if (this.mannschaftStatistikActive) {
      this.selectedMannschaftStatistik = 'aktuelle_mannschaft';
      await this.loadErgebnisse(this.currentMannschaft);
    } else if (this.schuetzenStatistikActive) {
      this.selectedStatistik = 'gesamtstatistik';
      await this.loadGesamtstatistik(this.currentMannschaft);
    }

    this.loadingData = false;
    this.onSelectWettkampfTag();

  }

  public mannschaftAlreadyLoaded(mannschaftId) {
    for (const m of this.mannschaften) {
      if (mannschaftId === m.id) {
        return true;
      }
    }
    return false;
  }

  public async updateResults() {
    this.loadingData = true;
    await this.loadWettkaempfe(this.currentVeranstaltung.id);
    this.loadingData = false;
  }
  private async clearAllStatistikTables() {
    // make everything invisible
    document.getElementById('einzeldruckButton').classList.add('hidden');
    document.getElementById('gesamtdruckButton').classList.add('hidden');
    for (let i = 0; i < 4; i++) {
      let rowNumber = 'row';
      rowNumber += i;
      document.getElementById(rowNumber + '2').classList.add('hidden');
      document.getElementById(rowNumber + '1').classList.add('hidden');
      let tableNumber = 'Table';
      tableNumber += i;
      document.getElementById(tableNumber).classList.add('hidden');
      document.getElementById(rowNumber).classList.add('hidden');
    }
    document.getElementById('row00').classList.add('hidden');
    document.getElementById('row07').classList.add('hidden');
    document.getElementById('row06').classList.add('hidden');
    document.getElementById('rowMannschafttabellenverlaufSportjahre').classList.add('hidden');
    document.getElementById('einzeldruckButton').classList.add('hidden');
    document.getElementById('gesamtdruckButton').classList.add('hidden');
    document.getElementById('selectWettkampftag').classList.add('hidden');
  }
  public async onSelectSchuetzenStatistik() {
    document.getElementById('selectWettkampftag').classList.add('hidden');
    this.selectedWettkampfTag =  this.alleTage[0];
    if (this.selectedStatistik === 'einzelstatistik') {
      this.currentStatistikTitle = 'Einzelstatistik';
      await this.loadEinzelstatistik(this.currentMannschaft);
      document.getElementById('selectWettkampftag').classList.remove('hidden');
      this.onSelectWettkampfTag();
    } else if (this.selectedStatistik === 'gesamtstatistik') {
      this.currentStatistikTitle =  'MANNSCHAFTEN.SCHUETZEN_STATISTIK.TITEL';
      await this.loadGesamtstatistik(this.currentMannschaft);
    } else if (this.selectedStatistik === 'alleligenstatistik') {
      await this.loadAlleLigenProSaisonStatistik(this.currentMannschaft);
      this.onSelectWettkampfTag();
      this.currentStatistikTitle = 'MANNSCHAFTEN.SCHUETZEN_STATISTIK_ALLE_LIGEN.TITEL';
    } else if (this.selectedStatistik === 'schuetzenstatistikMatch') {
      this.currentStatistikTitle = 'Wettkampfstatistik';
      await this.loadSchuetzenstatistikMatch(this.currentMannschaft);
      this.onSelectWettkampfTag();
      document.getElementById('selectWettkampftag').classList.remove('hidden');

    } else if (this.selectedStatistik === 'schuetzenstatistikWettkampftage') {
      this.currentStatistikTitle = 'WETTKAEMPFE.WETTKAEMPFE.TITLE';
      await this.loadSchuetzenstatistikWettkampftage(this.currentMannschaft);
    }
  }
  public getCurrentStatistikConfig() {
    if (this.selectedStatistik === 'einzelstatistik') {
      return WETTKAMPF_TABLE_EINZEL_CONFIG;
    } else if (this.selectedStatistik === 'gesamtstatistik') {
      return WETTKAMPF_TABLE_EINZELGESAMT_CONFIG;
    } else if (this.selectedStatistik === 'schuetzenstatistikMatch') {
      return WETTKAMPF_TABLE_MATCH_CONFIG;
    } else if (this.selectedStatistik === 'schuetzenstatistikWettkampftage') {
      return WETTKAMPF_TABLE_WETTKAMPFTAGE_CONFIG;
    }
  }

  public async onSelectMannschaftStatistik() {
    if (this.selectedMannschaftStatistik === 'aktuelle_mannschaft') {
      await this.loadErgebnisForMannschaft(this.currentMannschaft);
      this.onSelectWettkampfTag();
    } else if (this.selectedMannschaftStatistik === 'alle_mannschaften') {
      await this.loadAllErgebnisse(undefined);
      this.onSelectWettkampfTag();
    } else if (this.selectedMannschaftStatistik === 'tabellenverlauf_statistik_alle_sportjahre') {
        await this.visualizeMannschaftTabellenverlaufSportjahre(this.currentVeranstaltung);
    }
  }

  /**
   * Used to display the selected Mannschaft Tabellenverlauf in the last 5 years
   * @param veranstaltung
   * @private
   */
  private async visualizeMannschaftTabellenverlaufSportjahre(veranstaltung: VeranstaltungDO) {
    this.currentStatistikTitle = 'MANNSCHAFTEN.MANNSCHAFTEN.TABLE_NAME.MANNSCHAFT_TABELLENVERLAUF_TITLE';
    // prepare array for the tabellenplatzierungen over the sportjahre
    this.mannschaftTabellenverlaufSportjahre = new MannschaftTabellenverlaufSportjahre();
    // create config for the table on frontend
    this.mannschafttabellenverlaufConfig = {
      actions: {actionTypes: []},
      columns: [
        {
          translationKey: (this.currentVeranstaltung.sportjahr - 4).toString(),
          propertyName:   'tabellenplatzierung_sportjahr1',
          width: 20,
        },
        {
          translationKey: (this.currentVeranstaltung.sportjahr - 3).toString(),
          propertyName: 'tabellenplatzierung_sportjahr2',
          width: 20,
        },
        {
          translationKey: (this.currentVeranstaltung.sportjahr - 2).toString(),
          propertyName: 'tabellenplatzierung_sportjahr3',
          width: 20,
        },
        {
          translationKey: (this.currentVeranstaltung.sportjahr - 1).toString(),
          propertyName: 'tabellenplatzierung_sportjahr4',
          width: 20,
        },
        {
          translationKey: (this.currentVeranstaltung.sportjahr).toString(),
          propertyName: 'tabellenplatzierung_sportjahr5',
          width: 20,
        },
      ],
    };
    this.hideUebersichtsButtons();
    await this.clearAllStatistikTables();
    this.loadingData = true;
    this.currentConfig = this.mannschafttabellenverlaufConfig;
    // document.getElementById('rowMannschafttabellenverlaufSportjahre').classList.remove('hidden');
    document.getElementById('Table0').classList.remove('hidden');
    this.rows = [];

    await this.loadAllVeranstaltungenOfLiga(veranstaltung);
    if (this.loadingData) {
      await this.loadMannschaftTabellenverlaufSportjahre(this.filteredVeranstaltungenOfLiga);
    }
    this.loadingData = false;
  }
  // for every veranstaltung the ligatabelle gets fetched
  private async loadMannschaftTabellenverlaufSportjahre(veranstaltungen: VeranstaltungDO[]) {
    // sort the veranstaltungen so there is no need for a sort afterward
    for (const veranstaltungDO of veranstaltungen.sort((i, j) => i.sportjahr - j.sportjahr)) {
      await this.loadMannschaftTabellenverlaufSportjahreData(veranstaltungDO)
        .then((response: BogenligaResponse<LigatabelleErgebnisDO[]>) =>
          this.handleLoadMannschaftTabellenverlaufSportjahreSuccess(response.payload, veranstaltungDO))
        .catch((response: BogenligaResponse<LigatabelleErgebnisDO[]>) =>
          this.handleLoadMannschaftTabellenverlaufSportjahreFailure(response.payload));
    }
    if (this.loadingData) {
      this.rows.push(toTableRows(Array(this.mannschaftTabellenverlaufSportjahre)));
    }
  }
  private handleLoadMannschaftTabellenverlaufSportjahreSuccess(payload: LigatabelleErgebnisDO[], veranstaltung: VeranstaltungDO) {
    if (payload.length > 0) {
      // only the current verein tabellenplatz will be returned
      payload = payload.filter((mannschaft) => this.currentVerein.id === mannschaft.verein_id);
      let tabellenplatzVerein: number;
      // if the verein didn't play in the veranstaltung it will be skipped with a null value
      if (payload.length === 0) {
        tabellenplatzVerein = null;
      } else {
        tabellenplatzVerein = payload[0].tabellenplatz;
      }
      // places the value in the right variable
      if (tabellenplatzVerein !== null) {
        switch (this.currentVeranstaltung.sportjahr - veranstaltung.sportjahr) {
          case 4:
            this.mannschaftTabellenverlaufSportjahre.tabellenplatzierung_sportjahr1 = tabellenplatzVerein + '.';
            break;
          case 3:
            this.mannschaftTabellenverlaufSportjahre.tabellenplatzierung_sportjahr2 = tabellenplatzVerein + '.';
            break;
          case 2:
            this.mannschaftTabellenverlaufSportjahre.tabellenplatzierung_sportjahr3 = tabellenplatzVerein + '.';
            break;
          case 1:
            this.mannschaftTabellenverlaufSportjahre.tabellenplatzierung_sportjahr4 = tabellenplatzVerein + '.';
            break;
          case 0:
            this.mannschaftTabellenverlaufSportjahre.tabellenplatzierung_sportjahr5 = tabellenplatzVerein + '.';
            break;
        }
      }
    }
  }
  private handleLoadMannschaftTabellenverlaufSportjahreFailure(payload: LigatabelleErgebnisDO[]) {
    this.loadingData = false;
  }
  private async loadMannschaftTabellenverlaufSportjahreData(veranstaltung: VeranstaltungDO) {
    return this.ligaTabelleDataProvider.getLigatabelleVeranstaltung(veranstaltung.id);
  }
  private async loadAllVeranstaltungenOfLiga(veranstaltung: VeranstaltungDO) {
    await this.loadAllVeranstaltungenOfLigaData(veranstaltung)
              .then((response: BogenligaResponse<VeranstaltungDO[]>) =>
                this.handleLoadVeranstaltungenMannschaftTabellenverlaufSuccess(response.payload, veranstaltung))
              .catch((response: BogenligaResponse<VeranstaltungDO[]>) =>
                this.handleLoadVeranstaltungenMannschaftTabellenverlaufFailure(response.payload));
  }
  private async loadAllVeranstaltungenOfLigaData(veranstaltung: VeranstaltungDO) {
    return this.veranstaltungsDataProvider.findByLigaId(veranstaltung.ligaId);
  }
  private handleLoadVeranstaltungenMannschaftTabellenverlaufSuccess(payload: VeranstaltungDO[], veranstaltung: VeranstaltungDO) {
    if (payload.length > 0) {
        this.filteredVeranstaltungenOfLiga = payload.filter((loadedVeranstaltung) => {
          const sportjahrDifference = veranstaltung.sportjahr - loadedVeranstaltung.sportjahr;
          return sportjahrDifference >= 0 && sportjahrDifference <= 4;
        });
      }
    }
    private handleLoadVeranstaltungenMannschaftTabellenverlaufFailure(payload: VeranstaltungDO[]) {
      this.loadingData = false;
    }
  public async showStatistikOptions() {
    document.getElementById('selectStatistik').classList.remove('hidden');
    document.getElementById('selectMannschaftStatistik').classList.add('hidden');

    this.mannschaftStatistikActive = false;
    this.schuetzenStatistikActive = true;

    await this.loadGesamtstatistik(this.currentMannschaft);
    this.selectedStatistik = 'gesamtstatistik';
    document.getElementById('selectWettkampftag').classList.add('hidden');
  }

  public async showMannschaftOptions() {
    document.getElementById('selectMannschaftStatistik').classList.remove('hidden');
    document.getElementById('selectStatistik').classList.add('hidden');
    document.getElementById('selectWettkampftag').classList.add('hidden');

    this.schuetzenStatistikActive = false;
    this.mannschaftStatistikActive = true;

    await this.loadErgebnisForMannschaft(this.currentMannschaft);
    this.selectedMannschaftStatistik = 'aktuelle_mannschaft';
  }

  public onSelectWettkampfTag() {
    // Alle Tage hidden
    this.alleTage.forEach((tag) => {
      if (this.selectedWettkampfTag.id === tag.id) {
        document.getElementById(tag.id).classList.remove('hidden');
      } else {
        // Ausgewählten Tag anzeigen
        document.getElementById(tag.id).classList.add('hidden');
      }

    });


  }

}
