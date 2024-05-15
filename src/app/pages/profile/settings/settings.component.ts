import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { map, Observable } from 'rxjs';

interface Country {
  name: {
    common: string;
  },
  cca2: string;
  ccn3: string;
  flags: {
    png: string;
  }
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {

  isItalian: boolean = false;
  countriesData: Country[] = [];
  
  generalForm = new FormGroup({
    name: new FormControl<string | null>(null, Validators.required),
    surname: new FormControl<string | null>(null, Validators.required),
    email: new FormControl<string |null>(null, Validators.email),
    phoneNumber: new FormControl<string |null>(null, Validators.minLength(8)),
  })

  signupForm = new FormGroup({
    companyName: new FormControl<string | null>(null, Validators.required),
    country: new FormControl<Country | null>(null, Validators.required),
    licenseNumber: new FormControl<string |null>(null, Validators.required),
    partitaIva: new FormControl<string |null>(null, Validators.required),
    phoneNumber: new FormControl<string |null>(null, Validators.minLength(8)),
    website: new FormControl<string | null>(null),
  })

  modifyPasswordForm = new FormGroup({
    password: new FormControl(null, Validators.required),
    newPassword: new FormControl(null, Validators.required),
    repeatNewPassword: new FormControl(null, Validators.required),
  })
  
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchCountryData().subscribe((obj) => {
      this.countriesData = obj;
    });
  } 

  fetchCountryData(): Observable<Country[]> {
    return this.http.get<Country[]>('https://restcountries.com/v3.1/all?fields=name,flags,cca2,cca3')
      .pipe(map((val: Country[]) => val.sort((a,b) => a.name.common.localeCompare(b.name.common))));
  }

  setLicence() {
    const selectedCountry = this.signupForm.get('country')?.value!;
    if (selectedCountry.toString() === 'Italy') {
      this.isItalian = true;
      this.signupForm.patchValue({licenseNumber: 'none', partitaIva: ''});
    } else {
      this.isItalian = false;
      this.signupForm.patchValue({partitaIva: 'none', licenseNumber: ''});
    }
  }
}
