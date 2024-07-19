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
import { ApiResponse } from '../../../interfaces/api-response';
import { Connect } from '../../../classes/connect';
import { PopupDialogService } from '../../../services/popup-dialog.service';

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
    email: new FormControl<string | null>({ value: null, disabled: true }, [Validators.required, Validators.email]),
    licensenumber: new FormControl<string | null>(null),
    fiscalcode: new FormControl<string | null>(null),
    ccn3: new FormControl<string | null>(null),
  })

  companyForm = new FormGroup({
    company_name: new FormControl<string | null>(null),
    vat: new FormControl<string | null>(null),
    phone: new FormControl<string | null>(null),
  })

  modifyPasswordForm = new FormGroup({
    current_password: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required),
    password_confirmation: new FormControl(null, Validators.required),
  })

  constructor(private http: HttpClient, private connectServerService: ConnectServerService,
    private store: Store<{ user: UserState }>, private popupDialogService: PopupDialogService) { }

  ngOnInit() {
    this.connectServerService.getRequestCountryData().subscribe((obj) => {
      this.countriesData = obj;
      this.store.select(state => state.user.userInfo).subscribe(
        (val) => {
          this.generalForm.patchValue(val!);
          this.companyForm.patchValue(val!);
        }
      );
    })


  }

  fetchCountryData(): Observable<Country[]> {
    return this.http.get<Country[]>('https://restcountries.com/v3.1/all?fields=name,flags,cca2,cca3')
      .pipe(map((val: Country[]) => val.sort((a, b) => a.name.common.localeCompare(b.name.common))));
  }

  setLicence() {
    const selectedCountry = this.generalForm.get('ccn3')?.value!;
    if (selectedCountry === '380') {
      this.isItalian = true;
      this.generalForm.patchValue({ licensenumber: '', fiscalcode: null });
    } else {
      this.isItalian = false;
      this.generalForm.patchValue({ fiscalcode: null, licensenumber: '' });
    }
  }

  updateGeneral() {
    if (this.generalForm.valid) {
      let form_general = JSON.parse(JSON.stringify(this.generalForm.value));
      let country: Country;
      if (form_general.ccn3) {
        this.connectServerService.getSpecificCountryData(this.generalForm.get('ccn3')?.value!)
          .subscribe((val: any) => {
            if (val && val.length > 0) {
              country = { name: { common: val[0].name.common }, cca2: val[0].cca2, ccn3: val[0].ccn3 };
              delete form_general.ccn3;
              form_general.country = country;
              this.actionUpdateGeneral(form_general);
            }
          })
      }
      else {
        country = { name: { common: '' }, cca2: '', ccn3: '' };
        delete form_general.ccn3;
        form_general.country = country;
        this.actionUpdateGeneral(form_general);
      }

    }
  }
  private actionUpdateGeneral(form_general: FormGroup) {
    this.connectServerService.postRequest(Connect.urlServerLaraApi, 'user/updateProfile',
      form_general
    ).subscribe((esito: ApiResponse<null>) => {
      this.popupDialogService.alertElement(esito);
    })
  }

  updateCompany() {
    this.connectServerService.postRequest(Connect.urlServerLaraApi, 'user/updateCompany',
      this.companyForm.getRawValue()
    ).subscribe((esito: ApiResponse<null>) => {
      this.popupDialogService.alertElement(esito);
    })
  }

  seePassword(id: string) {
    if (id === 'password1') {
      if (this.type1 === 'password') {
        this.type1 = 'text';
        this.toggled1 = false;
      }
      else {
        this.type1 = 'password';
        this.toggled1 = true;
      }
    }
    else if (id === 'password2') {
      if (this.type2 === 'password') {
        this.type2 = 'text';
        this.toggled2 = false;
      }
      else {
        this.type2 = 'password';
        this.toggled2 = true;
      }
    }
    else {
      if (this.type3 === 'password') {
        this.type3 = 'text';
        this.toggled3 = false;
      }
      else {
        this.type3 = 'password';
        this.toggled3 = true;
      }
    }
  }

  saveNewPassword() {
    if (this.modifyPasswordForm.valid) {
      const obj_request: ApiResponse<any> = {
        code: 244,
        data: {},
        title: 'Info',
        message: 'Sei sicuro di voler cambiare la password di accesso?',
        obj_dialog: {
          disableClose: 1,
          obj_buttonAction:
          {
            action: 1,
            action_type: 2,
            label: 'Update',
            run_function: () => this.actionUpdatePassword()
          }
        }
      }
      this.popupDialogService.alertElement(obj_request);
    }
  }

  private actionUpdatePassword() {
    this.connectServerService.postRequest(Connect.urlServerLaraApi, 'user/resetPassword', {
      current_password: this.modifyPasswordForm.get('current_password')?.value,
      password: this.modifyPasswordForm.get('password')?.value,
      password_confirmation: this.modifyPasswordForm.get('password_confirmation')?.value,
    }).subscribe((esito: ApiResponse<null>) => {
      this.popupDialogService.alertElement(esito);
      this.modifyPasswordForm.reset();
    })
  }
}
