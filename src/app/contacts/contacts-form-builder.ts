import { FormGroup, Validators, AbstractControl, ValidationErrors, FormControl, ɵFormGroupValue } from '@angular/forms';
import { ContactForm, Contact } from './state.service';

export class ContactFormBuilder extends FormGroup<ContactForm> {

  constructor() {
    super({
      name: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.email]),
      address: new FormControl(''),
      gender: new FormControl('', [Validators.required, ContactFormBuilder.genderValidator]),
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

  static genderValidator(control: AbstractControl): ValidationErrors | null {
    return control.value === undefined ? { invalidGender: true } : null;
  }
}