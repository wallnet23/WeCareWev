import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { Observable } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ConnectServerService } from '../../../../services/connect-server.service';
import { ApiResponse } from '../../../../interfaces/api-response';
import { Connect } from '../../../../classes/connect';
import { PopupDialogService } from '../../../../services/popup-dialog.service';
import { Country } from '../../../../interfaces/country';
import { StepTwo } from '../interfaces/step-two';
import { Image } from '../interfaces/image';
import { TranslateModule } from '@ngx-translate/core';
import { ImageLoaderService } from '../../../../services/image-loader.service';

@Component({
  selector: 'app-step-two',
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
    TranslateModule
  ],
  templateUrl: './step-two.component.html',
  styleUrl: './step-two.component.scss'
})
export class StepTwoComponent {

  @Output() formEmit = new EventEmitter<FormGroup>();
  @Output() nextStep = new EventEmitter<void>();
  @Input() idsystem = 0;

  selectedFilesStep2: File[] = [];
  maxImagesStep2: number = 6;
  isImagesStep2: boolean = false;
  imageSpaceLeftStep2: boolean = true;
  imagesStep2: Image[] = [];
  countriesData: Country[] = [];
  urlServerLaraFile = Connect.urlServerLaraFile;
  isError: boolean = false;
  errors = {
    idcountry: false,
    location_address: false,
    location_city: false,
    location_postalcode: false
  }

  stepTwoForm = this.formBuilder.group({
    idcountry: new FormControl<number | null>(null, Validators.required),
    location_address: new FormControl<string>('', Validators.required),
    location_city: new FormControl<string>('', Validators.required),
    location_postalcode: new FormControl<string>('', Validators.required)
  });

  ngOnInit() {
    this.connectServerService.getRequestCountry().subscribe((obj) => {
      this.countriesData = obj;
    })
    if (this.idsystem > 0) {
      this.infoStep();
      this.getImages();
    }
  }

  constructor(private formBuilder: FormBuilder,
    private connectServerService: ConnectServerService,
    private popupDialogService: PopupDialogService,
  private imageLoaderService: ImageLoaderService) { }

  infoStep() {
    this.connectServerService.getRequest<ApiResponse<{ stepTwo: StepTwo }>>(Connect.urlServerLaraApi, 'system/infoStepTwo', { id: this.idsystem }).
      subscribe((val: ApiResponse<{ stepTwo: StepTwo }>) => {
        if (val.data && val.data.stepTwo) {
          this.stepTwoForm.patchValue(val.data.stepTwo);
        }
      })
  }

  saveStep(action: string) {
    this.errorLogic();
    if (action == 'save' || (action == 'next' && !this.isError)) {
      let stepTwo = JSON.parse(JSON.stringify(this.stepTwoForm.getRawValue()));

      this.connectServerService.postRequest<ApiResponse<null>>(Connect.urlServerLaraApi, 'system/saveStepTwo',
        {
          idsystem: this.idsystem,
          obj_step: stepTwo,
        })
        .subscribe((val: ApiResponse<null>) => {
          this.popupDialogService.alertElement(val);
          this.infoStep();
          this.formEmit.emit(this.formBuilder.group({}));
          if (action == 'next') {
            setTimeout(() => {
              // console.log('Emitting nextStep');
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
      this.selectedFilesStep2 = Array.from(input.files);
      this.uploadFilesServer();
    }
  }
  /**
   * Reset la selezione dei file quando importato
   */
  private resetFileInput() {
    const fileInput = document.getElementById('fileUpload2') as HTMLInputElement;
    fileInput.value = '';
    this.selectedFilesStep2 = [];
  }

  private errorLogic() {

    if (this.stepTwoForm.get('idcountry')?.value == null) {
      this.errors.idcountry = true;
    }
    else {
      this.errors.idcountry = false;
    }
    if (this.stepTwoForm.get('location_address')?.value == null || this.stepTwoForm.get('location_address')?.value!.replaceAll(' ', '') == '') {
      this.errors.location_address = true;
    }
    else {
      this.errors.location_address = false;
    }
    if (this.stepTwoForm.get('location_city')?.value == null || this.stepTwoForm.get('location_city')?.value!.replaceAll(' ', '') == '') {
      this.errors.location_city = true;
    }
    else {
      this.errors.location_city = false;
    }
    if (this.stepTwoForm.get('location_postalcode')?.value == null || this.stepTwoForm.get('location_postalcode')?.value!.replaceAll(' ', '') == '') {
      this.errors.location_postalcode = true;
    }
    else {
      this.errors.location_postalcode = false;
    }

    this.checkIsError();
  }

  private checkIsError() {
    if (!this.errors.location_address &&
      !this.errors.idcountry &&
      !this.errors.location_city &&
      !this.errors.location_postalcode) {
      this.isError = false;
    }
    else {
      this.isError = true;
    }
  }

  private uploadFilesServer() {
    // this.imagesStep2 = this.uploadImageService.getImagesStep2();
    const formData = new FormData();
    formData.append("folder", Connect.FOLDER_STEP_TWO);
    formData.append("size", Connect.FILE_SIZE.toString());
    formData.append("size_string", Connect.FILE_SIZE_STRING);
    formData.append("idsystem", this.idsystem.toString());
    formData.append("step_position", "2");
    if (this.selectedFilesStep2 && this.selectedFilesStep2.length + this.imagesStep2.length <= this.maxImagesStep2) {
      this.selectedFilesStep2.forEach((file, index) => {
        formData.append(`files[]`, file);
      });
      this.setImages(formData);
      this.imageSpaceLeftStep2 = true;
    }
    else {
      this.imageSpaceLeftStep2 = false;
    }
  }

  getImages() {
    this.connectServerService.getRequest<ApiResponse<{ listFiles: Image[] }>>(Connect.urlServerLaraApi, 'system/filesList',
      {
        idsystem: this.idsystem,
        step_position: 2
      })
      .subscribe((val: ApiResponse<{ listFiles: Image[] }>) => {
        if (val.data.listFiles) {
          this.imagesStep2 = val.data.listFiles.map(image => {
            // Chiama ImageLoaderService solo una volta per immagine
            this.imageLoaderService.getImageWithToken(Connect.urlServerLaraFile + image.src).subscribe(
              (safeUrl) => {
                image.src = safeUrl; // Assegna l'URL sicuro all'immagine
              }
            );
            return image;
          });
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
      { idsystem: this.idsystem, idimage: idimage })
      .subscribe((val: ApiResponse<null>) => {
        this.popupDialogService.alertElement(val);
        this.getImages();
      })
  }

  getForm() {
    return this.stepTwoForm;
  }

}
