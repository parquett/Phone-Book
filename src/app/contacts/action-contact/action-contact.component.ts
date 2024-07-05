import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NonNullableFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputsModule, RadioButtonModule } from '@progress/kendo-angular-inputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { Contact, ContactsService, ContactForm } from '../contacts.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-action-contact',
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
  templateUrl: './action-contact.component.html',
  styleUrls: ['./action-contact.component.scss']
})
export class ActionContactComponent implements OnInit {
  contactForm!: FormGroup<ContactForm>;
  contactId: number | null = null;
  isEditMode = false;
  destroyRef = inject(DestroyRef);

  constructor(
    private fb: NonNullableFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private contactsService: ContactsService
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.email]],
      address: [''],
      gender: ['Select gender', [Validators.required, this.contactsService.genderValidator]],
      status: ['', Validators.required]
    }) as FormGroup<ContactForm>;
  }

  ngOnInit(): void {
    this.route.paramMap.pipe( 
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(params => {
      const idParam = params.get('id');
      this.contactId = idParam ? Number(idParam) : null;
      this.isEditMode = this.contactId !== null;

      if (this.isEditMode) {
        const contact = this.contactsService.getContactById(this.contactId!);
        if (contact) {
          this.contactForm.patchValue(contact);
        }
      }
    });
  }

  get name() {return this.contactForm.controls.name;}

  get phone() {return this.contactForm.controls.phone;}

  get email() {return this.contactForm.controls.email;}

  get address() {return this.contactForm.controls.address;}

  get gender() {return this.contactForm.controls.gender;}

  get status() {return this.contactForm.controls.status;}

  saveContact() {
      const contact: Contact = {
        id: this.isEditMode ? this.contactId! : this.contactsService.getNextId(),
        name: this.name.value,
        phone: this.phone.value,
        email: this.email.value,
        address: this.address.value!,
        gender: this.gender.value,
        status: this.status.value
      };

      if (this.isEditMode) {
        this.contactsService.updateContact(this.contactId!, contact);
      } else {
        this.contactsService.addContact(contact);
      }

      this.closeDialog();
  }

  cancel() {
    this.router.navigate(['/contacts']);
  }

  closeDialog() {
    this.cancel();
  }
}
