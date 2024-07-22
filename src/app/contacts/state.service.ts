import { Injectable, Signal, signal } from '@angular/core';
import { Contact, ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private contactsSignal = signal<Contact[]>([]);

  constructor(private apiService: ApiService) {
    this.loadInitialContacts();
  }

  getContactsSignal() {
    return this.contactsSignal;
  }

  loadInitialContacts() {
    this.contactsSignal.set(this.apiService.getContactsSignal()());
  }

}
