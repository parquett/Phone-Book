// src/app/contacts/contacts.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatRadioModule} from '@angular/material/radio';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

interface Contact {
  id: number;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  gender: string;
  status: string;
}

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatRadioModule,
    InputsModule,
    ButtonsModule,
    DropDownsModule
  ],
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  contacts: Contact[] = [];
  contactForm: FormGroup;
  editMode: boolean = false;
  selectedContact: Contact | null = null;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.email]],
      address: [''],
      gender: ['', Validators.required],
      status: ['', Validators.required]
    });
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

  saveContacts() {
    localStorage.setItem('contacts', JSON.stringify(this.contacts));
  }

  addContact() {
    if (this.contactForm.valid) {
      const newContact: Contact = {
        id: this.contacts.length ? Math.max(...this.contacts.map(c => c.id)) + 1 : 1,
        ...this.contactForm.value
      };
      this.contacts.push(newContact);
      this.contactForm.reset();
      this.saveContacts();
    }
  }

  editContact(contact: Contact) {
    this.editMode = true;
    this.selectedContact = contact;
    this.contactForm.patchValue(contact);
  }

  updateContact() {
    if (this.contactForm.valid && this.selectedContact) {
      const index = this.contacts.findIndex(c => c.id === this.selectedContact!.id);
      this.contacts[index] = { ...this.selectedContact, ...this.contactForm.value };
      this.editMode = false;
      this.selectedContact = null;
      this.contactForm.reset();
      this.saveContacts();
    }
  }

  cancelEdit() {
    this.editMode = false;
    this.selectedContact = null;
    this.contactForm.reset();
  }
}
