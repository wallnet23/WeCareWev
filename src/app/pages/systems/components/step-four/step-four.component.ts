import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormControl, FormArray, FormGroup } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { InvertersComponent } from './inverters/inverters.component';
import { ClustersComponent } from './clusters/clusters.component';
import { ConnectServerService } from '../../../../services/connect-server.service';
import { ApiResponse } from '../../../../interfaces/api-response';
import { Connect } from '../../../../classes/connect';
import { PopupDialogService } from '../../../../services/popup-dialog.service';
import { StepFour } from '../interfaces/step-four';
import { Inverter, InverterData } from '../../interfaces/inverterData';
import { ClusterData } from '../../interfaces/clusterData';
import { TranslateModule } from '@ngx-translate/core';

interface BatteryInfo {
  serialNumber: string;
  askSupport: boolean;
}

interface SystemComposition {
  id: number | null;
  name: string;
}

@Component({
  selector: 'app-step-four',
  standalone: true,
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
  imports: [
    CommonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    HttpClientModule,
    MatIconModule,
    MatCardModule,
    InvertersComponent,
    ClustersComponent,
    TranslateModule
  ],
  templateUrl: './step-four.component.html',
  styleUrl: './step-four.component.scss'
})
export class StepFourComponent implements OnInit {

  @Output() formEmit = new EventEmitter<FormGroup>();
  @Output() nextStep = new EventEmitter<void>();
  inverterList: Inverter[] = [];

  isError = false;
  errors = {
    product_installdate: false,
    product_systemcomposition: false,
    product_systemweco: false,
    product_brand: false,
  }

  @ViewChild('invertersComponent') obj_invert!: InvertersComponent;
  @ViewChild('clustersComponent') obj_cluster!: ClustersComponent;
  @Input() idsystem = 0;
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
      id: 2,
      name: 'Battery and Inverter'
    }];
  wecoComposition: SystemComposition[] = [];
  stepInverter!: InverterData;
  stepCluster!: ClusterData;
  view_stepinverter = false;
  stepFourForm = this.formBuilder.group({
    product_installdate: new FormControl<null | string>(null, Validators.required),
    product_systemcomposition: new FormControl<number | null>(null, Validators.required),
    product_systemweco: new FormControl<number | null>(null, Validators.required),
    product_brand: new FormControl(''),
  });

  constructor(private formBuilder: FormBuilder, private connectServerService: ConnectServerService,
    private popupDialogService: PopupDialogService
  ) { }

  ngOnInit(): void {
    if (this.idsystem > 0) {
      this.logicStep();
      this.infoStep();
    }
  }


  saveStep(action: string) {

    this.errorLogic();
    if (!this.isError) {
      const stepFour = this.stepFourForm.value;
      // console.log('data 1', this.stepFourForm.value);
      let stepInverter = null;
      let stepCluster = null;
      if (this.obj_invert) {
        stepInverter = this.obj_invert.getDataFormInverter();
        console.log('inverter valid', this.obj_invert.getValidFormInvert());
      }
      if (this.obj_cluster) {
        stepCluster = this.obj_cluster.getDataFormCluster();
        // console.log('inverter valid', this.obj_invert.getValidFormInvert());
      }

      // console.log('data valid', this.stepFourForm.valid);
      this.connectServerService.postRequest<ApiResponse<null>>(Connect.urlServerLaraApi, 'system/saveStepFour',
        {
          idsystem: this.idsystem,
          obj_step: stepFour,
          obj_inverter: stepInverter,
          obj_cluster: stepCluster,
        })
        .subscribe((val: ApiResponse<null>) => {
          this.popupDialogService.alertElement(val);
          this.infoStep();
          this.formEmit.emit(this.formBuilder.group({}));
          if (action == 'next') {
            setTimeout(() => {
              // console.log('Emitting nextStep');
              this.nextStep.emit();
            }, 0);
          }
        })
    }
  }

  private infoStep() {
    this.connectServerService.getRequest<ApiResponse<{
      stepFour: StepFour,
      stepInverter: InverterData,
      stepCluster: ClusterData
    }>>(Connect.urlServerLaraApi, 'system/infoStepFour',
      {
        id: this.idsystem
      })
      .subscribe((val: ApiResponse<{
        stepFour: StepFour,
        stepInverter: InverterData,
        stepCluster: ClusterData
      }>) => {
        if (val.data && val.data.stepFour) {
          const data_step = val.data.stepFour;
          this.stepFourForm.patchValue(data_step);
        }
        if (val.data && val.data.stepInverter) {
          this.stepInverter = val.data.stepInverter;
        }
        if (val.data && val.data.stepCluster) {
          this.stepCluster = val.data.stepCluster;
        }
        // console.log('val 4 info:', val.data);

      })
  }

  getStepValid(): boolean {
    if(this.stepFourForm && this.obj_invert){
      if(this.stepFourForm.get('product_systemcomposition')?.value == 2){
        if(this.obj_cluster){
          return this.stepFourForm.valid && this.obj_invert.getValidFormInvert()
          && this.obj_cluster.getValidFormCluster();
        }else{
          return false;
        }
      }else{
        return this.stepFourForm.valid && this.obj_invert.getValidFormInvert();
      }
    }else{
      return false;
    }
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

  private errorLogic() {
    if (this.stepFourForm.get('product_installdate')?.value == null || this.stepFourForm.get('product_installdate')?.value!.replaceAll(' ', '') == '') {
      this.errors.product_installdate = true;
    }
    else {
      this.errors.product_installdate = false;
    }
    if (this.stepFourForm.get('product_systemcomposition')?.value == null) {
      this.errors.product_systemcomposition = true;
    }
    else {
      this.errors.product_systemcomposition = false;
    }
    if (this.stepFourForm.get('product_systemweco')?.value == null) {
      this.errors.product_systemweco = true;
    }
    else {
      this.errors.product_systemweco = false;
    }
    if (this.stepFourForm.get('product_systemweco')?.value == 0) {
      if (this.stepFourForm.get('product_brand')?.value == null || this.stepFourForm.get('product_brand')?.value!.replaceAll(' ', '') == '') {
        this.errors.product_brand = true;
      }
      else {
        this.errors.product_brand = false;
      }
    }
    else {
      this.errors.product_brand = false;
    }

    this.checkIsError();
  }

  private checkIsError() {
    if (!this.errors.product_installdate &&
      !this.errors.product_systemcomposition &&
      !this.errors.product_systemweco &&
      !this.errors.product_brand) {
      this.isError = false;
    }
    else {
      this.isError = true;
    }
  }

  private logicStep() {
    console.log('product_systemcomposition 1');

    this.stepFourForm.get('product_systemcomposition')?.valueChanges.subscribe(
      (val) => {
        console.log('product_systemcomposition 2');
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
          // Batterie e inverter
        } else if (val && val == 2) {
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
        }
      }
    )
  }

  getForm() {
    return this.stepFourForm;
  }

  updateInvertersList(list: Inverter[]) {
    this.inverterList = list;
  }

}
