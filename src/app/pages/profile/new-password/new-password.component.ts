import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PopupDialogService } from '../../../services/popup-dialog.service';
import { ConnectServerService } from '../../../services/connect-server.service';
import { ApiResponse } from '../../../interfaces/api-response';
import { Connect } from '../../../classes/connect';

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    TranslateModule
  ],
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.scss'
})
export class NewPasswordComponent implements OnInit {

  toggled1: boolean = true;
  toggled2: boolean = true;
  type1: string = 'password';
  type2: string = 'password';

  validPassword: boolean = true;
  equalPassword: boolean = true;
  errorMessage: boolean = false;
  email_val = '';
  token_val = '';

  newPswForm = this.formBuilder.group({
    password: new FormControl<string>('', Validators.required),
    passwordRepeat: new FormControl<string>('', Validators.required),
  })

  constructor(private formBuilder: FormBuilder, private router: Router,
    private connectServerService: ConnectServerService,
    private popupDialogService: PopupDialogService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params
      .subscribe(
        (params: Params) => {
          // console.log('params:', params['token']);
          this.token_val = params['token'];
        });

    this.route.queryParams
      .subscribe(
        (params: Params) => {
          if (params['email']) {
            // console.log('params:', params['email']);
            this.email_val = params['email'];
          }
        });
  }

  send() {
    if (this.email_val.length > 0 && this.token_val.length > 0) {

      const password = this.newPswForm.get('password')?.value;
      const passwordRepeat = this.newPswForm.get('passwordRepeat')?.value;
      const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":|<>])(?=.{8,})/;
      if (regex.test(password!)) {
        if (password === passwordRepeat) {
          this.equalPassword = true;
          this.validPassword = true;
          this.errorMessage = false;
          this.connectServerService.postRequest<ApiResponse<{}>>(Connect.urlServerLaraApi, 'user/reset-password', {
            email: this.email_val,
            token: this.token_val,
            password: password,
            password_confirmation: passwordRepeat,
          }).subscribe(
            (esito: ApiResponse<{}>) => {
              this.popupDialogService.alertElement(esito);
              this.router.navigate(['login']);
            }
          )
        }
        else {
          this.equalPassword = false;
          this.validPassword = true;
          this.errorMessage = true;
        }
      }
      else {
        this.equalPassword = true;
        this.validPassword = false;
        this.errorMessage = true;
      }
    }
  }

  seePassword(id: string) {
    if (id === 'passwordRepeat') {
      if (this.type2 === 'password') {
        this.type2 = 'text';
        this.toggled2 = false;
      }
      else {
        this.type2 = 'password';
        this.toggled2 = true;
      }
    }
    else {
      if (this.type1 === 'password') {
        this.type1 = 'text';
        this.toggled1 = false;
      }
      else {
        this.type1 = 'password';
        this.toggled1 = true;
      }
    }
  }

  goLogin(){
    this.router.navigate(['login']);
  }

}
