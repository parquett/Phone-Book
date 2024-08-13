import { InjectionToken } from '@angular/core';
import { IAPI } from './iapi.interface';

export const API_TOKEN = new InjectionToken<IAPI>('API_TOKEN');