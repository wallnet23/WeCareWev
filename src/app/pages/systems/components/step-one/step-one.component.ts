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
import { UserData } from '../../../profile/interfaces/user-data';

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
    customer_userdata: new FormControl<boolean | number>(0),
    customer_name: new FormControl('', Validators.required),
    customer_surname: new FormControl('', Validators.required),
    ccn3: new FormControl<string | null>(null, Validators.required),
    customer_phone: new FormControl<string>(''),
    customer_vat: new FormControl<string>('', Validators.required),
    customer_licensenumber: new FormControl<string>('', Validators.required),
    customer_fiscalcode: new FormControl<string>('', Validators.required),
  });
  constructor(private formBuilder: FormBuilder, private connectServerService: ConnectServerService,
    private popupDialogService: PopupDialogService) { }

  ngOnInit() {
    this.connectServerService.getRequestCountryData().subscribe((obj) => {
      this.countriesData = obj;
    });
    this.infoStep();
    this.logicStep();
  }

  infoStep() {
    this.connectServerService.getRequest<ApiResponse<{ stepOne: StepOne }>>(Connect.urlServerLaraApi, 'system/infoStepOne', { id: this.idsystem }).
      subscribe((val: ApiResponse<{ stepOne: StepOne }>) => {
        if (val.data && val.data.stepOne) {
          this.stepOneForm.patchValue(val.data.stepOne);
          //console.log(val.data.stepOne.ccn3);
          this.logicStep();
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
          delete stepOne.ccn3;
          stepOne.customer_country = country;
          // this.connectServerService.postRequest<ApiResponse<null>>(Connect.urlServerLaraApi, 'system/saveStepOne',
          //   {
          //     idsystem: this.idsystem,
          //     obj_step: stepOne
          //   })
          //   .subscribe((val: ApiResponse<null>) => {
          //     this.popupDialogService.alertElement(val);
          //     this.infoStep();
          //   })
          // console.log('valori', stepOne);
          this.saveData(stepOne);
        }
      })
    }
    else {
      country = { name: { common: '' }, cca2: '', ccn3: '' };
      delete stepOne.ccn3;
      stepOne.customer_country = country;
      this.saveData(stepOne);
      // this.connectServerService.postRequest<ApiResponse<null>>(Connect.urlServerLaraApi, 'system/saveStepTwo',
      //   {
      //     idsystem: this.idsystem,
      //     obj_step: stepOne,
      //   })
      //   .subscribe((val: ApiResponse<null>) => {
      //     this.popupDialogService.alertElement(val);
      //     this.infoStep();
      //   })
    }
  }

  private saveData(stepOne: any) {
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

  private logicStep() {
    this.stepOneForm.get('customer_userdata')?.valueChanges.subscribe(
      (val) => {
        if (val == (0 || false)) {
          this.stepOneForm.reset();
        } else if (val == (1 || true)) {
          this.connectServerService.getRequest<ApiResponse<{ userData: UserData }>>(Connect.urlServerLaraApi, 'user/infoTechnician',
            {}).subscribe(
              (val: ApiResponse<{ userData: UserData }>) => {
                if (val && val.data && val.data.userData) {
                  const obj_userData: UserData = val.data.userData;
                  this.stepOneForm.patchValue({
                    customer_name: val.data.userData.name,
                    customer_surname: val.data.userData.surname,
                    ccn3: val.data.userData.ccn3,
                    customer_phone: val.data.userData.phone,
                    customer_vat: val.data.userData.vat,
                    customer_licensenumber: val.data.userData.licensenumber,
                    customer_fiscalcode: val.data.userData.fiscalcode
                  })
                }
              }
            )
        }

      }
    );
    this.logicStepCcn3();
  }

  private logicStepCcn3(){
    this.stepOneForm.get('ccn3')?.valueChanges.subscribe(
      (val) => {
        // se ita
        if (val == '380') {
          this.stepOneForm.get('customer_vat')?.enable();
          this.stepOneForm.get('customer_fiscalcode')?.enable();
          this.stepOneForm.get('customer_licensenumber')?.setValue(null);
          this.stepOneForm.get('customer_licensenumber')?.disable();
        } else {
          this.stepOneForm.get('customer_vat')?.setValue(null);
          this.stepOneForm.get('customer_vat')?.disable();
          this.stepOneForm.get('customer_fiscalcode')?.setValue(null);
          this.stepOneForm.get('customer_fiscalcode')?.disable();
          this.stepOneForm.get('customer_licensenumber')?.enable();
        }
      });
  }


}
