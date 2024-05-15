import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.scss'
})
export class NewPasswordComponent {

  toggled1: boolean = true;
  toggled2: boolean = true;
  type1: string = 'password';
  type2: string = 'password';

  validPassword: boolean = true;
  equalPassword: boolean = true;
  errorMessage: boolean = false;

  newPswForm = this.formBuilder.group({
    password: new FormControl<string>('', Validators.required),
    passwordRepeat: new FormControl<string>('', Validators.required),
  })

  constructor(private formBuilder: FormBuilder, private router: Router) {}

  send() {
    const password = this.newPswForm.get('password')?.value;
    const passwordRepeat = this.newPswForm.get('passwordRepeat')?.value;
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":|<>])(?=.{8,})/;
    if(regex.test(password!)) {
      if(password === passwordRepeat) {
        this.equalPassword = true;
        this.validPassword = true;
        this.errorMessage = false;
        this.router.navigate(['batterySystem'])
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

  seePassword(id: string) {
    if(id === 'passwordRepeat') {
      if(this.type2 === 'password') {
        this.type2 = 'text';
        this.toggled2 = false;
      }
      else {
        this.type2 = 'password';
        this.toggled2 = true;
      }
    }
    else {
      if(this.type1 === 'password') {
        this.type1 = 'text';
        this.toggled1 = false;
      }
      else {
        this.type1 = 'password';
        this.toggled1 = true;
      }
    }
  }

}
