import { Injectable, Signal, signal } from '@angular/core';
import { Contact, ContactsService } from './contacts.service';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private contactsSignal = signal<Contact[]>([]);

  constructor(private contactsService: ContactsService) {
    this.loadInitialContacts();
  }

  getContactsSignal() {
    return this.contactsSignal;
  }

  loadInitialContacts() {
    this.contactsSignal.set(this.contactsService.getContactsSignal()());
  }

}
