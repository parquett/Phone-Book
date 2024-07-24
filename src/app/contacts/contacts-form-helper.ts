import { NonNullableFormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ApiService } from './api.service';
import { ContactForm, Contact } from './state.service';
import { inject } from '@angular/core';

export class ContactFormHelper {
  private fb = inject(NonNullableFormBuilder);
  private apiService = inject(ApiService);
  private isEditMode: boolean = false;
  private contactId: number | null = null;

  constructor() {}

  createContactForm(): FormGroup<ContactForm> {
    return this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.email]],
      address: [''],
      gender: ['Select gender', [Validators.required, this.genderValidator]],
      status: ['', Validators.required]
    }) as FormGroup<ContactForm>;
  }

  toContact(formValue: any, isEditMode: boolean, contactId: number | null): Contact {
    const id = isEditMode ? contactId! : null;
    return {
      id,
      name: formValue.name,
      phone: formValue.phone,
      email: formValue.email,
      address: formValue.address!,
      gender: formValue.gender,
      status: formValue.status
    };
  }

  setEditMode(isEditMode: boolean, contactId: number | null) {
    this.isEditMode = isEditMode;
    this.contactId = contactId;
  }

  genderValidator(control: AbstractControl): ValidationErrors | null {
    return control.value === 'Select gender' ? { invalidGender: true } : null;
  }
}
