import { Component, EventEmitter, Input, Output, SecurityContext } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StepTwo } from '../../components/interfaces/step-two';
import { ConnectServerService } from '../../../../services/connect-server.service';
import { Country } from '../../../../interfaces/country';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Image } from '../../components/interfaces/image';
import { Connect } from '../../../../classes/connect';
import { ApiResponse } from '../../../../interfaces/api-response';
import { ImageLoaderService } from '../../../../services/image-loader.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { ImageViewerComponent } from '../../components/image-viewer/image-viewer.component';
import { PdfViewerComponent } from '../../components/pdf-viewer/pdf-viewer.component';

@Component({
  selector: 'app-step-two-readonly',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  templateUrl: './step-two-readonly.component.html',
  styleUrl: './step-two-readonly.component.scss'
})
export class StepTwoReadonlyComponent {

  @Output() formEmit = new EventEmitter<FormGroup>();
  @Input() stepTwo: StepTwo | null = null;
  @Input() idsystem = 0;
  @Input() countriesList: Country[] = [];
  @Input() readonlyPopup: boolean = true;

  acceptedExt: string[] = ['jpg', 'png', 'jpeg'];

  stepTwoForm = this.fb.group({
    idcountry: [0, Validators.required],
    location_address: ['', Validators.required],
    location_city: ['', Validators.required],
    location_postalcode: ['', Validators.required]
  })

  isEditable: boolean = false;
  country_name: string = '';
  imagesStep: Image[] = [];
  urlServerLaraApi = Connect.urlServerLaraApi;
  modalImageUrl: string = '';
  urlServerLaraMedia = Connect.urlServerLaraMedia;
  constructor(private fb: FormBuilder, private connectServerService: ConnectServerService,
    private imageLoaderService: ImageLoaderService, private dialog: MatDialog,
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    // TODO: SE NECESSARIO CONVERTIRE LO STEP RICEVUTO IN INGERSSO IN UN FORM
    // this.connectServerService.getRequestCountry().subscribe((val: Country[]) => {
    //   this.countriesList = val;
    //   const result = this.countriesList.find((country: Country) => country.id === this.stepTwo?.idcountry!);
    //   if(result) {
    //     this.country_name = result.common_name;
    //   }
    // })
    this.getImages();
    if (this.isEditable) {
      this.stepTwoForm.patchValue(this.stepTwo!);
    }
    const result = this.countriesList.find((country: Country) => country.id === this.stepTwo?.idcountry!);
    if (result) {
      this.country_name = result.common_name;
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
          this.imagesStep = val.data.listFiles.map(image => {
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

  // setImage(img: Image) {
  //   // this.modalImageUrl = img.src;
  //   this.modalImageUrl = '';
  // }
  // selectedImage: string | null | SafeUrl = null;

  // openModal(imageSrc: string | SafeUrl) {
  //   this.selectedImage = this.urlServerLaraMedia + imageSrc;
  // }

  viewImage(img: Image) {
    console.log(img)
    if (img.ext != 'pdf' && this.acceptedExt.includes(img.ext)) {
      console.log("DEFINITO?")
      const dialogRef = this.dialog.open(ImageViewerComponent, {
        maxWidth: '90%',
        minWidth: '350px',
        maxHeight: '90%',
        data: { file: img }
      });
    }
    else if (img.ext == 'pdf') {
      const dialogRef = this.dialog.open(PdfViewerComponent, {
        maxWidth: '700px',
        minWidth: '350px',
        maxHeight: '500px',
        data: { pdf: img }
      });
    }
    else {
      const urlString = this.sanitizer.sanitize(SecurityContext.URL, img.src);
      const newTab = window.open(urlString!, "_blank");
    }
  }
}
