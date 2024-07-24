import { NotificationModule, NotificationService } from '@progress/kendo-angular-notification';
import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputsModule, RadioButtonModule } from '@progress/kendo-angular-inputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../api.service';
import { StateService } from '../state.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ContactFormBuilder } from '../contacts-form-builder';
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
  contactForm: ContactFormBuilder;
  contactId: number | null = null;
  isEditMode = false;
  loaderTrigger = false;
  destroyRef = inject(DestroyRef);
  notificationService = inject(NotificationService);
  apiService = inject(ApiService);
  stateService = inject(StateService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  genderList = [
    { value: 'Male', text: 'Male' },
    { value: 'Female', text: 'Female' }
  ];
  
  defaultGender = { value: undefined, text: 'Select gender' };

  constructor(
  ) {
    this.contactForm = new ContactFormBuilder();
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(params => {
      const idParam = params.get('id');
      this.contactId = idParam ? Number(idParam) : null;
      this.isEditMode = this.contactId !== null;

      this.contactForm.setEditMode(this.isEditMode, this.contactId);

      if (this.isEditMode) {
        const contact = this.stateService.getContactById(this.contactId!);
        if (contact) {
          this.contactForm.reset(contact); 
        }
      }
    });
  }

  saveContact() {
    const formValue = this.contactForm.getRawValue();
    const contact = this.contactForm.toContact(formValue, this.isEditMode, this.contactId);
    
    this.apiService.saveContact(contact).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      this.showNotification(this.isEditMode ? 'Contact updated' : 'Contact added');
      this.closeDialog();
    })
    this.loaderTrigger = true;
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
