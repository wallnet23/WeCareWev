import { Component, OnInit, SimpleChanges, ViewChild, viewChild } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { StepOneComponent } from '../components/step-one/step-one.component';
import { StepTwoComponent } from '../components/step-two/step-two.component';
import { MatIconModule } from '@angular/material/icon';
import { StepThreeComponent } from '../components/step-three/step-three.component';
import { StepFourComponent } from '../components/step-four/step-four.component';
import { ActivatedRoute } from '@angular/router';
import { StepFiveComponent } from '../components/step-five/step-five.component';
import { ConnectServerService } from '../../../services/connect-server.service';
import { ApiResponse } from '../../../interfaces/api-response';
import { SystemInfo } from '../interfaces/system-info';
import { Ticket } from '../interfaces/ticket';
import { Warranty } from '../interfaces/warranty';
import { RMA } from '../interfaces/rma';
import { Connect } from '../../../classes/connect';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-system-modify',
    templateUrl: './system-modify.component.html',
    styleUrl: './system-modify.component.scss',
    standalone: true,
    providers: [
        {
            provide: STEPPER_GLOBAL_OPTIONS,
            useValue: { showError: true },
        },
    ],
    imports: [
        MatStepperModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        StepOneComponent,
        StepTwoComponent,
        StepThreeComponent,
        StepFourComponent,
        StepFiveComponent,
        MatIconModule,
        CommonModule
    ]
})
export class SystemModifyComponent implements OnInit{

  allFormValid: boolean = true;
  idsystem: number = 0;
  systemName: string = '';

  @ViewChild('stepOne') obj_stepOne!: StepOneComponent;
  @ViewChild('stepTwo') obj_stepTwo!: StepTwoComponent;
  @ViewChild('stepThree') obj_stepThree!: StepThreeComponent;
  @ViewChild('stepFour') obj_stepFour!: StepFourComponent;
  @ViewChild('stepFive') obj_stepFive!: StepFiveComponent;

  stepOneForm!: FormGroup;
  stepTwoForm!: FormGroup;
  stepThreeForm!: FormGroup;
  stepFourForm!: FormGroup;
  stepFiveForm!: FormGroup;

  constructor(private route: ActivatedRoute, private connectServerService: ConnectServerService) {
    this.route.params.subscribe(params => {
      this.idsystem = params['id'];
      this.getSystemOverview()
    });

  }

  ngOnInit(): void {
    this.getAllFormValid();
  }

  getSystemOverview() {
    this.connectServerService.getRequest<ApiResponse<{systemInfo: SystemInfo, systemTickets: Ticket[], systemWarranty: Warranty, systemRMA: RMA}>>
    (Connect.urlServerLaraApi, 'system/systemOverview', {id: this.idsystem})
    .subscribe((val: ApiResponse<{systemInfo: SystemInfo, systemTickets: Ticket[], systemWarranty: Warranty, systemRMA: RMA}>) => {
      if(val.data) {
        this.systemName = val.data.systemInfo.title
      }
    })
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   this.stepOneForm = this.obj_stepOne.stepOneForm;
  //   this.stepTwoForm = this.obj_stepTwo.stepTwoForm;
  //   this.stepThreeForm = this.obj_stepThree.stepThreeForm;
  //   this.stepFourForm = this.obj_stepFour.stepFourForm;
  //   this.stepFiveForm = this.obj_stepFive.stepFiveForm;
  // }

  approvalRequested(){

  }

  private getAllFormValid() {
    const valid = this.obj_stepOne?.stepOneForm?.valid &&
    this.obj_stepTwo?.stepTwoForm?.valid &&
    this.obj_stepThree?.stepThreeForm?.valid &&
    this.obj_stepFour?.stepFourForm?.valid;
    this.allFormValid =  valid == null ? false : true;
  }

}
