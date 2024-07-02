import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormControl, FormArray } from '@angular/forms';
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

interface BatteryInfo {
  serialNumber: string;
  askSupport: boolean;
}

interface ClusterInfo {
  batteries: BatteryInfo,
  relatedInverter: string;
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
    ClustersComponent
  ],
  templateUrl: './step-four.component.html',
  styleUrl: './step-four.component.scss'
})
export class StepFourComponent implements OnInit {
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
  formValid: boolean = false;
  stepFourForm = this.formBuilder.group({
    product_installdate: new FormControl<Date | null>(null, Validators.required),
    product_systemcomposition: new FormControl<number | null>(null, Validators.required),
    product_systemweco: new FormControl<number | null>(null, Validators.required),
    product_brand: new FormControl(''),
  });

  constructor(private formBuilder: FormBuilder, private connectServerService: ConnectServerService,
    private popupDialogService: PopupDialogService
  ) { }

  ngOnInit(): void {
    this.logicStep();
    this.getStepValid();
  }

  sendData() {
    console.log('data 1', this.stepFourForm.value);
    console.log('inverter', this.obj_invert.getDataFormInverter());
  }

  saveData() {
    const stepFour = this.stepFourForm.value;
    console.log('data 1', this.stepFourForm.value);
    let stepInverter = null;
    let stepCluster = null;
    if(this.obj_invert && this.obj_invert.getDataFormInverter()){
      console.log('inverter', this.obj_invert.getDataFormInverter());
      console.log('inverter valid', this.obj_invert.getValidFormInvert());
    }

    console.log('data valid', this.stepFourForm.valid);
    // this.connectServerService.postRequest<ApiResponse<null>>(Connect.urlServerLaraApi, 'system/saveStepFour',
    //   {
    //     idsystem: this.idsystem,
    //     obj_step: stepFour,
    //     obj_inverter: stepInverter,
    //     obj_cluster: stepCluster,
    //   })
    //   .subscribe((val: ApiResponse<null>) => {
    //     this.popupDialogService.alertElement(val);

    //   })
  }

  private getStepValid() {
    if (this.stepFourForm && this.obj_invert) {
      this.formValid = this.stepFourForm.valid && this.obj_invert.getValidFormInvert();
    } else {
      this.formValid = false;
    }
  }


  private logicStep() {
    this.stepFourForm.get('product_systemcomposition')?.valueChanges.subscribe(
      (val) => {
        console.log();
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
}
