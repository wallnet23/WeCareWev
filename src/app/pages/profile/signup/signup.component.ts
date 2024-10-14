import { CommonModule, Location } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { RecaptchaFormsModule, RecaptchaModule, RecaptchaV3Module, ReCaptchaV3Service } from 'ng-recaptcha';
import { TranslateModule } from '@ngx-translate/core';
import { Country } from '../../../interfaces/country';
import { ConnectServerService } from '../../../services/connect-server.service';
import { Connect } from '../../../classes/connect';
import { ApiResponse } from '../../../interfaces/api-response';
import { PopupDialogService } from '../../../services/popup-dialog.service';
import { Store } from '@ngrx/store';
import { selectAllCountries } from '../../../ngrx/country/country.selectors';

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
    TranslateModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit {

  type1: string = 'password'
  type2: string = 'password'
  toggled1: boolean = true;
  toggled2: boolean = true;

  isItalian: boolean = false;
  validEmail: boolean = true;
  countriesData: Country[] = [];
  readonly store = inject(Store);

  signupForm = new FormGroup({
    name: new FormControl<string | null>(null, Validators.required),
    surname: new FormControl<string | null>(null, Validators.required),
    company_name: new FormControl<string | null>(null),
    country: new FormControl<number | null>(null, Validators.required),
    licensenumber: new FormControl<string | null>(null, Validators.required),
    vat: new FormControl<string | null>(null),
    email: new FormControl<string | null>(null, Validators.email),
    password: new FormControl<string | null>(null, Validators.minLength(6)),
    password_confirmation: new FormControl<string | null>(null, Validators.minLength(6)),
    phone: new FormControl<string | null>(null, Validators.required),
    phone_whatsapp: new FormControl<string | null>(null),
    fiscalcode: new FormControl<string | null>(null, Validators.required),
    request_description: new FormControl<string | null>(null),
    recaptcha: new FormControl(null, Validators.required),
  }, { validators: this.passwordMatchValidator })

  constructor(private connectServerService: ConnectServerService,
    private recaptcha: ReCaptchaV3Service, private popupDialogService: PopupDialogService,
    private router: Router) {
    // this.route.queryParamMap.subscribe(params => {
    //   console.log(params.get('text'));
    //   this.signupForm.get('request_description')?.setValue(params.get('text'));
    // });
  }

  ngOnInit() {
    this.store.select(selectAllCountries).subscribe((obj) => {
      this.countriesData = obj;
    });
    this.formLogic();
  }

  sendSignupData() {
    // console.log(this.signupForm.value);
    // console.log(this.signupForm.getRawValue());

    this.connectServerService.postRequest<ApiResponse<{}>>(Connect.urlServerLaraApi, 'user/signup', {
      obj_val: this.signupForm.getRawValue()
    }).subscribe(
      (esito: ApiResponse<{}>) => {
        this.popupDialogService.alertElement(esito);
        this.router.navigate(['/login']);
      }
    )
  }


  private formLogic() {
    this.signupForm.get('country')?.valueChanges.subscribe(
      (id: number | null) => {
        // console.log("COUNTRY SELECTED", country?.name.common.toString())
        if (id === 12) {
          this.isItalian = true;
          this.signupForm.patchValue({ licensenumber: 'none', vat: '', fiscalcode: '' });
          this.signupForm.get('licensenumber')?.disable();
          this.signupForm.get('fiscalcode')?.enable();
        } else {
          this.isItalian = false;
          this.signupForm.patchValue({ vat: 'none', licensenumber: '', fiscalcode: 'null' });
          this.signupForm.get('licensenumber')?.enable();
          this.signupForm.get('fiscalcode')?.disable();
        }
      }
    );
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const passwordConfirm = control.get('password_confirmation');
    if (!password || !passwordConfirm) {
      return null; // Uscita anticipata se i controlli non vengono trovati
    }
    return password.value === passwordConfirm.value ? null : { 'mismatch': true };
  }

  seePassword(id: string) {
    if (id === 'password') {
      if (this.type1 === 'password') {
        this.type1 = 'text';
        this.toggled1 = false;
      }
      else {
        this.type1 = 'password';
        this.toggled1 = true;
      }
    }
    else if (id === 'password_confirmation') {
      if (this.type2 === 'password') {
        this.type2 = 'text';
        this.toggled2 = false;
      }
      else {
        this.type2 = 'password';
        this.toggled2 = true;
      }
    }
  }
}
