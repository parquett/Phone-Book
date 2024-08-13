import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { Contact } from './contact-form.interface';
import { IAPI } from './iapi.interface';

@Injectable()
export class MockApiService implements IAPI {
  private contacts: Contact[] = [];
  private nextId = 1;

  public loadContacts(): Observable<Contact[]> {
    return of(this.contacts).pipe(
      delay(1_000)
    );
  }

  public saveContactsToLocalStorage(contact: Contact): Observable<Contact> {
    return of(contact).pipe(
      delay(1_000),
      tap(() => {
        const contactIndex = this.contacts.findIndex(c => c.id === contact.id);
        if (contactIndex !== -1) {
          // Update existing contact
          this.contacts[contactIndex] = contact;
        } else {
          // Add new contact
          contact.id = this.nextId++;
          this.contacts.push(contact);
        }
      })
    );
  }
}