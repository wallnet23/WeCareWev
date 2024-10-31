import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ConnectServerService } from '../../../../services/connect-server.service';
import { PopupDialogService } from '../../../../services/popup-dialog.service';
import { ApiResponse } from '../../../../interfaces/api-response';
import { StepFour } from '../interfaces/step-four';
import { Connect } from '../../../../classes/connect';
import { StepFourService } from './step-four.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SystemComposition } from './interfaces/system-composition';

@Component({
  selector: 'app-step-four',
  standalone: true,
  providers: [],
  imports: [
    CommonModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule,
    MatTooltipModule
  ],
  templateUrl: './step-four.component.html',
  styleUrl: './step-four.component.scss'
})
export class StepFourComponent {

  today = new Date().toISOString().split('T')[0];

  submitted = false;
  @Output() formEmit = new EventEmitter<FormGroup>();
  @Output() readonlyEmit = new EventEmitter<void>();
  @Output() changeStep = new EventEmitter<{step: number, action: number}>();

  @Input() isReadonly = false;
  @Input() idsystem = 0;

  readonly stepFourService = inject(StepFourService);
  language_now = 'en';
  wecoComposition: SystemComposition[] = [];
  systemComposition: SystemComposition[] = [
    {
      id: null,
      name: '---'
    },
    {
      id: 1,
      name: 'Inverter'
    },
    {
      id: 3,
      name: 'Battery and Inverter'
    }];
  numCluster = Array(15).fill(0).map((_, i) => ({
    num: i + 1,
    // Proprietà aggiuntive...
  }));
  numDevicesCluster = Array(16).fill(0).map((_, i) => ({
    num: i + 1,
    // Proprietà aggiuntive...
  }));
  view_stepinverter = false;
  stepFourForm = this.formBuilder.group({
    product_installdate: new FormControl<null | string>(null, [Validators.required, this.dateRangeValidator('2022-01-01', this.today)]),
    product_systemcomposition: new FormControl<number | null>(null, Validators.required),
    product_systemweco: new FormControl<number | null>(null, Validators.required),
    product_brand: new FormControl(''),
    inverter_hybrid: new FormControl<number | null | boolean>(null),
    inverter_online: new FormControl<number | null | boolean>(null),
    refidwecaresystemvolt: new FormControl<number | null>(null, Validators.required),
    system_model: new FormControl<number | null>(null, Validators.required),
    refidwecaresystemtype: new FormControl<number | null>(null, Validators.required),
    cluster_singlebattery: new FormControl<number | null>(null, Validators.required),
    cluster_numberdevices: new FormControl<number | null>({ value: null, disabled: false }, Validators.required),
  });

  constructor(private formBuilder: FormBuilder, private connectServerService: ConnectServerService,
    private popupDialogService: PopupDialogService, private translate: TranslateService) { }

  ngOnInit(): void {
    if (this.idsystem > 0) {
      this.logicStep();
      this.infoStep();
    }
  }
  get systemVoltView() {
    return this.stepFourService.getSystemVoltView();
  }
  get systemModelView() {
    return this.stepFourService.getSystemModelView();
  }

  get systemTypeView() {
    return this.stepFourService.getSystemTypeView();
  }
  private infoStep() {
    this.connectServerService.getRequest<ApiResponse<{
      stepFour: StepFour,
    }>>(Connect.urlServerLaraApi, 'system/infoStepFour',
      {
        id: this.idsystem
      })
      .subscribe((val: ApiResponse<{
        stepFour: StepFour
      }>) => {
        if (val.data && val.data.stepFour) {
          const data_step = val.data.stepFour;
          // this.stepFourForm.patchValue(data_step);
          this.stepFourService.infoClusters(this.stepFourForm, data_step);
        }
      })
  }



  // private getViewStepInverterValid() {
  //   console.log('val:', this.stepFourForm.get('product_systemcomposition')?.value);
  //   let result = false;
  //   if (this.obj_invert) {
  //     console.log('valid:', this.obj_invert.getValidFormInvert());
  //     if (this.stepFourForm.get('product_systemcomposition')?.value == 2 &&
  //       this.obj_invert.getValidFormInvert()) {
  //       result = true;
  //     }
  //   }
  //   this.view_stepinverter = result;
  // }




  private logicStep() {
    this.stepFourForm.get('product_systemcomposition')?.valueChanges.subscribe(
      (val) => {
        // console.log('product_systemcomposition 2');
        if (val == null) {
          this.wecoComposition = [
            {
              id: null,
              name: '---'
            }];
          this.stepFourForm.patchValue({
            product_systemweco: null
          });
          this.stepFourForm.get('product_systemweco')?.disable();
          // inverter
        } else if (val == 1) {
          this.wecoComposition = [
            {
              id: 1,
              name: 'Inverter'
            }
          ];
          this.stepFourForm.patchValue({
            product_systemweco: 1
          });
          this.stepFourForm.get('product_systemweco')?.enable();
          this.stepFourService.enableDisableFields(this.stepFourForm, val);
          // Batterie e inverter
        } else if (val && val == 3) {
          this.wecoComposition = [
            {
              id: null,
              name: '---'
            },
            {
              id: 1,
              name: 'Inverter'
            },
            {
              id: 2,
              name: 'Battery'
            },
            {
              id: 3,
              name: 'Battery and Inverter'
            }
          ];
          this.stepFourForm.patchValue({
            product_systemweco: null
          });
          this.stepFourForm.get('product_systemweco')?.enable();
          this.stepFourService.enableDisableFields(this.stepFourForm, val);
        }
      }
    );

    this.stepFourForm.get('refidwecaresystemvolt')?.valueChanges.subscribe(
      (val) => {
        this.stepFourService.updateSystemVolt(this.stepFourForm, val, () => { });
      });
    this.stepFourForm.get('system_model')?.valueChanges.subscribe(
      (val) => {
        this.stepFourService.updateSystemModel(this.stepFourForm, val, () => { });
      }
    );
    this.stepFourForm.get('cluster_singlebattery')?.valueChanges.subscribe(
      (val) => {
        // non è single battery
        // console.log('non è single battery', val);
        if (val === 0) {
          this.stepFourForm.get('cluster_numberdevices')?.enable();
        }else if(val == 1){
          this.stepFourForm.get('cluster_numberdevices')?.disable();
        }
      }
    );
  }

  getForm() {
    return this.stepFourForm;
  }


  saveStep(action: string) {
    this.submitted = true;
    const stepFour = this.stepFourForm.getRawValue();
    // console.log('data 1', this.stepFourForm.value);

    // console.log('data valid', this.stepFourForm.valid);
    if (this.stepFourForm.valid) {
      this.connectServerService.postRequest<ApiResponse<null>>(Connect.urlServerLaraApi, 'system/saveStepFour',
        {
          idsystem: this.idsystem,
          obj_step: stepFour,
        })
        .subscribe((val: ApiResponse<null>) => {
          this.popupDialogService.alertElement(val);
          this.infoStep();
          this.formEmit.emit(this.formBuilder.group({}));
          if (action == 'next') {
            setTimeout(() => {
              // console.log('Emitting nextStep');
              this.changeStep.emit({step: 4, action: 1});
            }, 0);
          }
        })
    }
  }

  previous() {
    this.changeStep.emit({step: 4, action: 0});
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
    const stepFour = this.stepFourForm.getRawValue();

    if (this.stepFourForm.valid) {
      this.connectServerService.postRequest<ApiResponse<null>>(Connect.urlServerLaraApi, 'system/saveStepFour',
        {
          idsystem: this.idsystem,
          obj_step: stepFour,
          readonly: 1,
        })
        .subscribe((val: ApiResponse<null>) => {
          this.popupDialogService.alertElement(val);
          this.readonlyEmit.emit();
        })
    }
  }

  dateRangeValidator(minDate: string, maxDate: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const selectedDate = new Date(control.value);
      const min = new Date(minDate);
      const max = new Date(maxDate);
  
      if (isNaN(selectedDate.getTime())) {
        return { invalidDate: true };
      }
  
      if (selectedDate < min) {
        return { dateTooEarly: true };
      }
  
      if (selectedDate > max) {
        return { dateTooLate: true };
      }
  
      return null;
    };
  }

}
