import {DestroyRef, Inject, inject, Injectable, signal} from '@angular/core';
import {tap} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Contact} from './contact-form.interface';
import { API_TOKEN } from './api.token';

@Injectable()
export class StateService {
  private _apiService = inject(API_TOKEN);
  private _destroyRef = inject(DestroyRef);
  private _contactsSignal = signal<Contact[]>([]);  

  constructor() {
    this._apiService.loadContacts().pipe(
        takeUntilDestroyed(this._destroyRef)
      ).subscribe(contacts => {
        this._contactsSignal.set(contacts);
      });
  }

  get contactsSignal() {
    return this._contactsSignal.asReadonly();
  }

  public saveContact(contact: Contact){
    return this._apiService.saveContactsToLocalStorage(contact).pipe(
          tap(savedContact => {
            this._contactsSignal.update(contacts => {
              const idx = contacts.findIndex(contact => contact.id === savedContact.id);
              return idx === -1
                ? [...contacts, savedContact]
                : [...contacts.slice(0, idx), savedContact, ...contacts.slice(idx+1)];
            });
          })
    )
  }

  public getContactById(id: number): Contact | undefined {
    return this._contactsSignal().find(contact => contact.id === id);
  }
}
