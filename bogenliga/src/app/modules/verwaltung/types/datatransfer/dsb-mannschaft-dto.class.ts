import {DataTransferObject} from '@shared/data-provider';

export class DsbMannschaftDTO implements DataTransferObject {
  id: number;
  nummer: string;
  vereinId: number;
  benutzerId: number;
  version: number;
  veranstaltungId: number;
  veranstaltungName: string;
  name: string;

  static copyFrom(optional: {
    id?: number,
    nummer?: string,
    vereinId?: number,
    benutzerId?: number,
    version?: number,
    veranstaltungId?: number;
  } = {}): DsbMannschaftDTO {
    const copy = new DsbMannschaftDTO();
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
    copy.version = optional.version || null;
    copy.nummer = optional.nummer || '';

    return copy;
  }
}
