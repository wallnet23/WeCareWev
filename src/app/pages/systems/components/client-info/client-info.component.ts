import { Component, Input, OnInit } from '@angular/core';
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
import { ConnectServerService } from '../../../../services/connect-server.service';
import { ApiResponse } from '../../../../interfaces/api-response';
import { StepOne } from '../interfaces/step-one';
import { Connect } from '../../../../classes/connect';
import { PopupDialogService } from '../../../../services/popup-dialog.service';
import { Country } from '../../../../interfaces/country';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-client-info',
  standalone: true,
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
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
    TranslateModule,
  ],
  templateUrl: './client-info.component.html',
  styleUrl: './client-info.component.scss'
})
export class ClientInfoComponent implements OnInit {

  @Input() idsystem = 0;
  countriesData: Country[] = [];

  stepOneForm = this.formBuilder.group({
    customer_name: new FormControl('', Validators.required),
    customer_surname: new FormControl('', Validators.required),
    ccn3: new FormControl<string | null>(null, Validators.required),
    customer_phone: new FormControl<string>(''),
    customer_vat: new FormControl<string>(''),
    customer_licensenumber: new FormControl<string>(''),
  });

  ngOnInit() {
    this.connectServerService.getRequestCountryData().subscribe((obj) => {
      this.countriesData = obj;
    });
  }

  constructor(private formBuilder: FormBuilder, private connectServerService: ConnectServerService,
    private popupDialogService: PopupDialogService) { }

  //saveStep --> invio i dati al server per ogni step, chiamo l'api con il ccn3 per recuperare l'oggetto country. url: system/saveStepOne
  //infoStep --> prendo i dati. url: system/infoStepOne

  infoStep() {
    this.connectServerService.getRequest<ApiResponse<StepOne>>(Connect.urlServerLaraApi, 'system/infoStepOne', {id: this.idsystem}).
      subscribe((val: ApiResponse<StepOne>) => {
        if (val.data) {
          this.stepOneForm.patchValue(val.data);
        }
      })
  }

  saveStep() {
    let stepOne = JSON.parse(JSON.stringify(this.stepOneForm.getRawValue()));
    let country$: Observable<Country>;
    let country: Country;
    console.log("CCN3: ", this.stepOneForm.get('ccn3')?.value!)
    country$ = this.connectServerService.getSpecificCountryData(this.stepOneForm.get('ccn3')?.value!);
    country$.subscribe((val: any) => {
      if (val && val.length > 0) {
        country = {name: {common: val[0].name.common}, cca2: val[0].cca2, ccn3: val[0].ccn3};
        console.log(country);
        delete stepOne.ccn3;
        stepOne.customer_country = country;
        this.connectServerService.postRequest<ApiResponse<null>>(Connect.urlServerLaraApi, 'system/saveStepOne',
          {
            idsystem: this.idsystem,
            obj_step: stepOne
          })
          .subscribe((val: ApiResponse<null>) => {
            this.popupDialogService.alertElement(val);
          })
      }
    })

  }

}
