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

  getFromLS(key: string){
    return localStorage.getItem(key);
  }

  parseFromLS(data: string | null){
    return data ? JSON.parse(data) : [];
  }

  loadContacts(): Observable<Contact[]> {
    const storedContacts = this.getFromLS(this.storageKey);
    const storedNextId = this.getFromLS(this.storageKeyNextId);
    this.nextId = storedNextId ? parseInt(storedNextId) : 0;
    return of(this.parseFromLS(storedContacts));
  }

  saveContactsToLocalStorage(contact: Contact) {
    const storedContacts = this.getFromLS(this.storageKey);
    let existingContacts: Contact[] = this.parseFromLS(storedContacts);
    
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
