import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { StepFour } from '../../components/interfaces/step-four';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-step-four-readonly',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  templateUrl: './step-four-readonly.component.html',
  styleUrl: './step-four-readonly.component.scss'
})
export class StepFourReadonlyComponent {

  @Output() formEmit = new EventEmitter<FormGroup>();

  @Input() stepFour: StepFour | null = null;
  @Input() idsystem = 0;

  constructor() {
    // TODO: SE NECESSARIO CONVERTIRE LO STEP RICEVUTO IN INGERSSO IN UN FORM
  }

}
