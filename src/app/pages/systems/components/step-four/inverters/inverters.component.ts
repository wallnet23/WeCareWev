import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Inverter } from '../../../interfaces/inverter';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    MatCardModule
  ],
  templateUrl: './inverters.component.html',
  styleUrl: './inverters.component.scss'
})
export class InvertersComponent implements OnInit {
  @Input() idsystem = 0;
  numInverter = Array(10).fill(0).map((_, i) => ({
    num: i + 1,
    // Proprietà aggiuntive...
  }));
  stepInverterForm = this.formBuilder.group({
    inverter_hybrid: new FormControl<number | null>(null),
    inverter_online: new FormControl<number | null>(null),
    inverter_number: new FormControl<number | null>(null, Validators.required),
    inverter_communication: new FormControl<number | null>({ value: null, disabled: true }),
    inverter_power: new FormControl<number | null>({ value: null, disabled: true }),
    inverters_list: this.formBuilder.array([]),
  });

  constructor(private formBuilder: FormBuilder) { }
  ngOnInit(): void {
    this.logicStep();
    this.infoInverters();
  }

  private logicStep() {
    this.stepInverterForm.get('inverter_number')?.valueChanges.subscribe(
      (val: number | null) => {
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
                serialnumber: '',
                model: ''
              }
            ));
          }
        }
      }
    )
  }

  private infoInverters(){

  }

  get inverterFieldAsFormArray(): any {
    return this.stepInverterForm.get('inverters_list') as FormArray;
  }
  inverter(obj: Inverter): any {
    return this.formBuilder.group({
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
}
