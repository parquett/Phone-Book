import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

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
  private contactsSubject = new BehaviorSubject<Contact[]>([]);

  constructor() {
    const storedContacts = localStorage.getItem('contacts');
    if (storedContacts) {
      this.contacts = JSON.parse(storedContacts);
    }
    this.contactsSubject.next(this.contacts);
  }

  getContactsObservable() {
    return this.contactsSubject.asObservable();
  }

  getContactById(id: number): Contact | undefined {
    return this.contacts.find(contact => contact.id === id);
  }

  addContact(newContact: Contact) {
    this.contacts.push(newContact);
    this.saveContacts();
    this.contactsSubject.next(this.contacts);
  }

  updateContact(id: number, updatedContact: Contact) {
    const index = this.contacts.findIndex(contact => contact.id === id);
    if (index !== -1) {
      this.contacts[index] = updatedContact;
      this.saveContacts();
      this.contactsSubject.next(this.contacts);
    }
  }

  getNextId(): number {
    return this.contacts.length ? Math.max(...this.contacts.map(c => c.id)) + 1 : 1;
  }

  private saveContacts() {
    localStorage.setItem('contacts', JSON.stringify(this.contacts));
  }

  genderValidator(control: AbstractControl): ValidationErrors| null {
    return control.value === 'Select gender' ? { invalidGender: true } : null;
  }
}
