import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { ScannerSelectorComponent } from '../../barcode-scanner/scanner-selector/scanner-selector.component';
import { ConnectServerService } from '../../../../services/connect-server.service';
import { PopupDialogService } from '../../../../services/popup-dialog.service';
import { Battery, Cluster } from '../../interfaces/clusterData';
import { ApiResponse } from '../../../../interfaces/api-response';
import { StepSix } from '../interfaces/step-six';
import { Connect } from '../../../../classes/connect';
import { ClusterSend } from '../step-four-old/clusters/cluster.service';
import { MatSelectModule } from '@angular/material/select';
import { Inverter } from '../../interfaces/inverterData';
import { StepFourService } from '../step-four/step-four.service';

@Component({
  selector: 'app-step-six',
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
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule,
    MatCardModule,
    ScannerSelectorComponent,
    MatSelectModule
  ],
  templateUrl: './step-six.component.html',
  styleUrl: './step-six.component.scss'
})
export class StepSixComponent {
  @Output() formEmit = new EventEmitter<FormGroup>();
  @Output() nextStep = new EventEmitter<void>();
  @Input() idsystem = 0;
  num_devices: number | null = 0;
  view_inverterslist: Inverter[] = [];
  readonly stepFourService = inject(StepFourService);
  stepSixForm = this.formBuilder.group({
    clusters_list: this.formBuilder.array<Cluster[]>([]),
    cluster_parallel: new FormControl<number | null>({ value: null, disabled: true }, Validators.required),
  });

  constructor(private formBuilder: FormBuilder, private connectServerService: ConnectServerService,
    private popupDialogService: PopupDialogService) { }

  ngOnInit(): void {
    if (this.idsystem > 0) {
      this.infoStep();
    }
  }
  private infoStep() {
    this.connectServerService.getRequest<ApiResponse<{
      stepSix: StepSix,
    }>>(Connect.urlServerLaraApi, 'system/infoStepFive',
      {
        id: this.idsystem
      })
      .subscribe((val: ApiResponse<{
        stepSix: StepSix
      }>) => {
        if (val.data && val.data.stepSix) {
          const data_step = val.data.stepSix;
          // this.inverterFieldAsFormArray.clear();
          // const data_step = val.data.stepFive;
          // this.stepFiveForm.patchValue({
          //   inverter_communication: data_step.inverter_communication,
          //   inverter_power: data_step.inverter_power
          // });
          // data_step.inverters_list.forEach(
          //   (inverter: Inverter) => {
          //     this.addInverter(inverter);
          //   }
          // )
          this.getClusterFieldAsFormArray(this.stepSixForm).clear();
          this.logicSingleBattery(this.stepSixForm, data_step.cluster_singlebattery);
          this.num_devices = data_step.cluster_numberdevices;
          const array_clusters = data_step.clusters_list;

          this.getClusterFieldAsFormArray(this.stepSixForm).clear();
          array_clusters.forEach(
            (cluster: Cluster, index: number) => {
              const inverterIds = cluster.inverters.map(inverter => inverter.id);
              this.addCluster(this.stepSixForm,
                {
                  id: cluster.id,
                  name: cluster.name,
                  inverters: inverterIds,
                  batteries: []
                });
              cluster.batteries.forEach(
                (battery) => {
                  this.addBattery(this.stepSixForm, index, battery);
                }
              )
            }
          )
        }
      })
  }
  saveStep(action: string) {
    // const stepFive = this.stepFiveForm.value;
    // // console.log('data 1', this.stepFiveForm.value);
    // // console.log('data valid', this.stepFourForm.valid);
    // this.connectServerService.postRequest<ApiResponse<null>>(Connect.urlServerLaraApi, 'system/saveStepFive',
    //   {
    //     idsystem: this.idsystem,
    //     obj_step: stepFive,
    //   })
    //   .subscribe((val: ApiResponse<null>) => {
    //     this.popupDialogService.alertElement(val);
    //     this.infoStep();
    //     this.formEmit.emit(this.formBuilder.group({}));
    //     if (action == 'next') {
    //       setTimeout(() => {
    //         // console.log('Emitting nextStep');
    //         this.nextStep.emit();
    //       }, 0);
    //     }
    //   })
  }
  /**
     * Usato per inserire i cluster (2)
     */
  private addCluster(form: FormGroup, obj_cluster: ClusterSend) {
    this.getClusterFieldAsFormArray(form).push(new FormGroup({
      id: new FormControl<number>(obj_cluster.id),
      name: new FormControl<string>(obj_cluster.name),
      //batteries: new FormArray([]),
      batteries: this.formBuilder.array([]),
      inverters: new FormControl<number[]>(obj_cluster.inverters)
    }));
  }

  /**
    * Usato per inserire le batterie nel cluster (3)
    * @param personalIndex
    * @param tipo
    */
  private addBattery(form: FormGroup, personalIndex: number, obj_battery: Battery) {
    // const clusterFormGroup = this.clusterFieldAsFormArray.at(personalIndex) as FormGroup;
    const clusterFormGroup = this.getClusterFieldAsFormArray(form).at(personalIndex) as FormGroup;
    const batterieFormArray = clusterFormGroup.get('batteries') as FormArray;
    batterieFormArray.push(new FormGroup({
      id: new FormControl(obj_battery.id, Validators.required),
      serialnumber: new FormControl(obj_battery.serialnumber, Validators.required),
      masterorslave: new FormControl(obj_battery.masterorslave),
    }));
  }
  public getClusterFieldAsFormArray(form: FormGroup): any {
    return form.get('clusters_list') as FormArray;
  }


  objcluster_default: ClusterSend = {
    id: 0,
    name: '',
    batteries: [],
    inverters: []
  }
  objbattery_default: Battery = {
    id: 0,
    serialnumber: '',
    masterorslave: null
  }

  getStrMasterSlave(type: number) {
    let str_type = 'Slave';
    if (type == 1) {
      str_type = 'Master';
      if (this.stepFourService.refidwecaresystemvolt == 2) {
        str_type = 'HVBOX';
      }
    }
    return str_type;
  }

  public generateClusterDefault() {
    const num_battery = this.num_devices;
    this.populateClusters(num_battery, this.objcluster_default, this.objbattery_default);
  }

  /**
     * Genera il cluster popolandolo (1)
     * @param num_cluster
     * @param num_battery
     */
  private populateClusters(num_battery: number | null | undefined,
    objcluster_default: ClusterSend, objbattery_default: Battery
  ) {

    this.addCluster(this.stepSixForm, objcluster_default);
    if (num_battery) {
      for (let j = 0; j < num_battery; j++) {
        // let tipo = 'Slave';
        // if (j == 0) {
        //   tipo = 'Master';
        //   if (this.stepClusterForm.get('refidwecaresystemvolt')?.value == 2) {
        //     tipo = 'HVBOX';
        //   }
        // }
        if (j == 0) {
          objbattery_default.masterorslave = 1;
        } else {
          objbattery_default.masterorslave = 0;
        }

        this.addBattery(this.stepSixForm, 1, objbattery_default);
      }
    }
  }
  // Funzione per rimuovere un cluster dalla lista
  removeCluster(index: number) {
    this.getClusterFieldAsFormArray(this.stepSixForm).removeAt(index); // Rimuove il cluster specificato dall'array
  }
  private logicSingleBattery(form: FormGroup, val: number | null) {
    if (val === 0) {
      form.get('cluster_parallel')?.enable();
    } else {
      form.get('cluster_parallel')?.disable();
    }
  }
}
