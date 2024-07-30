import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { tap} from 'rxjs';
import { ApiService } from './api.service';
import { takeUntilDestroyed} from '@angular/core/rxjs-interop';

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
  private _apiService = inject(ApiService);
  private _destroyRef = inject(DestroyRef);
  private _contactsSignal = signal<Contact[]>([]);  

  constructor() {
    const storedContacts = this._apiService.loadContacts();
    if (storedContacts) {
      storedContacts.pipe(
        takeUntilDestroyed(this._destroyRef)
      ).subscribe(contacts => {
        this._contactsSignal.set(contacts);
      });
    }
  }

  getContactsSignal() {
    return this._contactsSignal;
  }

  saveContact(contact: Contact){
    return this._apiService.saveContactsToLocalStorage(contact).pipe(
      takeUntilDestroyed(this._destroyRef),
          tap(savedContact => {
            this._contactsSignal.update(contacts => {
              const idx = contacts.findIndex(contact => contact.id === savedContact.id);
              console.log('idx', idx); 
              return idx == -1
              ? [...contacts, savedContact]
              : [...contacts.slice(0, idx), savedContact, ...contacts.slice(idx+1)];
            });
          })
    )
  }

  getContactById(id: number): Contact | undefined {
    return this._contactsSignal().find(contact => contact.id === id);
  }
}
