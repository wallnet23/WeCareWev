import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { map, Observable } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { RecaptchaFormsModule, RecaptchaModule, RecaptchaV3Module, ReCaptchaV3Service } from 'ng-recaptcha';


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
  selector: 'app-signup',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    MatSelectModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    RecaptchaV3Module,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit {

  isItalian: boolean = false;
  validEmail: boolean = true;
  countriesData: Country[] = [];

  signupForm = new FormGroup({
    name: new FormControl<string | null>(null, Validators.required),
    surname: new FormControl<string | null>(null, Validators.required),
    companyName: new FormControl<string | null>(null, Validators.required),
    country: new FormControl<Country | null>(null, Validators.required),
    licenseNumber: new FormControl<string |null>(null, Validators.required),
    partitaIva: new FormControl<string |null>(null, Validators.required),
    email: new FormControl<string |null>(null, Validators.email),
    phoneNumber: new FormControl<string |null>(null, Validators.minLength(8)),
    description: new FormControl<string | null>(null, Validators.required),
    recaptcha: new FormControl(null, Validators.required),
  })

  constructor(private http: HttpClient, private recaptcha: ReCaptchaV3Service,) { }

  ngOnInit() {
    this.fetchCountryData().subscribe((obj) => {
      this.countriesData = obj;
    });
  }  

  subscribe() {
    console.log(this.signupForm.value);
    console.log(this.signupForm.getRawValue());
  }

  fetchCountryData(): Observable<Country[]> {
    return this.http.get<Country[]>('https://restcountries.com/v3.1/all?fields=name,flags,cca2,cca3')
      .pipe(map((val: Country[]) => val.sort((a,b) => a.name.common.localeCompare(b.name.common))));
  }

  onCountrySelect(selectedCountry: any) {
    console.log('Selected Country:', selectedCountry);
    // You can update a form control value here if needed
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
