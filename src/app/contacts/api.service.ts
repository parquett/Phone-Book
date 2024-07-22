import { Injectable, Signal, signal } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { delay, tap, map } from 'rxjs/operators';

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
export class ApiService {
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

  saveContact(contact: Contact): Observable<Contact> {
    return of(contact).pipe(
      delay(5000),
      
      tap(savedContact => {
        if (!this.getContactById(savedContact.id!)) {
          savedContact.id = this.getNextId();
          this.contacts.set([...this.contacts(), savedContact]);
          console.log('contact added', savedContact);
        } else {
          const updatedContact = this.contacts().map(c => (c.id === savedContact.id ? savedContact : c));
          this.contacts.set(updatedContact);
          console.log('contact updated', savedContact);
        }
        this.saveContactsToLocalStorage();
      }),
    );
  }


  private saveContactsToLocalStorage() {
    localStorage.setItem('contacts', JSON.stringify(this.contacts()));
  }

  getNextId(): number {
    const contacts = this.contacts();
    return contacts.length ? Math.max(...contacts.map(c => c.id)) + 1 : 1;
  }

  genderValidator(control: AbstractControl): ValidationErrors | null {
    return control.value === 'Select gender' ? { invalidGender: true } : null;
  }
}