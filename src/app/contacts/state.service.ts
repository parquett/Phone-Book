import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of, delay, tap, switchMap } from 'rxjs';
import { ApiService } from './api.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  name: FormControl<string | null>;
  phone: FormControl<string | null>;
  email: FormControl<string | null>;
  address: FormControl<string | null>;
  gender: FormControl<string | null>;
  status: FormControl<string | null>;
}

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private contactsSignal = signal<Contact[]>([]);  
  private apiService = inject(ApiService);
  destroyRef = inject(DestroyRef);


   constructor() {
    const storedContacts = this.apiService.loadContacts();
    if (storedContacts) {
      storedContacts.pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(contacts => {
        this.contactsSignal.set(contacts);
      });
    }
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

  saveContact(contact: Contact){
    return this.apiService.saveContactsToLocalStorage(contact).pipe(
      takeUntilDestroyed(this.destroyRef),
      switchMap(savedContact => {
        return of(savedContact).pipe(
          tap(savedContact => {
            console.log('id', savedContact.id); //debug
            if (!this.getContactById(savedContact.id!)) {
              this.addContact(savedContact);
              console.log('contact added', savedContact); //debug
            } else {
              this.updateContact(savedContact.id!, savedContact);
              console.log('contact updated', savedContact); //debug
            }
          })
        );
      })
    );
  }

  getContactById(id: number): Contact | undefined {
    return this.contactsSignal().find(contact => contact.id === id);
  }
}
