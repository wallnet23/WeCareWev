import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { map, Observable } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { RecaptchaFormsModule, RecaptchaModule, RecaptchaV3Module, ReCaptchaV3Service } from 'ng-recaptcha';
import { TranslateModule } from '@ngx-translate/core';
import { Country } from '../../../interfaces/country';
import { ConnectServerService } from '../../../services/connect-server.service';
import { Connect } from '../../../classes/connect';
import { ApiResponse } from '../../../interfaces/api-response';
import { ToastrService } from 'ngx-toastr';
import { PopupDialogService } from '../../../services/popup-dialog.service';

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

  isItalian: boolean = false;
  validEmail: boolean = true;
  countriesData: Country[] = [];

  signupForm = new FormGroup({
    name: new FormControl<string | null>(null, Validators.required),
    surname: new FormControl<string | null>(null, Validators.required),
    company_name: new FormControl<string | null>(null, Validators.required),
    obj_country: new FormControl<Country | null>(null, Validators.required),
    license_number: new FormControl<string | null>(null, Validators.required),
    vat: new FormControl<string | null>(null, Validators.required),
    email: new FormControl<string | null>(null, Validators.email),
    phone: new FormControl<string | null>(null, Validators.minLength(6)),
    phone_whatsapp: new FormControl<string | null>(null, Validators.minLength(6)),
    request_description: new FormControl<string | null>(null, Validators.required),
    recaptcha: new FormControl(null, Validators.required),
  })

  constructor(private connectServerService: ConnectServerService,
    private recaptcha: ReCaptchaV3Service, private popupDialogService: PopupDialogService,
    private router: Router) { }

  ngOnInit() {
    this.connectServerService.getRequestCountryData().subscribe((obj) => {
      this.countriesData = obj;
    });
    this.formLogic();
  }

  subscribe() {
    // console.log(this.signupForm.value);
    console.log(this.signupForm.getRawValue());

    this.connectServerService.postRequest<ApiResponse<{}>>(Connect.urlServerLaraApi, 'user/signup', {
      obj_val: this.signupForm.getRawValue()
    }).subscribe(
      (esito: ApiResponse<{}>) => {
        this.popupDialogService.alertElement(esito);
        this.router.navigate(['/login']);
      }
    )
  }

  onCountrySelect(selectedCountry: any) {
    console.log('Selected Country:', selectedCountry);
    // You can update a form control value here if needed
  }

  private formLogic() {
    this.signupForm.get('obj_country')?.valueChanges.subscribe(
      (country: Country | null) => {
        if (country && country.name.common.toString() === 'Italy') {
          this.isItalian = true;
          this.signupForm.patchValue({ license_number: 'none', vat: '' });
        } else {
          this.isItalian = false;
          this.signupForm.patchValue({ vat: 'none', license_number: '' });
        }
      }
    );
  }

}
