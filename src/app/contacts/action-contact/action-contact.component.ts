import { NotificationModule, NotificationService } from '@progress/kendo-angular-notification';
import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputsModule, RadioButtonModule } from '@progress/kendo-angular-inputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { Contact, ApiService, ContactForm } from '../api.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ContactFormHelper } from '../contacts-form-helper';
import { StateService } from '../state.service';
import { LoaderModule } from '@progress/kendo-angular-indicators';

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
    NotificationModule,
    DialogModule,
    LoaderModule
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
  notificationService = inject(NotificationService);
  trigger = false;

  constructor(
    private fb: NonNullableFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private stateService: StateService
  ) {
    this.formHelper = new ContactFormHelper(fb, apiService);
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
        const contact = this.apiService.getContactById(this.contactId!);
        if (contact) {
          this.contactForm.reset(contact); 
        }
      }
    });
  }

  saveContact() {
    const formValue = this.contactForm.getRawValue();
    const contact = this.formHelper.toContact(formValue, this.isEditMode, this.contactId);
    
    
    this.apiService.saveContact(contact).subscribe(updatedContact => {
      if(!contact.id){
        this.stateService.getContactsSignal().set([...this.stateService.getContactsSignal()(), updatedContact]);
      } else {
        this.stateService.getContactsSignal().set(this.stateService.getContactsSignal()().map(c => (c.id === updatedContact.id ? updatedContact : c)));
      }
      this.showNotification(this.isEditMode ? 'Contact updated' : 'Contact added');
      this.closeDialog();
    })
    this.trigger = true;
  }


  showNotification(message: string) {
    this.notificationService.show({ 
      content: message, 
      animation: { type: 'fade', duration: 400 }, 
      position: { horizontal: 'center', vertical: 'top' }, 
      type: { style: 'success', icon: true } 
    });
  }

  cancel() {
    this.router.navigate(['/contacts']);
  }

  closeDialog() {
    this.cancel();
  }
}
