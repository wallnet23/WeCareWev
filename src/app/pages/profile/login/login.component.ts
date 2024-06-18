import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IpInfoConnectService } from '../../../services/ip-info-connect.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  valid: boolean = true;
  toggled: boolean = true;
  type: string = 'password'

  loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  })

  constructor(private router: Router, private ipInfoConnectService: IpInfoConnectService) { }

  login() {
    //console.log("email: ", this.loginForm.get('email')?.value);
    //console.log("password: ", this.loginForm.get('password')?.value);
    this.ipInfoConnectService.getLanguage().subscribe((val) => { console.log(val) });
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;
    if (email === 'paolo@gmail.com' && password === "123") {
      this.router.navigate(['/batterySystem']);
    }
    else {
      this.valid = false;
    }
  }

  seePassword() {
    if (this.type === 'password') {
      this.type = 'text';
      this.toggled = false;
    }
    else {
      this.type = 'password';
      this.toggled = true;
    }
  }

}

