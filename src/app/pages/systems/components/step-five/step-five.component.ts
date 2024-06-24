import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConnectServerService } from '../../../../services/connect-server.service';
import { ApiResponse } from '../../../../interfaces/api-response';
import { Connect } from '../../../../classes/connect';
import { PopupDialogService } from '../../../../services/popup-dialog.service';
import { StepFive } from '../interfaces/step-five';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-step-five',
  standalone: true,
  imports: [
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    HttpClientModule,
    CommonModule,
    MatIconModule,
    TranslateModule,
  ],
  templateUrl: './step-five.component.html',
  styleUrl: './step-five.component.scss'
})
export class StepFiveComponent {

  @Input() idsystem = 0;

  stepFiveForm = this.formBuilder.group({
    problem_occurred: new FormControl('', Validators.required),
    problem_description: new FormControl(''),
  })

  constructor(private formBuilder: FormBuilder, private connectServerService: ConnectServerService,
    private popupDialogService: PopupDialogService) { }

    ngOnInit(): void {
      this.infoStep();
    }

  infoStep() {
    this.connectServerService.getRequest<ApiResponse<{ stepFive: StepFive }>>(Connect.urlServerLaraApi, 'system/infoStepFive', { id: this.idsystem }).
      subscribe((val: ApiResponse<{ stepFive: StepFive }>) => {
        if (val.data && val.data.stepFive) {
          this.stepFiveForm.patchValue(val.data.stepFive);
        }
      })
  }

  saveStep() {
    const stepFive = this.stepFiveForm.getRawValue();
    this.connectServerService.postRequest<ApiResponse<null>>(Connect.urlServerLaraApi, 'system/saveStepFive',
      {
        idsystem: this.idsystem,
        obj_step: stepFive
      })
      .subscribe((val: ApiResponse<null>) => {
        this.popupDialogService.alertElement(val);
        this.infoStep();
      })
  }

  sendData() {
    console.log(this.stepFiveForm.value);
  }

}
