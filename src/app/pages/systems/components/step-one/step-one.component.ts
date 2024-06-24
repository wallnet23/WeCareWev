import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { Observable } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
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
  selector: 'app-step-one',
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
  templateUrl: './step-one.component.html',
  styleUrl: './step-one.component.scss'
})
export class StepOneComponent implements OnInit {

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
    this.infoStep();
  }

  constructor(private formBuilder: FormBuilder, private connectServerService: ConnectServerService,
    private popupDialogService: PopupDialogService) { }

  infoStep() {
    this.connectServerService.getRequest<ApiResponse<{ stepOne: StepOne }>>(Connect.urlServerLaraApi, 'system/infoStepOne', { id: this.idsystem }).
      subscribe((val: ApiResponse<{ stepOne: StepOne }>) => {
        if (val.data && val.data.stepOne) {
          this.stepOneForm.patchValue(val.data.stepOne);
          //console.log(val.data.stepOne.ccn3);
        }
      })
  }

  saveStep() {
    let stepOne = JSON.parse(JSON.stringify(this.stepOneForm.getRawValue()));
    let country$: Observable<Country>;
    let country: Country;

    if (stepOne.ccn3) {
      country$ = this.connectServerService.getSpecificCountryData(this.stepOneForm.get('ccn3')?.value!);
      country$.subscribe((val: any) => {
        if (val && val.length > 0) {
          country = { name: { common: val[0].name.common }, cca2: val[0].cca2, ccn3: val[0].ccn3 };
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
              this.infoStep();
            })
        }
      })
    }
    else {
      country = { name: { common: '' }, cca2: '', ccn3: '' };
      delete stepOne.ccn3;
      stepOne.location_country = country;

      this.connectServerService.postRequest<ApiResponse<null>>(Connect.urlServerLaraApi, 'system/saveStepTwo',
        {
          idsystem: this.idsystem,
          obj_step: stepOne,
        })
        .subscribe((val: ApiResponse<null>) => {
          this.popupDialogService.alertElement(val);
          this.infoStep();
        })
    }
  }

}
