import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Battery, Cluster, ClusterData } from '../../../interfaces/clusterData';
import { ConnectServerService } from '../../../../../services/connect-server.service';
import { ApiResponse } from '../../../../../interfaces/api-response';
import { Connect } from '../../../../../classes/connect';

export interface SystemVolt {
  id: number;
  name_it: string;
  name_en: string;
}
export interface SystemModel {
  id: number;
  name_it: string;
  name_en: string;
}
export interface SystemType {
  id: number;
  name_it: string;
  name_en: string;
  refidwecaresystemmodel: number;
  lv: number;
  hv: number;
}
export interface ClusterSend {
  id: number;
  name: string;
  batteries: any[];
  inverters: number[];
}

@Injectable({
  providedIn: 'root'
})
export class ClusterService {
  systemVolt: SystemVolt[] = [];
  systemModel: SystemModel[] = [];
  systemModel_view: SystemModel[] = [];
  systemType: SystemType[] = [];
  systemType_view: SystemType[] = [];

  constructor(private formBuilder: FormBuilder, private connectServerService: ConnectServerService) { }

  createForm(): FormGroup {
    return this.formBuilder.group({
      cluster_singlebattery: new FormControl<number | null>(null, Validators.required),
      cluster_parallel: new FormControl<number | null>({ value: null, disabled: true }, Validators.required),
      cluster_number: new FormControl<number | null>({ value: null, disabled: true }, Validators.required),
      cluster_numberdevices: new FormControl<number | null>({ value: null, disabled: true }, Validators.required),
      refidwecaresystemvolt: new FormControl<number | null>(null, Validators.required),
      system_model: new FormControl<number | null>(null, Validators.required),
      refidwecaresystemtype: new FormControl<number | null>(null, Validators.required),
      clusters_list: this.formBuilder.array<Cluster[]>([])
    });
  }

  infoClusters(form: FormGroup, obj_cluster: ClusterData) {
    form.get('refidwecaresystemvolt')?.setValue(obj_cluster.refidwecaresystemvolt);
    // Gestisci manualmente i campi dipendenti
    this.updateSystemVolt(form, obj_cluster.refidwecaresystemvolt, () => {
      form.get('system_model')?.setValue(obj_cluster.system_model);
      this.updateSystemModel(form, obj_cluster.system_model, () => {
        form.get('refidwecaresystemtype')?.setValue(obj_cluster.refidwecaresystemtype);
        form.get('cluster_singlebattery')?.setValue(obj_cluster.cluster_singlebattery);
        if (obj_cluster.cluster_singlebattery == 0) {
          form.get('cluster_parallel')?.setValue(obj_cluster.cluster_parallel);
          form.get('cluster_number')?.setValue(obj_cluster.cluster_number);
          form.get('cluster_numberdevices')?.setValue(obj_cluster.cluster_numberdevices);
        }
        this.singleBatteryLogic(form, obj_cluster.cluster_singlebattery);

      });
    });
    // console.log('clusters list: ', obj_cluster.clusters_list);
    this.getClusterFieldAsFormArray(form).clear();
    obj_cluster.clusters_list.forEach(
      (cluster: Cluster, index: number) => {
        const inverterIds = cluster.inverters.map(inverter => inverter.id);
        this.addCluster(form,
          {
            id: cluster.id,
            name: cluster.name,
            inverters: inverterIds,
            batteries: []
          });
        cluster.batteries.forEach(
          (battery) => {
            this.addBattery(form, index, battery);
          }
        )
      }
    )
  }

  /**
   * Usato per inserire i cluster (2)
   */
  public addCluster(form: FormGroup, obj_cluster: ClusterSend) {
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
  public addBattery(form: FormGroup, personalIndex: number, obj_battery: Battery) {
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

  private singleBatteryLogic(form: FormGroup, val: number | null) {
    if (val == 0) {
      form.get('cluster_parallel')?.enable();
      form.get('cluster_number')?.enable();
      form.get('cluster_numberdevices')?.enable();
    } else {
      form.get('cluster_parallel')?.disable();
      form.get('cluster_number')?.disable();
      form.get('cluster_numberdevices')?.disable();
    }
  }

  public updateSystemVolt(form: FormGroup, value: number | null, callback: () => void) {
    // console.log('modifica refidwecaresystemvolt', val);
    this.systemModel_view = [];
    this.systemType_view = [];
    form.patchValue({
      system_model: null,
      refidwecaresystemtype: null,
    });
    if (value && value > 0) {
      // LV
      if (value == 1) {
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
      } else if (value == 2) {
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
    callback();
  }

  public updateSystemModel(form: FormGroup, value: number | null, callback: () => void) {
    this.systemType_view = [];
    form.patchValue({
      refidwecaresystemtype: null,
    });
    if (value && value > 0) {
      const voltage: number | null | undefined = form.get('refidwecaresystemvolt')?.value;

      this.systemType_view = [];
      this.systemType.forEach(
        (type: SystemType) => {
          if (type.refidwecaresystemmodel == value) {
            // LV
            if (voltage == 1 && type.lv == 1) {
              this.systemType_view.push(type);
              // HV
            } else if (voltage == 2 && type.hv == 1) {
              this.systemType_view.push(type);
            }
          }
        }
      )
    }
    callback();
  }

  getSystemVoltView() {
    return this.systemVolt;
  }
  getSystemModelView() {
    return this.systemModel_view;
  }

  getSystemTypeView() {
    return this.systemType_view;
  }

  /**
   *
   */
  public setSystemsValues() {
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


}
