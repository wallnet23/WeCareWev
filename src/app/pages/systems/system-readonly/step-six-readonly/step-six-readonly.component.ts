import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { StepSix } from '../../components/interfaces/step-six';

@Component({
  selector: 'app-step-six-readonly',
  standalone: true,
  imports: [],
  templateUrl: './step-six-readonly.component.html',
  styleUrl: './step-six-readonly.component.scss'
})
export class StepSixReadonlyComponent {

  @Output() formEmit = new EventEmitter<FormGroup>();

  @Input() stepSix: StepSix | null = null;
  @Input() idsystem = 0;

  constructor() {
    // TODO: SE NECESSARIO CONVERTIRE LO STEP RICEVUTO IN INGERSSO IN UN FORM
  }

}
