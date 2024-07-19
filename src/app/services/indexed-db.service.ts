import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Requirements } from '../../models/Requirements';

@Injectable({
  providedIn: 'root',
})
export class IndexedDBService {
  db!: IDBDatabase;
  requirements = new BehaviorSubject<Requirements>({} as Requirements);

  constructor() {}

  async loadDb() {
    return new Promise((res, rej) => {
      const idbRequest = window.indexedDB.open('kappaRequirements', 1);

      idbRequest.onsuccess = (event: any) => {
        this.db = event.target.result;
        res(true);
      };

      idbRequest.onerror = (event: any) => {
        console.error('IndexedDB error', event);
      };

      idbRequest.onupgradeneeded = (event: any) => {
        this.db = event.target.result;
        const objectStore = this.db.createObjectStore('kappaRequirements', {
          keyPath: 'id',
        });
        res(true);
      };
    });
  }

  async getFromDb() {
    await this.loadDb();

    let promise = new Promise((res, rej) => {
      this.db
        .transaction('kappaRequirements')
        .objectStore('kappaRequirements')
        .get(69).onsuccess = (event: any) => {
        if (event.target.result) {
          res(event.target.result.requirements);
        } else {
          res({ quests: [], items: [], level: 0 });
        }
      };
    });

    const requirements = await promise;
    return <Requirements>requirements;
  }

  async getSavedRequirements() {
    const savedRequirements = await this.getFromDb();
    this.requirements.next(savedRequirements);
  }

  saveRequirements(requirements: Requirements) {
    const request = this.db
      .transaction('kappaRequirements', 'readwrite')
      .objectStore('kappaRequirements')
      .add({ id: 69, requirements: requirements });

    request.onerror = (event: any) => {
      this.db
        .transaction('kappaRequirements', 'readwrite')
        .objectStore('kappaRequirements')
        .put({ id: 69, requirements: requirements });
    };

    this.requirements.next(requirements);
  }
}
