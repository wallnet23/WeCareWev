import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { SystemInfoFull } from '../../interfaces/system-info-full';
import { ApiResponse } from '../../../../interfaces/api-response';
import { StepStatus } from '../../interfaces/step-status';
import { Connect } from '../../../../classes/connect';
import { ConnectServerService } from '../../../../services/connect-server.service';
import { StepOne } from '../interfaces/step-one';
import { StepTwo } from '../interfaces/step-two';
import { StepThree } from '../interfaces/step-three';
import { StepFour } from '../interfaces/step-four';
import { InverterData } from '../../interfaces/inverterData';
import { ClusterData } from '../../interfaces/clusterData';
import { StepFive } from '../interfaces/step-five';
import { StepSix } from '../interfaces/step-six';
import { Country } from '../../../../interfaces/country';
import { Image } from '../interfaces/image';
import { StepOneReadonlyComponent } from "../../system-readonly/step-one-readonly/step-one-readonly.component";
import { StepTwoReadonlyComponent } from "../../system-readonly/step-two-readonly/step-two-readonly.component";
import { StepThreeReadonlyComponent } from "../../system-readonly/step-three-readonly/step-three-readonly.component";
import { StepFourReadonlyComponent } from "../../system-readonly/step-four-readonly/step-four-readonly.component";
import { StepFiveReadonlyComponent } from "../../system-readonly/step-five-readonly/step-five-readonly.component";
import { StepSixReadonlyComponent } from "../../system-readonly/step-six-readonly/step-six-readonly.component";

@Component({
  selector: 'app-read-data-popup',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    TranslateModule,
    StepOneReadonlyComponent,
    StepTwoReadonlyComponent,
    StepThreeReadonlyComponent,
    StepFourReadonlyComponent,
    StepFiveReadonlyComponent,
    StepSixReadonlyComponent
],
  templateUrl: './read-data-popup.component.html',
  styleUrl: './read-data-popup.component.scss'
})
export class ReadDataPopupComponent {

  systemInfo: SystemInfoFull = this.initSystem();
  countriesList: Country[] = [];
  idsystem: number = 0;
  imagesStep2: Image[] = [];
  imagesStep3: Image[] = [];
  systemStatus: { id: number, name: string, color: string } | null = null;

  constructor(private connectServerService: ConnectServerService, @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ReadDataPopupComponent>) {}

  ngOnInit(): void {
    this.idsystem = this.data.idsystem;
    if (this.idsystem > 0) {
      this.systemInfo!.id = this.idsystem;
      this.getSystem();
      //this.stepFourService.setSystemsValues();
    }
  }

  getSystem() {
    this.getCountries();
    this.getStepOne();
    this.getStepTwo();
    this.getStepThree();
    this.getStepFour();
    this.getStepFive();
    this.getStepSix();
    this.getStatus();
  }

  getStepOne() {
    this.connectServerService.getRequest<ApiResponse<{ stepOne: StepOne }>>(Connect.urlServerLaraApi,
      'system/infoStepOne', { id: this.idsystem }).
      subscribe((val: ApiResponse<{ stepOne: StepOne }>) => {
        if (val.data && val.data.stepOne) {
          this.systemInfo!.stepOne = val.data.stepOne;
        }
      })
  }

  getStepTwo() {
    this.connectServerService.getRequest<ApiResponse<{ stepTwo: StepTwo }>>(Connect.urlServerLaraApi, 'system/infoStepTwo', { id: this.idsystem }).
      subscribe((val: ApiResponse<{ stepTwo: StepTwo }>) => {
        if (val.data && val.data.stepTwo) {
          this.systemInfo!.stepTwo = val.data.stepTwo;
          this.getImages(2);
        }
      })
  }

  getStepThree() {
    this.connectServerService.getRequest<ApiResponse<{ stepThree: StepThree }>>(Connect.urlServerLaraApi, 'system/infoStepThree', { id: this.idsystem }).
      subscribe((val: ApiResponse<{ stepThree: StepThree }>) => {
        if (val.data.stepThree) {
          this.systemInfo!.stepThree = val.data.stepThree;
          this.getImages(3);
        }
      })
  }

  getStepFour() {
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
          this.systemInfo.stepFour = val.data.stepFour;
        }
        // if (val.data && val.data.stepInverter) {
        //   this.systemInfo.inverter = val.data.stepInverter;
        // }
        // if (val.data && val.data.stepCluster) {
        //   this.systemInfo.cluster = val.data.stepCluster;
        // }
        // console.log('val 4 info:', this.systemInfo);
      })
  }

  getStepFive() {
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
          const data_step = val.data.stepFive;
          this.systemInfo.stepFive = val.data.stepFive;
        }
      })
  }

  getStepSix() {
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
          this.systemInfo.stepSix = val.data.stepSix;
        }
      })
  }

  getCountries() {
    this.connectServerService.getRequestCountry().subscribe((val: any) => {
      if (val) {
        this.countriesList = val;
      }
    });
  }

  getStatus() {
    // console.log("Received 1")
    if (this.idsystem > 0) {
      this.connectServerService.getRequest<ApiResponse<{ status: { id: number, name: string, color: string } }>>
        (Connect.urlServerLaraApi, 'system/systemStatus', { idsystem: this.idsystem })
        .subscribe((val: ApiResponse<{ status: { id: number, name: string, color: string } }>) => {
          if (val.data) {
            this.systemStatus = val.data.status;
            //  console.log(this.systemStatus)
            // if(this.systemStatus.id == 2) {
            //   this.validStepOne = true;
            //   this.validStepTwo = true;
            //   this.validStepThree = true;
            //   this.validStepFour = true;
            //   this.validStepFive = true;
            //   this.validStepSix = true;
            // }

          }
        })
    }
  }

  getImages(step: number) {
    this.connectServerService.getRequest<ApiResponse<{ listFiles: Image[] }>>(Connect.urlServerLaraApi, 'system/filesList',
      {
        idsystem: this.idsystem,
        step_position: step
      })
      .subscribe((val: ApiResponse<{ listFiles: Image[] }>) => {
        if (val.data.listFiles) {
          if (step == 2) {
            this.imagesStep2 = val.data.listFiles;
          }
          else if (step == 3) {
            this.imagesStep3 = val.data.listFiles;
          }
        }
      })
  }

  close(): void {
    this.dialogRef.close();
  }

  private initSystem() {
    return {
      id: 0,
      stepOne: {
        system_name: '',
        system_description: '',
        system_owner: 0,
        customer_name: '',
        customer_surname: '',
        customer_country: 0,
        customer_phone: '',
        customer_vat: '',
        customer_licensenumber: '',
        customer_fiscalcode: '',
      },
      stepTwo: {
        idcountry: 0,
        location_address: '',
        location_city: '',
        location_postalcode: '',
      },
      stepThree: {
        idcountry: 0,
        installer_companyname: '',
        installer_address: '',
        vendor_contact: '',
        installer_email: '',
        installer_dateofpurchase: '',
      },
      stepFour: {
        product_systemcomposition: null,
        product_systemweco: null,
        product_installdate: null,
        product_brand: null,
        inverter_hybrid: null,
        inverter_online: null,
        refidwecaresystemvolt: null,
        system_model: null,
        refidwecaresystemtype: null,
        cluster_singlebattery: null,
        cluster_numberdevices: null
      },
      stepFive: {
        inverter_communication: 0,
        inverter_power: 0,
        inverters_list: []
      },
      stepSix: {
        cluster_parallel: 0,
        clusters_list: [],
        inverters_list: [],
        cluster_numberdevices: 0,
        cluster_singlebattery: 0
      }
      // inverter: {
      //   inverter_number: null,
      //   inverter_hybrid: null,
      //   inverter_communication: null,
      //   inverter_power: null,
      //   inverter_online: null,
      //   inverters_list: [],
      // },
      // cluster: {
      //   cluster_singlebattery: null,
      //   cluster_parallel: null,
      //   cluster_number: null,
      //   cluster_numberdevices: null,
      //   refidwecaresystemvolt: null,
      //   system_model: null,
      //   refidwecaresystemtype: null,
      //   clusters_list: [],
      // }
    };
  }

}
