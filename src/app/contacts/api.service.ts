import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { StateService, Contact } from './state.service';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private storageKey='contacts';
  private storageKeyNextId='nextId';
  private nextId: number = 0;

  loadContacts(): Observable<Contact[]> {
    const storedContacts = localStorage.getItem(this.storageKey);
    const storedNextId = localStorage.getItem(this.storageKeyNextId);
    this.nextId = storedNextId ? parseInt(storedNextId) : 0;
    return of(storedContacts ? JSON.parse(storedContacts) : []);
  }

  saveContactsToLocalStorage(contact: Contact) {
    const storedContacts = localStorage.getItem(this.storageKey);
    let existingContacts: Contact[] = storedContacts? JSON.parse(storedContacts) : [];
    
    if (!contact.id) {
      contact.id = ++this.nextId;
    }

    return of(contact).pipe(
      delay(5000),
      tap(() => {
        const contactIndex = existingContacts.findIndex(c => c.id === contact.id);
        if (contactIndex !== -1) {
            // Update existing contact
            existingContacts[contactIndex] = contact;
        } else {
            // Add new contact
            existingContacts.push(contact);
        }
        localStorage.setItem(this.storageKey, JSON.stringify(existingContacts));
        localStorage.setItem(this.storageKeyNextId, this.nextId!.toString());
      })
    );
  }

}
