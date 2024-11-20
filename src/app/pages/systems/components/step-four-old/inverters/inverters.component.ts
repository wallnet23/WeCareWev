import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Inverter, InverterData } from '../../../interfaces/inverterData';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ScannerSelectorComponent } from "../../../OLD-barcode-scanner/scanner-selector/scanner-selector.component";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-inverters',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatCardModule,
    ScannerSelectorComponent,
    TranslateModule
],
  templateUrl: './inverters.component.html',
  styleUrl: './inverters.component.scss'
})
export class InvertersComponent implements OnInit, OnChanges {
  @Input() idsystem = 0;
  @Input() stepInverter!: InverterData;
  @Output() listInverters = new EventEmitter<Inverter[]>();
  numInverter = Array(10).fill(0).map((_, i) => ({
    num: i + 1,
    // Proprietà aggiuntive...
  }));
  stepInverterForm = this.formBuilder.group({
    inverter_hybrid: new FormControl<number | null | boolean>(null),
    inverter_online: new FormControl<number | null | boolean>(null),
    inverter_number: new FormControl<number | null>(null, Validators.required),
    inverter_communication: new FormControl<number | null | boolean>({ value: null, disabled: true }),
    inverter_power: new FormControl<number | null | boolean>({ value: null, disabled: true }),
    inverters_list: this.formBuilder.array<any[]>([]),
  });

  constructor(private formBuilder: FormBuilder) { }
  ngOnInit(): void {
    this.logicStep();
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log('change: ',changes.idfather);
    if (changes['stepInverter'] && changes['stepInverter'].currentValue &&
      changes['stepInverter'].currentValue != null) {
      this.infoInverters(changes['stepInverter'].currentValue);
    }
  }

  onBarcodeScanned(barcode: string, i: number) {
    this.inverterFieldAsFormArray.at(i).get('serialnumber').setValue(barcode);
    // console.log("FORM FIELD", this.inverterFieldAsFormArray.value[i].serialnumber)
  }

  private logicStep() {
    this.stepInverterForm.get('inverter_number')?.valueChanges.subscribe(
      (val: number | null) => {
        console.log('---val', val);
        if (val != null && val > 1) {
          this.stepInverterForm.get('inverter_communication')?.enable();
          this.stepInverterForm.get('inverter_power')?.enable();
        } else {
          this.stepInverterForm.patchValue({
            inverter_communication: 0,
            inverter_power: 0,
          })
          this.stepInverterForm.get('inverter_communication')?.disable();
          this.stepInverterForm.get('inverter_power')?.disable();
        }
        if (val != null && val > 0) {
          this.inverterFieldAsFormArray.clear();
          for (let i = 0; i < val; i++) {
            this.inverterFieldAsFormArray.push(this.inverter(
              {
                id: 0,
                serialnumber: '',
                model: ''
              }
            ));
          }
        }
      }
    )
  }

  private infoInverters(obj_inverter: InverterData) {
    this.stepInverterForm.patchValue({
      inverter_hybrid: obj_inverter.inverter_hybrid,
      inverter_online: obj_inverter.inverter_online,
      inverter_number: obj_inverter.inverter_number,
      inverter_communication: obj_inverter.inverter_communication,
      inverter_power: obj_inverter.inverter_power,
    });
    if (obj_inverter.inverter_number != null && obj_inverter.inverter_number > 1) {
      this.stepInverterForm.get('inverter_communication')?.enable();
      this.stepInverterForm.get('inverter_power')?.enable();
    } else {
      this.stepInverterForm.get('inverter_communication')?.disable();
      this.stepInverterForm.get('inverter_power')?.disable();
    }

    this.inverterFieldAsFormArray.clear();
    console.log('inverter list: ', obj_inverter);
    obj_inverter.inverters_list.forEach(
      (inverter: Inverter) => {
        this.inverterFieldAsFormArray.push(
          this.inverter(
            inverter
          ));
      }
    )
    this.releaseUpdateListInverters();
    this.logicStep();
  }

  get inverterFieldAsFormArray(): any {
    return this.stepInverterForm.get('inverters_list') as FormArray;
  }
  inverter(obj: Inverter): any {
    return this.formBuilder.group({
      id: [obj.id],
      serialnumber: [obj.serialnumber, [Validators.required]],
      model: [obj.model, [Validators.required]]
    });
  }

  getDataFormInverter() {
    // console.log(this.formInverter.getRawValue());
    return this.stepInverterForm.getRawValue();
  }

  getValidFormInvert() {
    return this.stepInverterForm.valid;
  }

  getListInverters(): any[] {
    let inverterList: any[] = [];
    const form = this.stepInverterForm;
    if (form) {
      const formlist = form.get('inverters_list');
      if (formlist) {
        inverterList = formlist.value;
      }
    }
    return inverterList;
  }

  /**
   * Propaga aggiornamento lista inverter
   */
  releaseUpdateListInverters() {
    // console.log('aggiorna');
    let inverterList: Inverter[] = [];
    const form = this.stepInverterForm;
    if (form) {
      const formlist = form.get('inverters_list');
      if (formlist) {
        inverterList = formlist.value;
      }
    }
    this.listInverters.emit(inverterList)
  }
}
