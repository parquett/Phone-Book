import { NotificationModule, NotificationService } from '@progress/kendo-angular-notification';
import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputsModule, RadioButtonModule } from '@progress/kendo-angular-inputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { ReactiveFormsModule } from '@angular/forms';
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
  private _contactId: number | null = null;
  private _destroyRef = inject(DestroyRef);
  private _notificationService = inject(NotificationService);
  private _stateService = inject(StateService);
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);

  contactForm: ContactFormBuilder;
  isEditMode = false;
  loaderTrigger = false;
  genderList = [
    { value: 'Male', text: 'Male' },
    { value: 'Female', text: 'Female' }
  ];
  defaultGender = { value: undefined, text: 'Select gender' };

  constructor() {
    this.contactForm = new ContactFormBuilder();
  }

  ngOnInit(): void {
    this._route.paramMap.pipe(
      takeUntilDestroyed(this._destroyRef)
    ).subscribe(params => {
      const idParam = params.get('id');
      this._contactId = idParam ? Number(idParam) : null;
      this.isEditMode = this._contactId !== null;

      if (this.isEditMode) {
        const contact = this._stateService.getContactById(this._contactId!);
        if (contact) {
          this.contactForm.reset(contact); 
        }
      }
    });
  }

  saveContact() {
    const formValue = this.contactForm.getRawValue();
    const contact = this.contactForm.toContact(formValue, this.isEditMode, this._contactId);
    
    this._stateService.saveContact(contact).pipe(
      takeUntilDestroyed(this._destroyRef)
    ).subscribe(() => {
      this.showNotification(this.isEditMode ? 'Contact updated' : 'Contact added');
      this.closeDialog();
    })
    this.loaderTrigger = true;
  }


  showNotification(message: string) {
    this._notificationService.show({ 
      content: message, 
      animation: { type: 'fade', duration: 400 }, 
      position: { horizontal: 'center', vertical: 'top' }, 
      type: { style: 'success', icon: true } 
    });
  }

  async cancel() {
    await this._router.navigate(['/contacts']);
  }

  closeDialog() {
    this.cancel();
  }
}
