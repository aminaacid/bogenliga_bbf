import {DataTransferObject} from '@shared/data-provider';

export class MannschaftOfflineSyncDto implements DataTransferObject {
  id: number;
  version: number;
  vereinId: number;

  nummer: number;
  benutzerId: number;
  veranstaltungId: number;
  sortierung: number;

  static copyFrom(optional: {
    id?: number,
    nummer?: string,
    vereinId?: number,
    benutzerId?: number,
    version?: number,
    veranstaltungId?: number,
    sortierung?: number;
  } = {}): MannschaftOfflineSyncDto {
    const copy = new MannschaftOfflineSyncDto();
    // show '0' value
    if (optional.id >= 0) {
      copy.id = optional.id;
    } else {
      copy.id = null;
    }

    if (optional.benutzerId >= 0) {
      copy.benutzerId = optional.benutzerId;
    } else {
      copy.benutzerId = null;
    }

    if (optional.vereinId >= 0) {
      copy.vereinId = optional.vereinId;
    } else {
      copy.vereinId = null;
    }
    if (optional.veranstaltungId >= 0) {
      copy.veranstaltungId = optional.veranstaltungId;
    } else {
      copy.veranstaltungId = null;
    }
    if (optional.sortierung >= 0) {
      copy.sortierung = optional.sortierung;
    } else {
      copy.sortierung = null;
    }
    copy.version = optional.version || null;
    copy.nummer = optional.nummer || '';

    return copy;
  }
}
