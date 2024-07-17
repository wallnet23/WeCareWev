import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { map, Observable } from 'rxjs';
import { ConnectServerService } from '../../../services/connect-server.service';
import { Store } from '@ngrx/store';
import { UserState } from '../../../ngrx/user/user.reducer';
import { User } from '../interfaces/user';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';

interface Country {
  name: {
    common: string;
  },
  cca2: string;
  ccn3: string;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatTooltip,
    MatIcon
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {

  type1: string = 'password'
  type2: string = 'password'
  type3: string = 'password'
  toggled1: boolean = true;
  toggled2: boolean = true;
  toggled3: boolean = true;
  
  isItalian: boolean = false;
  countriesData: Country[] = [];
  
  generalForm = new FormGroup({
    name: new FormControl<string | null>(null, Validators.required),
    surname: new FormControl<string | null>(null, Validators.required),
    email: new FormControl<string |null>(null, Validators.email),
    licensenumber: new FormControl<string |null>(null, Validators.required),
    fiscalcode: new FormControl<string | null>(null, Validators.required),
    ccn3: new FormControl<string | null>(null, Validators.required),
  })

  companyForm = new FormGroup({
    company_name: new FormControl<string | null>(null, Validators.required),
    vat: new FormControl<string |null>(null, Validators.required),
    phone: new FormControl<string |null>(null),
    website: new FormControl<string | null>(null),
  })

  modifyPasswordForm = new FormGroup({
    password: new FormControl(null, Validators.required),
    newPassword: new FormControl(null, Validators.required),
    repeatNewPassword: new FormControl(null, Validators.required),
  })
  
  constructor(private http: HttpClient, private connectServerService: ConnectServerService,
    private store: Store<{ user: UserState }>) {}

  ngOnInit() {
    this.connectServerService.getRequestCountryData().subscribe((obj) => {
      this.countriesData = obj;
    })

    this.store.select(state => state.user.userInfo).subscribe(
      (val) => {
      this.generalForm.patchValue(val!);
      this.companyForm.patchValue(val!);
      }
    )
  } 

  fetchCountryData(): Observable<Country[]> {
    return this.http.get<Country[]>('https://restcountries.com/v3.1/all?fields=name,flags,cca2,cca3')
      .pipe(map((val: Country[]) => val.sort((a,b) => a.name.common.localeCompare(b.name.common))));
  }

  setLicence() {
    const selectedCountry = this.generalForm.get('ccn3')?.value!;
    if (selectedCountry === '380') {
      this.isItalian = true;
      this.generalForm.patchValue({licensenumber: '', fiscalcode: null});
    } else {
      this.isItalian = false;
      this.generalForm.patchValue({fiscalcode: null, licensenumber: ''});
    }
  }

  seePassword(id: string) {
    if(id === 'password1') {
      if(this.type1 === 'password') {
        this.type1 = 'text';
        this.toggled1 = false;
      }
      else {
        this.type1 = 'password';
        this.toggled1 = true;
      }
    }
    else if (id === 'password2') {
      if(this.type2 === 'password') {
        this.type2 = 'text';
        this.toggled2 = false;
      }
      else {
        this.type2 = 'password';
        this.toggled2 = true;
      }
    }
    else {
      if(this.type3 === 'password') {
        this.type3 = 'text';
        this.toggled3 = false;
      }
      else {
        this.type3 = 'password';
        this.toggled3 = true;
      }
    }
  }

  saveStep() {

    let form= JSON.parse(JSON.stringify(this.generalForm.getRawValue()));
    let country$: Observable<Country>;
    let country: Country;

    if (form.ccn3) {
      country$ = this.connectServerService.getSpecificCountryData(this.generalForm.get('ccn3')?.value!);
      country$.subscribe((val: any) => {
        if (val && val.length > 0) {
          country = { name: { common: val[0].name.common }, cca2: val[0].cca2, ccn3: val[0].ccn3 };
          delete form.ccn3;
          form.customer_country = country;
          //this.saveData(stepOne, action);
        }
      })
    }
    else {
      country = { name: { common: '' }, cca2: '', ccn3: '' };
      delete form.ccn3;
      form.customer_country = country;
      //this.saveData(stepOne, action);
    }

    console.log("general form:", form);
    console.log("company form:", this.companyForm.getRawValue())
  }

  sendForm() {
    console.log("general form:", this.generalForm.getRawValue());
    console.log("company form:", this.companyForm.getRawValue())
  }
}
