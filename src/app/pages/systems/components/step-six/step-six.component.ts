import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
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
import { MatDialog } from '@angular/material/dialog';
import { ReadDataPopupComponent } from '../read-data-popup/read-data-popup.component';

@Component({
  selector: 'app-step-six',
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
    MatSelectModule
  ],
  templateUrl: './step-six.component.html',
  styleUrl: './step-six.component.scss'
})
export class StepSixComponent {

  submitted = false;

  @Output() formEmit = new EventEmitter<FormGroup>();
  @Output() readonlyEmit = new EventEmitter<void>();
  @Output() changeStep = new EventEmitter<{step: number, action: number}>();

  @Input() isReadonly = false;
  @Input() idsystem = 0;
  num_devices: number | null = 0;
  view_inverterslist: Inverter[] = [];
  readonly stepFourService = inject(StepFourService);
  cluster_singlebattery: number | null = null;

  stepSixForm = this.formBuilder.group({
    clusters_list: this.formBuilder.array<Cluster[]>([]),
    cluster_parallel: new FormControl<number | null>({ value: null, disabled: true }, Validators.required),
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
      stepSix: StepSix,
    }>>(Connect.urlServerLaraApi, 'system/infoStepSix',
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
          this.cluster_singlebattery = data_step.cluster_singlebattery;
          this.stepSixForm.patchValue({
            cluster_parallel: data_step.cluster_parallel
          });
          this.getClusterFieldAsFormArray(this.stepSixForm).clear();
          this.num_devices = data_step.cluster_numberdevices;
          const array_clusters = data_step.clusters_list;
          this.view_inverterslist = data_step.inverters_list;
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
          this.logicSingleCluster(this.stepSixForm, array_clusters.length);
        }
      })
  }

  saveStep(action: string) {
    this.submitted = true;
    // console.log('1. copy_form', this.stepSixForm.getRawValue());
    if (this.stepSixForm.valid) {
      const copy_form = JSON.parse(JSON.stringify(this.stepSixForm.getRawValue()));
      copy_form.clusters_list.forEach((cluster: any) => {
        const array_inverters: Inverter[] = this.view_inverterslist.filter(
          (inverter: Inverter) => cluster.inverters.includes(inverter.id)
        );
        cluster.inverters = array_inverters;
      });
      // console.log('2. copy_form', copy_form);
      this.connectServerService.postRequest<ApiResponse<null>>(Connect.urlServerLaraApi, 'system/saveStepSix',
        {
          idsystem: this.idsystem,
          obj_step: copy_form,
        })
        .subscribe((val: ApiResponse<null>) => {
          this.popupDialogService.alertElement(val);
          this.infoStep();
          this.formEmit.emit(this.formBuilder.group({}));
          if (action == 'next') {
            setTimeout(() => {
              // console.log('Emitting nextStep');
              this.changeStep.emit({step: 6, action: 1});
            }, 0);
          }
        })
    }
  }

  previous() {
    this.changeStep.emit({step: 6, action: 0});
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

  // private addBattery(form: FormGroup, personalIndex: number, obj_battery: Battery) {
  //   // const clusterFormGroup = this.clusterFieldAsFormArray.at(personalIndex) as FormGroup;
  //   const clusterFormGroup = this.getClusterFieldAsFormArray(form).at(personalIndex) as FormGroup;
  //   const batterieFormArray = clusterFormGroup.get('batteries') as FormArray;
  //   batterieFormArray.push(new FormGroup({
  //     id: new FormControl(obj_battery.id, Validators.required),
  //     serialnumber: new FormControl(obj_battery.serialnumber, Validators.required),
  //     masterorslave: new FormControl(obj_battery.masterorslave),
  //   }));
  // }
  private addBattery(form: FormGroup, personalIndex: number, obj_battery: Battery) {
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
    // Ottieni l'indice dell'ultimo cluster aggiunto
    const clusterIndex = this.getClusterFieldAsFormArray(this.stepSixForm).length - 1;

    if (num_battery) {
      for (let j = 0; j < num_battery; j++) {
        if (j == 0) {
          objbattery_default.masterorslave = 1;
        } else {
          objbattery_default.masterorslave = 0;
        }
        this.addBattery(this.stepSixForm, clusterIndex, objbattery_default);
      }
    }
    this.logicSingleCluster(this.stepSixForm, this.getClusterFieldAsFormArray(this.stepSixForm).length);

  }

  // Funzione per rimuovere un cluster dalla lista
  removeCluster(index: number) {
    this.getClusterFieldAsFormArray(this.stepSixForm).removeAt(index); // Rimuove il cluster specificato dall'array
    this.logicSingleCluster(this.stepSixForm, this.getClusterFieldAsFormArray(this.stepSixForm).length);
  }

  private logicSingleCluster(form: FormGroup, val: number) {
    // console.log('valid', val);
    if (val > 1) {
      form.get('cluster_parallel')?.enable();
    } else {
      form.get('cluster_parallel')?.disable();
    }
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
    if (this.stepSixForm.valid) {
      const copy_form = JSON.parse(JSON.stringify(this.stepSixForm.getRawValue()));
      copy_form.clusters_list.forEach((cluster: any) => {
        const array_inverters: Inverter[] = this.view_inverterslist.filter(
          (inverter: Inverter) => cluster.inverters.includes(inverter.id)
        );
        cluster.inverters = array_inverters;
      });
      this.connectServerService.postRequest<ApiResponse<null>>(Connect.urlServerLaraApi, 'system/saveStepSix',
        {
          idsystem: this.idsystem,
          obj_step: copy_form,
          readonly: 1,
        })
        .subscribe((val: ApiResponse<null>) => {
          this.popupDialogService.alertElement(val);
          this.readonlyEmit.emit();
        })
    }
  }
}
