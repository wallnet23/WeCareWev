import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

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

  loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  })

  constructor(private router: Router) {}

  login() {
    //console.log("email: ", this.loginForm.get('email')?.value);
    //console.log("password: ", this.loginForm.get('password')?.value);
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;
    if(email === 'paolo@gmail.com' && password === "123") {
      this.router.navigate(['/batterySystem']);
    }
    else {
      this.valid = false;
    }
  }

}
