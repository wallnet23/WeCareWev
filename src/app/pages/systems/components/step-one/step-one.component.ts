import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ConnectServerService } from '../../../../services/connect-server.service';
import { ApiResponse } from '../../../../interfaces/api-response';
import { StepOne } from '../interfaces/step-one';
import { Connect } from '../../../../classes/connect';
import { PopupDialogService } from '../../../../services/popup-dialog.service';
import { Country } from '../../../../interfaces/country';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { selectAllCountries } from '../../../../ngrx/country/country.selectors';
import { Store } from '@ngrx/store';
import { CountryState } from '../../../../ngrx/country/country.reducer';

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
    MatTooltipModule
  ],
  templateUrl: './step-one.component.html',
  styleUrl: './step-one.component.scss'
})
export class StepOneComponent implements OnInit {

  @Output() formEmit = new EventEmitter<FormGroup>();
  @Output() readonlyEmit = new EventEmitter<void>();
  @Output() idEmitter = new EventEmitter<number>();
  @Output() nextStep = new EventEmitter<void>();

  @Input() isReadonly = false;
  @Input() idsystem = 0;
  countriesData: Country[] = [];
  isError = false;
  submitted = false;
  errors = {
    system_name: false,
    system_owner: false,
    customer_name: false,
    customer_surname: false,
    customer_country: false,
    customer_phone: false,
    customer_licensenumber: false,
    customer_fiscalcode: false,
  }

  stepOneForm = this.formBuilder.group({
    system_name: new FormControl<string | null>(null, Validators.required),
    system_description: new FormControl<string | null>(null),
    system_owner: new FormControl<number>(1, Validators.required),
    customer_name: new FormControl('', Validators.required),
    customer_surname: new FormControl('', Validators.required),
    customer_country: new FormControl<number | null>(null, Validators.required),
    customer_phone: new FormControl<string>('', Validators.required),
    customer_vat: new FormControl<string>(''),
    customer_licensenumber: new FormControl<string>('', Validators.required),
    customer_fiscalcode: new FormControl<string>('', Validators.required),
  });

  constructor(private formBuilder: FormBuilder, private connectServerService: ConnectServerService,
    private popupDialogService: PopupDialogService, private router: Router,
    private store: Store<{ country: CountryState }>, private translate: TranslateService) { }

  ngOnInit() {
    this.store.select(selectAllCountries).subscribe((obj) => {
      this.countriesData = obj;
    });
    this.infoStep();
    if (this.idsystem == 0) {
      this.disableFields();
      this.logicStep();
    }
  }

  infoStep() {
    if (this.idsystem > 0) {
      this.connectServerService.getRequest<ApiResponse<{ stepOne: StepOne }>>(Connect.urlServerLaraApi,
        'system/infoStepOne', { id: this.idsystem }).
        subscribe((val: ApiResponse<{ stepOne: StepOne }>) => {
          if (val.data && val.data.stepOne) {
            if (val.data.stepOne.system_owner == 1) {
              this.stepOneForm.patchValue({
                system_name: val.data.stepOne.system_name,
                system_description: val.data.stepOne.system_description,
                system_owner: val.data.stepOne.system_owner,
              });
              this.stepOneForm.get('customer_name')?.disable();
              this.stepOneForm.get('customer_surname')?.disable();
              this.stepOneForm.get('customer_country')?.disable();
              this.stepOneForm.get('customer_phone')?.disable();
              this.stepOneForm.get('customer_vat')?.disable();
              this.stepOneForm.get('customer_licensenumber')?.disable();
              this.stepOneForm.get('customer_fiscalcode')?.disable();
            }
            else {
              this.stepOneForm.patchValue(val.data.stepOne);
              const customer_country = this.stepOneForm.get('customer_country')?.value;
              if (customer_country == 12) {
                this.stepOneForm.get('customer_vat')?.enable();
                this.stepOneForm.get('customer_fiscalcode')?.enable();
                this.stepOneForm.get('customer_licensenumber')?.disable();
              } else {
                this.stepOneForm.get('customer_vat')?.disable();
                this.stepOneForm.get('customer_fiscalcode')?.disable();
                this.stepOneForm.get('customer_licensenumber')?.enable();
              }
            }
            //console.log(val.data.stepOne.ccn3);
            this.logicStep();
          }
        })
    }
  }


  saveStep(action: string) {
    //this.errorLogic();
    this.submitted = true;
    if (this.stepOneForm.valid) {
      let stepOne = JSON.parse(JSON.stringify(this.stepOneForm.getRawValue()));
      this.saveData(stepOne, action);
    }
  }

  updateStep() {
    // APRI POPUP E POI FAI LA CHIAMATA
  }

  private errorLogic() {
    if (this.stepOneForm.get('system_name')?.value == null || this.stepOneForm.get('system_name')?.value!.replaceAll(' ', '') == '') {
      this.errors.system_name = true;
    }
    else {
      this.errors.system_name = false;
    }

    if (this.stepOneForm.get('system_owner')?.value == 0) {
      if (this.stepOneForm.get('customer_name')?.value == null || this.stepOneForm.get('customer_name')?.value!.replaceAll(' ', '') == '') {
        this.errors.customer_name = true;
      }
      else {
        this.errors.customer_name = false;
      }
      if (this.stepOneForm.get('customer_surname')?.value == null || this.stepOneForm.get('customer_surname')?.value!.replaceAll(' ', '') == '') {
        this.errors.customer_surname = true;
      }
      else {
        this.errors.customer_surname = false;
      }
      if (this.stepOneForm.get('customer_country')?.value == null) {
        this.errors.customer_country = true;
      }
      else {
        this.errors.customer_country = false;
      }
      if (this.stepOneForm.get('customer_phone')?.value == null || this.stepOneForm.get('customer_phone')?.value!.replaceAll(' ', '') == '') {
        this.errors.customer_phone = true;
      }
      else {
        this.errors.customer_phone = false;
      }
      if (this.stepOneForm.get('customer_country')?.value == 12) {
        this.errors.customer_licensenumber = false;
        if (this.stepOneForm.get('customer_fiscalcode')?.value == null || this.stepOneForm.get('customer_fiscalcode')?.value!.replaceAll(' ', '') == '') {
          this.errors.customer_fiscalcode = true;
        }
        else {
          this.errors.customer_fiscalcode = false;
        }
      }
      else {
        this.errors.customer_fiscalcode = false;
        if (this.stepOneForm.get('customer_licensenumber')?.value == null || this.stepOneForm.get('customer_licensenumber')?.value!.replaceAll(' ', '') == '') {
          this.errors.customer_licensenumber = true;
        }
        else {
          this.errors.customer_licensenumber = false;
        }
      }
    }
    else {
      this.errors.customer_name = false;
      this.errors.customer_surname = false;
      this.errors.customer_country = false;
      this.errors.customer_phone = false;
      this.errors.customer_fiscalcode = false;
      this.errors.customer_licensenumber = false;
    }
    this.checkIsError();
  }

  private checkIsError() {
    if (!this.errors.customer_name &&
      !this.errors.customer_surname &&
      !this.errors.customer_country &&
      !this.errors.customer_phone &&
      !this.errors.customer_fiscalcode &&
      !this.errors.customer_licensenumber) {
      this.isError = false;
    }
    else {
      this.isError = true;
    }
  }

  private saveData(stepOne: any, action: string) {
    this.connectServerService.postRequest<ApiResponse<{ idsystem: number }>>(Connect.urlServerLaraApi, 'system/saveStepOne',
      {
        idsystem: this.idsystem,
        obj_step: stepOne
      })
      .subscribe((val: ApiResponse<{ idsystem: number }>) => {
        if (this.idsystem == 0) {
          this.formEmit.emit(this.formBuilder.group({}));
          this.router.navigate(['systemManagement', val.data.idsystem]);
        } else {
          this.idsystem = val.data.idsystem;
          this.idEmitter.emit(val.data.idsystem);
          this.popupDialogService.alertElement(val);
          this.infoStep();
          this.formEmit.emit(this.formBuilder.group({}));
          if (action == 'next') {
            setTimeout(() => {
              // console.log('Emitting nextStep');
              this.nextStep.emit();
            }, 0);
          }
        }
      })
  }

  private logicStep() {
    this.stepOneForm.get('system_owner')?.valueChanges.subscribe(
      (val) => {
        if (val == 0) {
          this.stepOneForm.get('customer_name')?.enable();
          this.stepOneForm.get('customer_surname')?.enable();
          this.stepOneForm.get('customer_phone')?.enable();
          this.stepOneForm.get('customer_country')?.enable();
          const customer_country = this.stepOneForm.get('customer_country')?.value;
          if (customer_country == 12) {
            this.stepOneForm.get('customer_vat')?.enable();
            this.stepOneForm.get('customer_fiscalcode')?.enable();
            this.stepOneForm.get('customer_licensenumber')?.disable();
          } else {
            this.stepOneForm.get('customer_vat')?.disable();
            this.stepOneForm.get('customer_fiscalcode')?.disable();
            this.stepOneForm.get('customer_licensenumber')?.enable();
          }
        } else if (val == (1 || true)) {
          this.disableFields();
        }

      }
    );
    this.logicStepCountry();
  }


  private disableFields() {
    // console.log('dentroooo');
    this.stepOneForm.get('customer_name')?.disable();
    this.stepOneForm.get('customer_surname')?.disable();
    this.stepOneForm.get('customer_country')?.disable();
    this.stepOneForm.get('customer_phone')?.disable();
    this.stepOneForm.get('customer_vat')?.disable();
    this.stepOneForm.get('customer_licensenumber')?.disable();
    this.stepOneForm.get('customer_fiscalcode')?.disable();
  }

  private logicStepCountry() {
    this.stepOneForm.get('customer_country')?.valueChanges.subscribe(
      (val) => {
        // se ita
        if (val == 12) {
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

  onCheckboxChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const isChecked = checkbox.checked;
    const value = isChecked ? 1 : 0;
    this.stepOneForm.patchValue({ system_owner: value });
    const owner = this.stepOneForm.get('system_owner')?.value;
    // console.log("Owner", this.stepOneForm.get('system_owner')?.value);
    // if (owner) {
    //   this.stepOneForm.get('')
    // }
  }

  getFormValid() {
    return this.stepOneForm.valid;
  }

  getForm() {
    return this.stepOneForm;
  }

  approvalRequested() {
    this.translate.get(['POPUP.TITLE.INFO', 'POPUP.MSG_APPROVEDSTEP', 'POPUP.BUTTON.SEND']).subscribe((translations) => {
      const obj_request: ApiResponse<any> = {
        code: 244,
        data: {},
        title: translations['POPUP.TITLE.INFO'],
        message: translations['POPUP.MSG_APPROVEDSTEP'],
        obj_dialog: {
          disableClose: 1,
          obj_buttonAction:
          {
            action: 1,
            action_type: 2,
            label: translations['POPUP.BUTTON.SEND'],
            run_function: () => this.updateStepReadonly()
          }
        }
      }
      this.popupDialogService.alertElement(obj_request);
    });

  }

  private updateStepReadonly() {
    this.submitted = true;
    const stepOne = this.stepOneForm.getRawValue();

    if (this.stepOneForm.valid) {
      this.connectServerService.postRequest<ApiResponse<null>>(Connect.urlServerLaraApi, 'system/saveStepOne',
        {
          idsystem: this.idsystem,
          obj_step: stepOne,
          readonly: 1,
        })
        .subscribe((val: ApiResponse<null>) => {
          this.popupDialogService.alertElement(val);
          this.readonlyEmit.emit();
        })
    }
  }

}
