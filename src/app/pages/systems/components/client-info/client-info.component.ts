import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

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
  selector: 'app-client-info',
  standalone: true,
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {showError: true},
    },
  ],
  imports: [
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    HttpClientModule,
    CommonModule,
    MatIconModule,
  ],
  templateUrl: './client-info.component.html',
  styleUrl: './client-info.component.scss'
})
export class ClientInfoComponent implements OnInit {

  countriesData: Country[] = [];

  clientFormGroup = this.formBuilder.group({
    name: new FormControl('', Validators.required),
    surname: new FormControl('', Validators.required),
    country: new FormControl<Country | null>(null, Validators.required),
    phoneNumber: new FormControl('')
  });

  ngOnInit() {
    this.fetchCountryData().subscribe((obj) => {
      this.countriesData = obj;
    });
  }  

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {}

  fetchCountryData(): Observable<Country[]> {
    return this.http.get<Country[]>('https://restcountries.com/v3.1/all?fields=name,flags,cca2,cca3')
      .pipe(map((val: Country[]) => val.sort((a,b) => a.name.common.localeCompare(b.name.common))));
  }

  sendData() {
    console.log(this.clientFormGroup.value);
  }
}
