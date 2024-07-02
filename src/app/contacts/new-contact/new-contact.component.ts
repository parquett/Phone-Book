import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputsModule, RadioButtonModule } from '@progress/kendo-angular-inputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { Contact, ContactForm, ContactsService } from '../contacts.service';

@Component({
  selector: 'app-new-contact',
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
  templateUrl: './new-contact.component.html',
  styleUrls: ['./new-contact.component.scss']
})
export class NewContactComponent {
  contactForm: FormGroup<ContactForm>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private contactsService: ContactsService
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.email]],
      address: [''],
      gender: ['Select gender', Validators.required],
      status: ['', Validators.required]
    }) as FormGroup<ContactForm>;
  }

  addContact() {
    if (this.contactForm.valid) {
      const newContact: Contact = {
        id: this.contactsService.getNextId(),
        name: this.contactForm.controls.name.value!,
        phone: this.contactForm.controls.phone.value!,
        email: this.contactForm.controls.email.value!,
        address: this.contactForm.controls.address.value!,
        gender: this.contactForm.controls.gender.value!,
        status: this.contactForm.controls.status.value!
      };
      this.contactsService.addContact(newContact);
      this.router.navigate(['/contacts']);
    }
  }

  cancelAdd() {
    this.router.navigate(['/contacts']);
  }

  closeDialog(){
    this.cancelAdd();
  }
}
