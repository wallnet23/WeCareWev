import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { Observable } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { UploadImageService } from '../../../../services/upload-images.service';
import { ConnectServerService } from '../../../../services/connect-server.service';
import { Country } from '../../../../interfaces/country';
import { ApiResponse } from '../../../../interfaces/api-response';
import { Connect } from '../../../../classes/connect';
import { PopupDialogService } from '../../../../services/popup-dialog.service';
import { StepThree } from '../interfaces/step-three';
import { Image } from '../interfaces/image';

@Component({
  selector: 'app-step-three',
  standalone: true,
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
  imports: [
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    HttpClientModule,
    CommonModule,
    MatIconModule,
  ],
  templateUrl: './step-three.component.html',
  styleUrl: './step-three.component.scss'
})
export class StepThreeComponent implements OnInit {

  @Output() formEmit = new EventEmitter<FormGroup>();
  @Output() nextStep = new EventEmitter<void>();

  @Input() idsystem = 0;
  selectedFilesStep3: File[] = [];
  maxImagesStep3: number = 2;
  isImagesStep3: boolean = false;
  imageSpaceLeftStep3: boolean = true;
  imagesStep3: Image[] = [];
  countriesData: Country[] = [];
  urlServerLara = Connect.urlServerLara;

  stepThreeForm = this.formBuilder.group({
    installer_companyname: new FormControl<string>('', Validators.required),
    installer_address: new FormControl<string>('', Validators.required),
    ccn3: new FormControl<string | null>(null, Validators.required),
    vendor_contact: new FormControl<string>(''),
    installer_email: new FormControl<string>('', Validators.email),
    installer_dateofpurchase: new FormControl<string>('', Validators.required)
  });

  ngOnInit() {
    this.connectServerService.getRequestCountryData().subscribe((obj) => {
      this.countriesData = obj;
    })
    if (this.idsystem > 0) {
      this.infoStep();
      this.getImages();
    }
  }

  constructor(private formBuilder: FormBuilder, private uploadImageService: UploadImageService,
    private connectServerService: ConnectServerService, private popupDialogService: PopupDialogService) { }

  infoStep() {
    this.connectServerService.getRequest<ApiResponse<{ stepThree: StepThree }>>(Connect.urlServerLaraApi, 'system/infoStepThree', { id: this.idsystem }).
      subscribe((val: ApiResponse<{ stepThree: StepThree }>) => {
        if (val.data.stepThree) {
          this.stepThreeForm.patchValue(val.data.stepThree);
          console.log(val.data.stepThree)
        }
      })
  }

  saveStep(action: string) {
    let stepThree = JSON.parse(JSON.stringify(this.stepThreeForm.getRawValue()));
    let country$: Observable<Country>;
    let country: Country;

    if (stepThree.ccn3) {
      country$ = this.connectServerService.getSpecificCountryData(this.stepThreeForm.get('ccn3')?.value!);
      country$.subscribe((val: any) => {
        if (val && val.length > 0) {
          country = { name: { common: val[0].name.common }, cca2: val[0].cca2, ccn3: val[0].ccn3 };
          console.log(country);
          delete stepThree.ccn3;
          stepThree.supplier_country = country;

          console.log("STEP3: ", stepThree)

          this.connectServerService.postRequest<ApiResponse<null>>(Connect.urlServerLaraApi, 'system/saveStepThree',
            {
              idsystem: this.idsystem,
              obj_step: stepThree
            })
            .subscribe((val: ApiResponse<null>) => {
              this.popupDialogService.alertElement(val);
              this.infoStep();
              this.formEmit.emit(this.formBuilder.group({}));
              if (action == 'next') {
                setTimeout(() => {
                  console.log('Emitting nextStep');
                  this.nextStep.emit();
                }, 0);
              }
            })
        }
      })
    }
    else {
      country = { name: { common: '' }, cca2: '', ccn3: '' };
      delete stepThree.ccn3;
      stepThree.location_country = country;

      this.connectServerService.postRequest<ApiResponse<null>>(Connect.urlServerLaraApi, 'system/saveStepThree',
        {
          idsystem: this.idsystem,
          obj_step: stepThree,
        })
        .subscribe((val: ApiResponse<null>) => {
          this.popupDialogService.alertElement(val);
          this.infoStep();
          this.formEmit.emit(this.formBuilder.group({}));
          if (action == 'next') {
            setTimeout(() => {
              console.log('Emitting nextStep');
              this.nextStep.emit();
            }, 0);
          }
        })
    }


  }

  /**
* Quando si seleziona i file
* @param event
*/
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFilesStep3 = Array.from(input.files);
      this.uploadFilesServer();
    }
  }
  /**
   * Reset la selezione dei file quando importato
   */
  private resetFileInput() {
    const fileInput = document.getElementById('fileUpload3') as HTMLInputElement;
    fileInput.value = '';
    this.selectedFilesStep3 = [];
  }

  private uploadFilesServer() {
    const formData = new FormData();
    formData.append("folder", Connect.FOLDER_STEP_THREE);
    formData.append("size", Connect.FILE_SIZE.toString());
    formData.append("size_string", Connect.FILE_SIZE_STRING);
    formData.append("idsystem", this.idsystem.toString());
    formData.append("step_position", "3");
    if (this.selectedFilesStep3 && this.selectedFilesStep3.length + this.imagesStep3.length <= this.maxImagesStep3) {
      this.selectedFilesStep3.forEach((file, index) => {
        formData.append(`files[]`, file);
      });
      this.setImages(formData);
      this.imageSpaceLeftStep3 = true;
    }
    else {
      this.imageSpaceLeftStep3 = false;
    }
  }

  getImages() {
    this.connectServerService.getRequest<ApiResponse<{ listFiles: Image[] }>>(Connect.urlServerLaraApi, 'system/filesList',
      {
        idsystem: this.idsystem,
        step_position: 3
      })
      .subscribe((val: ApiResponse<{ listFiles: Image[] }>) => {
        if (val.data.listFiles) {
          this.imagesStep3 = val.data.listFiles;
        }
      })
  }

  setImages(formData: FormData) {
    this.connectServerService.postRequest<ApiResponse<null>>(Connect.urlServerLaraApi, 'system/uploadFiles',
      formData)
      .subscribe((val: ApiResponse<null>) => {
        this.popupDialogService.alertElement(val);
        this.resetFileInput();
        this.getImages();
      })
  }

  deleteImg(idimage: number) {
    this.connectServerService.postRequest<ApiResponse<null>>(Connect.urlServerLaraApi, 'system/deleteFile',
      {
        idsystem: this.idsystem,
        idimage: idimage
      })
      .subscribe((val: ApiResponse<null>) => {
        this.popupDialogService.alertElement(val);
        this.getImages();
      })
  }

  getForm() {
    return this.stepThreeForm;
  }

}
