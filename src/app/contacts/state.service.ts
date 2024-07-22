import { Injectable, signal } from '@angular/core';
import { Contact } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private contactsSignal = signal<Contact[]>([]);  

  constructor() {
  }

  getContactsSignal() {
    return this.contactsSignal;
  }


  addContact(contact: Contact){
    this.contactsSignal.set([...this.contactsSignal(), contact]);
  }

  updateContact(id: number, updatedContact: Contact){
    this.contactsSignal.update(contactsSignal => contactsSignal.map(c => (c.id === updatedContact.id ? updatedContact : c)));
  }
}
