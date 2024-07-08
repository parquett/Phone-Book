import { Injectable, Signal, signal } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';

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
  private contacts = signal<Contact[]>([]);

  constructor() {
    const storedContacts = localStorage.getItem('contacts');
    if (storedContacts) {
      this.contacts.set(JSON.parse(storedContacts));
    }
  }

  getContactsSignal(): Signal<Contact[]> {
    return this.contacts;
  }

  getContactById(id: number): Contact | undefined {
    return this.contacts().find(contact => contact.id === id);
  }

  addContact(newContact: Contact) {
    this.contacts.set([...this.contacts(), newContact]);
    this.saveContacts();
  }

  updateContact(id: number, updatedContact: Contact) {
    this.contacts.set(
      this.contacts().map(contact => (contact.id === id ? updatedContact : contact))
    );
    this.saveContacts();
  }

  getNextId(): number {
    const contacts = this.contacts();
    return contacts.length ? Math.max(...contacts.map(c => c.id)) + 1 : 1;
  }

  private saveContacts() {
    localStorage.setItem('contacts', JSON.stringify(this.contacts()));
  }

  genderValidator(control: AbstractControl): ValidationErrors | null {
    return control.value === 'Select gender' ? { invalidGender: true } : null;
  }
}