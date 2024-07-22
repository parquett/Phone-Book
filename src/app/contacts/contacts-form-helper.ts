import { NonNullableFormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService, ContactForm, Contact } from './api.service';

export class ContactFormHelper {
  private fb: NonNullableFormBuilder;
  private contactsService: ApiService;
  private isEditMode: boolean = false;
  private contactId: number | null = null;

  constructor(fb: NonNullableFormBuilder, contactsService: ApiService) {
    this.fb = fb;
    this.contactsService = contactsService;
  }

  createContactForm(): FormGroup<ContactForm> {
    return this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.email]],
      address: [''],
      gender: ['Select gender', [Validators.required, this.contactsService.genderValidator]],
      status: ['', Validators.required]
    }) as FormGroup<ContactForm>;
  }

  toContact(formValue: any, isEditMode: boolean, contactId: number | null): Contact {
    const id = isEditMode ? contactId! : this.contactsService.getNextId();
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

  isInEditMode(): boolean {
    return this.isEditMode;
  }

  getContactId(): number | null {
    return this.contactId;
  }
}
