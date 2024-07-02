import { Routes } from '@angular/router';
import { ContactsComponent } from './contacts/contacts.component';
import { EditContactComponent } from './contacts/edit-contact/edit-contact.component';
import { NewContactComponent } from './contacts/new-contact/new-contact.component';

export const routes: Routes = [
  { path: '', redirectTo: '/contacts', pathMatch: 'full' },
  {
    path: 'contacts',
    component: ContactsComponent,
    children: [
      { path: 'edit/:id', component: EditContactComponent },
      { path: 'new', component: NewContactComponent }
    ]
  }
];
