import { CommonModule, Location, LocationChangeEvent } from '@angular/common';
import { Component, ElementRef, HostListener, inject, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConnectServerService } from '../../../services/connect-server.service';
import { ApiResponse } from '../../../interfaces/api-response';
import { SystemInfoFull } from '../interfaces/system-info-full';
import { Connect } from '../../../classes/connect';
import { Image } from '../components/interfaces/image';
import { StepOne } from '../components/interfaces/step-one';
import { StepTwo } from '../components/interfaces/step-two';
import { StepThree } from '../components/interfaces/step-three';
import { InverterData } from '../interfaces/inverterData';
import { ClusterData } from '../interfaces/clusterData';
import { StepFour } from '../components/interfaces/step-four';
import { Validators, FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { TranslateModule } from '@ngx-translate/core';
import { StepOneReadonlyComponent } from "./step-one-readonly/step-one-readonly.component";
import { StepTwoReadonlyComponent } from "./step-two-readonly/step-two-readonly.component";
import { StepThreeReadonlyComponent } from "./step-three-readonly/step-three-readonly.component";
import { StepFourReadonlyComponent } from "./step-four-readonly/step-four-readonly.component";
import { StepFiveReadonlyComponent } from "./step-five-readonly/step-five-readonly.component";
import { StepSixReadonlyComponent } from "./step-six-readonly/step-six-readonly.component";
import { Country } from '../../../interfaces/country';
import { StepFive } from '../components/interfaces/step-five';
import { StepSix } from '../components/interfaces/step-six';
import { StepOneComponent } from "../components/step-one/step-one.component";
import { StepTwoComponent } from "../components/step-two/step-two.component";
import { StepThreeComponent } from "../components/step-three/step-three.component";
import { StepFourComponent } from "../components/step-four/step-four.component";
import { StepFiveComponent } from "../components/step-five/step-five.component";
import { StepSixComponent } from "../components/step-six/step-six.component";
import { ErrorMessageComponent } from "../error-message/error-message.component";
import { StepStatus } from '../interfaces/step-status';
import { StepFourService } from '../components/step-four/step-four.service';

declare var $: any;

@Component({
  selector: 'app-system-readonly',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    StepOneReadonlyComponent,
    StepTwoReadonlyComponent,
    StepThreeReadonlyComponent,
    StepFourReadonlyComponent,
    StepFiveReadonlyComponent,
    StepSixReadonlyComponent,
    StepOneComponent,
    StepTwoComponent,
    StepThreeComponent,
    StepFourComponent,
    StepFiveComponent,
    StepSixComponent,
    ErrorMessageComponent
  ],
  templateUrl: './system-readonly.component.html',
  styleUrl: './system-readonly.component.scss'
})
export class SystemReadonlyComponent {

  @ViewChild('stepOne') obj_stepOne!: StepOneReadonlyComponent;
  @ViewChild('stepTwo') obj_stepTwo!: StepTwoReadonlyComponent;
  @ViewChild('stepThree') obj_stepThree!: StepThreeReadonlyComponent;
  @ViewChild('stepFour') obj_stepFour!: StepFourReadonlyComponent;
  @ViewChild('stepFive') obj_stepFive!: StepFourReadonlyComponent;
  @ViewChild('stepSix') obj_stepSix!: StepFourReadonlyComponent;

  modalImageUrl: string = '';

  // TODO: MODIFICARE SYSTEM STATUS CON QUELLO REALE
  systemStatus: { id: number, name: string, color: string } | null = null;
  idsystem: number = 0;
  systemInfo: SystemInfoFull = this.initSystem();
  imagesStep2: Image[] = [];
  imagesStep3: Image[] = [];
  urlServerLara = Connect.urlServerLara;
  customerCountry: string = '';
  installerCountry: string = '';
  countriesList: Country[] = [];
  readonly stepFourService = inject(StepFourService);

  stepStatusList: StepStatus[] = [];

  constructor(private route: ActivatedRoute, private connectServerService: ConnectServerService,
    private elementRef: ElementRef, private location: Location) {
    this.route.params.subscribe(params => {
      this.idsystem = params['id'];
    });
    //this.initializeStepStatusList();
  }

  ngOnInit(): void {
    if (this.idsystem > 0) {
      this.systemInfo!.id = this.idsystem;
      this.getSystem();
      this.stepFourService.setSystemsValues();
    }
  }

  getSystem() {
    this.getStepStatus();
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

  getStepStatus() {
    this.connectServerService.getRequest<ApiResponse<{ stepStatusList: StepStatus[] }>>(
      Connect.urlServerLaraApi, 'system/listStepSystemStatus', { idsystem: this.idsystem })
      .subscribe((val: ApiResponse<{ stepStatusList: StepStatus[] }>) => {
        if (val.data) {
          this.stepStatusList = val.data.stepStatusList;
          // console.log("QUI", this.stepStatusList);
        }
      })
  }

  onFormOneReceived(form: FormGroup) {
    this.route.params.subscribe(params => {
      this.idsystem = params['id'];
      //this.stepOneForm = form;
      //this.getSystemOverview();
      this.getStatus();
    });
  }

  onFormTwoReceived(form: FormGroup) {
    //this.stepTwoForm = form;
  }

  onFormThreeReceived(form: FormGroup) {
    //this.stepThreeForm = form;
  }

  onFormFourReceived(form: FormGroup) {
    //this.stepFourForm = form;
  }
  onFormFiveReceived(form: FormGroup) {
    //this.stepFiveForm = form;
  }
  onFormSixReceived(form: FormGroup) {
    //this.stepSixForm = form;
  }

  getStatus() {
    // console.log("Received 1")
    if (this.idsystem > 0) {
      this.connectServerService.getRequest<ApiResponse<{ status: { id: number, name: string, color: string } }>>
        (Connect.urlServerLaraApi, 'system/systemState', { idsystem: this.idsystem })
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
            if (this.systemStatus.id == 3) {
              // CHIAMATA AL SERVER PER SAPERE QUALI SONO GLI STEP INVALIDI E RECUPERARE LE TEXTAREA
            }
          }
        })
    }
  }

  goBack() {
    this.location.back();
  }

  getCountries() {
    this.connectServerService.getRequestCountry().subscribe((val: any) => {
      if (val) {
        this.countriesList = val;
      }
    });
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

  // initializeStepStatusList() {
  //   let i = 0;
  //   for (i; i < 6; i++) {
  //     const item = {
  //       step: 0,
  //       listStepStatus: {
  //         idstatus: 0,
  //         name_status: '',
  //         color: '',
  //         message: null,
  //         message_date: null,
  //       }
  //     }
  //     this.stepStatusList.push(item);
  //   }
  // }

  @HostListener('click')
  onClick() {
    const modalId = this.elementRef.nativeElement.getAttribute('data-bs-target');
    if (modalId) {
      const modalElement = document.querySelector(modalId);
      if (modalElement) {
        modalElement.classList.add('show');
        modalElement.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
      }
    }
  }

  setImage(img: Image) {
    // this.modalImageUrl = img.src;
    this.modalImageUrl = '';
  }

  onDataReceived() {
    this.getSystem();
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
