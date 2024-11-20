import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PopupDialogService } from '../../../../services/popup-dialog.service';
import { ConnectServerService } from '../../../../services/connect-server.service';
import { MatCardModule } from '@angular/material/card';
import { ScannerSelectorComponent } from '../../OLD-barcode-scanner/scanner-selector/scanner-selector.component';
import { Inverter } from '../../interfaces/inverterData';
import { ApiResponse } from '../../../../interfaces/api-response';
import { Connect } from '../../../../classes/connect';
import { StepFive } from '../interfaces/step-five';
import { ScannerBarcodeButtonComponent } from "../../../../components/scanner-barcode-button/scanner-barcode-button.component";

@Component({
  selector: 'app-step-five',
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
    MatCardModule,
    ScannerSelectorComponent,
    ScannerBarcodeButtonComponent
],
  templateUrl: './step-five.component.html',
  styleUrl: './step-five.component.scss'
})
export class StepFiveComponent {

  submitted = false;

  @Output() formEmit = new EventEmitter<FormGroup>();
  @Output() readonlyEmit = new EventEmitter<void>();
  @Output() changeStep = new EventEmitter<{step: number, action: number}>();

  @Input() isReadonly = false;
  @Input() idsystem = 0;
  stepFiveForm = this.formBuilder.group({
    inverter_communication: new FormControl<number | null | boolean>({ value: null, disabled: false }),
    inverter_power: new FormControl<number | null | boolean>({ value: null, disabled: false }),
    inverters_list: this.formBuilder.array<any[]>([]),
  });

  constructor(private formBuilder: FormBuilder, private connectServerService: ConnectServerService,
    private popupDialogService: PopupDialogService, private translate: TranslateService) { }

  ngOnInit(): void {
    if (this.idsystem > 0) {
      this.infoStep();
    }
  }

  private infoStep() {
    this.connectServerService.getRequest<ApiResponse<{
      stepFive: StepFive,
    }>>(Connect.urlServerLaraApi, 'system/infoStepFive',
      {
        id: this.idsystem
      })
      .subscribe((val: ApiResponse<{
        stepFive: StepFive
      }>) => {
        if (val.data && val.data.stepFive) {
          this.inverterFieldAsFormArray.clear();
          const data_step = val.data.stepFive;
          this.stepFiveForm.patchValue({
            inverter_communication: data_step.inverter_communication,
            inverter_power: data_step.inverter_power
          });
          data_step.inverters_list.forEach(
            (inverter: Inverter) => {
              this.addInverter(inverter);
            }
          )
        }
      })
  }
  getForm() {
    return this.stepFiveForm;
  }


  saveStep(action: string) {
    this.submitted = true;
    const stepFive = this.stepFiveForm.value;
    // console.log('data 1', this.stepFiveForm.value);
    // console.log('data valid', this.stepFourForm.valid);
    if (this.stepFiveForm.valid) {
      this.connectServerService.postRequest<ApiResponse<null>>(Connect.urlServerLaraApi, 'system/saveStepFive',
        {
          idsystem: this.idsystem,
          obj_step: stepFive,
        })
        .subscribe((val: ApiResponse<null>) => {
          this.popupDialogService.alertElement(val);
          this.infoStep();
          this.formEmit.emit(this.formBuilder.group({}));
          if (action == 'next') {
            setTimeout(() => {
              // console.log('Emitting nextStep');
              this.changeStep.emit({step: 5, action: 1});
            }, 0);
          }
        })
    }
  }

  previous() {
    this.changeStep.emit({step: 5, action: 0});
  }

  get inverterFieldAsFormArray(): any {
    return this.stepFiveForm.get('inverters_list') as FormArray;
  }
  inverter(obj: Inverter): any {
    return this.formBuilder.group({
      id: [obj.id],
      serialnumber: [obj.serialnumber, [Validators.required]],
      model: [obj.model, [Validators.required]]
    });
  }
  addInverter(objInverter: Inverter) {
    this.inverterFieldAsFormArray.push(this.inverter(objInverter));
  }
  // Funzione per rimuovere un inverter dalla lista
  removeInverter(index: number) {
    this.inverterFieldAsFormArray.removeAt(index); // Rimuove l'inverter specificato dall'array
  }
  onBarcodeScanned(barcode: string, i: number) {
    this.inverterFieldAsFormArray.at(i).get('serialnumber').setValue(barcode);
    // console.log("FORM FIELD", this.inverterFieldAsFormArray.value[i].serialnumber)
  }

  approvalRequested() {
    // this.translate.get(['POPUP.TITLE.INFO', 'POPUP.MSG_APPROVEDSTEP', 'POPUP.BUTTON.SEND']).subscribe((translations) => {
    //   const obj_request: ApiResponse<any> = {
    //     code: 244,
    //     data: {},
    //     title: translations['POPUP.TITLE.INFO'],
    //     message: translations['POPUP.MSG_APPROVEDSTEP'],
    //     obj_dialog: {
    //       disableClose: 1,
    //       obj_buttonAction:
    //       {
    //         action: 1,
    //         action_type: 2,
    //         label: translations['POPUP.BUTTON.SEND'],
    //         run_function: () => this.updateStepReadonly()
    //       }
    //     }
    //   }
    //   this.popupDialogService.alertElement(obj_request);
    // });
    this.updateStepReadonly();
  }

  private updateStepReadonly() {
    this.submitted = true;
    const stepFive = this.stepFiveForm.getRawValue();
    if (this.stepFiveForm.valid) {
      this.connectServerService.postRequest<ApiResponse<null>>(Connect.urlServerLaraApi, 'system/saveStepFive',
        {
          idsystem: this.idsystem,
          obj_step: stepFive,
          readonly: 1,
        })
        .subscribe((val: ApiResponse<null>) => {
          this.popupDialogService.alertElement(val);
          this.readonlyEmit.emit();
        })
    }
  }
}
