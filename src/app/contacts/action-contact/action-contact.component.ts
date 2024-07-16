import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputsModule, RadioButtonModule } from '@progress/kendo-angular-inputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { ReactiveFormsModule, NonNullableFormBuilder } from '@angular/forms';
import { Contact, ContactsService, ContactForm } from '../contacts.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ContactFormHelper } from '../contacts-form-helper';

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
  formHelper: ContactFormHelper;

  constructor(
    private fb: NonNullableFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private contactsService: ContactsService
  ) {
    this.formHelper = new ContactFormHelper(fb, contactsService);
    this.contactForm = this.formHelper.createContactForm();
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(params => {
      const idParam = params.get('id');
      this.contactId = idParam ? Number(idParam) : null;
      this.isEditMode = this.contactId !== null;

      this.formHelper.setEditMode(this.isEditMode, this.contactId);

      if (this.isEditMode) {
        const contact = this.contactsService.getContactById(this.contactId!);
        if (contact) {
          this.contactForm.reset(contact);
        }
      }
    });
  }

  saveContact() {
    const formValue = this.contactForm.getRawValue();
    const contact = this.formHelper.toContact(formValue, this.isEditMode, this.contactId);

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
