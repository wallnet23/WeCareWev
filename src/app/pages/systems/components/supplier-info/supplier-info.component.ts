import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { UploadImageService } from '../../../../services/upload-images.service';

interface Country {
  name: {
    common: string;
  },
  cca2: string;
  ccn3: string;
  flags: {
    png: string;
  }
}

@Component({
  selector: 'app-supplier-info',
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
  templateUrl: './supplier-info.component.html',
  styleUrl: './supplier-info.component.scss'
})
export class SupplierInfoComponent implements OnInit {

  maxImages: number = 15;
  isImages: boolean = false;
  imageSpaceLeft: boolean = true;
  images: string[] = [];
  countriesData: Country[] = [];

  supplierFormGroup = this.formBuilder.group({
    name: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    country: new FormControl<Country | null>(null, Validators.required),
    contact: new FormControl(''),
    email: new FormControl('', Validators.email),
    invoiceDate: new FormControl<Date | null>(null, Validators.required)
  });

  ngOnInit() {
    this.fetchCountryData().subscribe((obj) => {
      this.countriesData = obj;
    });
  }

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private uploadImage: UploadImageService) { }

  fetchCountryData(): Observable<Country[]> {
    return this.http.get<Country[]>('https://restcountries.com/v3.1/all?fields=name,flags,cca2,cca3')
      .pipe(map((val: Country[]) => val.sort((a, b) => a.name.common.localeCompare(b.name.common))));
  }

  sendData() {
    console.log(this.supplierFormGroup.value);
  }

  onFileSelected(event: any) {
    const uploadCallback = () => {
      this.images = this.uploadImage.getImages();
      this.isImages = true;
    }
    this.imageSpaceLeft = this.uploadImage.upload(event, uploadCallback, this.maxImages);
    console.log(this.uploadImage.getImages());
  }

  deleteImg(index: number) {
    const deleteCallback = () => {
      this.images = this.uploadImage.getImages();
      if (this.images.length < 2) {
        this.isImages = false;
      }
    }
    this.uploadImage.deleteImg(index, deleteCallback);
  }
}
