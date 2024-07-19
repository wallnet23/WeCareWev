import { AfterViewInit, Component, OnInit, SimpleChanges, ViewChild, viewChild } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { StepOneComponent } from '../components/step-one/step-one.component';
import { StepTwoComponent } from '../components/step-two/step-two.component';
import { MatIconModule } from '@angular/material/icon';
import { StepThreeComponent } from '../components/step-three/step-three.component';
import { StepFourComponent } from '../components/step-four/step-four.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ConnectServerService } from '../../../services/connect-server.service';
import { ApiResponse } from '../../../interfaces/api-response';
import { SystemInfo } from '../interfaces/system-info';
import { Ticket } from '../interfaces/ticket';
import { Warranty } from '../interfaces/warranty';
import { RMA } from '../interfaces/rma';
import { Connect } from '../../../classes/connect';
import { CommonModule, Location } from '@angular/common';
import { PopupDialogService } from '../../../services/popup-dialog.service';
import { ClusterService } from '../components/step-four/clusters/cluster.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-system-management',
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
    MatIconModule,
    CommonModule,
    TranslateModule
  ],
  templateUrl: './system-management.component.html',
  styleUrl: './system-management.component.scss'
})
export class SystemManagementComponent {
  allFormValid: boolean = true;
  idsystem: number = 0;
  systemName: string = '';

  @ViewChild('stepOne') obj_stepOne!: StepOneComponent;
  @ViewChild('stepTwo') obj_stepTwo!: StepTwoComponent;
  @ViewChild('stepThree') obj_stepThree!: StepThreeComponent;
  @ViewChild('stepFour') obj_stepFour!: StepFourComponent;

  stepOneForm!: FormGroup;
  stepTwoForm!: FormGroup;
  stepThreeForm!: FormGroup;
  stepFourForm!: FormGroup;
  stepFiveForm!: FormGroup;

  systemStatus: { id: number, name: string } | null = null;

  constructor(private route: ActivatedRoute, private connectServerService: ConnectServerService,
    private location: Location, private router: Router, private popupDialogService: PopupDialogService,
    private clusterService: ClusterService) {
    this.route.params.subscribe(params => {
      this.idsystem = params['id'];
      this.getSystemOverview();
      this.clusterService.setSystemsValues();
    });
  }

  ngOnInit(): void {
    this.getAllFormValid();
    this.initForms();
    this.getStatus();
    //this.stepOneForm = this.obj_stepOne.stepOneForm;
    if (this.getAllFormValid()) {
      this.stepOneForm = this.obj_stepOne.getForm();
      this.stepTwoForm = this.obj_stepTwo.getForm();
      this.stepThreeForm = this.obj_stepThree.getForm();
      //this.stepFourForm = this.obj_stepFour.getForm();
    }
  }

  initForms() {
    this.stepOneForm = new FormGroup({
      invalid: new FormControl(null, Validators.required)
    });
    this.stepTwoForm = new FormGroup({
      invalid: new FormControl(null, Validators.required)
    });
    this.stepThreeForm = new FormGroup({
      invalid: new FormControl(null, Validators.required)
    });
    this.stepFourForm = new FormGroup({
      invalid: new FormControl(null, Validators.required)
    });
    // this.stepFiveForm = new FormGroup({
    //   invalid: new FormControl(null, Validators.required)
    // });
  }

  onFormOneReceived(form: FormGroup) {
    this.route.params.subscribe(params => {
      this.idsystem = params['id'];
      this.stepOneForm = form;
      this.getSystemOverview();
      this.getStatus();
    });
  }

  onFormTwoReceived(form: FormGroup) {
    this.stepTwoForm = form;
  }

  onFormThreeReceived(form: FormGroup) {
    this.stepThreeForm = form;
  }

  onFormFourReceived(form: FormGroup) {
    this.stepFourForm = form;
  }

  onIdReceived(id: number) {
    this.idsystem = id;
    //console.log('ID received from child:', id);
  }

  getSystemOverview() {
    if (this.idsystem > 0) {
      this.connectServerService.getRequest<ApiResponse<{ systemInfo: SystemInfo, systemTickets: Ticket[], systemWarranty: Warranty, systemRMA: RMA }>>
        (Connect.urlServerLaraApi, 'system/systemOverview', { id: this.idsystem })
        .subscribe((val: ApiResponse<{ systemInfo: SystemInfo, systemTickets: Ticket[], systemWarranty: Warranty, systemRMA: RMA }>) => {
          if (val.data) {
            this.systemName = val.data.systemInfo.system_name;
          }
        })
    }
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   this.stepOneForm = this.obj_stepOne.stepOneForm;
  //   this.stepTwoForm = this.obj_stepTwo.stepTwoForm;
  //   this.stepThreeForm = this.obj_stepThree.stepThreeForm;
  //   this.stepFourForm = this.obj_stepFour.stepFourForm;
  //   this.stepFiveForm = this.obj_stepFive.stepFiveForm;
  // }

  approvalRequested() {
    this.connectServerService.postRequest<ApiResponse<null>>
      (Connect.urlServerLaraApi, 'system/systemApproval', { idsystem: this.idsystem })
      .subscribe((val: ApiResponse<null>) => {
        this.popupDialogService.alertElement(val);
        this.router.navigate(['systemOverview', this.idsystem]);
      })
  }

  getStatus() {
    // console.log("Received 1")
    if (this.idsystem > 0) {
      this.connectServerService.getRequest<ApiResponse<{ status: { id: number, name: string } }>>
        (Connect.urlServerLaraApi, 'system/systemState', { idsystem: this.idsystem })
        .subscribe((val: ApiResponse<{ status: { id: number, name: string } }>) => {
          if (val.data) {
            this.systemStatus = val.data.status;
          }
        })
    }
  }

  getAllFormValid() {
    const valid = this.obj_stepOne?.stepOneForm?.valid &&
      this.obj_stepTwo?.stepTwoForm?.valid &&
      this.obj_stepThree?.stepThreeForm?.valid
    //&&
    //this.obj_stepFour?.stepFourForm?.valid;
    this.allFormValid = valid
    //== null ? false : true;
    return this.allFormValid;
  }

  goBack() {
    this.location.back();
  }

  goToSystem() {
    this.router.navigate(['systemOverview', this.idsystem]);
  }

}
