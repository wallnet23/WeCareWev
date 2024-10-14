import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { StepTwo } from '../../components/interfaces/step-two';

@Component({
  selector: 'app-step-two-readonly',
  standalone: true,
  imports: [],
  templateUrl: './step-two-readonly.component.html',
  styleUrl: './step-two-readonly.component.scss'
})
export class StepTwoReadonlyComponent {

  @Output() formEmit = new EventEmitter<FormGroup>();

  @Input() stepTwo: StepTwo | null = null; 
  @Input() idsystem = 0;

  constructor() {
    // TODO: SE NECESSARIO CONVERTIRE LO STEP RICEVUTO IN INGERSSO IN UN FORM
  }

}
