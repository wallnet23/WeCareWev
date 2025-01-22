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
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ImageLoaderService } from '../../../../services/image-loader.service';
import { MatDialog } from '@angular/material/dialog';
import { ImageViewerComponent } from '../image-viewer/image-viewer.component';
import { PdfViewerComponent } from '../pdf-viewer/pdf-viewer.component';

@Component({
  selector: 'app-step-two',
  standalone: true,
  providers: [],
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
  @Output() readonlyEmit = new EventEmitter<void>();
  @Output() changeStep = new EventEmitter<{ step: number, action: number }>();

  @Input() isReadonly = false;
  @Input() idsystem = 0;

  submitted = false;
  selectedFilesStep2: File[] = [];
  maxImagesStep2: number = 5;
  isImagesStep2: boolean = false;
  imageSpaceLeftStep2: boolean = true;
  imagesStep2: Image[] = [];
  countriesData: Country[] = [];
  urlServerLaraFile = Connect.urlServerLaraFile;
  //isError: boolean = false;
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
  urlServerLaraMedia = Connect.urlServerLaraMedia;
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
    private imageLoaderService: ImageLoaderService, private translate: TranslateService,
    public dialog: MatDialog) { }

  infoStep() {
    this.connectServerService.getRequest<ApiResponse<{ stepTwo: StepTwo }>>(Connect.urlServerLaraApi, 'system/infoStepTwo', { id: this.idsystem }).
      subscribe((val: ApiResponse<{ stepTwo: StepTwo }>) => {
        if (val.data && val.data.stepTwo) {
          this.stepTwoForm.patchValue(val.data.stepTwo);
        }
      })
  }

  saveStep(action: string) {
    //this.errorLogic();
    this.submitted = true;
    //if (action == 'save' || (action == 'next' && !this.isError)) {
    if (this.stepTwoForm.valid && this.imagesStep2.length >= 5) {
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
              this.changeStep.emit({ step: 2, action: 1 });
            }, 0);
          }
        })
    }
  }

  previous() {
    this.changeStep.emit({ step: 2, action: 0 });
  }

  updateStep() {
    // APRI POPUP E POI FAI LA CHIAMATA
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

  // private errorLogic() {

  //   if (this.stepTwoForm.get('idcountry')?.value == null) {
  //     this.errors.idcountry = true;
  //   }
  //   else {
  //     this.errors.idcountry = false;
  //   }
  //   if (this.stepTwoForm.get('location_address')?.value == null || this.stepTwoForm.get('location_address')?.value!.replaceAll(' ', '') == '') {
  //     this.errors.location_address = true;
  //   }
  //   else {
  //     this.errors.location_address = false;
  //   }
  //   if (this.stepTwoForm.get('location_city')?.value == null || this.stepTwoForm.get('location_city')?.value!.replaceAll(' ', '') == '') {
  //     this.errors.location_city = true;
  //   }
  //   else {
  //     this.errors.location_city = false;
  //   }
  //   if (this.stepTwoForm.get('location_postalcode')?.value == null || this.stepTwoForm.get('location_postalcode')?.value!.replaceAll(' ', '') == '') {
  //     this.errors.location_postalcode = true;
  //   }
  //   else {
  //     this.errors.location_postalcode = false;
  //   }

  //   this.checkIsError();
  // }

  // private checkIsError() {
  //   if (!this.errors.location_address &&
  //     !this.errors.idcountry &&
  //     !this.errors.location_city &&
  //     !this.errors.location_postalcode) {
  //     this.isError = false;
  //   }
  //   else {
  //     this.isError = true;
  //   }
  // }

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
            // this.imageLoaderService.getImageWithToken(Connect.urlServerLaraFile + image.src).subscribe(
            //   (safeUrl) => {
            //     image.src = safeUrl; // Assegna l'URL sicuro all'immagine
            //   }
            // );
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

  approvalRequested() {
    // this.translate.get(['POPUP.TITLE.INFO', 'POPUP.MSG_APPROVEDSTEP', 'POPUP.BUTTON.SEND']).subscribe((translations) => {
    //   const obj_request: ApiResponse<any> = {
    //     code: 244,
    //     data: {},
    //     title: translations['POPUP.TITLE.INFO'],
    //     message: translations['POPUP.MSG_APPROVEDSTEP'],
    //     obj_dialog: {
    //       disableClose: 1,
    //       obj_buttonAction:
    //       {
    //         action: 1,
    //         action_type: 2,
    //         label: translations['POPUP.BUTTON.SEND'],
    //         run_function: () => this.updateStepReadonly()
    //       }
    //     }
    //   }
    //   this.popupDialogService.alertElement(obj_request);
    // });
    this.updateStepReadonly();
  }

  private updateStepReadonly() {
    this.submitted = true;
    const stepTwo = this.stepTwoForm.getRawValue();

    if (this.stepTwoForm.valid) {
      this.connectServerService.postRequest<ApiResponse<null>>(Connect.urlServerLaraApi, 'system/saveStepTwo',
        {
          idsystem: this.idsystem,
          obj_step: stepTwo,
          readonly: 1,
        })
        .subscribe((val: ApiResponse<null>) => {
          this.popupDialogService.alertElement(val);
          this.readonlyEmit.emit();
        })
    }
  }

  viewImage(image: Image) {
    console.log(image)
    const id = image.id;
    if (id > 0) {
      if (image.ext == "pdf") {
        this.dialog.open(PdfViewerComponent, {
          data: { file: image },
          panelClass: 'fullscreen-modal',
          width: '90vh',
          height: '90vh',
          maxHeight: '90vh',
          maxWidth: '95vw',
          minWidth: '250px',
          position: {
            top: '40px',
          },
          // autoFocus: false
        });
      }
      else {
        this.dialog.open(ImageViewerComponent, {
          data: { file: image },
        });
      }
    }
  }

}
