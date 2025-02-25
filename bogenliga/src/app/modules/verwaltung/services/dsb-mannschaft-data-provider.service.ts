import {Injectable} from '@angular/core';

import {HttpErrorResponse} from '@angular/common/http';
import {
  BogenligaResponse,
  DataProviderService,
  RequestResult,
  RestClient,
  UriBuilder,
  VersionedDataTransferObject
} from '../../shared/data-provider';
import {CurrentUserService, OnOfflineService} from '@shared/services';
import {fromPayload, fromPayloadArray} from '../mapper/dsb-mannschaft-mapper';
import {DsbMannschaftDO} from '../types/dsb-mannschaft-do.class';
import {VereinDO} from '../types/verein-do.class';
import {db} from '@shared/data-provider/offlinedb/offlinedb';
import {mannschaftDOfromOffline, mannschaftDOfromOfflineArray} from '@verwaltung/mapper/mannschaft-offline-mapper';
import {OfflineVerein} from '@shared/data-provider/offlinedb/types/offline-verein.interface';

/**
 * TODO check usage
 */
@Injectable({
  providedIn: 'root'
})
export class DsbMannschaftDataProviderService extends DataProviderService {

  serviceSubUrl = 'v1/dsbmannschaft';

  constructor(private restClient: RestClient, private currentUserService: CurrentUserService, private onOfflineService: OnOfflineService) {
    super();
  }

  public create(payload: DsbMannschaftDO, payload2: VereinDO): Promise<BogenligaResponse<DsbMannschaftDO>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.POST<VersionedDataTransferObject>(new UriBuilder().fromPath(this.getUrl()).build(), payload)
          .then((data: VersionedDataTransferObject) => {
            resolve({result: RequestResult.SUCCESS, payload: fromPayload(data)});

          }, (error: HttpErrorResponse) => {

            if (error.status === 0) {
              reject({result: RequestResult.CONNECTION_PROBLEM});
            } else {
              reject({result: RequestResult.FAILURE});
            }
          });
      /*
      this.restClient.POST<VersionedDataTransferObject>(new UriBuilder().fromPath(this.getUrl()).build(), payload2)
        .then((data: VersionedDataTransferObject) => {
          resolve({result: RequestResult.SUCCESS, payload: fromPayload(data)});

        }, (error: HttpErrorResponse) => {

          if (error.status === 0) {
            reject({result: RequestResult.CONNECTION_PROBLEM});
          } else {
            reject({result: RequestResult.FAILURE});
          }
        });
       */
    });
  }

  public deleteById(id: number): Promise<BogenligaResponse<void>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.DELETE<void>(new UriBuilder().fromPath(this.getUrl()).path(id).build())
          .then((noData) => {
            resolve({result: RequestResult.SUCCESS});

          }, (error: HttpErrorResponse) => {

            if (error.status === 0) {
              reject({result: RequestResult.CONNECTION_PROBLEM});
            } else {
              reject({result: RequestResult.FAILURE});
            }
          });
    });
  }


  public findAll(): Promise<BogenligaResponse<DsbMannschaftDO[]>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.GET<Array<VersionedDataTransferObject>>(this.getUrl())
          .then((data: VersionedDataTransferObject[]) => {

            resolve({result: RequestResult.SUCCESS, payload: fromPayloadArray(data)});

          }, (error: HttpErrorResponse) => {

            if (error.status === 0) {
              reject({result: RequestResult.CONNECTION_PROBLEM});
            } else {
              reject({result: RequestResult.FAILURE});
            }
          });
    });
  }

  public findAllByVereinsId(id: string | number): Promise<BogenligaResponse<DsbMannschaftDO[]>> {
    if (this.onOfflineService.isOffline()) {
      console.log('Choosing offline way for findall mannschaften by vereinsid');
      let dsbMannschaften: DsbMannschaftDO[];
      return new Promise((resolve, reject) => {
        db.transaction('rw', db.mannschaftTabelle, db.vereinTabelle, (tx) => {
          let vereine: OfflineVerein[];
          db.vereinTabelle.toArray()
            .then((v) => {vereine = v; });
          db.mannschaftTabelle.where('vereinId').equals(id).toArray()
            .then((data) => {
              dsbMannschaften = mannschaftDOfromOfflineArray(data, vereine);
            });
        })
          .then( () => {
            resolve({result: RequestResult.SUCCESS, payload: dsbMannschaften});
        }, () => reject({result: RequestResult.FAILURE}));

      });
    } else {
      // return promise
      // sign in success -> resolve promise
      // sign in failure -> reject promise with result
      return new Promise((resolve, reject) => {
        this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder().fromPath(this.getUrl()).path('byVereinsID/' + id).build())
            .then((data: VersionedDataTransferObject[]) => {

              resolve({result: RequestResult.SUCCESS, payload: fromPayloadArray(data)});

            }, (error: HttpErrorResponse) => {

              if (error.status === 0) {
                reject({result: RequestResult.CONNECTION_PROBLEM});
              } else {
                reject({result: RequestResult.FAILURE});
              }
            });
      });
    }
  }
  public findAllVerAndWettByVereinsId(id: string | number): Promise<BogenligaResponse<DsbMannschaftDO[]>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder().fromPath(this.getUrl()).path('VeranstaltungAndWettkampfByID/' + id).build())
          .then((data: VersionedDataTransferObject[]) => {

            resolve({result: RequestResult.SUCCESS, payload: fromPayloadArray(data)});

          }, (error: HttpErrorResponse) => {

            if (error.status === 0) {
              reject({result: RequestResult.CONNECTION_PROBLEM});
            } else {
              reject({result: RequestResult.FAILURE});
            }
          });
    });
  }

  public findAllByVeranstaltungsId(id: string | number): Promise<BogenligaResponse<DsbMannschaftDO[]>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder().fromPath(this.getUrl()).path('byVeranstaltungsID/' + id).build())
        .then((data: VersionedDataTransferObject[]) => {

          resolve({result: RequestResult.SUCCESS, payload: fromPayloadArray(data)});

        }, (error: HttpErrorResponse) => {

          if (error.status === 0) {
            reject({result: RequestResult.CONNECTION_PROBLEM});
          } else {
            reject({result: RequestResult.FAILURE});
          }
        });
    });
  }


  public findById(id: string | number): Promise<BogenligaResponse<DsbMannschaftDO>> {
    if (this.onOfflineService.isOffline()) {
      console.log('Choosing offline way for find mannschaft by id');
      let mannschaftID: number;
      if (typeof id === 'string') {
        mannschaftID = parseInt(id);
      } else {
        mannschaftID = id;
      }
      return new Promise((resolve, reject) => {
        let dsbMannschaft: DsbMannschaftDO;
        db.transaction('r', db.mannschaftTabelle, db.vereinTabelle, (tx) => {
          let vereine: OfflineVerein[];
          db.vereinTabelle.toArray()
            .then((v) => {vereine = v; });

          db.mannschaftTabelle.get(mannschaftID)
            .then((data) => {
              dsbMannschaft = mannschaftDOfromOffline(data, vereine);
            });
        })
          .then(() => {
            resolve({result: RequestResult.SUCCESS, payload: dsbMannschaft});
          }, () => {
            reject({result: RequestResult.FAILURE});
          });
      });
    } else {
      // return promise
      // sign in success -> resolve promise
      // sign in failure -> reject promise with result
      return new Promise((resolve, reject) => {
        this.restClient.GET<VersionedDataTransferObject>(new UriBuilder().fromPath(this.getUrl()).path(id).build())
            .then((data: VersionedDataTransferObject) => {

              resolve({result: RequestResult.SUCCESS, payload: fromPayload(data)});

            }, (error: HttpErrorResponse) => {

              if (error.status === 0) {
                reject({result: RequestResult.CONNECTION_PROBLEM});
              } else {
                reject({result: RequestResult.FAILURE});
              }
            });
      });
    }
  }

  public update(payload: VersionedDataTransferObject): Promise<BogenligaResponse<DsbMannschaftDO>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.PUT<VersionedDataTransferObject>(new UriBuilder().fromPath(this.getUrl()).build(), payload)
          .then((data: VersionedDataTransferObject) => {
            resolve({result: RequestResult.SUCCESS, payload: fromPayload(data)});

          }, (error: HttpErrorResponse) => {

            if (error.status === 0) {
              reject({result: RequestResult.CONNECTION_PROBLEM});
            } else {
              reject({result: RequestResult.FAILURE});
            }
          });
    });
  }

  // Method to send ids to the backend. Returns backends response
  // Gets executed when button "Mannschaft kopieren" is pressed
  public copyMannschaftFromVeranstaltung(lastVeranstaltungID: string | number, currentVeranstaltungID: string | number): Promise<BogenligaResponse<void>> {

    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.GET<VersionedDataTransferObject>(new UriBuilder().fromPath(this.getUrl()).
      path('byLastVeranstaltungsID/' + lastVeranstaltungID + '/' + currentVeranstaltungID ).build())
          .then((data: VersionedDataTransferObject) => {
            resolve({result: RequestResult.SUCCESS});

          }, (error: HttpErrorResponse) => {
            if (error.status === 0) {
              reject({result: RequestResult.CONNECTION_PROBLEM});
            } else {
              reject({result: RequestResult.FAILURE});
            }
          });
    });
  }
// Backend-Aufruf um eine Mannschaft eienr Veransatltung zuzuweisen.
  public assignMannschaftToVeranstaltung(currentVeranstaltungID: string | number, mannschaftID: string | number): Promise<BogenligaResponse<void>> {

    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.GET<VersionedDataTransferObject>(new UriBuilder().fromPath(this.getUrl()).
      path('assignMannschaftToVeranstaltung/' + currentVeranstaltungID + '/' + mannschaftID ).build())
        .then((data: VersionedDataTransferObject) => {
          resolve({result: RequestResult.SUCCESS});

        }, (error: HttpErrorResponse) => {
          if (error.status === 0) {
            reject({result: RequestResult.CONNECTION_PROBLEM});
          } else {
            reject({result: RequestResult.FAILURE});
          }
        });
    });
  }
// Backend-Aufruf um eine Mannschaft asu einer Veranstaltung zu entfernen.
  public unassignMannschaftFromVeranstaltung(mannschaftID: string | number): Promise<BogenligaResponse<void>> {

    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.GET<VersionedDataTransferObject>(new UriBuilder().fromPath(this.getUrl()).
      path('unassignMannschaftFromVeranstaltung/'  + mannschaftID ).build())
        .then((data: VersionedDataTransferObject) => {
          resolve({result: RequestResult.SUCCESS});

        }, (error: HttpErrorResponse) => {
          if (error.status === 0) {
            reject({result: RequestResult.CONNECTION_PROBLEM});
          } else {
            reject({result: RequestResult.FAILURE});
          }
        });
    });
  }
  public findAllByWarteschlangeId(): Promise<BogenligaResponse<DsbMannschaftDO[]>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder().fromPath(this.getUrl()).path('byWarteschlangeID/').build())
          .then((data: VersionedDataTransferObject[]) => {

            resolve({result: RequestResult.SUCCESS, payload: fromPayloadArray(data)});

          }, (error: HttpErrorResponse) => {

            if (error.status === 0) {
              reject({result: RequestResult.CONNECTION_PROBLEM});
            } else {
              reject({result: RequestResult.FAILURE});
            }
          });
    });
  }

  public findAllByName(searchTerm: string): Promise<BogenligaResponse<DsbMannschaftDO[]>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return (searchTerm === '' || searchTerm === null)
      ? this.findAllByWarteschlangeId()
      : new Promise((resolve, reject) => {
        this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder().fromPath(this.getUrl()).path('byName').path(searchTerm).build())
            .then((data: VersionedDataTransferObject[]) => {

              resolve({result: RequestResult.SUCCESS, payload: fromPayloadArray(data)});

            }, (error: HttpErrorResponse) => {

              if (error.status === 0) {
                reject({result: RequestResult.CONNECTION_PROBLEM});
              } else {
                reject({result: RequestResult.FAILURE});
              }
            });
      });
  }
}
