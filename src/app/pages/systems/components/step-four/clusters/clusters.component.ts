import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConnectServerService } from '../../../../../services/connect-server.service';
import { ApiResponse } from '../../../../../interfaces/api-response';
import { Connect } from '../../../../../classes/connect';
import { Inverter } from '../../../interfaces/inverter';

interface SystemVolt {
  id: number;
  name_it: string;
  name_en: string;
}
interface SystemModel {
  id: number;
  name_it: string;
  name_en: string;
}
interface SystemType {
  id: number;
  name_it: string;
  name_en: string;
  refidwecaresystemmodel: number;
  lv: number;
  hv: number;
}

@Component({
  selector: 'app-clusters',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './clusters.component.html',
  styleUrl: './clusters.component.scss'
})
export class ClustersComponent implements OnInit {
  @Input() idsystem = 0;
  language_now = 'en';
  systemVolt: SystemVolt[] = [];
  systemModel: SystemModel[] = [];
  systemModel_view: SystemModel[] = [];
  systemType: SystemType[] = [];
  systemType_view: SystemType[] = [];
  numCluster = Array(15).fill(0).map((_, i) => ({
    num: i + 1,
    // Proprietà aggiuntive...
  }));
  numDevicesCluster = Array(16).fill(0).map((_, i) => ({
    num: i + 1,
    // Proprietà aggiuntive...
  }));
  stepClusterForm = this.formBuilder.group({
    cluster_singlebattery: new FormControl<number | null>(null, Validators.required),
    cluster_parallel: new FormControl<number | null>({ value: null, disabled: true }, Validators.required),
    cluster_number: new FormControl<number | null>({ value: null, disabled: true }, Validators.required),
    cluster_numberdevices: new FormControl<number | null>({ value: null, disabled: true }, Validators.required),
    refidwecaresystemvolt: new FormControl<number | null>(null, Validators.required),
    system_model: new FormControl<number | null>(null, Validators.required),
    refidwecaresystemtype: new FormControl<number | null>(null, Validators.required),
    clusters_list: this.formBuilder.array([])
  });

  constructor(private formBuilder: FormBuilder, private connectServerService: ConnectServerService) {
  }

  ngOnInit(): void {
    this.logicCluster();
    this.connectServerService.getRequest<ApiResponse<{ systemVolt: SystemVolt[] }>>(Connect.urlServerLaraApi, 'system/listSystemVolt',
      {}
    ).subscribe(
      (val: ApiResponse<{ systemVolt: SystemVolt[] }>) => {
        if (val.data && val.data.systemVolt) {
          this.systemVolt = val.data.systemVolt;
        }
      })
    this.connectServerService.getRequest<ApiResponse<{ systemModel: SystemModel[] }>>(Connect.urlServerLaraApi, 'system/listSystemModel',
        {}
      ).subscribe(
        (val: ApiResponse<{ systemModel: SystemModel[] }>) => {
          if (val.data && val.data.systemModel) {
            this.systemModel = val.data.systemModel;
          }
        })
      this.connectServerService.getRequest<ApiResponse<{ systemType: SystemType[] }>>(Connect.urlServerLaraApi, 'system/listSystemType',
          {}
        ).subscribe(
          (val: ApiResponse<{ systemType: SystemType[] }>) => {
            if (val.data && val.data.systemType) {
              this.systemType = val.data.systemType;
            }
          })
  }

  private logicCluster(){
    this.stepClusterForm.get('cluster_singlebattery')?.valueChanges.subscribe(
      (val) => {
        if (val == 0) {
          this.stepClusterForm.get('cluster_parallel')?.enable();
          this.stepClusterForm.get('cluster_number')?.enable();
          this.stepClusterForm.get('cluster_numberdevices')?.enable();
        } else {
          this.stepClusterForm.get('cluster_parallel')?.disable();
          this.stepClusterForm.get('cluster_number')?.disable();
          this.stepClusterForm.get('cluster_numberdevices')?.disable();
          this.populateClusters(1, 1);
        }
      }
    );
    this.stepClusterForm.get('cluster_number')?.valueChanges.subscribe(
      (val) => {
        if (val && val > 0) {
          this.generateClusters();
        }
      });
    this.stepClusterForm.get('cluster_numberdevices')?.valueChanges.subscribe(
      (val) => {
        if (val && val > 0) {
          this.generateClusters();
        }
      });
    this.stepClusterForm.get('refidwecaresystemvolt')?.valueChanges.subscribe(
      (val) => {
        if (val && val > 0) {
          this.stepClusterForm.patchValue({
            system_model: null,
            refidwecaresystemtype: null,
          });
          // LV
          if (val == 1) {
            this.systemModel_view = [];
            this.systemType.forEach(
              (type: SystemType) => {
                if (type.lv == 1) {
                  const model = this.systemModel.find((model_search) => model_search.id === type.refidwecaresystemmodel);
                  if (model) {
                    const model_view = this.systemModel_view.find((model_v) => model_v.id === model.id);
                    if (!model_view) {
                      this.systemModel_view.push(model);
                    }
                  }
                }
              }
            )
          // HV
          } else if (val == 2) {
            this.systemModel_view = [];
            this.systemType.forEach(
              (type: SystemType) => {
                if (type.hv == 1) {
                  const model_view = this.systemModel.find((model) => model.id === type.refidwecaresystemmodel);
                  if (model_view) {
                    const model_v = this.systemModel_view.find((model) => model.id === model_view.id);
                    if (!model_v) {
                      this.systemModel_view.push(model_view);
                    }
                  }
                }
              }
            )
          }
        }
      });
    this.stepClusterForm.get('system_model')?.valueChanges.subscribe(
      (val) => {
        if (val && val > 0) {
          const voltage: number | null | undefined = this.stepClusterForm.get('refidwecaresystemvolt')?.value;
          this.stepClusterForm.patchValue({
            refidwecaresystemtype: null,
          });
          this.systemType_view = [];
          this.systemType.forEach(
            (type: SystemType) => {
              if (type.refidwecaresystemmodel == val) {
                // LV
                if(voltage == 1 && type.lv == 1){
                  this.systemType_view.push(type);
                  // HV
                }else if(voltage == 2 && type.hv == 1){
                  this.systemType_view.push(type);
                }
              }
            }
          )
        }
      }
    );
  }

  get clusterFieldAsFormArray(): any {
    return this.stepClusterForm.get('clusters_list') as FormArray;
  }
  addCluster() {
    this.clusterFieldAsFormArray.push(new FormGroup({
      batteries: new FormArray([]),
      inverter: new FormControl<Inverter[]>([])
    }));
  }

  addBattery(personaIndex: number, tipo: string) {
    const clusterFormGroup = this.clusterFieldAsFormArray.at(personaIndex) as FormGroup;
    const batterieFormArray = clusterFormGroup.get('batteries') as FormArray;
    batterieFormArray.push(new FormGroup({
      serialnumber: new FormControl('', Validators.required),
      masterorslave: new FormControl(tipo),
    }));
  }

  private generateClusters() {

    const num_cluster = this.stepClusterForm.get('cluster_number')?.value;
    const num_battery = this.stepClusterForm.get('cluster_numberdevices')?.value;
    this.populateClusters(num_cluster, num_battery);
  }

  private populateClusters(num_cluster: number | null | undefined, num_battery: number | null | undefined) {
    this.clusterFieldAsFormArray.clear();
    if(num_cluster){
      for (let i = 0; i < num_cluster; i++) {
        this.addCluster();
        if(num_battery){
          for (let j = 0; j < num_battery; j++) {
            let tipo = 'Slave';
            if (j == 0) {
              tipo = 'Master';
              if(this.stepClusterForm.get('refidwecaresystemvolt')?.value == 2){
                tipo = 'HVBOX';
              }

            }
            this.addBattery(i, tipo);
          }
        }

      }
    }

  }
}
