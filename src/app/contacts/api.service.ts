import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { StateService, Contact } from './state.service';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  storageKey='contacts';
  private stateService = inject(StateService);
  get contacts() { return this.stateService.getContactsSignal(); }



  constructor() {
    const storedContacts = localStorage.getItem(this.storageKey);
    if (storedContacts) {
      this.contacts.set(JSON.parse(storedContacts));
    }
  }

  saveContact(contact: Contact): Observable<Contact> {
    return of(contact).pipe(
      delay(5000),
      tap(savedContact => {
        console.log('id', savedContact.id);
        if (!savedContact.id) {
          savedContact.id = this.getNextId();
          this.stateService.addContact(savedContact);
          console.log('contact added', savedContact);
        } else {
          this.stateService.updateContact(savedContact.id!, savedContact);
          console.log('contact updated', savedContact);
        }
        this.saveContactsToLocalStorage();
      }),
    );
  }

  private saveContactsToLocalStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.contacts()));
  }

  getNextId(): number {
    const contacts = this.contacts();
    return contacts.length ? Math.max(...contacts.map(c => c.id!)) + 1 : 1;
  }

}
