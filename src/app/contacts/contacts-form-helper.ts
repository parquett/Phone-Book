import { FormGroup, Validators, AbstractControl, ValidationErrors, FormControl, ɵFormGroupValue } from '@angular/forms';
import { ApiService } from './api.service';
import { ContactForm, Contact } from './state.service';
import { inject } from '@angular/core';

export class ContactFormHelper extends FormGroup<ContactForm> {
  private apiService = inject(ApiService);
  private isEditMode: boolean = false;
  private contactId: number | null = null;

  constructor() {
    super({
      name: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.email]),
      address: new FormControl(''),
      gender: new FormControl('Select gender', [Validators.required, ContactFormHelper.genderValidator]),
      status: new FormControl('', Validators.required)
    });
  }

  toContact(formValue: ɵFormGroupValue<ContactForm>, isEditMode: boolean, contactId: number | null): Contact {
    const id = isEditMode ? contactId! : null;
    return {
      id,
      name: formValue.name!,
      phone: formValue.phone!,
      email: formValue.email!,
      address: formValue.address!,
      gender: formValue.gender!,
      status: formValue.status!
    };
  }

  setEditMode(isEditMode: boolean, contactId: number | null) {
    this.isEditMode = isEditMode;
    this.contactId = contactId;
  }

  static genderValidator(control: AbstractControl): ValidationErrors | null {
    return control.value === 'Select gender' ? { invalidGender: true } : null;
  }
}