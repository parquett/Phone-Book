import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputsModule, RadioButtonModule } from '@progress/kendo-angular-inputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { Contact, ContactsService } from './contacts.service';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputsModule,
    ButtonsModule,
    DropDownsModule,
    RadioButtonModule,
    RouterOutlet,
    DialogModule
  ],
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  contacts: Contact[] = [];

  constructor(private router: Router, private contactsService: ContactsService) {}

  ngOnInit() {
    this.contactsService.getContactsObservable().subscribe(contacts => {
      this.contacts = contacts;
    });
  }

  editContact(contactId: number) {
    this.router.navigate(['/contacts/edit', contactId]);
  }

  addContact() {
    this.router.navigate(['/contacts/new']);
  }
}
