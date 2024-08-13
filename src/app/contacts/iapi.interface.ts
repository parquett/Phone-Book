import { Observable } from 'rxjs';
import { Contact } from './contact-form.interface';

export interface IAPI {
  loadContacts(): Observable<Contact[]>;
  saveContactsToLocalStorage(contact: Contact): Observable<Contact>;
}