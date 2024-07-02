import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

export interface Contact {
  id: number;
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
export class ContactsService {
  private contacts: Contact[] = [];

  constructor() {
    const storedContacts = localStorage.getItem('contacts');
    if (storedContacts) {
      this.contacts = JSON.parse(storedContacts);
    }
  }

  getContacts(): Contact[] {
    return this.contacts;
  }

  getContactById(id: number): Contact | undefined {
    return this.contacts.find(contact => contact.id === id);
  }

  addContact(newContact: Contact) {
    this.contacts.push(newContact);
    this.saveContacts();
  }

  updateContact(id: number, updatedContact: Partial<Contact>) {
    const contact = this.getContactById(id);
    if (contact) {
      Object.assign(contact, updatedContact);
      this.saveContacts();
    }
  }

  getNextId(): number {
    return this.contacts.length ? Math.max(...this.contacts.map(c => c.id)) + 1 : 1;
  }

  private saveContacts() {
    localStorage.setItem('contacts', JSON.stringify(this.contacts));
  }
}
