import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { StepFour } from '../../components/interfaces/step-four';

@Component({
  selector: 'app-step-four-readonly',
  standalone: true,
  imports: [],
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
