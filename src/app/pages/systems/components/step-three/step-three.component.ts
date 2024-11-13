import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormControl, FormGroup, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ConnectServerService } from '../../../../services/connect-server.service';
import { Country } from '../../../../interfaces/country';
import { ApiResponse } from '../../../../interfaces/api-response';
import { Connect } from '../../../../classes/connect';
import { PopupDialogService } from '../../../../services/popup-dialog.service';
import { StepThree } from '../interfaces/step-three';
import { Image } from '../interfaces/image';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ImageLoaderService } from '../../../../services/image-loader.service';

@Component({
  selector: 'app-step-three',
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
  templateUrl: './step-three.component.html',
  styleUrl: './step-three.component.scss'
})
export class StepThreeComponent implements OnInit {

  today = new Date().toISOString().split('T')[0];

  @Output() formEmit = new EventEmitter<FormGroup>();
  @Output() readonlyEmit = new EventEmitter<void>();
  @Output() changeStep = new EventEmitter<{ step: number, action: number }>();

  @Input() isReadonly = false;
  @Input() idsystem = 0;
  selectedFilesStep3: File[] = [];
  maxImagesStep3: number = 2;
  isImagesStep3: boolean = false;
  imageSpaceLeftStep3: boolean = true;
  imagesStep3: Image[] = [];
  countriesData: Country[] = [];
  urlServerLaraFile = Connect.urlServerLaraFile;

  submitted = false;
  isError = false;
  errors = {
    installer_companyname: false,
    installer_address: false,
    installer_email: false,
    installer_dateofpurchase: false,
    idcountry: false
  }

  stepThreeForm = this.formBuilder.group({
    installer_companyname: new FormControl<string>('', Validators.required),
    installer_address: new FormControl<string>('', Validators.required),
    idcountry: new FormControl<number | null>(null, Validators.required),
    vendor_contact: new FormControl<string>(''),
    installer_email: new FormControl<string>('', [Validators.email, Validators.required]),
    installer_dateofpurchase: new FormControl<string>('', [Validators.required, this.dateRangeValidator('2022-01-01', this.today)])
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
    private connectServerService: ConnectServerService, private popupDialogService: PopupDialogService,
    private imageLoaderService: ImageLoaderService, private translate: TranslateService) { }

  infoStep() {
    this.connectServerService.getRequest<ApiResponse<{ stepThree: StepThree }>>(Connect.urlServerLaraApi, 'system/infoStepThree', { id: this.idsystem }).
      subscribe((val: ApiResponse<{ stepThree: StepThree }>) => {
        if (val.data.stepThree) {
          this.stepThreeForm.patchValue(val.data.stepThree);
          // console.log(val.data.stepThree)
        }
      })
  }

  saveStep(action: string) {
    //this.errorLogic();
    this.submitted = true;
    //if (action == 'save' || (!this.isError && action == 'next')) {
    if (this.stepThreeForm.valid) {
      let stepThree = JSON.parse(JSON.stringify(this.stepThreeForm.getRawValue()));
      if (stepThree.idcountry) {
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
                // console.log('Emitting nextStep');
                this.changeStep.emit({ step: 3, action: 1 });
              }, 0);
            }
          })
      }
    }
  }

  previous() {
    this.changeStep.emit({ step: 3, action: 0 });
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
          this.imagesStep3 = val.data.listFiles.map(image => {
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

  private errorLogic() {
    // console.log("date: ", this.stepThreeForm.get('installer_dateofpurchase')?.value)
    if (this.stepThreeForm.get('idcountry')?.value == null) {
      this.errors.idcountry = true;
    }
    else {
      this.errors.idcountry = false;
    }
    if (this.stepThreeForm.get('installer_address')?.value == null || this.stepThreeForm.get('installer_address')?.value!.replaceAll(' ', '') == '') {
      this.errors.installer_address = true;
    }
    else {
      this.errors.installer_address = false;
    }
    if (this.stepThreeForm.get('installer_companyname')?.value == null || this.stepThreeForm.get('installer_companyname')?.value!.replaceAll(' ', '') == '') {
      this.errors.installer_companyname = true;
    }
    else {
      this.errors.installer_companyname = false;
    }
    if (this.stepThreeForm.get('installer_dateofpurchase')?.value == null || this.stepThreeForm.get('installer_dateofpurchase')?.value === '') {
      this.errors.installer_dateofpurchase = true;
    }
    else {
      this.errors.installer_dateofpurchase = false;
    }
    if (this.stepThreeForm.get('installer_email')?.value == null || this.stepThreeForm.get('installer_email')?.value!.replaceAll(' ', '') == '' ||
      this.stepThreeForm.get('installer_email')?.value!.indexOf('@') === -1) {
      this.errors.installer_email = true;
    }
    else {
      this.errors.installer_email = false;
    }

    this.checkIsError();
  }

  private checkIsError() {
    if (!this.errors.installer_address &&
      !this.errors.idcountry &&
      !this.errors.installer_companyname &&
      !this.errors.installer_dateofpurchase &&
      !this.errors.installer_email) {
      this.isError = false;
    }
    else {
      this.isError = true;
    }
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
    const stepThree = this.stepThreeForm.getRawValue();

    if (this.stepThreeForm.valid) {
      this.connectServerService.postRequest<ApiResponse<null>>(Connect.urlServerLaraApi, 'system/saveStepThree',
        {
          idsystem: this.idsystem,
          obj_step: stepThree,
          readonly: 1,
        })
        .subscribe((val: ApiResponse<null>) => {
          this.popupDialogService.alertElement(val);
          this.readonlyEmit.emit();
        })
    }
  }

  dateRangeValidator(minDate: string, maxDate: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const selectedDate = new Date(control.value);
      const min = new Date(minDate);
      const max = new Date(maxDate);

      if (isNaN(selectedDate.getTime())) {
        return { invalidDate: true };
      }

      if (selectedDate < min) {
        return { dateTooEarly: true };
      }

      if (selectedDate > max) {
        return { dateTooLate: true };
      }

      return null;
    };
  }
}
