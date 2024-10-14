import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { StepThree } from '../../components/interfaces/step-three';

@Component({
  selector: 'app-step-three-readonly',
  standalone: true,
  imports: [],
  templateUrl: './step-three-readonly.component.html',
  styleUrl: './step-three-readonly.component.scss'
})
export class StepThreeReadonlyComponent {

  @Output() formEmit = new EventEmitter<FormGroup>();

  @Input() stepThree: StepThree | null = null;
  @Input() idsystem = 0;

  constructor() {
    // TODO: SE NECESSARIO CONVERTIRE LO STEP RICEVUTO IN INGERSSO IN UN FORM
  }

}
