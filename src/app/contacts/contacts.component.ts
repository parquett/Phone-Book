import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputsModule, RadioButtonModule } from '@progress/kendo-angular-inputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormControl, NonNullableFormBuilder } from '@angular/forms';
import { Contact, ContactForm, ContactsService } from './contacts.service';



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
  contactForm!: FormGroup<{
    name: FormControl<string>;
    phone: FormControl<string>;
    email: FormControl<string>;
    address: FormControl<string | null>;
    gender: FormControl<string>;
    status: FormControl<string>;
  }>;
  editMode: boolean = false;
  selectedContact: Contact | null = null;

  genderOptions = ['Male', 'Female'];
  public showDialog = false;

  constructor(private fb: NonNullableFormBuilder, private router: Router, private contactsService: ContactsService) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.email]],
      address: [''],
      gender: ['', Validators.required],
      status: ['', Validators.required]
    }) as FormGroup<ContactForm>;
  }

  ngOnInit() {
    this.loadContacts();
  }

  loadContacts() {
    const storedContacts = localStorage.getItem('contacts');
    if (storedContacts) {
      this.contacts = JSON.parse(storedContacts);
    }
  }

  editContact(contactId: number) {
    this.router.navigate(['/contacts/edit', contactId]);
  }

  addContact() {
    this.router.navigate(['/contacts/new']);
  }
}
