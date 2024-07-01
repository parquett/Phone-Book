import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, NonNullableFormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputsModule, RadioButtonModule } from '@progress/kendo-angular-inputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DialogModule, DialogService } from '@progress/kendo-angular-dialog';
import { ReactiveFormsModule } from '@angular/forms';

interface Contact {
  id: number;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  gender: string;
  status: string;
}

interface ContactForm {
  name: FormControl<string>;
  phone: FormControl<string>;
  email: FormControl<string>;
  address: FormControl<string | null>;
  gender: FormControl<string>;
  status: FormControl<string>;
}

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
    DialogModule
  ],
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  contacts: Contact[] = [];
  contactForm!: FormGroup<ContactForm>;
  editMode: boolean = false;
  selectedContact: Contact | null = null;

  genderOptions = ['Male', 'Female'];
  public showDialog = false;

  constructor(private fb: NonNullableFormBuilder, private dialogService: DialogService) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.email]],
      address: [''],
      gender: ['Select gender', Validators.required],
      status: ['', Validators.required]
    }) as FormGroup<ContactForm>;
  }

  ngOnInit() {
    this.loadContacts();
  }

  get f() {
    return this.contactForm.controls;
  }

  loadContacts() {
    const storedContacts = localStorage.getItem('contacts');
    if (storedContacts) {
      this.contacts = JSON.parse(storedContacts);
    }
  }

  saveContacts() {
    localStorage.setItem('contacts', JSON.stringify(this.contacts));
  }

  addContact() {
    if (this.contactForm.valid) {
      const newContact: Contact = {
        id: this.contacts.length ? Math.max(...this.contacts.map(c => c.id)) + 1 : 1,
        name: this.f.name.value,
        phone: this.f.phone.value,
        email: this.f.email.value || '',
        address: this.f.address.value || '',
        gender: this.f.gender.value,
        status: this.f.status.value
      };
      this.contacts.push(newContact);
      this.contactForm.reset({
        name: '',
        phone: '',
        email: '',
        address: null,
        gender: '',
        status: ''
      });
      this.saveContacts();
    }
  }

  editContact(contact: Contact) {
    this.editMode = true;
    this.selectedContact = contact;
    this.contactForm.patchValue(contact);
    this.showDialog = true; // Показать всплывающее окно
  }

  updateContact() {
    if (this.contactForm.valid && this.selectedContact) {
      const index = this.contacts.findIndex(c => c.id === this.selectedContact!.id);
      const updatedContact = {
        ...this.selectedContact,
        name: this.f.name.value,
        phone: this.f.phone.value,
        email: this.f.email.value || '',
        address: this.f.address.value || '',
        gender: this.f.gender.value,
        status: this.f.status.value
      };
      this.contacts[index] = updatedContact;
      this.editMode = false;
      this.selectedContact = null;
      this.contactForm.reset({
        name: '',
        phone: '',
        email: '',
        address: null,
        gender: '',
        status: ''
      });
      this.saveContacts();
      this.showDialog = false; // Скрыть всплывающее окно
    }
  }

  cancelEdit() {
    this.editMode = false;
    this.selectedContact = null;
    this.contactForm.reset({
      name: '',
      phone: '',
      email: '',
      address: null,
      gender: '',
      status: ''
    });
    this.showDialog = false; // Скрыть всплывающее окно
  }

  closeDialog(){
    this.cancelEdit();
  }
}
