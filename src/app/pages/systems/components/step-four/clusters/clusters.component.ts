import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Inverter } from '../../../interfaces/inverterData';
import { Battery, ClusterData } from '../../../interfaces/clusterData';
import { MatSelectModule } from '@angular/material/select';
import { ClusterSend, ClusterService } from './cluster.service';
import { TranslateModule } from '@ngx-translate/core';



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
    MatCardModule,
    MatSelectModule,
    TranslateModule
  ],
  templateUrl: './clusters.component.html',
  styleUrl: './clusters.component.scss'
})
export class ClustersComponent implements OnInit, OnChanges {
  @Input() idsystem = 0;
  @Input() stepCluster!: ClusterData;
  @Input() inverterList: Inverter[] = [];
  view_inverterslist: Inverter[] = [];
  language_now = 'en';

  numCluster = Array(15).fill(0).map((_, i) => ({
    num: i + 1,
    // Proprietà aggiuntive...
  }));
  numDevicesCluster = Array(16).fill(0).map((_, i) => ({
    num: i + 1,
    // Proprietà aggiuntive...
  }));
  stepClusterForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private clusterService: ClusterService
  ) {
    this.stepClusterForm = clusterService.createForm();
    //this.clusterService.setSystemsValues(() => {});
  }

  ngOnInit(): void {
    this.logicCluster();
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log('change: ',changes.idfather);
    if (changes['stepCluster'] && changes['stepCluster'].currentValue &&
      changes['stepCluster'].currentValue != null
    ) {
      this.clusterService.infoClusters(this.stepClusterForm, changes['stepCluster'].currentValue);
    }
    if (changes['inverterList'] && changes['inverterList'].currentValue &&
      changes['inverterList'].currentValue != null
    ) {
      // console.log('list', changes['inverterList'].currentValue);
      this.view_inverterslist = changes['inverterList'].currentValue;
    }
  }

  get systemVoltView() {
    return this.clusterService.getSystemVoltView();
  }
  get systemModelView() {
    return this.clusterService.getSystemModelView();
  }

  get systemTypeView() {
    return this.clusterService.getSystemTypeView();
  }

  private logicCluster() {
    this.stepClusterForm.get('cluster_singlebattery')?.valueChanges.subscribe(
      (val) => {
        // console.log('cluster_singlebattery chiamata');
        if (val == 0) {
          this.stepClusterForm.get('cluster_parallel')?.enable();
          this.stepClusterForm.get('cluster_number')?.enable();
          this.stepClusterForm.get('cluster_numberdevices')?.enable();
        } else {
          this.stepClusterForm.get('cluster_parallel')?.disable();
          this.stepClusterForm.get('cluster_number')?.disable();
          this.stepClusterForm.get('cluster_numberdevices')?.disable();
          this.populateClusters(1, 1, this.objcluster_default, this.objbattery_default);
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
        const obj_clusternumber = this.stepClusterForm.get('cluster_number');
        if (obj_clusternumber && obj_clusternumber.value) {
          if (val && val > 0 && obj_clusternumber.value > 0) {
            this.generateClusters();
          }
        } else {
          // svuota
          // this.clusterFieldAsFormArray.clear();
          this.clusterService.getClusterFieldAsFormArray(this.stepClusterForm).clear();
        }
      });
    this.stepClusterForm.get('refidwecaresystemvolt')?.valueChanges.subscribe(
      (val) => {
        this.clusterService.updateSystemVolt(this.stepClusterForm, val, () => { });
      });
    this.stepClusterForm.get('system_model')?.valueChanges.subscribe(
      (val) => {
        this.clusterService.updateSystemModel(this.stepClusterForm, val, () => { });
      }
    );
  }


  // get clusterFieldAsFormArray(): any {
  //   return this.stepClusterForm.get('clusters_list') as FormArray;
  // }

  get clusterFieldAsFormArrayService(): any {
    return this.clusterService.getClusterFieldAsFormArray(this.stepClusterForm) as FormArray;
  }

  objcluster_default: ClusterSend = {
    id: 0,
    name: '',
    batteries: [],
    inverters: []
  }

  /**
   * Usato per inserire i cluster (2)
   */
  // private addCluster(obj_cluster: ClusterSend) {
  //   this.clusterFieldAsFormArray.push(new FormGroup({
  //     id: new FormControl<number>(obj_cluster.id),
  //     name: new FormControl<string>(obj_cluster.name),
  //     //batteries: new FormArray([]),
  //     batteries: this.formBuilder.array([]),
  //     inverters: new FormControl<number[]>(obj_cluster.inverters)
  //   }));
  // }

  objbattery_default: Battery = {
    id: 0,
    serialnumber: '',
    masterorslave: null
  }

  getStrMasterSlave(type: number) {
    let str_type = 'Slave';
    if (type == 1) {
      str_type = 'Master';
      if (this.stepClusterForm.get('refidwecaresystemvolt')?.value == 2) {
        str_type = 'HVBOX';
      }
    }
    return str_type;
  }
  /**
   * Usato per inserire le batterie nel cluster (3)
   * @param personalIndex
   * @param tipo
   */
  // private addBattery(personalIndex: number, obj_battery: Battery) {
  //   // const clusterFormGroup = this.clusterFieldAsFormArray.at(personalIndex) as FormGroup;
  //   const clusterFormGroup = this.clusterService.getClusterFieldAsFormArray(this.stepClusterForm).at(personalIndex) as FormGroup;
  //   const batterieFormArray = clusterFormGroup.get('batteries') as FormArray;
  //   batterieFormArray.push(new FormGroup({
  //     id: new FormControl(obj_battery.id, Validators.required),
  //     serialnumber: new FormControl(obj_battery.serialnumber, Validators.required),
  //     masterorslave: new FormControl(obj_battery.masterorslave),
  //   }));
  // }

  private generateClusters() {
    const num_cluster = this.stepClusterForm.get('cluster_number')?.value;
    const num_battery = this.stepClusterForm.get('cluster_numberdevices')?.value;
    this.populateClusters(num_cluster, num_battery, this.objcluster_default, this.objbattery_default);
  }

  /**
     * Genera il cluster popolandolo (1)
     * @param num_cluster
     * @param num_battery
     */
  private populateClusters(num_cluster: number | null | undefined, num_battery: number | null | undefined,
    objcluster_default: ClusterSend, objbattery_default: Battery
  ) {
    this.clusterService.getClusterFieldAsFormArray(this.stepClusterForm).clear();
    if (num_cluster) {
      for (let i = 0; i < num_cluster; i++) {
        this.clusterService.addCluster(this.stepClusterForm, objcluster_default);
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

            this.clusterService.addBattery(this.stepClusterForm, i, objbattery_default);
          }
        }

      }
    }
  }

  getDataFormCluster() {
    const copy_form = JSON.parse(JSON.stringify(this.stepClusterForm.getRawValue()));
    copy_form.clusters_list.forEach((cluster: any) => {
      const array_inverters: Inverter[] = this.view_inverterslist.filter(
        (inverter: Inverter) => cluster.inverters.includes(inverter.id));
        cluster.inverters = array_inverters;
    });
    // console.log(copy_form);
    return copy_form;
  }

  getValidFormCluster() {
    // console.log('form cluster valid', this.stepClusterForm.valid);
    return this.stepClusterForm.valid;
  }

}
