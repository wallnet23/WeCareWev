import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StepThree } from '../../components/interfaces/step-three';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ConnectServerService } from '../../../../services/connect-server.service';
import { Country } from '../../../../interfaces/country';
import { Image } from '../../components/interfaces/image';
import { ApiResponse } from '../../../../interfaces/api-response';
import { Connect } from '../../../../classes/connect';

@Component({
  selector: 'app-step-three-readonly',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  templateUrl: './step-three-readonly.component.html',
  styleUrl: './step-three-readonly.component.scss'
})
export class StepThreeReadonlyComponent {

  @Output() formEmit = new EventEmitter<FormGroup>();

  @Input() stepThree: StepThree | null = null;
  @Input() idsystem = 0;
  @Input() countriesList: Country[] = [];

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

  constructor(private fb: FormBuilder, private connectServerService: ConnectServerService) { }

  ngOnInit(): void {
    // TODO: SE NECESSARIO CONVERTIRE LO STEP RICEVUTO IN INGERSSO IN UN FORM
    // this.connectServerService.getRequestCountry().subscribe((val: Country[]) => {
    //   this.countriesList = val;
    //   const result = this.countriesList.find((country: Country) => country.id === this.stepThree?.idcountry!);
    //   if(result) {
    //     this.country_name = result.common_name;
    //   }
    // })
    this.getImages();
    if (this.isEditable) {
      this.stepTwoForm.patchValue(this.stepThree!);
    }
    const result = this.countriesList.find((country: Country) => country.id === this.stepThree?.idcountry!);
    if (result) {
      this.country_name = result.common_name;
    }
  }

  getImages() {
    this.connectServerService.getRequest<ApiResponse<{ listFiles: Image[] }>>(this.urlServerLaraApi, 'system/filesList',
      {
        idsystem: this.idsystem,
        step_position: 3
      })
      .subscribe((val: ApiResponse<{ listFiles: Image[] }>) => {
        if (val.data.listFiles) {
          this.imagesStep = val.data.listFiles;
        }
      })
  }

  setImage(img: Image) {
    // this.modalImageUrl = img.src;
    this.modalImageUrl = '';
  }

}
