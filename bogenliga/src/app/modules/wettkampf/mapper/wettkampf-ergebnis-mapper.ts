import {VersionedDataTransferObject} from '../../shared/data-provider';
import {LigatabelleErgebnisDTO} from '../types/datatransfer/wettkampf-ergebnis-dto.class';
import {LigatabelleErgebnisDO} from '../types/wettkampf-ergebnis-do.class';

export function toDO(ligatabelleErgebnisDTO: LigatabelleErgebnisDTO): LigatabelleErgebnisDO {

  const ligatabelleErgebnisDO = new LigatabelleErgebnisDO();

  ligatabelleErgebnisDO.id = ligatabelleErgebnisDTO.id;
  ligatabelleErgebnisDO.version = ligatabelleErgebnisDTO.version;

  ligatabelleErgebnisDO.veranstaltungId = ligatabelleErgebnisDTO.veranstaltungId;
  ligatabelleErgebnisDO.veranstaltungName = ligatabelleErgebnisDTO.veranstaltungName;
  ligatabelleErgebnisDO.wettkampf_id = ligatabelleErgebnisDTO.wettkampfId;
  ligatabelleErgebnisDO.wettkampf_tag = ligatabelleErgebnisDTO.wettkampfTag;
  ligatabelleErgebnisDO.mannschaft_id = ligatabelleErgebnisDTO.mannschaftId;
  ligatabelleErgebnisDO.mannschaft_name = ligatabelleErgebnisDTO.vereinName.toString() + '-' + ligatabelleErgebnisDTO.mannschaftNummer.toString();
  ligatabelleErgebnisDO.verein_id = ligatabelleErgebnisDTO.vereinId;
  ligatabelleErgebnisDO.matchpunkte = ligatabelleErgebnisDTO.matchpkt.toString() + ' : ' + ligatabelleErgebnisDTO.matchpktGegen.toString();
  ligatabelleErgebnisDO.satzpunkte = ligatabelleErgebnisDTO.satzpkt.toString() + ' : ' + ligatabelleErgebnisDTO.satzpktGegen.toString();
  ligatabelleErgebnisDO.satzpkt_differenz = ligatabelleErgebnisDTO.satzpktDifferenz;
  ligatabelleErgebnisDO.tabellenplatz = ligatabelleErgebnisDTO.tabellenplatz;
  ligatabelleErgebnisDO.sortierung = ligatabelleErgebnisDTO.sortierung;



  return ligatabelleErgebnisDO;
}

export function toDOArray(ligatabelleErgebnisDTO: LigatabelleErgebnisDTO[]): LigatabelleErgebnisDO[] {
  const list: LigatabelleErgebnisDO[] = [];
  ligatabelleErgebnisDTO.forEach((single) => list.push(toDO(single)));
  return list;
}


export function fromPayload(payload: VersionedDataTransferObject): LigatabelleErgebnisDO {

  const ligatabelleErgebnisDTO = LigatabelleErgebnisDTO.copyFrom(payload);
  return toDO(ligatabelleErgebnisDTO);
}


export function fromPayloadLigatabelleErgebnisArray(payload: VersionedDataTransferObject[]): LigatabelleErgebnisDO[] {
  const list: LigatabelleErgebnisDO[] = [];
  payload.forEach((single) => list.push(fromPayload(single)));
  return list;
}
