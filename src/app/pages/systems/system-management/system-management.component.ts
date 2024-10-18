import { Component, inject, ViewChild } from '@angular/core';
import { Validators, FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS, StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { StepOneComponent } from '../components/step-one/step-one.component';
import { StepTwoComponent } from '../components/step-two/step-two.component';
import { MatIconModule } from '@angular/material/icon';
import { StepThreeComponent } from '../components/step-three/step-three.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ConnectServerService } from '../../../services/connect-server.service';
import { ApiResponse } from '../../../interfaces/api-response';
import { SystemInfo } from '../interfaces/system-info';
import { Ticket } from '../../tickets/interfaces/ticket';
import { Warranty } from '../interfaces/warranty';
import { RMA } from '../interfaces/rma';
import { Connect } from '../../../classes/connect';
import { CommonModule, Location } from '@angular/common';
import { PopupDialogService } from '../../../services/popup-dialog.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { StepFourComponent } from '../components/step-four/step-four.component';
import { StepFourService } from '../components/step-four/step-four.service';
import { StepFiveComponent } from "../components/step-five/step-five.component";
import { StepSixComponent } from "../components/step-six/step-six.component";

@Component({
  selector: 'app-system-management',
  standalone: true,
  providers: [],
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
    MatIconModule,
    CommonModule,
    TranslateModule,
    StepFourComponent,
    StepFiveComponent,
    StepSixComponent
  ],
  templateUrl: './system-management.component.html',
  styleUrl: './system-management.component.scss'
})
export class SystemManagementComponent {
  allFormValid: boolean = true;
  idsystem: number = 0;
  systemName: string = '';

  isEditable = [true, false, false, false, false, false];

  @ViewChild('stepOne') obj_stepOne!: StepOneComponent;
  @ViewChild('stepTwo') obj_stepTwo!: StepTwoComponent;
  @ViewChild('stepThree') obj_stepThree!: StepThreeComponent;
  @ViewChild('stepFour') obj_stepFour!: StepFourComponent;
  @ViewChild('stepFive') obj_stepFive!: StepFourComponent;
  @ViewChild('stepSix') obj_stepSix!: StepFourComponent;

  stepOneForm!: FormGroup;
  stepTwoForm!: FormGroup;
  stepThreeForm!: FormGroup;
  stepFourForm!: FormGroup;
  stepFiveForm!: FormGroup;
  stepSixForm!: FormGroup;

  systemStatus: { id: number, name: string, color: string } | null = null;
  readonly stepFourService = inject(StepFourService);

  constructor(private route: ActivatedRoute, private connectServerService: ConnectServerService,
    private location: Location, private router: Router, private popupDialogService: PopupDialogService,
    private translate: TranslateService) {
    this.route.params.subscribe(params => {
      this.idsystem = params['id'];
      this.getSystemOverview();
      this.stepFourService.setSystemsValues();
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
      this.stepFourForm = this.obj_stepFour.getForm();
      this.stepFiveForm = this.obj_stepFive.getForm();
      this.stepSixForm = this.obj_stepSix.getForm();
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
    this.stepFiveForm = new FormGroup({
      invalid: new FormControl(null, Validators.required)
    });
    this.stepSixForm = new FormGroup({
      invalid: new FormControl(null, Validators.required)
    });
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
  onFormFiveReceived(form: FormGroup) {
    this.stepFiveForm = form;
  }
  onFormSixReceived(form: FormGroup) {
    this.stepSixForm = form;
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
    this.translate.get(['POPUP.TITLE.INFO', 'POPUP.MSG_APPROVEDSYSTEM', 'POPUP.BUTTON.SEND']).subscribe((translations) => {
      const obj_request: ApiResponse<any> = {
        code: 244,
        data: {},
        title: translations['POPUP.TITLE.INFO'],
        message: translations['POPUP.MSG_APPROVEDSYSTEM'],
        obj_dialog: {
          disableClose: 1,
          obj_buttonAction:
          {
            action: 1,
            action_type: 2,
            label: translations['POPUP.BUTTON.SEND'],
            run_function: () => this.sendApprovalRequest()
          }
        }
      }
      this.popupDialogService.alertElement(obj_request);
    });

  }

  private sendApprovalRequest() {
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
      this.connectServerService.getRequest<ApiResponse<{ status: { id: number, name: string, color: string } }>>
        (Connect.urlServerLaraApi, 'system/systemState', { idsystem: this.idsystem })
        .subscribe((val: ApiResponse<{ status: { id: number, name: string, color: string } }>) => {
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
      &&
      this.obj_stepFour?.stepFourForm?.valid;
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

  // Funzione che gestiosce lo scrolling degli step
  manageStepScrolling($event: { step: number, action: number }, stepper: MatStepper) {
    console.log("EDITABLE1", $event)
    if ($event.action == 0) {
      this.isEditable[$event.step - 1] = false;
      this.isEditable[$event.step - 2] = true;
      console.log("EDITABLE2", this.isEditable)
      setTimeout(() => {
        stepper.previous();
      }, 0);
    }
    else if ($event.action == 1) {
      this.isEditable[$event.step - 1] = false;
      this.isEditable[$event.step] = true;
      console.log("EDITABLE2", this.isEditable)
      setTimeout(() => {
        stepper.next();
      }, 0);
    }
  }

}
