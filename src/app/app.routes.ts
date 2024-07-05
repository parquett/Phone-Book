import { Routes } from '@angular/router';
import { ContactsComponent } from './contacts/contacts.component';
import { ActionContactComponent } from './contacts/action-contact/action-contact.component';

export const routes: Routes = [
  { path: '', redirectTo: '/contacts', pathMatch: 'full' },
  {
    path: 'contacts',
    component: ContactsComponent,
    children: [
      { path: 'new', component: ActionContactComponent },
      { path: 'edit/:id', component: ActionContactComponent }
    ]
  }
];
