/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { API_TOKEN } from './app/contacts/api.token';
import { MockApiService } from './app/contacts/mock-api.service';
import { ApiService } from './app/contacts/api.service';


bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(BrowserAnimationsModule),
    {provide: API_TOKEN, useClass: ApiService}
  ]
}).catch(err => console.error(err));
