import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputsModule, RadioButtonModule } from '@progress/kendo-angular-inputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { StateService } from './state.service';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputsModule,
    ButtonsModule,
    DropDownsModule,
    RadioButtonModule,
    RouterOutlet,
    DialogModule
  ],
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent{
  private _router = inject(Router);
  private _stateService = inject(StateService);
  
  contactsSignal = this._stateService.contactsSignal;

  editContact(contactId: number) {
    this._router.navigate(['/contacts/edit', contactId]);
  }

  addContact() {
    this._router.navigate(['/contacts/new']);
  }
}