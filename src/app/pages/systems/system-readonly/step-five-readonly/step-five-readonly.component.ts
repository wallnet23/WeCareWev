import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { StepFive } from '../../components/interfaces/step-five';

@Component({
  selector: 'app-step-five-readonly',
  standalone: true,
  imports: [],
  templateUrl: './step-five-readonly.component.html',
  styleUrl: './step-five-readonly.component.scss'
})
export class StepFiveReadonlyComponent {

  @Output() formEmit = new EventEmitter<FormGroup>();

  @Input() stepFive: StepFive | null = null;
  @Input() idsystem = 0;

  constructor() {
    // TODO: SE NECESSARIO CONVERTIRE LO STEP RICEVUTO IN INGERSSO IN UN FORM
  }

}
