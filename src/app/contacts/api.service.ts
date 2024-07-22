import { Injectable, Signal, inject } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { StateService } from './state.service';

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
  storageKey='contacts';
  private stateService = inject(StateService);
  get contacts() { return this.stateService.getContactsSignal(); }



  constructor() {
    const storedContacts = localStorage.getItem(this.storageKey);
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
    return contacts.length ? Math.max(...contacts.map(c => c.id)) + 1 : 1;
  }

  genderValidator(control: AbstractControl): ValidationErrors | null {
    return control.value === 'Select gender' ? { invalidGender: true } : null;
  }
}
