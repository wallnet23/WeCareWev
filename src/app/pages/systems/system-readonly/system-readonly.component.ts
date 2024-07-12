import { CommonModule, Location, LocationChangeEvent } from '@angular/common';
import { Component, ElementRef, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConnectServerService } from '../../../services/connect-server.service';
import { ApiResponse } from '../../../interfaces/api-response';
import { SystemInfoFull } from '../interfaces/system-info-full';
import { Connect } from '../../../classes/connect';
import { Image } from '../components/interfaces/image';
import { StepOne } from '../components/interfaces/step-one';
import { StepTwo } from '../components/interfaces/step-two';
import { StepThree } from '../components/interfaces/step-three';

declare var $: any;

@Component({
  selector: 'app-system-readonly',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './system-readonly.component.html',
  styleUrl: './system-readonly.component.scss'
})
export class SystemReadonlyComponent {

  modalImageUrl: string = '';

  idsystem: number = 0;
  systemInfo: SystemInfoFull = this.initSystem();
  imagesStep2: Image[] = [];
  imagesStep3: Image[] = [];
  urlServerLara = Connect.urlServerLara;
  customerCountry: string = '';
  installerCountry: string = '';

  constructor(private route: ActivatedRoute, private connectServerService: ConnectServerService, 
    private elementRef: ElementRef, private location: Location) {
    this.route.params.subscribe(params => {
      this.idsystem = params['id'];
    });
  }

  ngOnInit(): void {
    if (this.idsystem > 0) {
      this.systemInfo!.id = this.idsystem;
      this.getSystem();
    }
  }

  getSystem() {
    this.getStepOne();
    this.getStepTwo();
    this.getStepThree();
    this.getStepFour();
  }

  getStepOne() {
    this.connectServerService.getRequest<ApiResponse<{ stepOne: StepOne }>>(Connect.urlServerLaraApi,
      'system/infoStepOne', { id: this.idsystem }).
      subscribe((val: ApiResponse<{ stepOne: StepOne }>) => {
        if (val.data && val.data.stepOne) {
          this.systemInfo!.stepOne = val.data.stepOne;
          this.getCountry(val.data.stepOne.ccn3, 'customerCountry');
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

  }

  goBack() {
    this.location.back();
  }

  getCountry(ccn3: string, target: 'customerCountry' | 'installerCountry') {
    if (ccn3) {
      this.connectServerService.getSpecificCountryData(ccn3).subscribe((val: any) => {
        if (val && val.length > 0) {
          this[target] = val[0].name.common;
        } else {
          this[target] = '';
        }
      });
    } else {
      this[target] = '';
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
    this.modalImageUrl = img.src;
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
        ccn3: '',
        customer_phone: '',
        customer_vat: '',
        customer_licensenumber: '',
        customer_fiscalcode: '',
      },
      stepTwo: {
        ccn3: '',
        location_address: '',
        location_city: '',
        location_postalcode: '',
      },
      stepThree: {
        ccn3: '',
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
      }
    };
  }

}
