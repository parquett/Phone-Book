import { Injectable} from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

import {Contact} from './contact-form.interface';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private _storageKey='contacts';
  private _storageKeyNextId='nextId';

  private get nextId():number {
    const id = localStorage.getItem(this._storageKeyNextId) ?? '0';
    const currId = parseInt(id) + 1;
    localStorage.setItem(this._storageKeyNextId, JSON.stringify(currId));
    return currId;
  }

  private getAndParseContacts() {
    const storedContacts = localStorage.getItem(this._storageKey);
    return storedContacts ? JSON.parse(storedContacts) : [];
  }

  public loadContacts(): Observable<Contact[]> {
    return of(this.getAndParseContacts()).pipe(
      delay(1_000)
    );
  }

  public saveContactsToLocalStorage(contact: Contact) {
    let existingContacts: Contact[] = this.getAndParseContacts();

    return of(contact).pipe(
      delay(1_000),
      tap(() => {
        const contactIndex = existingContacts.findIndex(c => c.id === contact.id);
        if (contactIndex !== -1) {
            // Update existing contact
            existingContacts[contactIndex] = contact;
        } else {
            // Add new contact
            contact.id = this.nextId;
            existingContacts.push(contact);
        }
        localStorage.setItem(this._storageKey, JSON.stringify(existingContacts));
      })
    );
  }

}
