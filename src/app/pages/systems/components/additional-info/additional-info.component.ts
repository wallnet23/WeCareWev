import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-additional-info',
  standalone: true,
  imports: [],
  templateUrl: './additional-info.component.html',
  styleUrl: './additional-info.component.scss'
})
export class AdditionalInfoComponent {

  additionalFormGroup = this.formBuilder.group({
    problemOccurred: new FormControl('', Validators.required),
    description: new FormControl(''),
  })

  constructor(private formBuilder: FormBuilder) {}

  sendData() {
    console.log(this.additionalFormGroup.value);
  }

}
