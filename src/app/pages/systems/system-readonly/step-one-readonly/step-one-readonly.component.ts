import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { StepOne } from '../../components/interfaces/step-one';

@Component({
  selector: 'app-step-one-readonly',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './step-one-readonly.component.html',
  styleUrl: './step-one-readonly.component.scss'
})
export class StepOneReadonlyComponent {

  @Output() formEmit = new EventEmitter<FormGroup>();

  @Input() stepOne: StepOne | null = null;
  @Input() idsystem = 0;

  constructor() {
    // TODO: SE NECESSARIO CONVERTIRE LO STEP RICEVUTO IN INGERSSO IN UN FORM
  }

}
