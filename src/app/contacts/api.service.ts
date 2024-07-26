import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { StateService, Contact } from './state.service';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  storageKey='contacts';

  loadContacts(): Contact[] {
    const storedContacts = localStorage.getItem(this.storageKey);
    return storedContacts ? JSON.parse(storedContacts) : [];
  }

  saveContactsToLocalStorage(contact: Contact) {
    const storedContacts = localStorage.getItem(this.storageKey);
    let existingContacts: Contact[] = [];
    if (storedContacts) {
        existingContacts = JSON.parse(storedContacts);
    }
    
    if (!contact.id) {
      contact.id = existingContacts.length + 1;
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
      })
    );
  }

}
