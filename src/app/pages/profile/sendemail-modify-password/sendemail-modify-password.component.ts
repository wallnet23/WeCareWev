import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ConnectServerService } from '../../../services/connect-server.service';
import { ApiResponse } from '../../../interfaces/api-response';
import { Connect } from '../../../classes/connect';
import { PopupDialogService } from '../../../services/popup-dialog.service';

@Component({
  selector: 'app-sendemail-modify-password',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
  ],
  templateUrl: './sendemail-modify-password.component.html',
  styleUrl: './sendemail-modify-password.component.scss'
})
export class SendemailModifyPasswordComponent {

  isSent: boolean = false;
  validEmail: boolean = true;

  recoverPswForm = new FormGroup({
    email: new FormControl('', Validators.required),
  })

  constructor(private router: Router, private connectServerService: ConnectServerService,
    private popupDialogService: PopupDialogService
  ) { }

  send() {
    //Send the request to the server
    const email_val = this.recoverPswForm.get('email')?.value;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (emailRegex.test(email_val!)) {
      this.validEmail = true;
      this.isSent = true;
      this.connectServerService.postRequest<ApiResponse<{}>>(Connect.urlServerLaraApi, 'user/forgot-password', {
        email: email_val
      }).subscribe(
        (esito: ApiResponse<{}>) => {
          this.popupDialogService.alertElement(esito);
          this.router.navigate(['login']);
        }
      )
    }
    else {
      this.validEmail = false;
    }
  }
  goLogin() {
    this.router.navigate(['login']);
  }


}
