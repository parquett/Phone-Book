import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputsModule, RadioButtonModule } from '@progress/kendo-angular-inputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Contact, ContactsService, ContactForm } from '../contacts.service';

@Component({
  selector: 'app-edit-contact',
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
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.scss']
})
export class EditContactComponent implements OnInit {
  contactForm!: FormGroup<ContactForm>;
  contactId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private contactsService: ContactsService
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.email]],
      address: [''],
      gender: ['', Validators.required],
      status: ['', Validators.required]
    }) as FormGroup<ContactForm>;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.contactId = Number(params.get('id'));
      const contact = this.contactsService.getContactById(this.contactId);
      if (contact) {
        this.contactForm.patchValue(contact);
      }
    });
  }

  updateContact() {
    if (this.contactForm.valid) {
      const updatedContact: Contact = {
        id: this.contactId,
        name: this.contactForm.controls.name.value!,
        phone: this.contactForm.controls.phone.value!,
        email: this.contactForm.controls.email.value!,
        address: this.contactForm.controls.address.value!,
        gender: this.contactForm.controls.gender.value!,
        status: this.contactForm.controls.status.value!
      };
      this.contactsService.updateContact(this.contactId, updatedContact);
      this.router.navigate(['/contacts']);
    }
  }

  cancelEdit() {
    this.router.navigate(['/contacts']);
  }

  closeDialog(){
    this.cancelEdit();
  }
}
