import { Injectable, signal } from '@angular/core';
import { FormControl } from '@angular/forms';

export interface Contact {
  id: number | null;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  gender: string;
  status: string;
}

export interface ContactForm {
  name: FormControl<string>;
  phone: FormControl<string>;
  email: FormControl<string>;
  address: FormControl<string | null>;
  gender: FormControl<string>;
  status: FormControl<string>;
}

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

  getContactById(id: number): Contact | undefined {
    return this.contactsSignal().find(contact => contact.id === id);
  }
}
