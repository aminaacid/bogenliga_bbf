import {Inject, Injectable} from '@angular/core';
import {LOCAL_STORAGE, StorageService} from 'ngx-webstorage-service';

const STORAGE_KEY_PREFIX = 'bogenliga_';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageDataProvider {

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) {

  }

  public set(key: string, value: string): void {
    this.storage.set(STORAGE_KEY_PREFIX + key, value);
  }

  public get(key: string): string {
    return this.storage.get(STORAGE_KEY_PREFIX + key);
  }

  public remove(key: string): void {
    this.storage.remove(STORAGE_KEY_PREFIX + key);
  }
}
