import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormControl, FormArray } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { UploadImageService } from '../../../../services/upload-images.service';
import { MatCardModule } from '@angular/material/card';

interface InverterInfo {
  serialNumber: string;
  model: string;
  askSupport: boolean;
}

interface BatteryInfo {
    serialNumber: string;
    askSupport: boolean;
}

interface ClusterInfo {
  batteries: BatteryInfo,
  relatedInverter: string;
}

@Component({
  selector: 'app-product-info',
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
    MatCardModule,
  ],
  templateUrl: './product-info.component.html',
  styleUrl: './product-info.component.scss'
})
export class ProductInfoComponent {


  inverterNum: any[] = [];
  numbers: number[] = Array.from({ length: 10 }, (_, i) => i + 1);

  productFormGroup = this.formBuilder.group({
    installationDate: new FormControl<Date | null>(null, Validators.required),
    sysComposition: new FormControl<string | null>(null, Validators.required),
    wecoProducts: new FormControl<string | null>(null, Validators.required),
    brand: new FormControl('', Validators.required),
    hybridInverter: new FormControl<boolean>(false, Validators.required),
    inverterNumber: new FormControl<number | null>(null, Validators.required),
    parallelInverter: new FormControl<boolean>(false, Validators.required),
    powerInverter: new FormControl<boolean>(false, Validators.required),
    inverters: this.formBuilder.array([]),
    batteryVoltage: new FormControl<string | null>(null, Validators.required),
    batteryType: new FormControl<string | null>(null, Validators.required),
    batteryModel: new FormControl<string | null>(null, Validators.required),
    singleBattery: new FormControl<boolean | null>(null, Validators.required),
    clusterNumber: new FormControl<number | null>(null, Validators.required),
    parallelCluster: new FormControl<boolean | null>(null, Validators.required),
    itemsForCluster: new FormControl<number | null>(null, Validators.required),
    clusters: this.formBuilder.array([])
  });

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private uploadImage: UploadImageService) { }

  sendData() {
    console.log(this.productFormGroup.value);
  }

  generateInverterArray() {
    const i = this.productFormGroup.get('inverterNumber')?.value;
    this.inverterFieldsAsFormArray.clear();
    for (let j = 0; j < i!; j++) {
      this.inverterFieldsAsFormArray.push(this.inverter(
        {
          serialNumber: '',
          model: '',
          askSupport: false,
        }
      ))
    }
    console.log(this.inverterFieldsAsFormArray);
  }

  /*
  generateBatteryArray() {
    if (this.productFormGroup.get('singleBattery')?.value == true) {
      this.batteryFieldsAsFormArray.clear();
      this.clusterFieldsAsFormArray.clear()
      this.clusterFieldsAsFormArray.push(this.cluster(
        {
          batteries: new FormArray([]),
          relatedInverter: ''
        }
      ))
    }
    else {
      const i = this.productFormGroup.get('clusterNumber')?.value;
      const j = this.productFormGroup.get('itemsForCluster')?.value;
      this.inverterFieldsAsFormArray.clear();
      for (let j = 0; j < i!; j++) {
        this.inverterFieldsAsFormArray.push(this.inverter(
          {
            serialNumber: '',
            model: '',
            askSupport: false,
          }
        ))
      }
    }
    console.log(this.clusterFieldsAsFormArray);
  }
  */

  get clusterFieldsAsFormArray() {
    return this.productFormGroup.get('clusters') as FormArray;
  }

  get batteryFieldsAsFormArray() {
    return this.clusterFieldsAsFormArray.get('batteries') as FormArray;
  }

  get inverterFieldsAsFormArray() {
    return this.productFormGroup.get('inverters') as FormArray;
  }

  inverter(obj: InverterInfo) {
    return this.formBuilder.group({
      serialNumber: new FormControl(obj.serialNumber, Validators.required),
      model: new FormControl(obj.model, Validators.required),
      askSupport: new FormControl<boolean>(obj.askSupport, Validators.required),
    })
  }

  cluster(obj: ClusterInfo) {
    return this.formBuilder.group({
      batteries: this.formBuilder.array([]),
      relatedInverter: new FormControl(obj.relatedInverter, Validators.required)
    })
  }

  battery(obj: BatteryInfo) {
    return this.formBuilder.group({
      serialNumber: new FormControl(obj.serialNumber, Validators.required),
      askSupport: new FormControl(obj.askSupport, Validators.required)
    })
  }

  support(i: number) {
    const askSupport = !this.inverterFieldsAsFormArray.at(i).get('askSupport');
    this.inverterFieldsAsFormArray.at(i).setValue('askSupport', askSupport);
    console.log(this.inverterFieldsAsFormArray.at(i).get('askSupport'))
  }

  print() {
    console.log(this.productFormGroup);
  }
}
