import {FormControl} from '@angular/forms';

export interface Contact {
  id: number | null;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  gender: string;
  status: string;
}

export interface ContactForm {
  name: FormControl<string | null>;
  phone: FormControl<string | null>;
  email: FormControl<string | null>;
  address: FormControl<string | null>;
  gender: FormControl<string | null>;
  status: FormControl<string | null>;
}
