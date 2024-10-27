import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '../../../../interfaces/api-response';
import { SystemVolt } from './interfaces/system-volt';
import { Connect } from '../../../../classes/connect';
import { SystemModel } from './interfaces/system-model';
import { SystemType } from './interfaces/system-type';
import { ConnectServerService } from '../../../../services/connect-server.service';
import { FormGroup } from '@angular/forms';
import { StepFour } from '../interfaces/step-four';
import { SystemComposition } from './interfaces/system-composition';

@Injectable({
  providedIn: 'root'
})
export class StepFourService {
  readonly connectServerService = inject(ConnectServerService);
  private systemVolt: SystemVolt[] = [];
  private systemModel: SystemModel[] = [];
  private systemModel_view: SystemModel[] = [];
  private systemType: SystemType[] = [];
  private systemType_view: SystemType[] = [];
  // 1 inverter, 3 battery e inverter
  public product_systemcomposition: null | number = null;
  // lv o hv
  public refidwecaresystemvolt: null | number = null;
  // 0 no, 1 si
  public cluster_singlebattery: null | number = null;

  constructor() { }

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
   * Inizializza e viene chiamato in system-management
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

  /**
   * Viene chiamato quando si prende i parametri dal server
   * @param form
   * @param obj_cluster
   */
  infoClusters(form: FormGroup, obj_stepfour: StepFour) {
    this.product_systemcomposition = obj_stepfour.product_systemcomposition;
    this.refidwecaresystemvolt = obj_stepfour.refidwecaresystemvolt;
    this.cluster_singlebattery = obj_stepfour.cluster_singlebattery;
    form.get('product_systemcomposition')?.setValue(obj_stepfour.product_systemcomposition);
    // console.log('obj_stepfour.product_systemcomposition', obj_stepfour.product_systemcomposition);
    form.get('product_systemweco')?.setValue(obj_stepfour.product_systemweco);
    form.get('product_installdate')?.setValue(obj_stepfour.product_installdate);
    form.get('product_brand')?.setValue(obj_stepfour.product_brand);
    form.get('inverter_online')?.setValue(obj_stepfour.inverter_online);
    form.get('inverter_hybrid')?.setValue(obj_stepfour.inverter_hybrid);
    form.get('refidwecaresystemvolt')?.setValue(obj_stepfour.refidwecaresystemvolt);
    this.enableDisableFields(form, obj_stepfour.product_systemcomposition);
    // Gestisci manualmente i campi dipendenti
    this.updateSystemVolt(form, obj_stepfour.refidwecaresystemvolt, () => {
      form.get('system_model')?.setValue(obj_stepfour.system_model);
      this.updateSystemModel(form, obj_stepfour.system_model, () => {
        form.get('refidwecaresystemtype')?.setValue(obj_stepfour.refidwecaresystemtype);
        form.get('cluster_singlebattery')?.setValue(obj_stepfour.cluster_singlebattery);
        if (obj_stepfour.cluster_singlebattery == 0) {
          form.get('cluster_numberdevices')?.setValue(obj_stepfour.cluster_numberdevices);
        }
      });
    });
  }

  /**
   *
   * @param form
   * @param product_systemcomposition_val
   */
  public enableDisableFields(form: FormGroup, product_systemcomposition_val: number | null) {
    // console.log(product_systemcomposition_val);
    if (product_systemcomposition_val == 1) {
      form.get('refidwecaresystemvolt')?.disable();
      form.get('system_model')?.disable();
      form.get('refidwecaresystemtype')?.disable();
      form.get('cluster_singlebattery')?.disable();
      form.get('cluster_numberdevices')?.disable();
    } else if (product_systemcomposition_val == 3) {
      form.get('refidwecaresystemvolt')?.enable();
      form.get('system_model')?.enable();
      form.get('refidwecaresystemtype')?.enable();
      form.get('cluster_singlebattery')?.enable();
      form.get('cluster_numberdevices')?.enable();
    }
  }

  /**
   *
   * @param form
   * @param value
   * @param callback
   */
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

  /**
   *
   * @param form
   * @param value
   * @param callback
   */
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

}
